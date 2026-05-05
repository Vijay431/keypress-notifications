/**
 * Configuration validation utilities
 *
 * Provides validation functions for Keypress Notifications configuration
 */

import { ExtensionConfig } from '../types/extension';

/**
 * Validates a configuration object
 * @param config - Configuration to validate
 * @returns Validation result with any errors found
 */
export function validateConfiguration(config: ExtensionConfig): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate minimumKeys
  if (typeof config.minimumKeys !== 'number') {
    errors.push({
      path: 'minimumKeys',
      message: 'Minimum keys must be a number',
      value: config.minimumKeys,
      severity: 'error',
    });
  } else if (config.minimumKeys < 1) {
    errors.push({
      path: 'minimumKeys',
      message: 'Minimum keys must be at least 1',
      value: config.minimumKeys,
      severity: 'error',
    });
  } else if (config.minimumKeys > 5) {
    errors.push({
      path: 'minimumKeys',
      message: 'Minimum keys should not exceed 5 to avoid notification spam',
      value: config.minimumKeys,
      severity: 'warn',
    });
  }

  // Validate logLevel
  const validLogLevels = ['error', 'warn', 'info', 'debug'];
  if (!validLogLevels.includes(config.logLevel)) {
    errors.push({
      path: 'logLevel',
      message: `Log level must be one of: ${validLogLevels.join(', ')}`,
      value: config.logLevel,
      severity: 'error',
    });
  }

  // Validate showCommandName
  if (typeof config.showCommandName !== 'boolean') {
    errors.push({
      path: 'showCommandName',
      message: 'Show command name must be a boolean',
      value: config.showCommandName,
      severity: 'error',
    });
  }

  // Validate excludedCommands
  if (!Array.isArray(config.excludedCommands)) {
    errors.push({
      path: 'excludedCommands',
      message: 'Excluded commands must be an array',
      value: config.excludedCommands,
      severity: 'error',
    });
  } else {
    for (const commandId of config.excludedCommands) {
      if (typeof commandId !== 'string') {
        errors.push({
          path: 'excludedCommands',
          message: `Excluded command "${commandId}" must be a string`,
          value: commandId,
          severity: 'error',
        });
      }
    }
  }

  // Validate enabled
  if (typeof config.enabled !== 'boolean') {
    errors.push({
      path: 'enabled',
      message: 'Enabled must be a boolean',
      value: config.enabled,
      severity: 'error',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    hasErrors: errors.some((e) => e.severity === 'error'),
    hasWarnings: errors.some((e) => e.severity === 'warn'),
  };
}

/**
 * Validates a single configuration value
 * @param path - Dot notation path to config value (e.g., 'minimumKeys')
 * @param value - Value to validate
 * @param allowedValues - Optional array of allowed values
 * @param rules - Validation rules to apply
 * @returns Validation result
 */
export function validateConfigValue(
  path: string,
  value: unknown,
  allowedValues?: unknown[],
  rules?: ValidationRule[],
): ValidationResult {
  const errors: ValidationError[] = [];

  // Apply custom rules if provided
  if (rules) {
    for (const rule of rules) {
      const result = rule.validate(value, path);
      if (!result.isValid) {
        errors.push(result);
        if (result.severity) {
          errors.push({
            path,
            message: result.message,
            value,
            severity: result.severity,
          });
        }
      }
    }
  }

  // Check allowed values
  if (allowedValues && !allowedValues.includes(value)) {
    errors.push({
      path,
      message: `Value must be one of: ${allowedValues.join(', ')}`,
      value,
      severity: 'error',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    hasErrors: errors.some((e) => e.severity === 'error'),
    hasWarnings: errors.some((e) => e.severity === 'warn'),
  };
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  hasErrors: boolean;
  hasWarnings: boolean;
}

/**
 * Validation error interface
 */
export interface ValidationError {
  path: string;
  message: string;
  value: unknown;
  severity: 'error' | 'warn';
}

/**
 * Validation rule interface
 */
export interface ValidationRule {
  validate: (value: unknown, path: string) => ValidationResult;
  name?: string;
  message?: string;
  severity?: 'error' | 'warn';
}

/**
 * Custom validation rules
 */

/**
 * Rule: minimumKeys range check
 */
export const minimumKeysRule: ValidationRule = {
  name: 'minimumKeys-range',
  validate: (value: unknown) => {
    if (typeof value !== 'number') {
      return {
        isValid: false,
        message: 'Must be a number',
        severity: 'error' as const,
      };
    }

    const num = value as number;
    if (num < 1) {
      return {
        isValid: false,
        message: 'Must be at least 1',
        severity: 'error',
      };
    }

    if (num > 5) {
      return {
        isValid: true, // Warning, not error
        message: 'Consider using higher value to reduce notification spam',
        severity: 'warn',
      };
    }

    return { isValid: true };
  },
};

/**
 * Rule: logLevel values check
 */
export const logLevelRule: ValidationRule = {
  name: 'logLevel-enum',
  validate: (value: unknown) => {
    const validValues = ['error', 'warn', 'info', 'debug'];
    if (!validValues.includes(value as string)) {
      return {
        isValid: false,
        message: `Must be one of: ${validValues.join(', ')}`,
        severity: 'error',
      };
    }

    return { isValid: true };
  },
};

/**
 * Rule: boolean value check
 */
export const booleanRule: ValidationRule = {
  name: 'boolean-type',
  validate: (value: unknown) => {
    if (typeof value !== 'boolean') {
      return {
        isValid: false,
        message: 'Must be a boolean (true or false)',
        severity: 'error',
      };
    }

    return { isValid: true };
  },
};

/**
 * Rule: array of strings check
 */
export const arrayOfStringsRule: ValidationRule = {
  name: 'array-of-strings',
  validate: (value: unknown) => {
    if (!Array.isArray(value)) {
      return {
        isValid: false,
        message: 'Must be an array of strings',
        severity: 'error',
      };
    }

    for (const item of value as string[]) {
      if (typeof item !== 'string') {
        return {
          isValid: false,
          message: 'All items must be strings',
          severity: 'error',
        };
      }
    }

    return { isValid: true };
  },
};

/**
 * Validates configuration and returns a user-friendly error report
 * @param result - Validation result
 * @returns Formatted error message
 */
export function formatValidationResult(result: ValidationResult): string {
  if (result.isValid) {
    return '✅ Configuration is valid';
  }

  if (result.errors.length === 0) {
    return '✅ Configuration is valid';
  }

  let formatted = '❌ Configuration validation failed:\n';
  let hasErrors = false;

  for (const error of result.errors) {
    const icon = error.severity === 'error' ? '❌' : '⚠️';
    formatted += `  ${icon} ${error.path}: ${error.message}\n`;
    if (error.severity === 'error') {
      hasErrors = true;
    }
  }

  if (!hasErrors && result.hasWarnings) {
    formatted += '⚠️  Some warnings (non-blocking)\n';
  }

  return formatted;
}
