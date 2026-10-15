import type { ICommandHandler } from './ICommandHandler';

export { BaseCommandHandler, type CommandResult } from './BaseCommandHandler';
export { DisableCommand } from './DisableCommand';
export { EnableCommand } from './EnableCommand';
export type { ICommandHandler } from './ICommandHandler';
export { ShowOutputChannelCommand } from './ShowOutputChannelCommand';

export type CommandHandlerFactory = () => ICommandHandler;
