import * as vscode from 'vscode';

import { initializeContainer } from './di';
import { ExtensionManager } from './managers/ExtensionManager';

let extensionManager: ExtensionManager | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    await initializeContainer(context);
    extensionManager = new ExtensionManager();
    await extensionManager.activate(context);
  } catch (error) {
    console.error('Failed to activate Keypress Notifications extension:', error);
    vscode.window.showErrorMessage('Failed to activate Keypress Notifications extension');
  }
}

export function deactivate(): void {
  if (extensionManager) {
    extensionManager.deactivate();
    extensionManager = undefined;
  }
}
