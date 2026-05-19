import { BaseService } from './BaseService';
import type { IAccessibilityService } from '../di/interfaces/IAccessibilityService';

export class AccessibilityService extends BaseService implements IAccessibilityService {
  public async announce(_message: string): Promise<void> {
    // Screen reader announcements require vscode.accessibility API (VS Code 1.110+)
    // No-op for now; extend when minimum engine version is raised.
  }
}
