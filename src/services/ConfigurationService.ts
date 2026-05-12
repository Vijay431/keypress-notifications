/**
 * Configuration Service
 *
 * Manages VS Code configuration settings for the extension.
 * Provides type-safe access to extension settings with change event handling.
 *
 * @description
 * Handles configuration management with automatic migration support.
 * Integrates with VS Code's configuration system and provides change events.
 *
 * @category Services
 * @category Configuration
 *
 * @example
 * ```typescript
 * const configService = ConfigurationService.create(logger);
 * const config = configService.getConfiguration();
 * console.log(`Extension enabled: ${config.enabled}`);
 * ```
 */

import * as vscode from 'vscode';

import type { ILogger } from '../di';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import { ExtensionConfig, LogLevel } from '../types/extension';
import { Logger } from '../utils/logger';

import { BaseService } from './BaseService';

/**
 * Configuration Service
 *
 * @description
 * Manages VS Code configuration settings for the extension.
 * Provides type-safe access to extension settings with change event handling.
 * Supports configuration migrations and context variable updates.
 *
 * @category Services
 * @category Configuration
 */
export class ConfigurationService extends BaseService implements IConfigurationService {
  private static instance?: ConfigurationService;
  private readonly configSection = 'keypress-notifications';
  private currentConfig: ExtensionConfig;

  /**
   * Private constructor - use create() or getInstance()
   *
   * @description
   * Creates a new ConfigurationService with injected logger.
   * Private to enforce factory pattern and DI usage.
   *
   * @param logger - Logger instance for logging
   */
  private constructor(logger: ILogger) {
    super(logger);
    this.currentConfig = this.readConfiguration();
  }

  /**
   * Get singleton instance (legacy pattern)
   *
   * @description
   * Returns the singleton ConfigurationService instance.
   * Creates one if it doesn't exist, injecting a Logger instance.
   *
   * @deprecated Use DI injection instead:
   * `container.get<IConfigurationService>(TYPES.ConfigurationService)`
   *
   * @example
   * ```typescript
   * const configService = ConfigurationService.getInstance();
   * ```
   *
   * @category Singleton Pattern
   */
  public static getInstance(): ConfigurationService {
    ConfigurationService.instance ??= new ConfigurationService(Logger.getInstance());
    return ConfigurationService.instance;
  }

  /**
   * Create a new instance (DI pattern)
   *
   * @description
   * Factory method for creating a new ConfigurationService instance.
   * Used by the DI container for dependency injection.
   *
   * @param logger - Logger instance to inject
   * @returns New ConfigurationService instance
   *
   * @example
   * ```typescript
   * container.registerSingleton<IConfigurationService>(
   *   TYPES.ConfigurationService,
   *   () => {
   *     const logger = container.get<ILogger>(TYPES.Logger);
   *     return ConfigurationService.create(logger);
   *   }
   * );
   * ```
   *
   * @category Factory Pattern
   */
  public static create(logger: ILogger): ConfigurationService {
    return new ConfigurationService(logger);
  }

  /**
   * Initialize the service
   *
   * @description
   * Sets up configuration and applies log level settings.
   *
   * @example
   * ```typescript
   * await configService.initialize();
   * ```
   *
   * @category Lifecycle
   */
  public override async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.logger.debug('Initializing ConfigurationService');

    this.currentConfig = this.readConfiguration();
    this.applyLogLevel(this.currentConfig.logLevel);

