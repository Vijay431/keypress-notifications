export type VerbosityLevel = 'minimal' | 'normal' | 'verbose';

export interface IAccessibilityService {
  announce(message: string, verbosity?: VerbosityLevel): Promise<void>;
  announceSuccess(operation: string, detail?: string): Promise<void>;
  announceError(operation: string, error: string): Promise<void>;
}
