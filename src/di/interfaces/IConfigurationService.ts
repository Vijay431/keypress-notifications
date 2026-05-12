/**
 * Configuration Service Interface
 *
 * Defines the contract for accessing and managing VS Code configuration.
 *
 * @description
 * Provides type-safe access to extension settings with change event handling.
 * Supports configuration updates, migrations, and context management.
 *
 * @category Services
 * @see ConfigurationService - Implementation in services/ConfigurationService.ts
 */

import * as vscode from 'vscode';

import type { ExtensionConfig, LogLevel } from '../../types/extension';

/**
 * Configuration Service Interface
 *
 * @description
 * Manages VS Code configuration settings for the extension.
 * Provides type-safe access to settings with change event handling.
 *
 * @example
 * ```typescript
 * class MyService {
 *   constructor(private readonly configService: IConfigurationService) {}
 *
 *   checkEnabled() {
 *     if (this.configService.isEnabled()) {
 *       // ... enabled logic
 *     }
 *   }
 * }
 * ```
 *
 * @category Service Interfaces
 */
export interface IConfigurationService {
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
   */
  getConfiguration(): ExtensionConfig;

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
   */
  isEnabled(): boolean;

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
   */
  getMinimumKeys(): number;

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
   */
  getExcludedCommands(): string[];

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
   */
  shouldShowCommandName(): boolean;

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
   */
  getLogLevel(): LogLevel;

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
   */
  onConfigurationChanged(callback: () => void): vscode.Disposable;

  /**
   * Update a configuration setting
   *
   * @description
   * Updates a configuration value and applies migrations if needed.
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
   */
  updateConfiguration<T>(key: string, value: T, target?: vscode.ConfigurationTarget): Promise<void>;

  /**
   * Reset configuration to defaults
   *
   * @description
   * Reverts all configuration settings to their default values.
   * Uses the configuration migrator to restore previous state if available.
   *
   * @example
   * ```typescript
   * await configService.resetConfig();
   * ```
   */
  resetConfig(): Promise<void>;
}
