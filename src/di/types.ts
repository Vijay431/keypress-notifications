export const TYPES = {
  Logger: Symbol.for('Logger'),
  ConfigurationService: Symbol.for('ConfigurationService'),
  KeypressService: Symbol.for('KeypressService'),
  AccessibilityService: Symbol.for('AccessibilityService'),
} as const;

export type DiToken = (typeof TYPES)[keyof typeof TYPES];
