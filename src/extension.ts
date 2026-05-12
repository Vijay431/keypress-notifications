/**
 * Keypress Notifications Extension
 *
 * Main entry point for the VS Code extension.
 *
 * @description
 * Handles activation and deactivation of the extension.
 * Uses DI container for service management and initialization.
 *
 * @category Extension
 * @category Lifecycle
 */

import * as vscode from 'vscode';

import type { IExtensionManager, KeypressNotificationsApi } from './di';
import { container, initializeContainer } from './di/container';
import { TYPES } from './di/types';

/**
 * Extension activation
 *
 * @description
 * Called by VS Code when the extension is activated.
 * Initializes the DI container, creates the ExtensionManager,
 * and activates all services.
 *
 * @param context - VS Code extension context
 * @returns Public API for the extension
 *
 * @example
 * ```typescript
 * export async function activate(context: vscode.ExtensionContext) {
 *   await initializeContainer(context);
 *   extensionManager = container.get<IExtensionManager>(TYPES.ExtensionManager);
 *   await extensionManager.activate(context);
 *   return extensionManager.getApi();
 * }
 * ```
 *
 * @category Lifecycle
 */
export async function activate(
  context: vscode.ExtensionContext,
): Promise<KeypressNotificationsApi> {
  await initializeContainer(context);
  const extensionManager = container.get<IExtensionManager>(TYPES.ExtensionManager);
  await extensionManager.activate(context);
  return extensionManager.getApi();
}

/**
 * Extension deactivation
 *
 * @description
 * Called by VS Code when the extension is deactivated.
 * Clears the DI container and disposes all services.
 *
 * @category Lifecycle
 */
export function deactivate(): void {
  container.clear();
}
