import * as vscode from 'vscode';

import { BaseService } from './BaseService';
import { ConfigurationService } from './ConfigurationService';

/**
 * KeypressService class that dynamically detects multi-key combinations
 * without hardcoding specific shortcuts. Shows notifications like "You've pressed Ctrl+C".
 */
export class KeypressService extends BaseService {
  private lastActionTime = 0;
  private actionBuffer: string[] = [];
  private readonly MULTI_KEY_THRESHOLD = 150; // ms between keys to consider multi-key sequence
  private configService: ConfigurationService;
  private enabled = true;

  constructor() {
    super();
    this.configService = ConfigurationService.getInstance();
  }

  /**
   * Initialize the KeypressService and discover available VS Code commands
   */
  public override async initialize(): Promise<void> {
    await super.initialize();
    this.logger.info('Initializing KeypressService');
    await this.discoverAndWrapCommands();
  }

  /**
   * Enable keypress detection
   */
  public override async enable(): Promise<void> {
    await super.enable();
    this.enabled = true;
    this.logger.info('KeypressService enabled');
  }

  /**
   * Disable keypress detection
   */
  public override async disable(): Promise<void> {
    await super.disable();
    this.enabled = false;
    this.logger.info('KeypressService disabled');
  }

  /**
   * Discover VS Code commands and create dynamic wrappers
   */
  private async discoverAndWrapCommands(): Promise<void> {
    const allCommands = await vscode.commands.getCommands();

    // Filter for common keyboard shortcut commands
    const shortcutCommands = allCommands.filter(cmd =>
      cmd.startsWith('editor.action.') ||
      cmd.startsWith('workbench.action.') ||
      cmd.includes('clipboard') ||
      cmd.includes('save') ||
      cmd.includes('format') ||
      cmd.includes('comment'),
    );

    this.logger.debug(`Found ${shortcutCommands.length} shortcut commands to wrap`);

    // Create wrapper for each discovered command
    shortcutCommands.forEach(originalCommand => {
      const wrapperCommand =
        `keypress-notifications.wrapper.${originalCommand.replace(/\./g, '_')}`;

      const disposable = vscode.commands.registerCommand(
        wrapperCommand,
        async (...args: unknown[]) => {
          if (this.enabled && this.configService.isEnabled()) {
            this.detectKeyPress(originalCommand);
          }
          // Execute the original command
          await vscode.commands.executeCommand(originalCommand, ...args);
        });

      this.registerDisposable(disposable);
    });

    this.logger.debug('Command wrappers registered successfully');
  }

  /**
   * Detect key press and show notification if multi-key combination
   */
  detectKeyPress(commandId: string): void {
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
        setTimeout(() => this.showMultiKeyNotification(), 50); // Small delay to capture sequences
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
    // Common command to key mappings
    const commandKeyMap: Record<string, string> = {
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
    };

    // Check if we have a direct mapping
    const mapping = commandKeyMap[commandId];
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
      this.actionBuffer = []; // Clear buffer after showing

      this.logger.debug(`Notification shown: ${message}`);
    }
  }

  /**
   * Get current state for testing or debugging
   */
  public getState() {
    return {
      enabled: this.enabled,
      actionBufferLength: this.actionBuffer.length,
      lastActionTime: this.lastActionTime,
    };
  }
}