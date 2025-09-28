import { ExtensionContext, window } from 'vscode';
import { ExtensionManager } from './managers/ExtensionManager';

let extensionManager: ExtensionManager | undefined;

/**
 * Called when the extension is activated.
 * This is the entry point for the Keypress Notifications extension.
 */
export async function activate(context: ExtensionContext): Promise<void> {
  try {
    extensionManager = new ExtensionManager();
    await extensionManager.activate(context);
  } catch (error) {
    console.error('Failed to activate extension:', error);
    window.showErrorMessage('Failed to activate Keypress Notifications');
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
