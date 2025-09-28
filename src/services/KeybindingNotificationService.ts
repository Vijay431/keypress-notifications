import { Disposable, commands } from 'vscode';
import { BaseService } from './BaseService';
import { NotificationService } from './NotificationService';
import { ConfigurationService } from './ConfigurationService';
import { KeybindingReaderService } from './KeybindingReaderService';
import { KeybindingEvent, CommandInfo, KeyCombination } from '../types/extension';

/**
 * Service responsible for detecting keybinding usage and showing notifications.
 *
 * This service provides:
 * - Detection of multi-key command executions
 * - Notification display for keybinding events
 * - Configuration-based filtering and enabling/disabling
 * - Integration with VS Code's command system
 */
export class KeybindingNotificationService extends BaseService {
  private readonly notificationService = new NotificationService();
  private readonly configService = ConfigurationService.getInstance();
  private readonly keybindingReader = new KeybindingReaderService();
  private readonly commandInterceptors = new Map<string, Disposable>();
  private isEnabled = false;
  private minimumKeys = 2;
  private excludedCommands: string[] = [];
  private showCommandName = true;

  // Common VS Code commands with their default keybindings
  private readonly commonKeybindings = new Map<string, string>([
    // Clipboard operations
    ['editor.action.clipboardCopyAction', 'Ctrl+C'],
    ['editor.action.clipboardCutAction', 'Ctrl+X'],
    ['editor.action.clipboardPasteAction', 'Ctrl+V'],
    
    // File operations
    ['workbench.action.files.save', 'Ctrl+S'],
    ['workbench.action.files.saveAll', 'Ctrl+K S'],
    ['workbench.action.files.newUntitledFile', 'Ctrl+N'],
    ['workbench.action.files.openFile', 'Ctrl+O'],
    
    // Editor operations
    ['editor.action.formatDocument', 'Shift+Alt+F'],
    ['editor.action.commentLine', 'Ctrl+/'],
    ['editor.action.duplicateSelection', 'Shift+Alt+Down'],
    ['editor.action.moveLinesDownAction', 'Alt+Down'],
    ['editor.action.moveLinesUpAction', 'Alt+Up'],
    
    // Search and navigation
    ['workbench.action.findInFiles', 'Ctrl+Shift+F'],
    ['workbench.action.quickOpen', 'Ctrl+P'],
    ['workbench.action.showCommands', 'Ctrl+Shift+P'],
    ['workbench.action.gotoLine', 'Ctrl+G'],
    
    // View operations
    ['workbench.action.toggleSidebarVisibility', 'Ctrl+B'],
    ['workbench.action.terminal.toggleTerminal', 'Ctrl+`'],
    ['workbench.action.togglePanel', 'Ctrl+J'],
    
    // Debug operations
    ['workbench.action.debug.start', 'F5'],
    ['workbench.action.debug.stepOver', 'F10'],
    ['workbench.action.debug.stepInto', 'F11'],
    ['workbench.action.debug.stepOut', 'Shift+F11'],
    
    // Window operations
    ['workbench.action.closeActiveEditor', 'Ctrl+W'],
    ['workbench.action.closeWindow', 'Ctrl+Shift+W'],
    ['workbench.action.newWindow', 'Ctrl+Shift+N'],
    
    // Multi-cursor and selection
    ['editor.action.addSelectionToNextFindMatch', 'Ctrl+D'],
    ['editor.action.selectHighlights', 'Ctrl+Shift+L'],
    ['editor.action.insertCursorAbove', 'Ctrl+Alt+Up'],
    ['editor.action.insertCursorBelow', 'Ctrl+Alt+Down']
  ]);

  constructor() {
    super('KeybindingNotificationService');
  }

  protected override async onInitialize(): Promise<void> {
    await this.notificationService.initialize();
    await this.keybindingReader.initialize();
    
    await this.loadConfiguration();
    await this.setupKeybindingDetection();
    
    this.logger.debug('KeybindingNotificationService initialized');
  }

