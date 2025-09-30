/**
 * Core TypeScript interfaces and types for the Keypress Notifications VS Code extension.
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
  enable?(): Promise<void>;
  disable?(): Promise<void>;
  dispose(): void;
  isInitialized(): boolean;
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
 * Extension state for management and testing
 */
export interface ExtensionState {
  isActive: boolean;
  activatedAt?: Date;
  configuration: ExtensionConfig;
  services: string[];
}

/**
 * Service initialization result
 */
export interface ServiceInitializationResult {
  success: boolean;
  error?: string;
  service: string;
}

/**
 * Command registration result
 */
export interface CommandRegistrationResult {
  success: boolean;
  command: string;
  error?: string;
}

/**
 * Notification display options
 */
export interface NotificationOptions {
  message: string;
  showCommandName?: boolean;
  duration?: number;
  type?: 'info' | 'warn' | 'error';
}

/**
 * Keypress service state for debugging and testing
 */
export interface KeypressServiceState {
  enabled: boolean;
  actionBufferLength: number;
  lastActionTime: number;
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
