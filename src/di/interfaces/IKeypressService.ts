/**
 * Keypress Service Interface
 *
 * Defines the contract for detecting and responding to multi-key command executions.
 *
 * @description
 * Core service that monitors command execution and displays notifications
 * for common multi-key keybindings. Handles throttling, filtering, and
 * platform-specific key display.
 *
 * @category Services
 * @see KeypressService - Implementation in services/KeypressService.ts
 */

import * as vscode from 'vscode';

/**
 * Service state information
 *
 * @description
 * Represents the current operational state of the keypress service.
 */
export interface KeypressServiceState {
  /** Whether the service is currently enabled */
  enabled: boolean;
  /** Timestamp of the last notification shown */
  lastNotificationAt: number;
  /** Command ID of the last notification */
  lastCommandNotified: string | undefined;
}

/**
 * Keypress Service Interface
 *
 * @description
 * Detects multi-key commands and displays notifications to users.
 * Monitors command execution, applies filters, and formats notification messages.
 *
 * @example
 * ```typescript
 * const keypressService = container.get<IKeypressService>(TYPES.KeypressService);
 *
 * // Subscribe to notification events
 * keypressService.onDidShowNotification((message) => {
 *   console.log('Notification shown:', message);
 * });
 *
 * // Check service state
 * const state = keypressService.getState();
 * ```
 *
 * @category Service Interfaces
 */
export interface IKeypressService extends vscode.Disposable {
  /**
	 * Event fired when a notification is shown
	 *
	 * @description
	 * Emitted when the service displays a notification to the user.
	 * Provides the notification message that was shown.
	 */
  readonly onDidShowNotification: vscode.Event<string>;

  /**
	 * Initialize the service
	 *
	 * @description
	 * Sets up command listeners and proxy registration.
	 * Must be called before the service will function.
	 *
	 * @example
	 * ```typescript
	 * await keypressService.initialize();
	 * ```
	 */
  initialize(): Promise<void>;

  /**
	 * Enable the service
	 *
	 * @description
	 * Allows the service to show notifications.
	 * Called when extension setting is enabled.
	 *
	 * @example
	 * ```typescript
	 * await keypressService.enable();
	 * ```
	 */
  enable(): Promise<void>;

  /**
	 * Disable the service
	 *
	 * @description
	 * Prevents the service from showing notifications.
	 * Called when extension setting is disabled.
	 *
	 * @example
	 * ```typescript
	 * await keypressService.disable();
	 * ```
	 */
  disable(): Promise<void>;

  /**
	 * Get the current service state
	 *
	 * @description
	 * Returns a snapshot of the service's current operational state.
	 * Useful for debugging and testing.
	 *
	 * @returns Current state of the service
	 *
	 * @example
	 * ```typescript
	 * const state = keypressService.getState();
	 * console.log(`Service enabled: ${state.enabled}`);
	 * ```
	 */
  getState(): KeypressServiceState;

  /**
	 * Dispose of the service
	 *
	 * @description
	 * Clean up all resources including event listeners and proxy commands.
	 * Called automatically during extension deactivation.
	 *
	 * @example
	 * ```typescript
	 * keypressService.dispose();
	 * ```
	 */
  dispose(): void;
}
