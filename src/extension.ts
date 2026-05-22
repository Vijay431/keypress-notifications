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
    const channel = vscode.window.createOutputChannel('Keypress Notifications - Activation Error');
    channel.appendLine(`Activation failed: ${String(error)}`);
    channel.show();
    vscode.window.showErrorMessage(
      'Keypress Notifications failed to activate. See output for details.',
    );
  }
}

export function deactivate(): void {
  extensionManager?.deactivate();
  extensionManager = undefined;
}
