import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import type { ILogger } from '../di/interfaces/ILogger';
import { BaseCommandHandler } from './BaseCommandHandler';
import type { CommandResult } from './ICommandHandler';

export class DisableCommand extends BaseCommandHandler {
  constructor(
    logger: ILogger,
    private readonly configService: IConfigurationService,
  ) {
    super('DisableCommand', logger);
  }

  public async execute(): Promise<CommandResult> {
    await this.configService.updateConfiguration('enabled', false);
    await this.showInfo('Keypress Notifications extension disabled');
    return this.success('Extension disabled');
  }
}
