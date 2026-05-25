import * as vscode from 'vscode';

import  { type IAccessibilityService } from '../di/interfaces/IAccessibilityService';
import  { type IConfigurationService } from '../di/interfaces/IConfigurationService';
import  { type IKeypressService } from '../di/interfaces/IKeypressService';
import  { type ILogger } from '../di/interfaces/ILogger';
import { Logger } from '../utils/logger';

import { AccessibilityService } from './AccessibilityService';
import { ConfigurationService } from './ConfigurationService';

/**
 * KeypressService class that dynamically detects multi-key combinations
 * without hardcoding specific shortcuts. Shows notifications like "You've pressed Ctrl+C".
 */
export class KeypressService implements IKeypressService {
  private static instance: KeypressService | undefined;
  private lastActionTime = 0;
  private actionBuffer: string[] = [];
  private readonly MULTI_KEY_THRESHOLD = 150; // ms between keys to consider multi-key sequence
  private enabled = true;
  private readonly disposables: vscode.Disposable[] = [];
  private readonly pendingTimers = new Set<ReturnType<typeof setTimeout>>();

  private static readonly COMMAND_KEY_MAP: Record<string, string> = {
    // Original 19
    'editor.action.clipboardCopyAction': 'Ctrl+C',
    'editor.action.clipboardCutAction': 'Ctrl+X',
    'editor.action.clipboardPasteAction': 'Ctrl+V',
    'workbench.action.showCommands': 'Ctrl+Shift+P',
    'workbench.action.quickOpen': 'Ctrl+P',
    'workbench.action.files.save': 'Ctrl+S',
    'workbench.action.files.saveAll': 'Ctrl+K S',
    'workbench.action.files.newUntitledFile': 'Ctrl+N',
    'workbench.action.files.openFile': 'Ctrl+O',
    'workbench.action.findInFiles': 'Ctrl+Shift+F',
    'workbench.action.gotoLine': 'Ctrl+G',
    'workbench.action.toggleSidebarVisibility': 'Ctrl+B',
    'workbench.action.terminal.toggleTerminal': 'Ctrl+`',
    'workbench.action.togglePanel': 'Ctrl+J',
    'workbench.action.closeActiveEditor': 'Ctrl+W',
    'workbench.action.newWindow': 'Ctrl+Shift+N',
    'editor.action.formatDocument': 'Shift+Alt+F',
    'editor.action.commentLine': 'Ctrl+/',
    'editor.action.addSelectionToNextFindMatch': 'Ctrl+D',
    // Explorer
    'filesExplorer.copy': 'Ctrl+C',
    'filesExplorer.cut': 'Ctrl+X',
    'filesExplorer.paste': 'Ctrl+V',
    // Editing
    'undo': 'Ctrl+Z',
    'redo': 'Ctrl+Y',
    'editor.action.selectAll': 'Ctrl+A',
    'actions.find': 'Ctrl+F',
    'editor.action.startFindReplaceAction': 'Ctrl+H',
    'editor.action.moveLinesUpAction': 'Alt+Up',
    'editor.action.moveLinesDownAction': 'Alt+Down',
    'editor.action.copyLinesUpAction': 'Shift+Alt+Up',
    'editor.action.copyLinesDownAction': 'Shift+Alt+Down',
    'editor.action.deleteLines': 'Ctrl+Shift+K',
    'editor.action.quickFix': 'Ctrl+.',
    // Workbench / navigation
    'workbench.action.splitEditor': 'Ctrl+\\',
    'workbench.action.reopenClosedEditor': 'Ctrl+Shift+T',
    'workbench.action.gotoSymbol': 'Ctrl+Shift+O',
    'workbench.action.openSettings': 'Ctrl+,',
    'workbench.view.scm': 'Ctrl+Shift+G',
    'workbench.view.extensions': 'Ctrl+Shift+X',
    'workbench.view.debug': 'Ctrl+Shift+D',
    'workbench.actions.view.problems': 'Ctrl+Shift+M',
    // Terminal
    'workbench.action.terminal.new': 'Ctrl+Shift+`',
  };

  private constructor(
    private readonly logger: ILogger,
    private readonly configService: IConfigurationService,
    private readonly accessibilityService: IAccessibilityService,
  ) {}

  /** @deprecated Use DI injection instead */
  public static getInstance(): KeypressService {
    KeypressService.instance ??= new KeypressService(
      Logger.getInstance(),
      ConfigurationService.getInstance(),
      AccessibilityService.getInstance(),
    );
    return KeypressService.instance;
  }

  public static create(
    logger: ILogger,
    configService: IConfigurationService,
    accessibilityService: IAccessibilityService,
  ): KeypressService {
    return new KeypressService(logger, configService, accessibilityService);
  }

  /**
   * Initialize the KeypressService and discover available VS Code commands
   */
  public async initialize(): Promise<void> {
    this.logger.info('Initializing KeypressService');
    await this.discoverAndWrapCommands();
  }

