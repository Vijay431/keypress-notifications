/**
 * Service Interfaces Barrel Export
 *
 * Exports all service interfaces for the dependency injection system.
 *
 * @category Dependency Injection
 * @category Service Interfaces
 */

export type { ILogger } from './ILogger';
export type { IAccessibilityService } from './IAccessibilityService';
export type { IConfigurationService } from './IConfigurationService';
export type { IKeypressService } from './IKeypressService';
export type { ICache, CacheConfig, CacheStats } from './ICache';
export type {
  IMetricsCollector,
  MetricData,
  MetricsSummary,
} from './IMetricsCollector';
export type {
  IExtensionManager,
  KeypressNotificationsApi,
} from './IExtensionManager';
