import type { IAccessibilityService, VerbosityLevel } from '../di/interfaces/IAccessibilityService';
import type { ILogger } from '../di/interfaces/ILogger';
import { Logger } from '../utils/logger';

export class AccessibilityService implements IAccessibilityService {
  private static instance: AccessibilityService | undefined;

  private constructor(private readonly logger: ILogger) {}

  /** @deprecated Use DI injection instead */
  public static getInstance(): AccessibilityService {
    AccessibilityService.instance ??= new AccessibilityService(Logger.getInstance());
    return AccessibilityService.instance;
  }

  public static create(logger: ILogger): AccessibilityService {
    return new AccessibilityService(logger);
  }

  public async announce(message: string, _verbosity: VerbosityLevel = 'normal'): Promise<void> {
    // Stub: accessibility announcements for future screen reader support
    this.logger.debug(`[Accessibility] ${message}`);
  }

  public async announceSuccess(operation: string, detail = ''): Promise<void> {
    const message = detail ? `${operation} succeeded: ${detail}` : `${operation} succeeded`;
    await this.announce(message);
  }

  public async announceError(operation: string, error: string): Promise<void> {
    await this.announce(`${operation} failed: ${error}`);
  }
}
