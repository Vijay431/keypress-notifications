/**
 * Logger Service
 *
 * Centralized logging with output channel support and metrics collection.
 *
 * @description
 * Provides logging functionality with configurable log levels.
 * Integrates with VS Code output channels and optionally with metrics collection.
 * Supports both TEXT and JSON log formats.
 *
 * @category Utilities
 * @category Logging
 *
 * @example
 * ```typescript
 * const logger = Logger.getInstance();
 * logger.info('Service initialized');
 * logger.error('Operation failed', error);
 * ```
 */

import * as vscode from 'vscode';

import type { ILogger } from '../di';
import { LogFormat } from '../di/interfaces/ILogger';
import type { IMetricsCollector } from '../di/interfaces/IMetricsCollector';
import { LogLevel } from '../types/extension';

/**
 * Logger Service
 *
 * @description
 * Centralized logging with output channel support.
 * All log messages are written to a VS Code output channel and optionally
 * recorded as metrics for performance analysis.
 *
 * Log levels filter messages:
 * - DEBUG: Detailed diagnostic information
 * - INFO: General informational messages
 * - WARN: Warning messages for potentially problematic situations
 * - ERROR: Error messages for failures and exceptional conditions
 *
 * Log formats:
 * - TEXT: Human-readable formatted log messages
 * - JSON: Structured JSON log entries for parsing and analysis
 *
 * @category Utilities
 * @category Logging
 */
export class Logger implements ILogger {
  private static instance: Logger | undefined;
  private outputChannel: vscode.OutputChannel;
  private logLevel: LogLevel = LogLevel.INFO;
  private logFormat: LogFormat = LogFormat.TEXT;
  private metricsCollector?: IMetricsCollector;

  /**
   * Private constructor - use getInstance() or DI injection
   *
   * @description
   * Creates the VS Code output channel for logging.
   * Private to enforce singleton pattern and DI usage.
   *
   * @param outputChannel - Optional output channel to use (for testing)
   */
  private constructor(outputChannel?: vscode.OutputChannel) {
    this.outputChannel =
      outputChannel ?? vscode.window.createOutputChannel('Keypress Notifications');
  }

  /**
   * Get singleton instance (legacy pattern)
   *
   * @description
   * Returns the singleton logger instance.
   * Creates one if it doesn't exist.
   *
   * @deprecated Use DI injection instead: `container.get<ILogger>(TYPES.Logger)`
   *
   * @example
   * ```typescript
   * const logger = Logger.getInstance();
   * logger.info('Starting operation');
   * ```
   *
   * @category Singleton Pattern
   */
  public static getInstance(): Logger {
    this.instance ??= new Logger();
    return this.instance;
  }

  /**
   * Create a new instance (DI pattern)
   *
   * @description
   * Factory method for creating a new logger instance.
   * Used by the DI container for dependency injection.
   *
   * @param metricsCollector - Optional metrics collector for performance tracking
   * @param outputChannel - Optional output channel to use (for testing)
   *
   * @example
   * ```typescript
   * container.registerSingleton<ILogger>(TYPES.Logger, () => Logger.create(metricsCollector));
   * ```
   *
   * @category Factory Pattern
   */
  public static create(
    metricsCollector?: IMetricsCollector,
    outputChannel?: vscode.OutputChannel,
  ): Logger {
    const logger = new Logger(outputChannel);
    if (metricsCollector) {
      logger.setMetricsCollector(metricsCollector);
    }
    return logger;
  }

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
  public setMetricsCollector(metricsCollector: IMetricsCollector): void {
    this.metricsCollector = metricsCollector;
  }

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
   *
   * @category Configuration
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

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
   *
   * @category Configuration
   */
  public setLogFormat(format: LogFormat): void {
    this.logFormat = format;
  }

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
   * logger.debug('Processing request', { url, method });
   * ```
   *
   * @category Logging Operations
   */
  public debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

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
   *
   * @category Logging Operations
   */
  public info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

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
   *
   * @category Logging Operations
   */
  public warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

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
   * try {
   *   // ... operation
   * } catch (error) {
   *   logger.error('Operation failed', error);
   * }
   * ```
   *
   * @category Logging Operations
   */
  public error(message: string, error?: unknown): void {
    this.log(LogLevel.ERROR, message, error);
  }

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
   *
   * @category VS Code Integration
   */
  public show(): void {
    this.outputChannel.show();
  }

