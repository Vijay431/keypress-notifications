/**
 * Extension Manager Interface
 *
 * @description
 * Public interface for ExtensionManager service.
 * Defines the contract for extension lifecycle management.
 *
 * @category Dependency Injection
 * @category Service Interfaces
 *
 * @example
 * ```typescript
 * class ExtensionManager implements IExtensionManager {
 *   activate(context: vscode.ExtensionContext): Promise<void> {
 *     // Implementation
 *   }
 *   getApi(): KeypressNotificationsApi {
 *     // Implementation
 *   }
 * }
 * ```
 */
import * as vscode from 'vscode';

import type { IConfigurationService } from './IConfigurationService';
import type { IKeypressService } from './IKeypressService';

/**
 * Keypress Notifications Public API
 *
 * @description
 * Public interface for external access to extension functionality.
 * Provides event subscription and state inspection.
 */
export interface KeypressNotificationsApi {
  /** Event fired when a notification is shown */
  readonly onDidShowNotification: vscode.Event<string>;
}

/**
 * Extension Manager Interface
 *
 * @description
 * Defines the contract for extension lifecycle management.
 * Manages service coordination and activation/deactivation.
 *
 * @category Dependency Injection
 * @category Service Interfaces
 */
export interface IExtensionManager {
  /**
   * Activate the extension
   *
   * @description
   * Initializes all services, registers commands, and sets up context variables.
   *
   * @param context - VS Code extension context
   */
  activate(context: vscode.ExtensionContext): Promise<void>;

  /**
   * Deactivate the extension
   *
   * @description
   * Cleans up all resources and services.
   */
  deactivate(): void;

  /**
   * Get configuration service
   *
   * @description
   * Returns the configuration service instance for external access.
   *
   * @returns The configuration service
   */
  getConfigurationService(): IConfigurationService;

  /**
   * Get keypress service
   *
   * @description
   * Returns the keypress service instance for external access.
   *
   * @returns The keypress service
   */
  getKeypressService(): IKeypressService;

  /**
   * Get public API
   *
   * @description
   * Returns the public API interface for the extension.
   * Provides access to events for testing and integration.
   *
   * @returns The public API interface
   */
  getApi(): KeypressNotificationsApi;

  /**
   * Check if extension is active
   *
   * @description
   * Returns whether the extension is currently enabled.
   *
   * @returns Whether the extension is active
   */
  isActive(): boolean;
}
