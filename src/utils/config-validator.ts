import type { ExtensionConfig } from '../types/extension';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateConfig(config: ExtensionConfig): ValidationResult {
  const errors: string[] = [];

  if (typeof config.enabled !== 'boolean') {
    errors.push('enabled must be a boolean');
  }
  if (typeof config.minimumKeys !== 'number' || config.minimumKeys < 1) {
    errors.push('minimumKeys must be a positive number');
  }
  if (!Array.isArray(config.excludedCommands)) {
    errors.push('excludedCommands must be an array');
  }
  if (typeof config.showCommandName !== 'boolean') {
    errors.push('showCommandName must be a boolean');
  }

  return { valid: errors.length === 0, errors };
}
