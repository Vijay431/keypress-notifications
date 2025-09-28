/**
 * Core TypeScript interfaces and types for the VS Code extension.
 *
 * This file contains all the type definitions used throughout the extension,
 * providing a single source of truth for data structures and ensuring
 * type safety across all services and managers.
 */

/**
 * Base service interface that all services should implement
 */
export interface IService {
  initialize(): Promise<void>;
  dispose(): void;
}

/**
 * Configuration interface for the extension
 */
export interface ExtensionConfig {
  enabled: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  minimumKeys: number; // Minimum number of keys in combination to show notification
  excludedCommands: string[]; // Commands to exclude from notifications
  showCommandName: boolean; // Whether to show the command name in notifications
}

/**
 * Logger interface for consistent logging across the extension
 */
export interface ILogger {
  error(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  show(): void;
  dispose(): void;
}

/**
 * Keybinding information parsed from VS Code configuration
 */
export interface KeybindingInfo {
  key: string;
  command: string;
  when?: string;
  args?: unknown;
}

/**
 * Parsed key combination details
 */
export interface KeyCombination {
  modifiers: string[];
  key: string;
  formatted: string; // Human-readable format like "Ctrl+Shift+V"
}

/**
 * Command execution context information
 */
export interface CommandInfo {
  id: string;
  title?: string;
  category?: string;
  keybinding?: KeyCombination;
}

/**
 * Keybinding detection event information
 */
export interface KeybindingEvent {
  command: CommandInfo;
  keyCombination: KeyCombination;
  timestamp: Date;
  context?: string;
}

/**
 * Legacy keypress event information (for backward compatibility)
 * @deprecated Use KeybindingEvent instead
 */
export interface KeypressEvent {
  action: 'copy' | 'cut' | 'paste';
  timestamp: Date;
  hasSelection: boolean;
  selectedText?: string;
}
