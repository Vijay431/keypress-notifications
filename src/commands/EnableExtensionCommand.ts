/**
 * Enable Extension Command
 *
 * Command to enable the Keypress Notifications extension.
 *
 * @description
 * Enables the extension by updating the configuration.
 * Provides user feedback with an information message.
 *
 * @category Commands
 *
 * @example
 * ```typescript
 * const command = new EnableExtensionCommand(configService, logger, accessibilityService);
 * await command.execute();
 * ```
 */

import type { ILogger } from '../di';
import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';

import { BaseCommandHandler } from './BaseCommandHandler';
import type { CommandResult } from './BaseCommandHandler';

/**
 * Enable Extension Command
 *
 * @description
 * Enables the extension by updating the configuration setting.
 * Shows an information message confirming the action.
 *
 * @category Commands
 */
export class EnableExtensionCommand extends BaseCommandHandler {
  /**
   * Create a new EnableExtensionCommand instance
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
   * const command = EnableExtensionCommand.create(configService, logger, accessibilityService);
   * ```
   *
   * @category Construction
   */
  constructor(
    private readonly configService: IConfigurationService,
    logger: ILogger,
    accessibilityService: IAccessibilityService,
  ) {
    super('EnableExtensionCommand', logger, accessibilityService);
  }

  /**
   * Create a new instance (factory pattern)
   *
   * @description
   * Factory method for creating a new EnableExtensionCommand instance.
   * Used by the DI container for dependency injection.
   *
   * @param configService - Configuration service for settings
   * @param logger - Logger instance for diagnostics
   * @param accessibilityService - Accessibility service for screen reader support
   *
   * @example
   * ```typescript
   * container.registerSingleton(
   *   TYPES.EnableExtensionCommand,
   *   () => EnableExtensionCommand.create(configService, logger, accessibilityService)
   * );
   * ```
   *
   * @category Factory Pattern
   */
  public static create(
    configService: IConfigurationService,
    logger: ILogger,
    accessibilityService: IAccessibilityService,
  ): EnableExtensionCommand {
    return new EnableExtensionCommand(configService, logger, accessibilityService);
  }

  /**
   * Execute the command
   *
   * @description
   * Updates the configuration to enable the extension.
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
    this.logInfo('Enabling extension');

    try {
      // Update configuration
      await this.configService.updateConfiguration('enabled', true);

      // Show information message
      this.showInfo('Keypress Notifications extension enabled');

      // Announce to screen readers
      await this.announceSuccess(
        'Enable Extension',
        'Keypress Notifications extension is now enabled',
      );

      return this.success('Extension enabled');
    } catch (error) {
      this.logError('Failed to enable extension', error);
      this.showError('Failed to enable extension');
      await this.announceError('Enable Extension', String(error));
      return this.error('Failed to enable extension', error);
    }
  }
}