  protected override onDispose(): void {
    this.disposeInterceptors();
    this.keybindingReader.dispose();
    this.notificationService.dispose();
  }

  /**
   * Load configuration settings.
   */
  private async loadConfiguration(): Promise<void> {
    const config = this.configService.getConfiguration();
    this.isEnabled = config.enabled;
    this.minimumKeys = config.minimumKeys || 2;
    this.excludedCommands = config.excludedCommands || [];
    this.showCommandName = config.showCommandName !== false;
  }

  /**
   * Set up keybinding detection by intercepting command executions.
   */
  private async setupKeybindingDetection(): Promise<void> {
    if (!this.isEnabled) {
      this.logger.debug('Keybinding detection disabled via configuration');
      return;
    }

    try {
      // Register interceptors for common multi-key commands
      this.registerCommandInterceptors();
      
      this.logger.info(`Keybinding detection set up for ${this.commandInterceptors.size} commands`);
    } catch (error) {
      this.logger.error('Failed to setup keybinding detection:', error);
      throw error;
    }
  }

  /**
   * Register command interceptors for multi-key commands.
   */
  private registerCommandInterceptors(): void {
    const notifiableCommands = this.getNotifiableCommands();
    
    for (const commandId of notifiableCommands) {
      this.registerCommandInterceptor(commandId);
    }
  }

  /**
   * Register an interceptor for a specific command.
   */
  private registerCommandInterceptor(commandId: string): void {
    if (this.commandInterceptors.has(commandId)) {
      return; // Already registered
    }

    try {
      // Register a command with the same ID to intercept it
      const disposable = commands.registerCommand(commandId, async (...args: unknown[]) => {
        // Handle the keybinding event
        await this.handleCommandExecution(commandId, args);
        
        // Execute the original command
        await this.executeOriginalCommand(commandId, args);
      });

      this.commandInterceptors.set(commandId, disposable);
      this.addDisposable(disposable);
    } catch (error) {
      this.logger.warn(`Failed to register interceptor for command ${commandId}:`, error);
    }
  }

