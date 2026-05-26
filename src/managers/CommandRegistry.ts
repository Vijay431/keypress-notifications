import * as vscode from 'vscode';

import { type CommandHandlerFactory } from '../commands';

export interface CommandMetadata {
  id: string;
  title: string;
  category: string;
  handlerFactory: CommandHandlerFactory;
  icon?: string;
}

export class CommandRegistry {
  private readonly commands = new Map<
    string,
    { metadata: CommandMetadata; disposable: vscode.Disposable }
  >();

  public registerCommand(metadata: CommandMetadata): this {
    if (this.commands.has(metadata.id)) {
      this.unregisterCommand(metadata.id);
    }
    const handler = metadata.handlerFactory();
    const disposable = vscode.commands.registerCommand(metadata.id, async () => {
      try {
        const result = await handler.execute();
        if (!result.success) {
          const detail = result.error ? ` (${result.error})` : '';
          vscode.window.showErrorMessage(
            `Command '${metadata.title}' failed: ${result.message}${detail}`,
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Command '${metadata.title}' failed: ${String(error)}`);
      }
    });
    this.commands.set(metadata.id, { metadata, disposable });
    return this;
  }

  public registerCommands(commands: CommandMetadata[]): this {
    for (const command of commands) {
      this.registerCommand(command);
    }
    return this;
  }

  public async executeCommand(commandId: string, ...args: unknown[]): Promise<unknown> {
    return vscode.commands.executeCommand(commandId, ...args);
  }

  public hasCommand(commandId: string): boolean {
    return this.commands.has(commandId);
  }

  public getCommand(commandId: string): CommandMetadata | undefined {
    return this.commands.get(commandId)?.metadata;
  }

  public getRegisteredCommands(): CommandMetadata[] {
    return Array.from(this.commands.values()).map(({ metadata }) => metadata);
  }

  public unregisterCommand(commandId: string): void {
    const entry = this.commands.get(commandId);
    if (entry) {
      entry.disposable.dispose();
      this.commands.delete(commandId);
    }
  }

  public dispose(): void {
    for (const entry of this.commands.values()) {
      entry.disposable.dispose();
    }
    this.commands.clear();
  }
}
