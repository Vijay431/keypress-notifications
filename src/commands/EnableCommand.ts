import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import type { ILogger } from '../di/interfaces/ILogger';

import { BaseCommandHandler, type CommandResult } from './BaseCommandHandler';

export class EnableCommand extends BaseCommandHandler {
  constructor(
    logger: ILogger,
    accessibilityService: IAccessibilityService,
    private readonly configService: IConfigurationService,
  ) {
    super('Enable', logger, accessibilityService);
  }

  public async execute(): Promise<CommandResult> {
    try {
      await this.configService.updateConfiguration('enabled', true);
      this.showInfo('Keypress Notifications enabled');
      await this.announceSuccess('Enable', 'Keypress Notifications is now active');
      this.logInfo('Extension enabled');
      return this.success('Extension enabled');
    } catch (err) {
      this.logError('Failed to enable extension', err);
      return this.error('Failed to enable extension', err);
    }
  }
}
