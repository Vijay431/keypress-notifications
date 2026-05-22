import * as vscode from 'vscode';

import type { IAccessibilityService, VerbosityLevel } from '../di/interfaces/IAccessibilityService';
import type { ILogger } from '../di/interfaces/ILogger';

import type { ICommandHandler } from './ICommandHandler';
import type { CommandResult } from './ICommandHandler';

export type { CommandResult };

export abstract class BaseCommandHandler implements ICommandHandler {
  constructor(
    protected readonly name: string,
    protected readonly logger: ILogger,
    protected readonly accessibilityService: IAccessibilityService,
  ) {}

  public abstract execute(): Promise<CommandResult>;

  protected success(message: string): CommandResult {
    return { success: true, message };
  }

  protected error(message: string, err?: unknown): CommandResult {
    const errorString = err instanceof Error ? err.message : String(err ?? '');
    return { success: false, message, error: errorString };
  }

  protected showInfo(message: string): void {
    vscode.window.showInformationMessage(message);
  }

  protected showWarning(message: string): void {
    vscode.window.showWarningMessage(message);
  }

  protected showError(message: string): void {
    vscode.window.showErrorMessage(message);
  }

  protected async announce(message: string, verbosity: VerbosityLevel = 'normal'): Promise<void> {
    await this.accessibilityService.announce(message, verbosity);
  }

  protected async announceSuccess(operation: string, detail?: string): Promise<void> {
    await this.accessibilityService.announceSuccess(operation, detail);
  }

  protected async announceError(operation: string, error: string): Promise<void> {
    await this.accessibilityService.announceError(operation, error);
  }

  protected logInfo(message: string, data?: unknown): void {
    this.logger.info(`[${this.name}] ${message}`, data);
  }

  protected logDebug(message: string, data?: unknown): void {
    this.logger.debug(`[${this.name}] ${message}`, data);
  }

  protected logWarn(message: string, data?: unknown): void {
    this.logger.warn(`[${this.name}] ${message}`, data);
  }

  protected logError(message: string, err?: unknown): void {
    this.logger.error(`[${this.name}] ${message}`, err);
  }
}
