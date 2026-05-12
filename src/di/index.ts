/**
 * Dependency Injection Module
 *
 * Central dependency injection system for the extension.
 *
 * @description
 * Provides a lightweight, type-safe DI container without external dependencies.
 * All services are registered as singletons with lazy instantiation.
 *
 * @category Dependency Injection
 *
 * @example
 * ```typescript
 * import { initializeContainer, getService, TYPES } from './di';
 *
 * export async function activate(context: vscode.ExtensionContext) {
 *   await initializeContainer(context);
 *   const logger = getService<ILogger>(TYPES.Logger);
 * }
 * ```
 */

// Container implementation
export { DIContainer, container, initializeContainer, getService, hasService } from './container';

// Service type tokens
export { TYPES, type DiToken } from './types';

// Service interfaces
export type {
  ILogger,
  IConfigurationService,
  IAccessibilityService,
  IKeypressService,
  ICache,
  CacheConfig,
  CacheStats,
  IMetricsCollector,
  MetricData,
  MetricsSummary,
  IExtensionManager,
  KeypressNotificationsApi,
} from './interfaces';
