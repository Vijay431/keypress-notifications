/**
 * Accessibility Service Interface
 *
 * Defines the contract for accessibility features.
 *
 * @description
 * Provides accessibility support including screen reader announcements.
 * Ensures extension is usable by users with disabilities.
 *
 * @category Services
 * @see AccessibilityService - Implementation when needed
 */

/**
 * Accessibility Service Interface
 *
 * @description
 * Provides accessibility features for the extension.
 * Currently focused on screen reader announcements.
 *
 * @example
 * ```typescript
 * class MyService {
 *   constructor(
 *     private readonly logger: ILogger,
 *     private readonly accessibilityService: IAccessibilityService,
 *   ) {}
 *
 *   async performAction() {
 *     await this.accessibilityService.announce('Action completed');
 *     this.logger.info('Action performed');
 *   }
 * }
 * ```
 *
 * @category Service Interfaces
 */
export interface IAccessibilityService {
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
  announce(
    message: string,
    verbosity?: 'minimal' | 'normal' | 'verbose',
  ): Promise<void>;

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
	 * await accessibilityService.announceSuccess('Save', 'Changes saved');
	 * ```
	 *
	 * @category Screen Reader
	 */
  announceSuccess(operation: string, detail?: string): Promise<void>;

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
	 * await accessibilityService.announceError('Delete', 'Not found');
	 * ```
	 *
	 * @category Screen Reader
	 */
  announceError(operation: string, error: string): Promise<void>;
}