    this.initialized = true;
  }

  /**
   * Get the complete extension configuration
   *
   * @description
   * Returns the current configuration object with all settings.
   *
   * @returns The extension configuration
   *
   * @example
   * ```typescript
   * const config = configService.getConfiguration();
   * console.log(`Minimum keys: ${config.minimumKeys}`);
   * ```
   *
   * @category Configuration Access
   */
  public getConfiguration(): ExtensionConfig {
    this.currentConfig = this.readConfiguration();
    return this.currentConfig;
  }

  /**
   * Check if the extension is enabled
   *
   * @description
   * Returns true if the extension's enabled setting is true.
   *
   * @returns Whether the extension is enabled
   *
   * @example
   * ```typescript
   * if (configService.isEnabled()) {
   *   // Show notifications
   * }
   * ```
   *
   * @category Configuration Access
   */
  public isEnabled(): boolean {
    return this.getConfiguration().enabled;
  }

  /**
   * Get the minimum key threshold
   *
   * @description
   * Returns the minimum number of keys required to show a notification.
   *
   * @returns The minimum key count (default: 2)
   *
   * @example
   * ```typescript
   * const minKeys = configService.getMinimumKeys();
   * if (keyCount >= minKeys) {
   *   showNotification();
   * }
   * ```
   *
   * @category Configuration Access
   */
  public getMinimumKeys(): number {
    return this.getConfiguration().minimumKeys;
  }

  /**
   * Get excluded commands list
   *
   * @description
   * Returns the list of commands that should not trigger notifications.
   *
   * @returns Array of command IDs to exclude
   *
   * @example
   * ```typescript
   * const excluded = configService.getExcludedCommands();
   * if (excluded.includes(commandId)) {
   *   return; // Skip this command
   * }
   * ```
   *
   * @category Configuration Access
   */
  public getExcludedCommands(): string[] {
    return this.getConfiguration().excludedCommands;
  }

  /**
   * Check if command name should be shown
   *
   * @description
   * Returns true if the showCommandName setting is enabled.
   *
   * @returns Whether to show command names in notifications
   *
   * @example
   * ```typescript
   * if (configService.shouldShowCommandName()) {
   *   message += ` (${commandName})`;
   * }
   * ```
   *
   * @category Configuration Access
   */
  public shouldShowCommandName(): boolean {
    return this.getConfiguration().showCommandName;
  }

  /**
   * Get the current log level
   *
   * @description
   * Returns the configured log level.
   *
   * @returns The log level setting
   *
   * @example
   * ```typescript
   * const level = configService.getLogLevel();
   * logger.setLogLevel(level);
   * ```
   *
   * @category Configuration Access
   */
  public getLogLevel(): LogLevel {
    return this.getConfiguration().logLevel as unknown as LogLevel;
  }

  /**
   * Listen for configuration changes
   *
   * @description
   * Registers a callback to be invoked when configuration changes.
   * The callback is only invoked for changes affecting this extension.
   *
   * @param callback - Function to call when configuration changes
   * @returns Disposable for unregistering the listener
   *
   * @example
   * ```typescript
   * const disposable = configService.onConfigurationChanged(() => {
   *   // Refresh configuration-dependent behavior
   * });
   * ```
   *
   * @category Configuration Events
   */
  public onConfigurationChanged(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(this.configSection)) {
        callback();
      }
    });
  }

  /**
   * Update a configuration setting
   *
   * @description
   * Updates a configuration value.
   * Triggers configuration change events.
   *
   * @template T - Type of the configuration value
   * @param key - Configuration key to update
   * @param value - New value for the setting
   * @param target - Configuration target (global, workspace, or workspace folder)
   *
   * @example
   * ```typescript
   * // Update minimum keys setting
   * await configService.updateConfiguration('minimumKeys', 3);
   *
   * // Update enabled setting globally
   * await configService.updateConfiguration('enabled', false, vscode.ConfigurationTarget.Global);
   * ```
   *
   * @category Configuration Management
   */
  public async updateConfiguration<T>(
    key: string,
    value: T,
    target?: vscode.ConfigurationTarget,
  ): Promise<void> {
    await vscode.workspace
      .getConfiguration(this.configSection)
      .update(key, value, target ?? vscode.ConfigurationTarget.Global);

    this.currentConfig = this.readConfiguration();
    this.applyLogLevel(this.currentConfig.logLevel);
    this.updateEnabledContext();

    this.logger.info(`Configuration updated: ${key} = ${JSON.stringify(value)}`);
  }

  /**
   * Reset configuration to defaults
   *
   * @description
   * Reverts all configuration settings to their default values.
   *
   * @example
   * ```typescript
   * await configService.resetConfig();
   * ```
   *
   * @category Configuration Management
   */
  public async resetConfig(): Promise<void> {
    this.currentConfig = this.readConfiguration();
    this.logger.info('Configuration reset to defaults');
  }

  /**
   * Dispose of configuration service resources
   *
   * @description
   * Cleans up all registered disposables and resets instance.
   * Called automatically during extension deactivation.
   *
   * @example
   * ```typescript
   * configService.dispose();
   * ```
   *
   * @category Lifecycle
   */
  public override dispose(): void {
    this.logger.debug('Disposing ConfigurationService');
    super.dispose();
    delete ConfigurationService.instance;
  }

  /**
   * Read configuration from VS Code
   *
   * @description
   * Reads current configuration values from VS Code's configuration system.
   *
   * @returns The current configuration
   *
   * @category Configuration Management
   * @private
   */
  private readConfiguration(): ExtensionConfig {
    const config = vscode.workspace.getConfiguration(this.configSection);

    return {
      enabled: config.get<boolean>('enabled', true),
      logLevel: config.get<ExtensionConfig['logLevel']>('logLevel', 'info'),
      minimumKeys: config.get<number>('minimumKeys', 2),
      excludedCommands: config.get<string[]>('excludedCommands', []),
      showCommandName: config.get<boolean>('showCommandName', false),
    };
  }

  /**
   * Apply log level to logger
   *
   * @description
   * Converts configuration log level to LogLevel enum and applies to logger.
   *
   * @param level - Configuration log level value
   *
   * @category Configuration Management
   * @private
   */
  private applyLogLevel(level: ExtensionConfig['logLevel']): void {
    let targetLevel: LogLevel;

    switch (level) {
      case 'error':
        targetLevel = LogLevel.ERROR;
        break;
      case 'warn':
        targetLevel = LogLevel.WARN;
        break;
      case 'debug':
        targetLevel = LogLevel.DEBUG;
        break;
      case 'info':
      default:
        targetLevel = LogLevel.INFO;
        break;
    }

    this.logger.setLogLevel(targetLevel);
  }

  /**
   * Update VS Code context variable
   *
   * @description
   * Updates the 'keypress-notifications.enabled' context variable
   * used for when clauses in package.json.
   *
   * @category Configuration Management
   * @private
   */
  private updateEnabledContext(): void {
    const isEnabled = this.isEnabled();
    vscode.commands.executeCommand('setContext', 'keypress-notifications.enabled', isEnabled);
  }
}
