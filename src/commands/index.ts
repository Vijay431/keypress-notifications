/**
 * Commands Module
 *
 * Barrel export for all command handlers.
 *
 * @description
 * Centralized exports for all extension command handlers.
 * Import individual commands or the entire module.
 *
 * @category Commands
 *
 * @example
 * ```typescript
 * // Import individual command
 * import { ShowOutputChannelCommand } from './commands';
 *
 * // Import all commands
 * import * as Commands from './commands';
 * ```
 */

// Base command handler
// Import for use in COMMAND_HANDLERS
import { DisableExtensionCommand } from './DisableExtensionCommand';
import { EnableExtensionCommand } from './EnableExtensionCommand';
import { ShowOutputChannelCommand } from './ShowOutputChannelCommand';

export { BaseCommandHandler, CommandResult } from './BaseCommandHandler';

// Concrete command implementations
export { ShowOutputChannelCommand } from './ShowOutputChannelCommand';
export { EnableExtensionCommand } from './EnableExtensionCommand';
export { DisableExtensionCommand } from './DisableExtensionCommand';

/**
 * All available command constructors
 *
 * @description
 * Mapping of command IDs to their handler constructors.
 * Used for dynamic command registration.
 *
 * @example
 * ```typescript
 * import { COMMAND_HANDLERS } from './commands';
 *
 * for (const [id, Handler] of Object.entries(COMMAND_HANDLERS)) {
 *   console.log(`Command: ${id}`);
 * }
 * ```
 */
export const COMMAND_HANDLERS = {
  ShowOutputChannelCommand,
  EnableExtensionCommand,
  DisableExtensionCommand,
} as const;

/**
 * Command IDs for all extension commands
 *
 * @description
 * Array of all command IDs registered by the extension.
 *
 * @example
 * ```typescript
 * import { COMMAND_IDS } from './commands';
 *
 * for (const id of COMMAND_IDS) {
 *   console.log(`Registered: ${id}`);
 * }
 * ```
 */
export const COMMAND_IDS = [
  'keypress-notifications.showOutputChannel',
  'keypress-notifications.enable',
  'keypress-notifications.disable',
] as const;
