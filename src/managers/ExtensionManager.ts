/**
 * Extension Manager
 *
 * Main coordinator for extension lifecycle and service management.
 *
 * @description
 * Orchestrates extension activation, deactivation, and service coordination.
 * Initializes all components and handles command registration via CommandRegistry.
 *
 * @category Managers
 * @category Lifecycle
 *
 * @example
 * ```typescript
 * const manager = new ExtensionManager(keypressService, configService, logger);
 * await manager.activate(context);
 * ```
 */

import * as vscode from 'vscode';

import {
  ShowOutputChannelCommand,
  EnableExtensionCommand,
  DisableExtensionCommand,
} from '../commands';
import type { ILogger } from '../di';
import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import type {
  IExtensionManager,
  KeypressNotificationsApi,
} from '../di/interfaces/IExtensionManager';
import type { IKeypressService } from '../di/interfaces/IKeypressService';

import { CommandRegistry } from './CommandRegistry';
import type { CommandMetadata } from './CommandRegistry';

/**
 * Extension Manager
 *
 * @description
 * Main coordinator for extension lifecycle.
 * Initializes all components and handles activation/deactivation.
 * Uses constructor injection for dependencies via DI container.
 *
 * @category Managers
 * @category Lifecycle
 */
export class ExtensionManager implements IExtensionManager {
  private logger: ILogger;
  private configService: IConfigurationService;
  private keypressService: IKeypressService;
  private accessibilityService: IAccessibilityService;
  private commandRegistry: CommandRegistry | undefined;
  private disposables: vscode.Disposable[] = [];

  /**
   * Create a new ExtensionManager instance
   *
   * @description
   * Creates manager with injected dependencies from DI container.
   *
   * @param keypressService - The keypress service for notification handling
   * @param configService - The configuration service for settings
   * @param accessibilityService - The accessibility service for screen reader support
   * @param logger - The logger for diagnostics
   *
   * @example
   * ```typescript
   * const manager = new ExtensionManager(
   *   keypressService,
   *   configService,
   *   accessibilityService,
   *   logger,
   * );
   * ```
   *
   * @category Construction
   */
  constructor(
    keypressService: IKeypressService,
    configService: IConfigurationService,
    accessibilityService: IAccessibilityService,
    logger: ILogger,
  ) {
    this.keypressService = keypressService;
    this.configService = configService;
    this.accessibilityService = accessibilityService;
    this.logger = logger;
  }

  /**
   * Activate the extension
   *
   * @description
   * Initializes all services, registers commands, and sets up context variables.
   * Called by VS Code when the extension is activated.
   *
   * @param context - VS Code extension context
   *
   * @example
   * ```typescript
   * await manager.activate(context);
   * ```
   *
   * @category Lifecycle
   */
  public async activate(context: vscode.ExtensionContext): Promise<void> {
    this.logger.info('Activating Keypress Notifications extension');

    try {
      // Initialize all components
      await this.initializeComponents();

      // Register commands
      await this.registerCommands();

      // Register disposables with VS Code
      this.disposables.forEach((disposable) => {
        context.subscriptions.push(disposable);
      });

      // Add our own disposables
      context.subscriptions.push({ dispose: () => this.dispose() });

      // Set initial context variable for enabled state
      await this.updateEnabledContext();

      this.logger.info('Keypress Notifications extension activated successfully');

      // Show activation message (only in development mode and when enabled)
      if (process.env['NODE_ENV'] === 'development' && this.configService.isEnabled()) {
        vscode.window.showInformationMessage('Keypress Notifications extension is now active');
      }
    } catch (error) {
      this.logger.error('Failed to activate extension', error);
      vscode.window.showErrorMessage('Failed to activate Keypress Notifications extension');
      throw error;
    }
  }

  /**
   * Deactivate the extension
   *
   * @description
   * Cleans up all resources and services.
   * Called by VS Code when the extension is deactivated.
   *
   * @example
   * ```typescript
   * manager.deactivate();
   * ```
   *
   * @category Lifecycle
   */
  public deactivate(): void {
    this.logger.info('Deactivating Keypress Notifications extension');
    this.dispose();
  }

  /**
   * Initialize all components
   *
   * @description
   * Initializes services and sets up configuration change listeners.
   *
   * @category Initialization
   * @private
   */
  private async initializeComponents(): Promise<void> {
    try {
      // Initialize services
      await this.keypressService.initialize();

      // Listen for configuration changes
      this.disposables.push(
        this.configService.onConfigurationChanged(() => {
          this.handleConfigurationChanged().catch((error) => {
            this.logger.error('Failed to handle configuration change', error);
          });
        }),
      );

      this.logger.debug('All components initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing components', error);
      throw error;
    }
  }

