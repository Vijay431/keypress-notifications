import * as vscode from 'vscode';

import { container, TYPES } from '../di';
import type { ILogger } from '../di/interfaces/ILogger';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import { ShowOutputChannelCommand } from '../commands/ShowOutputChannelCommand';
import { EnableCommand } from '../commands/EnableCommand';
import { DisableCommand } from '../commands/DisableCommand';

export class CommandRegistry {
  private disposables: vscode.Disposable[] = [];

  public register(context: vscode.ExtensionContext): void {
    const logger = container.get<ILogger>(TYPES.Logger);
    const configService = container.get<IConfigurationService>(TYPES.ConfigurationService);

    const commands: [string, () => Promise<void>][] = [
      [
        'keypress-notifications.showOutputChannel',
        async () => {
          await new ShowOutputChannelCommand(logger).execute();
        },
      ],
      [
        'keypress-notifications.enable',
        async () => {
          await new EnableCommand(logger, configService).execute();
        },
      ],
      [
        'keypress-notifications.disable',
        async () => {
          await new DisableCommand(logger, configService).execute();
        },
      ],
    ];

    for (const [id, handler] of commands) {
      this.disposables.push(vscode.commands.registerCommand(id, handler));
    }

    this.disposables.forEach((d) => context.subscriptions.push(d));
  }

  public dispose(): void {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
