/**
 * Base Command Handler
 *
 * Abstract base class for all command handlers.
 * Provides common functionality like logging, error handling, and accessibility.
 *
 * @description
 * All command handlers should extend this class and implement
 * the abstract `execute()` method. Provides consistent error handling,
 * logging, accessibility support, and helper methods for common operations.
 *
 * @category Commands
 *
 * @example
 * ```typescript
 * export class MyCommand extends BaseCommandHandler {
 *   public async execute(): Promise<CommandResult> {
 *     const editor = this.getActiveEditor();
 *     if (!editor) {
 *       return this.error('No active editor found');
 *     }
 *     // ... command logic
 *     return this.success('Operation completed');
 *   }
 * }
 * ```
 */

import * as vscode from 'vscode';

import type { ILogger } from '../di';
import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';

/**
 * Command Execution Result
 *
 * @description
 * Represents the result of executing a command.
 * Contains success status, user-facing message, and optional error details.
 */
export interface CommandResult {
  /** Whether the command succeeded */
  success: boolean;
  /** User-friendly result message */
  message: string;
  /** Optional error details */
  error?: string;
}

/**
 * Abstract base class for all command handlers
 *
 * @description
 * All command handlers should extend this class and implement
 * the abstract `execute()` method.
 *
 * @example
 * ```typescript
 * export class MyCommand extends BaseCommandHandler {
 *   constructor(
 *     private readonly myService: IMyService,
 *     accessibilityService: IAccessibilityService,
 *     logger: ILogger
 *   ) {
 *     super('MyCommand', logger, accessibilityService);
 *     this.myService = myService;
 *   }
 *
 *   public async execute(): Promise<CommandResult> {
 *     try {
 *       const result = await this.myService.doSomething();
 *       this.showInfo(result.message);
 *       await this.announceSuccess('MyCommand', result.detail);
 *       return this.success(result.message);
 *     } catch (error) {
 *       this.logError('Command failed', error);
 *       this.showError('Operation failed');
 *       await this.announceError('MyCommand', String(error));
 *       return this.error('Operation failed', error);
 *     }
 *   }
 * }
 * ```
 *
 * @category Commands
 */
export abstract class BaseCommandHandler {
  constructor(
    protected readonly name: string,
    protected readonly logger: ILogger,
    protected readonly accessibilityService: IAccessibilityService,
  ) {}

  /**
	 * Execute the command - MUST be implemented by all handlers
	 *
	 * @description
	 * Abstract method that must be implemented by all command handlers.
	 * Contains the main logic for the command.
	 *
	 * @returns Result of command execution
	 *
	 * @example
	 * ```typescript
	 * public async execute(): Promise<CommandResult> {
	 *   const editor = this.getActiveEditor();
	 *   if (!editor) {
	 *     return this.error('No active editor');
	 *   }
	 *   // ... command logic
	 *   return this.success('Done');
	 * }
	 * ```
	 *
	 * @category Command Execution
	 */
  public abstract execute(): Promise<CommandResult>;

  // ============ Editor Helpers ============

  /**
	 * Get the active text editor
	 *
	 * @description
	 * Returns the currently active text editor, if any.
	 *
	 * @returns The active text editor, or undefined
	 *
	 * @example
	 * ```typescript
	 * const editor = this.getActiveEditor();
	 * if (editor) {
	 *   const document = editor.document;
	 * }
	 * ```
	 *
	 * @category Editor Helpers
	 */
  protected getActiveEditor(): vscode.TextEditor | undefined {
    return vscode.window.activeTextEditor;
  }

  /**
	 * Get the active text editor or throw
	 *
	 * @description
	 * Returns the active text editor.
	 * Throws an error if no editor is active.
	 *
	 * @returns The active text editor
	 * @throws Error if no active editor
	 *
	 * @example
	 * ```typescript
	 * const editor = this.getRequiredActiveEditor();
	 * const selection = editor.selection;
	 * ```
	 *
	 * @category Editor Helpers
	 */
  protected getRequiredActiveEditor(): vscode.TextEditor {
    const editor = this.getActiveEditor();
    if (!editor) {
      throw new Error('No active editor found');
    }
    return editor;
  }

  /**
	 * Check if there is a non-empty selection
	 *
	 * @description
	 * Returns whether the active editor has a non-empty selection.
	 *
	 * @returns Whether there is a selection
	 *
	 * @example
	 * ```typescript
	 * if (this.hasSelection()) {
	 *   const selectedText = this.getSelectedText();
	 * }
	 * ```
	 *
	 * @category Editor Helpers
	 */
  protected hasSelection(): boolean {
    const editor = this.getActiveEditor();
    return !editor?.selection.isEmpty;
  }

  /**
	 * Get the currently selected text
	 *
	 * @description
	 * Returns the text selected in the active editor, or undefined.
	 *
	 * @returns The selected text, or undefined
	 *
	 * @example
	 * ```typescript
	 * const text = this.getSelectedText();
	 * if (text) {
	 *   console.log(`Selected: ${text}`);
	 * }
	 * ```
	 *
	 * @category Editor Helpers
	 */
  protected getSelectedText(): string | undefined {
    const editor = this.getActiveEditor();
    if (!editor || editor.selection.isEmpty) {
      return undefined;
    }
    return editor.document.getText(editor.selection);
  }

  // ============ Result Creators ============

