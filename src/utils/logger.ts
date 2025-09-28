import { OutputChannel, window } from 'vscode';

import { ILogger } from '../types/extension';

/**
 * Simple logger for VS Code extension.
 */
export class Logger implements ILogger {
  private outputChannel: OutputChannel;

  constructor(channelName = 'Keypress Notifications') {
    this.outputChannel = window.createOutputChannel(channelName);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.outputChannel.appendLine(`[DEBUG] ${message} ${args.length ? JSON.stringify(args) : ''}`);
  }

  public info(message: string, ...args: unknown[]): void {
    this.outputChannel.appendLine(`[INFO] ${message} ${args.length ? JSON.stringify(args) : ''}`);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.outputChannel.appendLine(`[WARN] ${message} ${args.length ? JSON.stringify(args) : ''}`);
  }

  public error(message: string, ...args: unknown[]): void {
    this.outputChannel.appendLine(`[ERROR] ${message} ${args.length ? JSON.stringify(args) : ''}`);
  }

  public show(): void {
    this.outputChannel.show();
  }

  public dispose(): void {
    this.outputChannel.dispose();
  }
}