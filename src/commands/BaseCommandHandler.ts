import * as vscode from 'vscode';

import type { ILogger } from '../di/interfaces/ILogger';
import type { CommandResult, ICommandHandler } from './ICommandHandler';

export abstract class BaseCommandHandler implements ICommandHandler {
  constructor(
    protected readonly name: string,
    protected readonly logger: ILogger,
  ) {}

  public abstract execute(): Promise<CommandResult>;

  protected success(message: string): CommandResult {
    return { success: true, message };
  }

  protected error(message: string, err?: unknown): CommandResult {
    const errorStr = err instanceof Error ? err.message : String(err ?? '');
    this.logger.error(`[${this.name}] ${message}`, err);
    return { success: false, message, error: errorStr };
  }

  protected async showInfo(message: string): Promise<void> {
    await vscode.window.showInformationMessage(message);
  }

  protected async showError(message: string): Promise<void> {
    await vscode.window.showErrorMessage(message);
  }
}
