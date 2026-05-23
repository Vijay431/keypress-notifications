/**
 * Core TypeScript interfaces and types for the Keypress Notifications VS Code extension.
 */

/**
 * Log levels enumeration
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Configuration interface for the extension
 */
export interface ExtensionConfig {
  enabled: boolean;
  minimumKeys: number;
  excludedCommands: string[];
  showCommandName: boolean;
  logLevel: LogLevel;
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
