import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import type { ILogger } from '../di/interfaces/ILogger';

import { BaseCommandHandler, type CommandResult } from './BaseCommandHandler';

export class DisableCommand extends BaseCommandHandler {
  constructor(
    logger: ILogger,
    accessibilityService: IAccessibilityService,
    private readonly configService: IConfigurationService,
  ) {
    super('Disable', logger, accessibilityService);
  }

  public async execute(): Promise<CommandResult> {
    try {
      await this.configService.updateConfiguration('enabled', false);
      this.showInfo('Keypress Notifications disabled');
      await this.announceSuccess('Disable', 'Keypress Notifications is now inactive');
      this.logInfo('Extension disabled');
      return this.success('Extension disabled');
    } catch (err) {
      this.logError('Failed to disable extension', err);
      return this.error('Failed to disable extension', err);
    }
  }
}
