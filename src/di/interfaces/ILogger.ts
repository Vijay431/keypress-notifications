/**
 * Logger Service Interface
 *
 * Defines the contract for logging operations throughout the extension.
 *
 * @description
 * Provides centralized logging with configurable log levels.
 * Supports writing to VS Code output channels and console.
 * Supports both TEXT and JSON log formats.
 *
 * @category Services
 * @see Logger - Implementation in utils/logger.ts
 */

import type { LogLevel } from '../../types/extension';

import type { IMetricsCollector } from './IMetricsCollector';

/**
 * Log format enumeration
 *
 * @description
 * Defines the available output formats for log messages.
 * TEXT: Human-readable formatted log messages
 * JSON: Structured JSON log entries for parsing and analysis
 *
 * @category Logging
 */
export enum LogFormat {
  /** Human-readable text format */
  TEXT = 'text',
  /** Structured JSON format */
  JSON = 'json',
}

/**
 * Logger Service Interface
 *
 * @description
 * Defines the contract for logging with support for multiple severity levels.
 * All logging operations are optional based on the configured log level.
 *
 * @example
 * ```typescript
 * class MyService {
 *   constructor(private readonly logger: ILogger) {}
 *
 *   doSomething() {
 *     this.logger.info('Starting operation');
 *     try {
 *       // ... operation
 *       this.logger.debug('Operation completed successfully');
 *     } catch (error) {
 *       this.logger.error('Operation failed', error);
 *     }
 *   }
 * }
 * ```
 *
 * @category Service Interfaces
 */
export interface ILogger {
  /**
	 * Log a debug-level message
	 *
	 * @description
	 * Debug messages are only shown when log level is DEBUG.
	 * Use for detailed diagnostic information during development.
	 *
	 * @param message - The message to log
	 * @param data - Optional data to include with the message
	 *
	 * @example
	 * ```typescript
	 * logger.debug('Function called with', { input, options });
	 * ```
	 */
  debug(message: string, data?: unknown): void;

  /**
	 * Log an info-level message
	 *
	 * @description
	 * Info messages are shown when log level is INFO or lower (DEBUG).
	 * Use for general informational messages about normal operation.
	 *
	 * @param message - The message to log
	 * @param data - Optional data to include with the message
	 *
	 * @example
	 * ```typescript
	 * logger.info('Service initialized successfully');
	 * ```
	 */
  info(message: string, data?: unknown): void;

  /**
	 * Log a warning-level message
	 *
	 * @description
	 * Warning messages are shown when log level is WARN or lower (INFO, DEBUG).
	 * Use for potentially problematic situations that don't prevent operation.
	 *
	 * @param message - The message to log
	 * @param data - Optional data to include with the message
	 *
	 * @example
	 * ```typescript
	 * logger.warn('Configuration value missing, using default', { key });
	 * ```
	 */
  warn(message: string, data?: unknown): void;

  /**
	 * Log an error-level message
	 *
	 * @description
	 * Error messages are always shown regardless of log level.
	 * Use for failures and exceptional conditions.
	 *
	 * @param message - The message to log
	 * @param error - Optional error details to include
	 *
	 * @example
	 * ```typescript
	 * logger.error('Failed to load configuration', error);
	 * ```
	 */
  error(message: string, error?: unknown): void;

  /**
	 * Set the metrics collector
	 *
	 * @description
	 * Attaches a metrics collector to track logging operations.
	 * Called by the DI container during initialization.
	 *
	 * @param metricsCollector - The metrics collector to use
	 *
	 * @example
	 * ```typescript
	 * logger.setMetricsCollector(metricsCollector);
	 * ```
	 *
	 * @category Metrics Integration
	 */
  setMetricsCollector(metricsCollector: IMetricsCollector): void;

  /**
	 * Set the minimum log level
	 *
	 * @description
	 * Messages below this level will be filtered out.
	 * Default is INFO.
	 *
	 * @param level - The minimum log level to display
	 *
	 * @example
	 * ```typescript
	 * logger.setLogLevel(LogLevel.DEBUG); // Show all messages
	 * logger.setLogLevel(LogLevel.ERROR); // Show only errors
	 * ```
	 */
  setLogLevel(level: LogLevel): void;

  /**
	 * Set the log format
	 *
	 * @description
	 * Changes the output format for log messages.
	 * TEXT format produces human-readable messages.
	 * JSON format produces structured log entries for parsing.
	 *
	 * @param format - The log format to use (TEXT or JSON)
	 *
	 * @example
	 * ```typescript
	 * logger.setLogFormat(LogFormat.TEXT); // Human-readable
	 * logger.setLogFormat(LogFormat.JSON); // Structured for parsing
	 * ```
	 */
  setLogFormat(format: LogFormat): void;

  /**
	 * Show the output channel in VS Code
	 *
	 * @description
	 * Opens the output channel panel in VS Code so the user can see logs.
	 *
	 * @example
	 * ```typescript
	 * logger.show();
	 * ```
	 */
  show(): void;

  /**
	 * Dispose of logger resources
	 *
	 * @description
	 * Cleans up the output channel and other resources.
	 * Called automatically during extension deactivation.
	 *
	 * @example
	 * ```typescript
	 * logger.dispose();
	 * ```
	 */
  dispose(): void;
}
