import type { ILogger } from '../di/interfaces/ILogger';
import { BaseCommandHandler } from './BaseCommandHandler';
import type { CommandResult } from './ICommandHandler';

export class ShowOutputChannelCommand extends BaseCommandHandler {
  constructor(logger: ILogger) {
    super('ShowOutputChannelCommand', logger);
  }

  public async execute(): Promise<CommandResult> {
    this.logger.show();
    await this.showInfo('Keypress Notifications is active');
    return this.success('Output channel shown');
  }
}
