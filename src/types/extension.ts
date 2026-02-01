/**
 * Core TypeScript interfaces and types for Keypress Notifications VS Code extension.
 *
 * This file contains type definitions used throughout the extension.
 */

/**
 * Configuration interface for extension
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
  setLogLevel?(level: LogLevel): void;
}

/**
 * Log levels enumeration
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
