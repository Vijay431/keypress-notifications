import  { type IAccessibilityService } from '../di/interfaces/IAccessibilityService';
import  { type IConfigurationService } from '../di/interfaces/IConfigurationService';
import  { type ILogger } from '../di/interfaces/ILogger';

import { BaseCommandHandler, type CommandResult } from './BaseCommandHandler';

export class ShowOutputChannelCommand extends BaseCommandHandler {
  constructor(
    logger: ILogger,
    accessibilityService: IAccessibilityService,
    private readonly configService: IConfigurationService,
  ) {
    super('ShowOutputChannel', logger, accessibilityService);
  }

  public async execute(): Promise<CommandResult> {
    try {
      this.logger.show();
      const status = this.configService.isEnabled() ? 'enabled' : 'disabled';
      const message = `Keypress Notifications is active (${status})`;
      this.showInfo(message);
      await this.announceSuccess('Show output channel', message);
      this.logInfo('Output channel shown');
      return this.success(message);
    } catch (err) {
      this.logError('Failed to show output channel', err);
      return this.error('Failed to show output channel', err);
    }
  }
}
