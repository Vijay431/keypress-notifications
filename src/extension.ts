import * as vscode from 'vscode';

import { ExtensionManager } from './managers/ExtensionManager';

let extensionManager: ExtensionManager | undefined;

/**
 * Called when the extension is activated.
 * This is the entry point for the Keypress Notifications extension.
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    extensionManager = new ExtensionManager();
    await extensionManager.activate(context);
  } catch (error) {
    console.error('Failed to activate Keypress Notifications extension:', error);
    vscode.window.showErrorMessage('Failed to activate Keypress Notifications extension');
  }
}

/**
 * Called when the extension is deactivated.
 * Clean up resources and dispose of any subscriptions.
 */
export function deactivate(): void {
  if (extensionManager) {
    extensionManager.deactivate();
    extensionManager = undefined;
  }
}
