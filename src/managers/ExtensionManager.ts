import * as vscode from 'vscode';

import { ConfigurationService } from '../services/ConfigurationService';
import { KeypressService } from '../services/KeypressService';
import { Logger } from '../utils/logger';

export class ExtensionManager {
  private logger: Logger;
  private configService: ConfigurationService;
  private keypressService: KeypressService;
  private disposables: vscode.Disposable[] = [];

  constructor() {
    this.logger = Logger.getInstance();
    this.configService = ConfigurationService.getInstance();
    this.keypressService = new KeypressService();
  }

  public async activate(context: vscode.ExtensionContext): Promise<void> {
    this.logger.info('Activating Keypress Notifications extension');

    try {
      // Initialize components
      await this.initializeComponents();

      // Register commands
      await this.registerCommands();

      // Register disposables with VS Code context
      this.disposables.forEach((disposable) => {
        context.subscriptions.push(disposable);
      });

      // Add our own disposables
      context.subscriptions.push({ dispose: () => this.dispose() });

      // Set initial context variable for enabled state
      await this.updateEnabledContext();

      this.logger.info('Keypress Notifications extension activated successfully');

      // Show activation message (only in debug mode and when enabled)
      if (process.env['NODE_ENV'] === 'development' && this.configService.isEnabled()) {
        vscode.window.showInformationMessage('Keypress Notifications extension is now active');
      }
    } catch (error) {
      this.logger.error('Failed to activate extension', error);
      vscode.window.showErrorMessage('Failed to activate Keypress Notifications extension');
      throw error;
    }
  }

  private async initializeComponents(): Promise<void> {
    try {
      // Initialize services
      await this.configService.initialize();
      await this.keypressService.initialize();

      // Listen for configuration changes to enable/disable extension
      this.disposables.push(
        this.configService.onConfigurationChanged(() => {
          void this.handleConfigurationChanged();
        }),
      );

      this.logger.debug('All components initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing components', error);
      throw error;
    }
  }

  private async registerCommands(): Promise<void> {
    // Register show output command
    this.disposables.push(
      vscode.commands.registerCommand('keypress-notifications.showOutputChannel', () => {
        this.logger.show();
        vscode.window.showInformationMessage('Keypress Notifications is active');
      }),
    );

    // Register enable/disable commands
    this.disposables.push(
      vscode.commands.registerCommand('keypress-notifications.enable', async () => {
        await this.configService.updateConfiguration('enabled', true);
        vscode.window.showInformationMessage('Keypress Notifications extension enabled');
      }),
    );

    this.disposables.push(
      vscode.commands.registerCommand('keypress-notifications.disable', async () => {
        await this.configService.updateConfiguration('enabled', false);
        vscode.window.showInformationMessage('Keypress Notifications extension disabled');
      }),
    );

    this.logger.debug('Commands registered successfully');
  }

  private async handleConfigurationChanged(): Promise<void> {
    const isEnabled = this.configService.isEnabled();
    this.logger.debug(`Configuration changed - enabled: ${isEnabled}`);

    // Update VS Code context variable for when clauses
    await this.updateEnabledContext();

    // Enable or disable keypress detection based on configuration
    if (isEnabled) {
      await this.keypressService.enable();
      this.logger.info('Extension enabled via configuration');
    } else {
      await this.keypressService.disable();
      this.logger.info('Extension disabled via configuration');
    }
  }

  private async updateEnabledContext(): Promise<void> {
    const isEnabled = this.configService.isEnabled();

    await vscode.commands.executeCommand(
      'setContext',
      'keypress-notifications.enabled',
      isEnabled,
    );

    this.logger.debug(`Context variables updated: enabled = ${isEnabled}`);
  }

  public deactivate(): void {
    this.logger.info('Deactivating Keypress Notifications extension');
    this.dispose();
  }

  private dispose(): void {
    this.logger.debug('Disposing ExtensionManager');

    // Dispose all registered disposables
    this.disposables.forEach((disposable) => {
      try {
        disposable.dispose();
      } catch (error) {
        this.logger.warn('Error disposing resource', error);
      }
    });

    this.disposables = [];

    // Dispose services
    this.keypressService.dispose();
    this.configService.dispose();

    // Dispose logger last
    this.logger.dispose();
  }

  // Public API for testing or external access
  public getConfigurationService(): ConfigurationService {
    return this.configService;
  }

  public getKeypressService(): KeypressService {
    return this.keypressService;
  }

  public isActive(): boolean {
    return this.configService.isEnabled();
  }
}