import * as vscode from 'vscode';

import { container, TYPES } from '../di';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import type { IKeypressService } from '../di/interfaces/IKeypressService';
import type { ILogger } from '../di/interfaces/ILogger';
import { CommandRegistry } from './CommandRegistry';

export class ExtensionManager {
  private logger: ILogger;
  private configService: IConfigurationService;
  private keypressService: IKeypressService;
  private commandRegistry: CommandRegistry;
  private disposables: vscode.Disposable[] = [];

  constructor() {
    this.logger = container.get<ILogger>(TYPES.Logger);
    this.configService = container.get<IConfigurationService>(TYPES.ConfigurationService);
    this.keypressService = container.get<IKeypressService>(TYPES.KeypressService);
    this.commandRegistry = new CommandRegistry();
  }

  public async activate(context: vscode.ExtensionContext): Promise<void> {
    this.logger.info('Activating Keypress Notifications extension');

    try {
      // Initialize components
      await this.initializeComponents();

      // Register commands via CommandRegistry
      this.commandRegistry.register(context);

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

    await vscode.commands.executeCommand('setContext', 'keypress-notifications.enabled', isEnabled);

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

    // Dispose command registry
    this.commandRegistry.dispose();

    // Services are disposed via context.subscriptions (registered in container)
  }

  // Public API for testing or external access
  public getConfigurationService(): IConfigurationService {
    return this.configService;
  }

  public getKeypressService(): IKeypressService {
    return this.keypressService;
  }

  public isActive(): boolean {
    return this.configService.isEnabled();
  }
}
