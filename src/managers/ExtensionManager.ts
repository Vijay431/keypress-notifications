import * as vscode from 'vscode';

import { getService, TYPES } from '../di';
import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import type { IKeypressService } from '../di/interfaces/IKeypressService';
import type { ILogger } from '../di/interfaces/ILogger';
import { DisableCommand } from '../commands/DisableCommand';
import { EnableCommand } from '../commands/EnableCommand';
import { ShowOutputChannelCommand } from '../commands/ShowOutputChannelCommand';
import { ConfigMigrator } from '../utils/config-migrator';
import { ConfigValidator } from '../utils/config-validator';
import { CommandRegistry } from './CommandRegistry';

export class ExtensionManager {
  private readonly disposables: vscode.Disposable[] = [];
  private commandRegistry: CommandRegistry | undefined;

  // Lazy getters that pull from DI container
  private get logger(): ILogger { return getService<ILogger>(TYPES.Logger); }
  private get configService(): IConfigurationService { return getService<IConfigurationService>(TYPES.ConfigurationService); }
  private get keypressService(): IKeypressService { return getService<IKeypressService>(TYPES.KeypressService); }
  private get accessibilityService(): IAccessibilityService { return getService<IAccessibilityService>(TYPES.AccessibilityService); }

  public async activate(context: vscode.ExtensionContext): Promise<void> {
    this.logger.info('Activating Keypress Notifications extension');

    try {
      // Validate and migrate config
      const rawConfig = this.configService.getConfiguration();
      const validatedConfig = ConfigValidator.validate(rawConfig, this.logger);
      const migratedConfig = ConfigMigrator.migrate(
        validatedConfig as unknown as Record<string, unknown>,
        this.logger,
      );
      if (migratedConfig !== (validatedConfig as unknown)) {
        this.logger.info('Config migration applied');
      }

      // Initialize services
      await this.keypressService.initialize();

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
          void this.handleConfigurationChanged();
        }),
      );

      // Push all disposables
      this.disposables.push({ dispose: () => this.commandRegistry?.dispose() });
      this.disposables.forEach(d => context.subscriptions.push(d));
      context.subscriptions.push({ dispose: () => this.dispose() });

      // Set initial enabled context
      await this.updateEnabledContext();

      this.logger.info('Keypress Notifications extension activated successfully');

      if (process.env['NODE_ENV'] === 'development' && this.configService.isEnabled()) {
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
