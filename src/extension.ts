import { ExtensionContext, window, commands, workspace } from 'vscode';

import { KeypressService } from './services/KeypressService';

let keypressService: KeypressService | undefined;

/**
 * Called when the extension is activated.
 * This is the entry point for the Keypress Notifications extension.
 */
export async function activate(context: ExtensionContext): Promise<void> {
  try {
    // Initialize keypress service
    keypressService = new KeypressService();
    await keypressService.initialize();

    // Register extension commands
    const activateCommand = commands.registerCommand(
      'keypress-notifications.activate',
      async () => {
        try {
          await keypressService?.setEnabled(true);
          window.showInformationMessage('Keypress Notifications Activated');
        } catch (error) {
          console.error('Error activating extension:', error);
          window.showErrorMessage('Failed to activate extension');
        }
      },
    );

    const deactivateCommand = commands.registerCommand(
      'keypress-notifications.deactivate',
      async () => {
        try {
          await keypressService?.setEnabled(false);
          window.showInformationMessage('Keypress Notifications Deactivated');
        } catch (error) {
          console.error('Error deactivating extension:', error);
          window.showErrorMessage('Failed to deactivate extension');
        }
      },
    );

    const showOutputCommand = commands.registerCommand(
      'keypress-notifications.showOutputChannel',
      () => {
        try {
          window.showInformationMessage('Keypress Notifications is active');
        } catch (error) {
          console.error('Error showing output:', error);
          window.showErrorMessage('Failed to show output');
        }
      },
    );

    // Register disposables
    context.subscriptions.push(activateCommand, deactivateCommand, showOutputCommand);

    // Set VS Code context variable
    const config = workspace.getConfiguration('keypress-notifications');
    const isEnabled = config.get('enabled', true);
    await commands.executeCommand('setContext', 'keypress-notifications.enabled', isEnabled);

    // Show activation message in development mode
    if (process.env['NODE_ENV'] === 'development') {
      window.showInformationMessage('Keypress Notifications is now active');
    }
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
  if (keypressService) {
    keypressService.dispose();
    keypressService = undefined;
  }
}
