import * as vscode from 'vscode';

import { getService, initializeContainer, TYPES } from './di';
import { type IAccessibilityService } from './di/interfaces/IAccessibilityService';
import { type IConfigurationService } from './di/interfaces/IConfigurationService';
import { type IKeypressService } from './di/interfaces/IKeypressService';
import { type ILogger } from './di/interfaces/ILogger';
import { ExtensionManager } from './managers/ExtensionManager';

let extensionManager: ExtensionManager | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    await initializeContainer(context);
    extensionManager = new ExtensionManager(
      getService<ILogger>(TYPES.Logger),
      getService<IConfigurationService>(TYPES.ConfigurationService),
      getService<IKeypressService>(TYPES.KeypressService),
      getService<IAccessibilityService>(TYPES.AccessibilityService),
    );
    await extensionManager.activate(context);
  } catch (error) {
    const channel = vscode.window.createOutputChannel('Keypress Notifications - Activation Error');
    channel.appendLine(`Activation failed: ${String(error)}`);
    channel.show();
    vscode.window.showErrorMessage(
      'Keypress Notifications failed to activate. See output for details.',
    );
    throw error;
  }
}

export function deactivate(): void {
  extensionManager?.deactivate();
  extensionManager = undefined;
}
