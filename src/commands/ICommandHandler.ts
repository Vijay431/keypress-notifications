export interface CommandResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface ICommandHandler {
  execute(): Promise<CommandResult>;
}