  /**
	 * Create a success result
	 *
	 * @description
	 * Creates a CommandResult indicating success.
	 *
	 * @param message - User-friendly success message
	 * @returns Command result with success=true
	 *
	 * @example
	 * ```typescript
	 * return this.success('Operation completed successfully');
	 * ```
	 *
	 * @category Result Helpers
	 */
  protected success(message: string): CommandResult {
    return { success: true, message };
  }

  /**
	 * Create an error result
	 *
	 * @description
	 * Creates a CommandResult indicating failure.
	 *
	 * @param message - User-friendly error message
	 * @param error - Optional error details
	 * @returns Command result with success=false
	 *
	 * @example
	 * ```typescript
	 * return this.error('Operation failed', error);
	 * ```
	 *
	 * @category Result Helpers
	 */
  protected error(message: string, error?: unknown): CommandResult {
    const errorString = error instanceof Error ? error.message : String(error ?? '');
    return { success: false, message, error: errorString };
  }

  // ============ User Messages ============

  /**
	 * Show an information message to the user
	 *
	 * @description
	 * Displays a temporary information message in VS Code.
	 *
	 * @param message - Message to display
	 *
	 * @example
	 * ```typescript
	 * this.showInfo('Configuration saved');
	 * ```
	 *
	 * @category User Messages
	 */
  protected showInfo(message: string): void {
    vscode.window.showInformationMessage(message);
  }

  /**
	 * Show a warning message to the user
	 *
	 * @description
	 * Displays a temporary warning message in VS Code.
	 *
	 * @param message - Message to display
	 *
	 * @example
	 * ```typescript
	 * this.showWarning('Configuration invalid');
	 * ```
	 *
	 * @category User Messages
	 */
  protected showWarning(message: string): void {
    vscode.window.showWarningMessage(message);
  }

  /**
	 * Show an error message to the user
	 *
	 * @description
	 * Displays a temporary error message in VS Code.
	 *
	 * @param message - Message to display
	 *
	 * @example
	 * ```typescript
	 * this.showError('Failed to save configuration');
	 * ```
	 *
	 * @category User Messages
	 */
  protected showError(message: string): void {
    vscode.window.showErrorMessage(message);
  }

  // ============ Accessibility ============

  /**
	 * Announce a message to screen reader users
	 *
	 * @description
	 * Uses the accessibility service to announce a message.
	 * Controls verbosity level for different announcement types.
	 *
	 * @param message - Message to announce
	 * @param verbosity - Announcement verbosity level
	 *
	 * @example
	 * ```typescript
	 * await this.announce('File saved', 'minimal');
	 * ```
	 *
	 * @category Accessibility
	 */
  protected async announce(
    message: string,
    verbosity: 'minimal' | 'normal' | 'verbose' = 'normal',
  ): Promise<void> {
    await this.accessibilityService.announce(message, verbosity);
  }

  /**
	 * Announce a successful operation
	 *
	 * @description
	 * Announces operation success with optional detail.
	 *
	 * @param operation - Description of the operation
	 * @param detail - Optional detail about the result
	 *
	 * @example
	 * ```typescript
	 * await this.announceSuccess('Save File', 'Changes saved to disk');
	 * ```
	 *
	 * @category Accessibility
	 */
  protected async announceSuccess(operation: string, detail?: string): Promise<void> {
    await this.accessibilityService.announceSuccess(operation, detail ?? '');
  }

  /**
	 * Announce an operation failure
	 *
	 * @description
	 * Announces operation failure with error message.
	 *
	 * @param operation - Description of the operation
	 * @param error - Error message
	 *
	 * @example
	 * ```typescript
	 * await this.announceError('Save File', 'Permission denied');
	 * ```
	 *
	 * @category Accessibility
	 */
  protected async announceError(operation: string, error: string): Promise<void> {
    await this.accessibilityService.announceError(operation, error);
  }

  // ============ Logging ============

  /**
	 * Log an info message
	 *
	 * @description
	 * Logs an informational message with command name prefix.
	 *
	 * @param message - Message to log
	 * @param data - Optional data to include
	 *
	 * @example
	 * ```typescript
	 * this.logInfo('Processing file', { path });
	 * ```
	 *
	 * @category Logging
	 */
  protected logInfo(message: string, data?: unknown): void {
    this.logger.info(`[${this.name}] ${message}`, data);
  }

  /**
	 * Log a debug message
	 *
	 * @description
	 * Logs a debug message with command name prefix.
	 *
	 * @param message - Message to log
	 * @param data - Optional data to include
	 *
	 * @example
	 * ```typescript
	 * this.logDebug('Checking selection', { start, end });
	 * ```
	 *
	 * @category Logging
	 */
  protected logDebug(message: string, data?: unknown): void {
    this.logger.debug(`[${this.name}] ${message}`, data);
  }

  /**
	 * Log a warning message
	 *
	 * @description
	 * Logs a warning message with command name prefix.
	 *
	 * @param message - Message to log
	 * @param data - Optional data to include
	 *
	 * @example
	 * ```typescript
	 * this.logWarn('Invalid configuration value', { key, value });
	 * ```
	 *
	 * @category Logging
	 */
  protected logWarn(message: string, data?: unknown): void {
    this.logger.warn(`[${this.name}] ${message}`, data);
  }

  /**
	 * Log an error message
	 *
	 * @description
	 * Logs an error message with command name prefix.
	 *
	 * @param message - Message to log
	 * @param error - Optional error details
	 *
	 * @example
	 * ```typescript
	 * this.logError('Failed to process', error);
	 * ```
	 *
	 * @category Logging
	 */
  protected logError(message: string, error?: unknown): void {
    this.logger.error(`[${this.name}] ${message}`, error);
  }
}
