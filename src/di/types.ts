/**
 * Dependency Injection Types
 *
 * Symbol-based tokens ensure uniqueness and avoid naming conflicts.
 *
 * @description
 * Using symbols instead of strings provides:
 * - Guaranteed uniqueness across the application
 * - No accidental naming collisions
 * - Better IDE support and type safety
 *
 * @category Dependency Injection
 * @see container.ts for usage
 */

/**
 * Service type tokens
 *
 * @description
 * Symbol-based tokens for dependency injection.
 * Each token uniquely identifies a service in the DI container.
 *
 * @example
 * ```typescript
 * container.registerSingleton<ILogger>(TYPES.Logger, () => new Logger());
 * const logger = container.get<ILogger>(TYPES.Logger);
 * ```
 */
export const TYPES = {
  /** Logger service - provides centralized logging */
  Logger: Symbol.for('keypress-notifications.Logger'),

  /** Configuration service - manages VS Code settings */
  ConfigurationService: Symbol.for('keypress-notifications.ConfigurationService'),

  /** Accessibility service - screen reader support */
  AccessibilityService: Symbol.for('keypress-notifications.AccessibilityService'),

  /** Keypress service - detects multi-key commands */
  KeypressService: Symbol.for('keypress-notifications.KeypressService'),

  /** Cache utility - provides caching with TTL expiration */
  Cache: Symbol.for('keypress-notifications.Cache'),

  /** Metrics collector - tracks performance metrics */
  MetricsCollector: Symbol.for('keypress-notifications.MetricsCollector'),

  /** Extension manager - coordinates extension lifecycle */
  ExtensionManager: Symbol.for('keypress-notifications.ExtensionManager'),
} as const;

/**
 * DI token type
 *
 * @description
 * Union type of all service tokens for type-safe DI operations.
 */
export type DiToken = (typeof TYPES)[keyof typeof TYPES];
