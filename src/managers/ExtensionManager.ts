import { Disposable, ExtensionContext, window, commands } from 'vscode';
import { ConfigurationService } from '../services/ConfigurationService';
import { KeybindingNotificationService } from '../services/KeybindingNotificationService';
import { Logger } from '../utils/logger';
import { CommandManager } from './CommandManager';

/**
 * Main extension manager that coordinates all other managers and services.
 *
 * This class is responsible for:
 * - Extension activation and deactivation
 * - Coordinating initialization of all managers and services
 * - Managing VS Code context and subscriptions
 * - Handling configuration changes
 */
export class ExtensionManager {
  private readonly logger = new Logger();
  private readonly configService = ConfigurationService.getInstance();
  private readonly commandManager = new CommandManager();
  private readonly keybindingService = new KeybindingNotificationService();
  private readonly disposables: Disposable[] = [];
  private context: ExtensionContext | undefined;

  /**
   * Activate the extension with the given context.
   */
  public async activate(context: ExtensionContext): Promise<void> {
    this.context = context;
    this.logger.info('Activating Keypress Notifications');

    try {
      // Initialize core services
      await this.initializeServices();

      // Initialize managers
      await this.initializeManagers();

      // Register disposables with VS Code context
      this.disposables.forEach((disposable) => {
        context.subscriptions.push(disposable);
      });

      // Add our own cleanup
      context.subscriptions.push({ dispose: () => this.dispose() });

      // Set initial context variables
      await this.updateContextVariables();

      this.logger.info('Keypress Notifications activated successfully');

      // Show activation message in development mode
      if (process.env['NODE_ENV'] === 'development' && this.configService.isEnabled()) {
        window.showInformationMessage('Keypress Notifications is now active');
      }
    } catch (error) {
      this.logger.error('Failed to activate extension:', error);
      window.showErrorMessage('Failed to activate Keypress Notifications');
      throw error;
    }
  }

  /**
   * Deactivate the extension and clean up resources.
   */
  public deactivate(): void {
    this.logger.info('Deactivating Keypress Notifications');
    this.dispose();
  }

  /**
   * Get the VS Code extension context.
   */
  public getContext(): ExtensionContext | undefined {
    return this.context;
  }

  /**
   * Check if the extension is currently active.
   */
  public isActive(): boolean {
    return this.configService.isEnabled();
  }

  /**
   * Initialize core services.
   */
  private async initializeServices(): Promise<void> {
    try {
      // Initialize configuration service first (other services depend on it)
      if (!this.configService.isInitialized()) {
        await this.configService.initialize();
      }

      // Listen for configuration changes early
      this.addDisposable(
        this.configService.onConfigurationChanged(async (config) => {
          await this.handleConfigurationChanged(config);
        })
      );

      // Initialize keybinding notification service
      if (!this.keybindingService.isInitialized()) {
        await this.keybindingService.initialize();
      }

      this.logger.debug('Services initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize services:', error);
      // Clean up any partially initialized services
      try {
        this.keybindingService.dispose();
        this.configService.dispose();
      } catch (cleanupError) {
        this.logger.warn('Error during service cleanup:', cleanupError);
      }
      throw error;
    }
  }

  /**
   * Initialize managers.
   */
  private async initializeManagers(): Promise<void> {
    try {
      // Initialize command manager
      await this.commandManager.activate();
      this.addDisposable({ dispose: () => this.commandManager.deactivate() });

      this.logger.debug('Managers initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize managers:', error);
      throw error;
    }
  }

  /**
   * Handle configuration changes.
   */
  private async handleConfigurationChanged(config: unknown): Promise<void> {
    try {
      this.logger.debug('Configuration changed:', config);
      
      // Update keybinding service enabled state
      const configObj = config as { enabled?: boolean };
      if (typeof configObj.enabled === 'boolean') {
        await this.keybindingService.setEnabled(configObj.enabled);
      }
      
      // Update keybinding service configuration for other settings
      await this.keybindingService.updateConfiguration();
      
      // Update context variables
      await this.updateContextVariables();
    } catch (error) {
      this.logger.error('Error handling configuration change:', error);
      // Don't rethrow - configuration changes should be non-fatal
    }
  }

  /**
   * Update VS Code context variables.
   */
  private async updateContextVariables(): Promise<void> {
    try {
      const isEnabled = this.configService.isEnabled();

      await commands.executeCommand('setContext', 'keypress-notifications.enabled', isEnabled);

      this.logger.debug(`Context variables updated: enabled = ${isEnabled}`);
    } catch (error) {
      this.logger.error('Error updating context variables:', error);
      // Don't rethrow - context variable updates should be non-fatal
    }
  }

  /**
   * Add a disposable resource.
   */
  private addDisposable(disposable: Disposable): void {
    this.disposables.push(disposable);
  }

  /**
   * Dispose of all resources.
   */
  private dispose(): void {
    this.logger.debug('Disposing ExtensionManager');

    // Deactivate command manager
    if (this.commandManager.isActivated()) {
      this.commandManager.deactivate();
    }

    // Dispose services
    this.keybindingService.dispose();
    this.configService.dispose();

    // Dispose all registered disposables
    this.disposables.forEach((disposable) => {
      try {
        disposable.dispose();
      } catch (error) {
        this.logger.warn('Error disposing resource:', error);
      }
    });

    this.disposables.length = 0;

    // Dispose logger last
    this.logger.dispose();
  }

  // Public API for testing
  public getCommandManager(): CommandManager {
    return this.commandManager;
  }

  public getConfigurationService(): ConfigurationService {
    return this.configService;
  }

  public getKeybindingService(): KeybindingNotificationService {
    return this.keybindingService;
  }
}