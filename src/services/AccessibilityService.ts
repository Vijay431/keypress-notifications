/**
 * Accessibility Service
 *
 * Provides accessibility features including screen reader announcements.
 *
 * @description
 * Ensures extension is usable by users with disabilities.
 * Currently focused on screen reader announcements using VS Code's accessibility API.
 *
 * @category Services
 * @category Accessibility
 *
 * @example
 * ```typescript
 * const accessibilityService = new AccessibilityService(logger);
 * await accessibilityService.announce('File saved successfully');
 * ```
 */

import * as vscode from 'vscode';

import type { ILogger } from '../di';
import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';

/**
 * Accessibility Service
 *
 * @description
 * Provides accessibility features for the extension.
 * Uses VS Code's accessibility API for screen reader announcements.
 *
 * @category Services
 * @category Accessibility
 */
export class AccessibilityService implements IAccessibilityService {
  private static instance: AccessibilityService | undefined;
  private logger: ILogger;

  /**
	 * Private constructor - use create() factory method
	 *
	 * @description
	 * Creates service with injected logger dependency.
	 * Private to enforce factory pattern and DI usage.
	 *
	 * @param logger - Logger instance for diagnostics
	 *
	 * @category Construction
	 * @private
	 */
  private constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
	 * Get singleton instance (legacy pattern)
	 *
	 * @description
	 * Returns the singleton AccessibilityService instance.
	 * Creates one if it doesn't exist using a default logger.
	 *
	 * @deprecated Use DI injection instead: `container.get<IAccessibilityService>(TYPES.AccessibilityService)`
	 *
	 * @example
	 * ```typescript
	 * const service = AccessibilityService.getInstance();
	 * await service.announce('Operation complete');
	 * ```
	 *
	 * @category Singleton Pattern
	 */
  public static getInstance(): AccessibilityService {
    if (!this.instance) {
      const { Logger } = require('../utils/logger');
      const logger = Logger.getInstance();
      this.instance = new AccessibilityService(logger);
    }
    return this.instance;
  }

  /**
	 * Create a new instance (DI pattern)
	 *
	 * @description
	 * Factory method for creating a new AccessibilityService instance.
	 * Used by the DI container for dependency injection.
	 *
	 * @param logger - Logger instance for diagnostics
	 *
	 * @example
	 * ```typescript
	 * container.registerSingleton<IAccessibilityService>(
	 *   TYPES.AccessibilityService,
	 *   () => AccessibilityService.create(logger)
	 * );
	 * ```
	 *
	 * @category Factory Pattern
	 */
  public static create(logger: ILogger): AccessibilityService {
    return new AccessibilityService(logger);
  }

  /**
	 * Announce a message to screen reader users
	 *
	 * @description
	 * Uses VS Code's accessibility API to announce messages.
	 * Supports verbosity control for different announcement types.
	 *
	 * @param message - Message to announce
	 * @param verbosity - Announcement verbosity level
	 *
	 * @example
	 * ```typescript
	 * await accessibilityService.announce('File saved', 'normal');
	 * ```
	 *
	 * @category Screen Reader
	 */
  public async announce(
    message: string,
    verbosity: 'minimal' | 'normal' | 'verbose' = 'normal',
  ): Promise<void> {
    this.logger.debug(`Announcing to screen reader: ${message} (${verbosity})`);
    vscode.window.showInformationMessage(message);
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
	 * await accessibilityService.announceSuccess('Save File', 'Changes saved');
	 * ```
	 *
	 * @category Screen Reader
	 */
  public async announceSuccess(operation: string, detail?: string): Promise<void> {
    const message = detail ? `${operation}: ${detail}` : operation;
    await this.announce(message, 'normal');
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
	 * await accessibilityService.announceError('Delete File', 'Not found');
	 * ```
	 *
	 * @category Screen Reader
	 */
  public async announceError(operation: string, error: string): Promise<void> {
    const message = `${operation} failed: ${error}`;
    await this.announce(message, 'normal');
  }
}
