import  { type ICommandHandler } from './ICommandHandler';

export { BaseCommandHandler, type CommandResult } from './BaseCommandHandler';
export type { ICommandHandler } from './ICommandHandler';
export { ShowOutputChannelCommand } from './ShowOutputChannelCommand';
export { EnableCommand } from './EnableCommand';
export { DisableCommand } from './DisableCommand';

export type CommandHandlerFactory = () => ICommandHandler;
