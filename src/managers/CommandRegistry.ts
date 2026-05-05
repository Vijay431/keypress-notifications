/**
 * Command Registry
 *
 * Manages registration and execution of VS Code commands.
 *
 * @description
 * Centralized command registry for extension commands.
 * Handles command registration, execution, and disposal.
 *
 * @category Managers
 * @category Commands
 *
 * @example
 * ```typescript
 * const registry = new CommandRegistry(context);
 * registry.registerCommands([
 *   {
 *     id: 'myExtension.myCommand',
 *     handler: () => console.log('Command executed'),
 *   },
 * ]);
 * ```
 */

import * as vscode from 'vscode';

import type { ILogger } from '../di';

/**
 * Command metadata for registration
 *
 * @description
 * Contains information needed to register and execute a command.
 */
export interface CommandMetadata {
  /** Unique command identifier (e.g., 'extension.commandId') */
  id: string;
  /** Command handler function */
  handler: (...args: unknown[]) => unknown;
  /** Optional display title */
  title?: string;
  /** Optional category for command grouping */
  category?: string;
}

/**
 * Command handler factory type
 *
 * @description
 * A function that creates a command handler.
 * Used for lazy instantiation of command handlers.
 */
export type CommandHandlerFactory<T extends CommandMetadata = CommandMetadata> = (
  metadata: T,
) => (...args: unknown[]) => unknown;

/**
 * Command Registry
 *
 * @description
 * Centralized registry for managing VS Code commands.
 * Provides fluent API for command registration and execution.
 *
 * @category Managers
 * @category Commands
 */
export class CommandRegistry {
  private readonly commands = new Map<string, CommandMetadata>();
  private readonly disposables: vscode.Disposable[] = [];
  private readonly logger: ILogger;
  private readonly context: { subscriptions: { dispose(): void }[] };

  /**
	 * Create a new CommandRegistry instance
	 *
	 * @description
	 * Initializes registry with VS Code extension context.
	 *
	 * @param context - VS Code extension context
	 * @param logger - Logger for diagnostics
	 *
	 * @example
	 * ```typescript
	 * const registry = new CommandRegistry(context, logger);
	 * ```
	 *
	 * @category Construction
	 */
  constructor(
    context: { subscriptions: { dispose(): void }[] },
    logger: ILogger,
  ) {
    this.context = context;
    this.logger = logger;
  }

  /**
	 * Register a single command
	 *
	 * @description
	 * Registers a command with VS Code and stores its metadata.
	 *
	 * @param metadata - Command metadata including id and handler
	 * @returns This registry for chaining
	 *
	 * @example
	 * ```typescript
	 * registry.registerCommand({
	 *   id: 'extension.hello',
	 *   handler: () => vscode.window.showInformationMessage('Hello!'),
	 * });
	 * ```
	 *
	 * @category Command Registration
	 */
  public registerCommand(metadata: CommandMetadata): this {
    if (this.commands.has(metadata.id)) {
      this.logger.warn(`Command already registered: ${metadata.id}`);
      return this;
    }

    // Register with VS Code
    const disposable = vscode.commands.registerCommand(metadata.id, metadata.handler);
    this.disposables.push(disposable);
    this.context.subscriptions.push(disposable);

    // Store metadata
    this.commands.set(metadata.id, metadata);

    this.logger.debug(`Command registered: ${metadata.id}`);
    return this;
  }

  /**
	 * Register multiple commands
	 *
	 * @description
	 * Registers all provided commands with VS Code.
	 *
	 * @param commands - Array of command metadata
	 * @returns This registry for chaining
	 *
	 * @example
	 * ```typescript
	 * registry.registerCommands([
	 *   { id: 'ext.cmd1', handler: () => {} },
	 *   { id: 'ext.cmd2', handler: () => {} },
	 * ]);
	 * ```
	 *
	 * @category Command Registration
	 */
  public registerCommands(commands: CommandMetadata[]): this {
    for (const metadata of commands) {
      this.registerCommand(metadata);
    }
    return this;
  }

