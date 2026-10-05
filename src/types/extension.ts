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
