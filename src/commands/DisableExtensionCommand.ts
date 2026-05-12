/**
 * Disable Extension Command
 *
 * Command to disable the Keypress Notifications extension.
 *
 * @description
 * Disables the extension by updating the configuration.
 * Provides user feedback with an information message.
 *
 * @category Commands
 *
 * @example
 * ```typescript
 * const command = new DisableExtensionCommand(configService, logger, accessibilityService);
 * await command.execute();
 * ```
 */

import type { ILogger } from '../di';
import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';

import { BaseCommandHandler } from './BaseCommandHandler';
import type { CommandResult } from './BaseCommandHandler';

/**
 * Disable Extension Command
 *
 * @description
 * Disables the extension by updating the configuration setting.
 * Shows an information message confirming the action.
 *
 * @category Commands
 */
export class DisableExtensionCommand extends BaseCommandHandler {
  /**
   * Create a new DisableExtensionCommand instance
   *
   * @description
   * Creates command with injected dependencies from DI container.
   *
   * @param configService - Configuration service for settings
   * @param logger - Logger instance for diagnostics
   * @param accessibilityService - Accessibility service for screen reader support
   *
   * @example
   * ```typescript
   * const command = DisableExtensionCommand.create(configService, logger, accessibilityService);
   * ```
   *
   * @category Construction
   */
  constructor(
    private readonly configService: IConfigurationService,
    logger: ILogger,
    accessibilityService: IAccessibilityService,
  ) {
    super('DisableExtensionCommand', logger, accessibilityService);
  }

  /**
   * Create a new instance (factory pattern)
   *
   * @description
   * Factory method for creating a new DisableExtensionCommand instance.
   * Used by the DI container for dependency injection.
   *
   * @param configService - Configuration service for settings
   * @param logger - Logger instance for diagnostics
   * @param accessibilityService - Accessibility service for screen reader support
   *
   * @example
   * ```typescript
   * container.registerSingleton(
   *   TYPES.DisableExtensionCommand,
   *   () => DisableExtensionCommand.create(configService, logger, accessibilityService)
   * );
   * ```
   *
   * @category Factory Pattern
   */
  public static create(
    configService: IConfigurationService,
    logger: ILogger,
    accessibilityService: IAccessibilityService,
  ): DisableExtensionCommand {
    return new DisableExtensionCommand(configService, logger, accessibilityService);
  }

  /**
   * Execute the command
   *
   * @description
   * Updates the configuration to disable the extension.
   *
   * @returns Result of command execution
   *
   * @example
   * ```typescript
   * const result = await command.execute();
   * if (result.success) {
   *   console.log(result.message);
   * }
   * ```
   *
   * @category Command Execution
   */
  public async execute(): Promise<CommandResult> {
    this.logInfo('Disabling extension');

    try {
      // Update configuration
      await this.configService.updateConfiguration('enabled', false);

      // Show information message
      this.showInfo('Keypress Notifications extension disabled');

      // Announce to screen readers
      await this.announceSuccess(
        'Disable Extension',
        'Keypress Notifications extension is now disabled',
      );

      return this.success('Extension disabled');
    } catch (error) {
      this.logError('Failed to disable extension', error);
      this.showError('Failed to disable extension');
      await this.announceError('Disable Extension', String(error));
      return this.error('Failed to disable extension', error);
    }
  }
}