  /**
   * Register all extension commands
   *
   * @description
   * Registers VS Code commands for show output, enable, and disable.
   * Uses CommandRegistry for centralized command management.
   *
   * @category Command Registration
   * @private
   */
  private async registerCommands(): Promise<void> {
    try {
      // Initialize command registry
      this.commandRegistry = new CommandRegistry({ subscriptions: this.disposables }, this.logger);

      // Create command handlers
      const showOutputChannelCommand = ShowOutputChannelCommand.create(
        this.logger,
        this.accessibilityService,
      );
      const enableExtensionCommand = EnableExtensionCommand.create(
        this.configService,
        this.logger,
        this.accessibilityService,
      );
      const disableExtensionCommand = DisableExtensionCommand.create(
        this.configService,
        this.logger,
        this.accessibilityService,
      );

      // Define command metadata
      const commands: CommandMetadata[] = [
        {
          id: 'keypress-notifications.showOutputChannel',
          handler: () => showOutputChannelCommand.execute(),
          title: 'Show Status',
          category: 'Keypress Notifications',
        },
        {
          id: 'keypress-notifications.enable',
          handler: () => enableExtensionCommand.execute(),
          title: 'Enable',
          category: 'Keypress Notifications',
        },
        {
          id: 'keypress-notifications.disable',
          handler: () => disableExtensionCommand.execute(),
          title: 'Disable',
          category: 'Keypress Notifications',
        },
      ];

      // Register all commands
      this.commandRegistry.registerCommands(commands);

      this.logger.debug(`Commands registered successfully (${commands.length} commands)`);
    } catch (error) {
      this.logger.error('Error registering commands', error);
      throw error;
    }
  }

  /**
   * Handle configuration changes
   *
   * @description
   * Called when extension configuration changes.
   * Updates enabled context and enables/disables keypress service.
   *
   * @category Configuration Handling
   * @private
   */
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

  /**
   * Update VS Code context variable
   *
   * @description
   * Updates the 'keypress-notifications.enabled' context variable
   * used for when clauses in package.json.
   *
   * @category Context Management
   * @private
   */
  private async updateEnabledContext(): Promise<void> {
    const isEnabled = this.configService.isEnabled();

    await vscode.commands.executeCommand('setContext', 'keypress-notifications.enabled', isEnabled);

    this.logger.debug(`Context variables updated: enabled = ${isEnabled}`);
  }

  /**
   * Dispose of all resources
   *
   * @description
   * Cleans up all registered disposables and services.
   * Called automatically during deactivation.
   *
   * @category Lifecycle
   * @private
   */
  private dispose(): void {
    this.logger.debug('Disposing ExtensionManager');

    // Dispose command registry
    if (this.commandRegistry) {
      try {
        this.commandRegistry.dispose();
      } catch (error) {
        this.logger.warn('Error disposing command registry', error);
      }
      this.commandRegistry = undefined;
    }

    // Dispose all registered disposables
    this.disposables.forEach((disposable) => {
      try {
        disposable.dispose();
      } catch (error) {
        this.logger.warn('Error disposing resource', error);
      }
    });

    this.disposables = [];

    // Note: Services are disposed by DI container
    // We don't dispose them here to avoid double-disposal
  }

  /**
   * Get the configuration service (for testing/external access)
   *
   * @description
   * Returns the configuration service instance.
   *
   * @returns The configuration service
   *
   * @example
   * ```typescript
   * const config = manager.getConfigurationService();
   * console.log(config.getConfiguration());
   * ```
   *
   * @category Public API
   */
  public getConfigurationService(): IConfigurationService {
    return this.configService;
  }

  /**
   * Get the keypress service (for testing/external access)
   *
   * @description
   * Returns the keypress service instance.
   *
   * @returns The keypress service
   *
   * @example
   * ```typescript
   * const keypress = manager.getKeypressService();
   * console.log(keypress.getState());
   * ```
   *
   * @category Public API
   */
  public getKeypressService(): IKeypressService {
    return this.keypressService;
  }

  /**
   * Get the public API for external access
   *
   * @description
   * Returns the public API interface for the extension.
   * Provides access to events for testing and integrations.
   *
   * @returns The public API interface
   *
   * @example
   * ```typescript
   * const api = manager.getApi();
   * api.onDidShowNotification((message) => {
   *   console.log('Notification shown:', message);
   * });
   * ```
   *
   * @category Public API
   */
  public getApi(): KeypressNotificationsApi {
    return {
      onDidShowNotification: this.keypressService.onDidShowNotification,
    };
  }

  /**
   * Check if the extension is currently active
   *
   * @description
   * Returns whether the extension is enabled.
   *
   * @returns Whether the extension is active
   *
   * @example
   * ```typescript
   * if (manager.isActive()) {
   *   console.log('Extension is active');
   * }
   * ```
   *
   * @category Public API
   */
  public isActive(): boolean {
    return this.configService.isEnabled();
  }
}
