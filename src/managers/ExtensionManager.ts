import * as vscode from 'vscode';

import { DisableCommand } from '../commands/DisableCommand';
import { EnableCommand } from '../commands/EnableCommand';
import { ShowOutputChannelCommand } from '../commands/ShowOutputChannelCommand';
import  { type IAccessibilityService } from '../di/interfaces/IAccessibilityService';
import  { type IConfigurationService } from '../di/interfaces/IConfigurationService';
import  { type IKeypressService } from '../di/interfaces/IKeypressService';
import  { type ILogger } from '../di/interfaces/ILogger';

import { CommandRegistry } from './CommandRegistry';

export class ExtensionManager {
  private readonly disposables: vscode.Disposable[] = [];
  private commandRegistry: CommandRegistry | undefined;

  constructor(
    private readonly logger: ILogger,
    private readonly configService: IConfigurationService,
    private readonly keypressService: IKeypressService,
    private readonly accessibilityService: IAccessibilityService,
  ) {}

  public async activate(context: vscode.ExtensionContext): Promise<void> {
    this.logger.info('Activating Keypress Notifications extension');

    try {
      // Initialize services
      await this.keypressService.initialize();

      // Apply configured log level
      this.logger.setLogLevel(this.configService.getConfiguration().logLevel);

      // Build command registry
      this.commandRegistry = new CommandRegistry();
      this.commandRegistry.registerCommands([
        {
          id: 'keypress-notifications.showOutputChannel',
          title: 'Show Status',
          category: 'Keypress Notifications',
          icon: '$(output)',
          handlerFactory: () => new ShowOutputChannelCommand(
            this.logger, this.accessibilityService, this.configService,
          ),
        },
        {
          id: 'keypress-notifications.enable',
          title: 'Enable',
          category: 'Keypress Notifications',
          handlerFactory: () => new EnableCommand(
            this.logger, this.accessibilityService, this.configService,
          ),
        },
        {
          id: 'keypress-notifications.disable',
          title: 'Disable',
          category: 'Keypress Notifications',
          handlerFactory: () => new DisableCommand(
            this.logger, this.accessibilityService, this.configService,
          ),
        },
      ]);

      // Wire config changes
      this.disposables.push(
        this.configService.onConfigurationChanged(() => {
          void this.handleConfigurationChanged().catch((err) => {
            this.logger.error('Failed to handle configuration change', err);
          });
        }),
      );

      // Register service disposables
      this.disposables.push({
        dispose: () => this.keypressService.dispose(),
      });
      this.disposables.push({
        dispose: () => this.configService.dispose(),
      });

      // Push all disposables to context
      this.disposables.push({ dispose: () => this.commandRegistry?.dispose() });
      this.disposables.forEach(d => context.subscriptions.push(d));

      // Set initial enabled context
      await this.updateEnabledContext();

      this.logger.info('Keypress Notifications extension activated successfully');

      if (context.extensionMode === vscode.ExtensionMode.Development && this.configService.isEnabled()) {
        vscode.window.showInformationMessage('Keypress Notifications extension is now active');
      }
    } catch (error) {
      this.logger.error('Failed to activate extension', error);
      vscode.window.showErrorMessage('Failed to activate Keypress Notifications extension');
      throw error;
    }
  }

  private async handleConfigurationChanged(): Promise<void> {
    const isEnabled = this.configService.isEnabled();
    this.logger.debug(`Configuration changed — enabled: ${String(isEnabled)}`);
    this.logger.setLogLevel(this.configService.getLogLevel());
    await this.updateEnabledContext();
    if (isEnabled) {
      await this.keypressService.enable();
    } else {
      await this.keypressService.disable();
    }
  }

  private async updateEnabledContext(): Promise<void> {
    const isEnabled = this.configService.isEnabled();
    await vscode.commands.executeCommand('setContext', 'keypress-notifications.enabled', isEnabled);
  }

  public deactivate(): void {
    this.logger.info('Deactivating Keypress Notifications extension');
    this.dispose();
  }

  private dispose(): void {
    this.commandRegistry?.dispose();
    for (const d of this.disposables) {
      try { d.dispose(); } catch { /* ignore */ }
    }
    this.disposables.length = 0;
  }
}