  /**
   * Dispose of logger resources
   *
   * @description
   * Cleans up the output channel.
   * Called automatically during extension deactivation.
   *
   * @example
   * ```typescript
   * logger.dispose();
   * ```
   *
   * @category Lifecycle
   */
  public dispose(): void {
    this.outputChannel.dispose();
  }

  /**
   * Internal logging implementation
   *
   * @description
   * Performs the actual logging after level filtering.
   * Writes to output channel and console (in development).
   * Records metrics if collector is attached.
   *
   * @param level - The log level of this message
   * @param message - The message to log
   * @param data - Optional data to include
   *
   * @category Logging Operations
   * @private
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    // Record metrics if collector is available
    if (this.metricsCollector) {
      const start = Date.now();
      try {
        // Perform the logging
        this.performLog(level, message, data);
        // Record success metric
        this.metricsCollector.record({
          operation: 'log',
          duration: Date.now() - start,
          success: true,
          metadata: { level: this.getLevelName(level), message },
        });
      } catch (error) {
        // Record failure metric
        this.metricsCollector.record({
          operation: 'log',
          duration: Date.now() - start,
          success: false,
          error: String(error),
        });
      }
    } else {
      // Perform logging without metrics
      this.performLog(level, message, data);
    }
  }

  /**
   * Perform the actual logging operation
   *
   * @description
   * Writes the log message to output channel and console.
   * Supports both TEXT and JSON formats.
   *
   * @param level - The log level of this message
   * @param message - The message to log
   * @param data - Optional data to include
   *
   * @category Logging Operations
   * @private
   */
  private performLog(level: LogLevel, message: string, data?: unknown): void {
    // Filter by log level
    if (level < this.logLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelName = this.getLevelName(level);

    if (this.logFormat === LogFormat.JSON) {
      // JSON format: structured log entry
      const logEntry: Record<string, unknown> = {
        timestamp,
        level: levelName,
        message,
      };
      if (data !== undefined) {
        logEntry['data'] = data;
      }
      this.outputChannel.appendLine(JSON.stringify(logEntry));

      // Also log to console in development
      if (process.env['NODE_ENV'] === 'development') {
        switch (level) {
          case LogLevel.DEBUG:
            console.debug(logEntry);
            break;
          case LogLevel.INFO:
            console.info(logEntry);
            break;
          case LogLevel.WARN:
            console.warn(logEntry);
            break;
          case LogLevel.ERROR:
            console.error(logEntry);
            break;
        }
      }
    } else {
      // TEXT format: human-readable
      const logMessage = `[${timestamp}] [${levelName}] ${message}`;
      this.outputChannel.appendLine(logMessage);

      if (data) {
        this.outputChannel.appendLine(`Data: ${JSON.stringify(data, null, 2)}`);
      }

      // Also log to console in development
      if (process.env['NODE_ENV'] === 'development') {
        switch (level) {
          case LogLevel.DEBUG:
            console.debug(logMessage, data);
            break;
          case LogLevel.INFO:
            console.info(logMessage, data);
            break;
          case LogLevel.WARN:
            console.warn(logMessage, data);
            break;
          case LogLevel.ERROR:
            console.error(logMessage, data);
            break;
        }
      }
    }
  }

  /**
   * Get the string name for a log level
   *
   * @description
   * Converts LogLevel enum to string representation.
   *
   * @param level - The log level
   * @returns String name of the level
   *
   * @category Logging Operations
   * @private
   */
  private getLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'DEBUG';
      case LogLevel.INFO:
        return 'INFO';
      case LogLevel.WARN:
        return 'WARN';
      case LogLevel.ERROR:
        return 'ERROR';
      default:
        return 'INFO';
    }
  }
}
