export const TYPES = {
  Logger: Symbol.for('Logger'),
  ConfigurationService: Symbol.for('ConfigurationService'),
  KeypressService: Symbol.for('KeypressService'),
  AccessibilityService: Symbol.for('AccessibilityService'),
  CommandRegistry: Symbol.for('CommandRegistry'),
  ExtensionManager: Symbol.for('ExtensionManager'),
} as const;

export type DiToken = (typeof TYPES)[keyof typeof TYPES];