  /**
   * Enable keypress detection
   */
  public async enable(): Promise<void> {
    this.enabled = true;
    this.logger.info('KeypressService enabled');
  }

  /**
   * Disable keypress detection
   */
  public async disable(): Promise<void> {
    this.enabled = false;
    this.logger.info('KeypressService disabled');
  }

  /**
   * Discover VS Code commands and create dynamic wrappers
   */
  private async discoverAndWrapCommands(): Promise<void> {
    const knownCommands = Object.keys(KeypressService.COMMAND_KEY_MAP);

    this.logger.debug(`Registering wrappers for ${knownCommands.length} known shortcut commands`);

    // Create wrapper for each known command
    knownCommands.forEach((originalCommand) => {
      const wrapperSuffix = originalCommand.replace(/\./g, '_');
      const wrapperCommand = `keypress-notifications.wrapper.${wrapperSuffix}`;

      const disposable = vscode.commands.registerCommand(
        wrapperCommand,
        async (...args: unknown[]) => {
          if (this.enabled && this.configService.isEnabled()) {
            this.detectKeyPress(originalCommand);
          }
          // Execute the original command
          await vscode.commands.executeCommand(originalCommand, ...args);
        },
      );

      this.disposables.push(disposable);
    });

    this.logger.debug('Command wrappers registered successfully');
  }

  /**
   * Detect key press and show notification if multi-key combination
   */
  public detectKeyPress(commandId: string): void {
    const currentTime = Date.now();
    const timeSinceLastAction = currentTime - this.lastActionTime;
    const keyCombo = this.inferKeysFromCommand(commandId);

    // Check if command is excluded
    const excludedCommands = this.configService.getExcludedCommands();
    if (excludedCommands.includes(commandId)) {
      return;
    }

    // If quick succession, likely multi-key combination
    if (timeSinceLastAction < this.MULTI_KEY_THRESHOLD && this.actionBuffer.length > 0) {
      this.actionBuffer.push(keyCombo);
      this.showMultiKeyNotification();
    } else {
      this.actionBuffer = [keyCombo];
      // Show notification for any key combination (2+ keys)
      if (this.isMultiKeyCombo(keyCombo)) {
        const timer = setTimeout(() => {
          this.pendingTimers.delete(timer);
          this.showMultiKeyNotification();
        }, 50); // Small delay to capture sequences
        this.pendingTimers.add(timer);
      }
    }

    this.lastActionTime = currentTime;
  }

  /**
   * Check if key combination has multiple keys
   */
  private isMultiKeyCombo(keyCombo: string): boolean {
    const minimumKeys = this.configService.getMinimumKeys();
    const keyParts = keyCombo.split('+');
    return keyParts.length >= minimumKeys;
  }

  /**
   * Infer key combination from VS Code command name
   */
  private inferKeysFromCommand(commandId: string): string {
    // Check if we have a direct mapping
    // eslint-disable-next-line security/detect-object-injection
    const mapping = KeypressService.COMMAND_KEY_MAP[commandId];
    if (mapping) {
      return this.adjustForPlatform(mapping);
    }

    // Try to infer from command name patterns
    return this.analyzeCommandName(commandId);
  }

  /**
   * Analyze command name to infer likely key combination
   */
  private analyzeCommandName(commandId: string): string {
    // This is a fallback for unknown commands
    // We'll show a generic description
    const commandName = commandId.split('.').pop() ?? commandId;
    return `Key combination for ${commandName}`;
  }

  /**
   * Adjust key combination for platform (Mac uses Cmd instead of Ctrl)
   */
  private adjustForPlatform(keyCombo: string): string {
    if (process.platform === 'darwin') {
      return keyCombo.replace(/Ctrl/g, 'Cmd');
    }
    return keyCombo;
  }

  /**
   * Show notification with detected key combination
   */
  private showMultiKeyNotification(): void {
    if (this.actionBuffer.length > 0) {
      const keySequence = this.actionBuffer.join(' → ');
      let message = `You've pressed ${keySequence}`;

      // Optionally show command name if configured
      if (this.configService.shouldShowCommandName() && this.actionBuffer.length === 1) {
        // For single commands, we could add more context
        message += ' (keyboard shortcut detected)';
      }

      vscode.window.showInformationMessage(message);
      void this.accessibilityService.announce(message);
      this.actionBuffer = []; // Clear buffer after showing

      this.logger.debug(`Notification shown: ${message}`);
    }
  }

  /**
   * Get current state for testing or debugging
   */
  public getState(): { enabled: boolean; actionBufferLength: number; lastActionTime: number } {
    return {
      enabled: this.enabled,
      actionBufferLength: this.actionBuffer.length,
      lastActionTime: this.lastActionTime,
    };
  }

  public dispose(): void {
    this.pendingTimers.forEach(clearTimeout);
    this.pendingTimers.clear();
    this.disposables.forEach((d) => {
      try {
        d.dispose();
      } catch {
        // ignore
      }
    });
    this.disposables.length = 0;
  }
}