  /**
   * Handle command execution and show notification.
   */
  private async handleCommandExecution(commandId: string, args: unknown[]): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    try {
      const keybinding = this.getKeybindingForCommand(commandId);
      if (!keybinding) {
        return; // No keybinding information available
      }

      const commandInfo: CommandInfo = {
        id: commandId,
        title: this.getCommandTitle(commandId),
        keybinding
      };

      const event: KeybindingEvent = {
        command: commandInfo,
        keyCombination: keybinding,
        timestamp: new Date(),
        context: args.length > 0 ? 'with-args' : 'no-args'
      };

      await this.showKeybindingNotification(event);
      this.logger.debug(`Keybinding event processed for command: ${commandId}`, { keybinding: keybinding.formatted });
    } catch (error) {
      this.logger.error(`Error handling command execution for ${commandId}:`, error);
    }
  }

  /**
   * Execute the original command.
   */
  private async executeOriginalCommand(commandId: string, args: unknown[]): Promise<void> {
    try {
      // Temporarily unregister our interceptor to avoid infinite recursion
      const interceptor = this.commandInterceptors.get(commandId);
      if (interceptor) {
        interceptor.dispose();
        this.commandInterceptors.delete(commandId);
      }

      // Execute the original command
      await commands.executeCommand(commandId, ...args);

      // Re-register the interceptor
      if (interceptor) {
        this.registerCommandInterceptor(commandId);
      }
    } catch (error) {
      this.logger.error(`Error executing original command ${commandId}:`, error);
      // Re-register the interceptor even if execution failed
      this.registerCommandInterceptor(commandId);
    }
  }

  /**
   * Get keybinding information for a command.
   */
  private getKeybindingForCommand(commandId: string): KeyCombination | undefined {
    // First check if we have it in our common keybindings
    const commonBinding = this.commonKeybindings.get(commandId);
    if (commonBinding) {
      return this.keybindingReader.parseKeyString(commonBinding);
    }

    // Then check the keybinding reader
    const binding = this.keybindingReader.getKeybindingForCommand(commandId);
    if (binding) {
      return this.keybindingReader.parseKeyString(binding.key);
    }

    return undefined;
  }

  /**
   * Get a human-readable title for a command.
   */
  private getCommandTitle(commandId: string): string {
    // Convert command ID to readable title
    const parts = commandId.split('.');
    const lastPart = parts[parts.length - 1];
    
    if (!lastPart) {
      return commandId; // Fallback to original command ID
    }
    
    // Convert camelCase to Title Case
    return lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Show notification for keybinding event.
   */
  private async showKeybindingNotification(event: KeybindingEvent): Promise<void> {
    const keyCombo = event.keyCombination.formatted;
    let message = `${keyCombo}`;
    
    if (this.showCommandName && event.command.title) {
      message += ` - ${event.command.title}`;
    }
    
    message += ' detected';

    await this.notificationService.showInfo(message);
  }

  /**
   * Get list of commands that should trigger notifications.
   */
  private getNotifiableCommands(): string[] {
    const commands: string[] = [];

    // Add commands from common keybindings that meet criteria
    for (const [commandId, keyString] of this.commonKeybindings) {
      if (!this.keybindingReader.meetsMinimumKeys(keyString, this.minimumKeys)) {
        continue;
      }

      if (this.keybindingReader.isCommandExcluded(commandId, this.excludedCommands)) {
        continue;
      }

      commands.push(commandId);
    }

    // Add commands from keybinding reader
    const readerCommands = this.keybindingReader.getNotifiableCommands(
      this.minimumKeys,
      this.excludedCommands
    );
    
    for (const commandId of readerCommands) {
      if (!commands.includes(commandId)) {
        commands.push(commandId);
      }
    }

    return commands;
  }

  /**
   * Dispose all command interceptors.
   */
  private disposeInterceptors(): void {
    for (const [commandId, disposable] of this.commandInterceptors) {
      try {
        disposable.dispose();
      } catch (error) {
        this.logger.warn(`Error disposing interceptor for ${commandId}:`, error);
      }
    }
    this.commandInterceptors.clear();
    this.logger.debug('All command interceptors disposed');
  }

  /**
   * Enable or disable keybinding detection.
   */
  public async setEnabled(enabled: boolean): Promise<void> {
    const wasEnabled = this.isEnabled;
    this.isEnabled = enabled;

    if (enabled && !wasEnabled && this.initialized) {
      await this.setupKeybindingDetection();
    } else if (!enabled && wasEnabled) {
      this.disposeInterceptors();
    }
  }

  /**
   * Update configuration settings.
   */
  public async updateConfiguration(): Promise<void> {
    await this.loadConfiguration();
    
    if (this.isEnabled) {
      // Restart detection with new configuration
      this.disposeInterceptors();
      await this.setupKeybindingDetection();
    }
  }

  /**
   * Check if keybinding detection is currently active.
   */
  public isActive(): boolean {
    return this.isEnabled && this.commandInterceptors.size > 0;
  }

  /**
   * Get statistics about registered interceptors.
   */
  public getStatistics(): { 
    totalInterceptors: number; 
    enabledCommands: string[];
    excludedCount: number;
  } {
    const enabledCommands = Array.from(this.commandInterceptors.keys());
    const allCommands = Array.from(this.commonKeybindings.keys());
    const excludedCount = allCommands.filter(cmd => 
      this.keybindingReader.isCommandExcluded(cmd, this.excludedCommands)
    ).length;

    return {
      totalInterceptors: this.commandInterceptors.size,
      enabledCommands,
      excludedCount
    };
  }
}