  /**
	 * Execute a registered command
	 *
	 * @description
	 * Executes a command by ID with optional arguments.
	 *
	 * @param commandId - ID of the command to execute
	 * @param args - Arguments to pass to the command handler
	 * @returns Result of command execution
	 *
	 * @example
	 * ```typescript
	 * await registry.executeCommand('extension.hello', 'World');
	 * ```
	 *
	 * @category Command Execution
	 */
  public async executeCommand(commandId: string, ...args: unknown[]): Promise<unknown> {
    const metadata = this.commands.get(commandId);
    if (!metadata) {
      this.logger.warn(`Command not found: ${commandId}`);
      throw new Error(`Command not registered: ${commandId}`);
    }

    this.logger.debug(`Executing command: ${commandId}`);
    return metadata.handler(...args);
  }

  /**
	 * Get all registered commands
	 *
	 * @description
	 * Returns array of all registered command metadata.
	 *
	 * @returns Array of command metadata
	 *
	 * @example
	 * ```typescript
	 * const commands = registry.getRegisteredCommands();
	 * console.log(`Registered ${commands.length} commands`);
	 * ```
	 *
	 * @category Command Queries
	 */
  public getRegisteredCommands(): CommandMetadata[] {
    return Array.from(this.commands.values());
  }

  /**
	 * Check if a command is registered
	 *
	 * @description
	 * Returns true if the command ID is registered.
	 *
	 * @param commandId - Command ID to check
	 * @returns Whether the command is registered
	 *
	 * @example
	 * ```typescript
	 * if (registry.hasCommand('extension.hello')) {
	 *   // Command is available
	 * }
	 * ```
	 *
	 * @category Command Queries
	 */
  public hasCommand(commandId: string): boolean {
    return this.commands.has(commandId);
  }

  /**
	 * Get command metadata by ID
	 *
	 * @description
	 * Returns the command metadata if registered, undefined otherwise.
	 *
	 * @param commandId - Command ID to retrieve
	 * @returns Command metadata or undefined
	 *
	 * @example
	 * ```typescript
	 * const cmd = registry.getCommand('extension.hello');
	 * if (cmd) {
	 *   console.log(cmd.title);
	 * }
	 * ```
	 *
	 * @category Command Queries
	 */
  public getCommand(commandId: string): CommandMetadata | undefined {
    return this.commands.get(commandId);
  }

  /**
	 * Unregister a command
	 *
	 * @description
	 * Removes a command from the registry and disposes its VS Code registration.
	 *
	 * @param commandId - Command ID to unregister
	 *
	 * @example
	 * ```typescript
	 * registry.unregisterCommand('extension.hello');
	 * ```
	 *
	 * @category Command Registration
	 */
  public unregisterCommand(commandId: string): void {
    const metadata = this.commands.get(commandId);
    if (!metadata) {
      this.logger.warn(`Cannot unregister unknown command: ${commandId}`);
      return;
    }

    // Find and dispose the VS Code registration
    // Since we register in order, the last disposable should be this command
    const disposable = this.disposables.pop();
    if (disposable) {
      disposable.dispose();
    }

    this.commands.delete(commandId);
    this.logger.debug(`Command unregistered: ${commandId}`);
  }

  /**
	 * Dispose all registered commands
	 *
	 * @description
	 * Disposes all VS Code command registrations and clears the registry.
	 * Called automatically during extension deactivation.
	 *
	 * @example
	 * ```typescript
	 * registry.dispose();
	 * ```
	 *
	 * @category Lifecycle
	 */
  public dispose(): void {
    this.logger.debug('Disposing CommandRegistry');

    for (const disposable of this.disposables) {
      try {
        disposable.dispose();
      } catch (error) {
        this.logger.warn('Error disposing command', error);
      }
    }

    this.disposables.length = 0;
    this.commands.clear();
  }

  /**
	 * Get the number of registered commands
	 *
	 * @description
	 * Returns the count of registered commands.
	 *
	 * @returns Number of registered commands
	 *
	 * @example
	 * ```typescript
	 * console.log(`Registry has ${registry.size} commands`);
	 * ```
	 *
	 * @category Command Queries
	 */
  public get size(): number {
    return this.commands.size;
  }
}
