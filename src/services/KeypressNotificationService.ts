import { Disposable, env, workspace, TextDocumentChangeEvent } from 'vscode';
import { BaseService } from './BaseService';
import { NotificationService } from './NotificationService';
import { ConfigurationService } from './ConfigurationService';
import { KeypressEvent } from '../types/extension';

/**
 * Service responsible for detecting keypress events and showing notifications.
 *
 * This service provides:
 * - Detection of copy, cut, and paste operations through workspace events
 * - Notification display for keypress events
 * - Configuration-based enabling/disabling
 * - Proper event listener registration and lifecycle management
 */
export class KeypressNotificationService extends BaseService {
  private readonly notificationService = new NotificationService();
  private readonly configService = ConfigurationService.getInstance();
  private clipboardWatcher: Disposable | undefined;
  private lastClipboardContent = '';
  private lastDocumentChange: Date = new Date();
  private isEnabled = false;

  constructor() {
    super('KeypressNotificationService');
  }

  protected override async onInitialize(): Promise<void> {
    await this.notificationService.initialize();
    this.isEnabled = this.configService.isEnabled();
    await this.setupKeypressDetection();
    this.logger.debug('KeypressNotificationService initialized');
  }

  protected override onDispose(): void {
    this.disposeWatchers();
    this.notificationService.dispose();
  }

  /**
   * Set up keypress detection by watching clipboard and document changes.
   */
  private async setupKeypressDetection(): Promise<void> {
    if (!this.isEnabled) {
      this.logger.debug('Keypress detection disabled via configuration');
      return;
    }

    try {
      // Initialize clipboard content
      this.lastClipboardContent = await env.clipboard.readText();

      // Watch for document changes to detect cut/paste operations
      const documentChangeWatcher = workspace.onDidChangeTextDocument((event) => {
        this.handleDocumentChange(event);
      });
      this.addDisposable(documentChangeWatcher);

      // Set up clipboard monitoring
      this.startClipboardMonitoring();

      this.logger.info('Keypress detection watchers set up successfully');
    } catch (error) {
      this.logger.error('Failed to setup keypress detection:', error);
      throw error;
    }
  }

  /**
   * Start monitoring clipboard for changes.
   */
  private startClipboardMonitoring(): void {
    if (this.clipboardWatcher) {
      return;
    }

    // Check clipboard periodically for changes
    const checkInterval = setInterval(async () => {
      if (!this.isEnabled) {
        return;
      }

      try {
        const currentContent = await env.clipboard.readText();
        if (currentContent !== this.lastClipboardContent && currentContent.length > 0) {
          // Clipboard changed - likely a copy or cut operation
          const timeSinceDocumentChange = Date.now() - this.lastDocumentChange.getTime();
          
          if (timeSinceDocumentChange < 500) {
            // Recent document change suggests cut operation
            await this.handleKeypressEvent('cut', currentContent);
          } else {
            // No recent document change suggests copy operation
            await this.handleKeypressEvent('copy', currentContent);
          }
          
          this.lastClipboardContent = currentContent;
        }
      } catch (error) {
        this.logger.error('Error monitoring clipboard:', error);
      }
    }, 100); // Check every 100ms

    this.clipboardWatcher = {
      dispose: () => {
        clearInterval(checkInterval);
      }
    };
    this.addDisposable(this.clipboardWatcher);
  }

  /**
   * Handle document change events to detect paste and cut operations.
   */
  private handleDocumentChange(event: TextDocumentChangeEvent): void {
    this.lastDocumentChange = new Date();
    
    // Check if this might be a paste operation
    if (event.contentChanges.length > 0) {
      const change = event.contentChanges[0];
      if (change && change.text.length > 0 && change.rangeLength >= 0) {
        // This looks like a paste or insert operation
        this.detectPasteOperation(change.text);
      }
    }
  }

  /**
   * Detect paste operations by comparing with clipboard content.
   */
  private async detectPasteOperation(insertedText: string): Promise<void> {
    try {
      const clipboardContent = await env.clipboard.readText();
      
      // If inserted text matches clipboard content, it's likely a paste operation
      if (insertedText === clipboardContent && insertedText.length > 0) {
        await this.handleKeypressEvent('paste', insertedText);
      }
    } catch (error) {
      this.logger.error('Error detecting paste operation:', error);
    }
  }

  /**
   * Handle detected keypress events.
   */
  private async handleKeypressEvent(action: 'copy' | 'cut' | 'paste', text: string): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    try {
      const event: KeypressEvent = {
        action,
        timestamp: new Date(),
        hasSelection: text.length > 0,
        selectedText: text.length > 100 ? `${text.substring(0, 100)}...` : text
      };

      await this.showKeypressNotification(event);
      this.logger.debug(`${action} action detected and processed`, { textLength: text.length });
    } catch (error) {
      this.logger.error(`Error handling ${action} action:`, error);
    }
  }

  /**
   * Show notification for keypress event.
   */
  private async showKeypressNotification(event: KeypressEvent): Promise<void> {
    const actionText = event.action.charAt(0).toUpperCase() + event.action.slice(1);
    const shortcut = this.getShortcutText(event.action);
    const message = `${actionText} (${shortcut}) detected`;

    await this.notificationService.showInfo(message);
  }

  /**
   * Get keyboard shortcut text for action.
   */
  private getShortcutText(action: 'copy' | 'cut' | 'paste'): string {
    switch (action) {
      case 'copy':
        return 'Ctrl+C';
      case 'cut':
        return 'Ctrl+X';
      case 'paste':
        return 'Ctrl+V';
    }
  }

  /**
   * Dispose all watchers and monitoring.
   */
  private disposeWatchers(): void {
    if (this.clipboardWatcher) {
      this.clipboardWatcher.dispose();
      this.clipboardWatcher = undefined;
    }
    this.logger.debug('Keypress detection watchers disposed');
  }

  /**
   * Enable or disable keypress detection.
   */
  public async setEnabled(enabled: boolean): Promise<void> {
    const wasEnabled = this.isEnabled;
    this.isEnabled = enabled;

    if (enabled && !wasEnabled && this.initialized) {
      await this.setupKeypressDetection();
    } else if (!enabled && wasEnabled) {
      this.disposeWatchers();
    }
  }

  /**
   * Check if keypress detection is currently active.
   */
  public isActive(): boolean {
    return this.isEnabled && Boolean(this.clipboardWatcher);
  }
}