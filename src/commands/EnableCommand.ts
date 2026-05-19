import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import type { ILogger } from '../di/interfaces/ILogger';
import { BaseCommandHandler } from './BaseCommandHandler';
import type { CommandResult } from './ICommandHandler';

export class EnableCommand extends BaseCommandHandler {
  constructor(
    logger: ILogger,
    private readonly configService: IConfigurationService,
  ) {
    super('EnableCommand', logger);
  }

  public async execute(): Promise<CommandResult> {
    await this.configService.updateConfiguration('enabled', true);
    await this.showInfo('Keypress Notifications extension enabled');
    return this.success('Extension enabled');
  }
}
