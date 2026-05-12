/**
 * Show Output Channel Command
 *
 * Command to show the extension's output channel.
 *
 * @description
 * Shows the extension's output channel in VS Code.
 * Provides user feedback with an information message.
 *
 * @category Commands
 *
 * @example
 * ```typescript
 * const command = new ShowOutputChannelCommand(logger, accessibilityService);
 * await command.execute();
 * ```
 */

import type { ILogger } from '../di';
import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';

import { BaseCommandHandler } from './BaseCommandHandler';
import type { CommandResult } from './BaseCommandHandler';

/**
 * Show Output Channel Command
 *
 * @description
 * Displays the extension's output channel to the user.
 * Also shows an information message confirming the extension is active.
 *
 * @category Commands
 */
export class ShowOutputChannelCommand extends BaseCommandHandler {
  /**
   * Create a new ShowOutputChannelCommand instance
   *
   * @description
   * Creates command with injected dependencies from DI container.
   *
   * @param logger - Logger instance for diagnostics
   * @param accessibilityService - Accessibility service for screen reader support
   *
   * @example
   * ```typescript
   * const command = ShowOutputChannelCommand.create(logger, accessibilityService);
   * ```
   *
   * @category Construction
   */
  constructor(logger: ILogger, accessibilityService: IAccessibilityService) {
    super('ShowOutputChannelCommand', logger, accessibilityService);
  }

  /**
   * Create a new instance (factory pattern)
   *
   * @description
   * Factory method for creating a new ShowOutputChannelCommand instance.
   * Used by the DI container for dependency injection.
   *
   * @param logger - Logger instance for diagnostics
   * @param accessibilityService - Accessibility service for screen reader support
   *
   * @example
   * ```typescript
   * container.registerSingleton(
   *   TYPES.ShowOutputChannelCommand,
   *   () => ShowOutputChannelCommand.create(logger, accessibilityService)
   * );
   * ```
   *
   * @category Factory Pattern
   */
  public static create(
    logger: ILogger,
    accessibilityService: IAccessibilityService,
  ): ShowOutputChannelCommand {
    return new ShowOutputChannelCommand(logger, accessibilityService);
  }

  /**
   * Execute the command
   *
   * @description
   * Shows the output channel and displays an information message.
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
    this.logInfo('Showing output channel');

    try {
      // Show the output channel
      this.logger.show();

      // Show information message
      this.showInfo('Keypress Notifications is active');

      // Announce to screen readers
      await this.announceSuccess('Show Status', 'Keypress Notifications is active');

      return this.success('Output channel shown');
    } catch (error) {
      this.logError('Failed to show output channel', error);
      this.showError('Failed to show output channel');
      await this.announceError('Show Status', String(error));
      return this.error('Failed to show output channel', error);
    }
  }
}
