/**
 * Dependency Injection Container
 *
 * Central DI container for managing service lifecycles and dependencies.
 * Uses a lightweight container pattern without external dependencies.
 *
 * @description
 * Provides service registration, resolution, and lifecycle management.
 * All services are singletons by default with lazy instantiation.
 *
 * @category Dependency Injection
 */

import type {
  ILogger,
  IConfigurationService,
  IAccessibilityService,
  IKeypressService,
  ICache,
  IMetricsCollector,
} from './interfaces';
import { TYPES } from './types';

/**
 * Service factory type - A function that creates a service instance.
 *
 * @example
 * ```typescript
 * const factory: ServiceFactory<Logger> = () => new Logger();
 * ```
 */
type ServiceFactory<T> = () => T;

/**
 * Service descriptor - Contains information about a registered service.
 *
 * @interface
 * @template T - The service type
 */
interface ServiceDescriptor<T> {
  /** Factory function to create the service instance */
  factory: ServiceFactory<T>;
  /** Cached service instance (created on first access) */
  instance?: T;
  /** Whether the service has been instantiated */
  isInstantiated: boolean;
}

/**
 * Dependency Injection Container
 *
 * Manages service registration, resolution, and lifecycle.
 * All services are singletons by default with lazy instantiation.
 *
 * @description
 * The container supports:
 * - Singleton services with lazy instantiation
 * - Direct instance registration
 * - Parent/child container hierarchy for scoped services
 * - Type-safe service resolution using Symbol tokens
 *
 * @example
 * ```typescript
 * // Register services
 * container.registerSingleton<ILogger>(
 *   TYPES.Logger,
 *   () => new Logger()
 * );
 *
 * // Resolve services
 * const logger = container.get<ILogger>(TYPES.Logger);
 * ```
 *
 * @category Dependency Injection
 */
export class DIContainer {
  private services = new Map<symbol, ServiceDescriptor<unknown>>();
  private parent: DIContainer | undefined;

  /**
   * Create a new DI container
   *
   * @param parent - Optional parent container for fallback resolution
   */
  constructor(parent?: DIContainer) {
    this.parent = parent;
  }

  /**
   * Register a singleton service
   *
   * @description
   * Registers a service with a factory function. The service will be
   * instantiated on first access and cached for subsequent requests.
   *
   * @template T - The service type
   * @param token - Symbol token identifying the service
   * @param factory - Factory function to create the service
   * @returns This container for chaining
   *
   * @example
   * ```typescript
   * container.registerSingleton<ILogger>(TYPES.Logger, () => new Logger());
   * ```
   */
  registerSingleton<T>(token: symbol, factory: ServiceFactory<T>): this {
    this.services.set(token, {
      factory,
      instance: undefined,
      isInstantiated: false,
    });
    return this;
  }

  /**
   * Register an instance directly
   *
   * @description
   * Registers an already-created service instance. Useful for testing
   * or when you need to share an existing instance.
   *
   * @template T - The service type
   * @param token - Symbol token identifying the service
   * @param instance - The service instance to register
   * @returns This container for chaining
   */
  registerInstance<T>(token: symbol, instance: T): this {
    this.services.set(token, {
      factory: () => instance,
      instance,
      isInstantiated: true,
    });
    return this;
  }

  /**
   * Resolve a service by token
   *
   * @description
   * Retrieves a service by its token. Creates the instance on first
   * access using the registered factory, then caches it.
   *
   * Falls back to parent container if service not found locally.
   *
   * @template T - The service type
   * @param token - Symbol token identifying the service
   * @returns The service instance
   * @throws Error if service not registered in this or parent containers
   *
   * @example
   * ```typescript
   * const logger = container.get<ILogger>(TYPES.Logger);
   * ```
   */
  get<T>(token: symbol): T {
    const descriptor = this.services.get(token);

    if (descriptor) {
      if (!descriptor.isInstantiated) {
        descriptor.instance = descriptor.factory();
        descriptor.isInstantiated = true;
      }
      return descriptor.instance as T;
    }

    // Fall back to parent container
    if (this.parent) {
      return this.parent.get<T>(token);
    }

    throw new Error(`Service not registered: ${token.toString()}`);
  }

  /**
   * Check if a service is registered
   *
   * @description
   * Returns true if the service is registered in this container
   * or any parent container.
   *
   * @param token - Symbol token identifying the service
   * @returns Whether the service is registered
   */
  has(token: symbol): boolean {
    return this.services.has(token) || (this.parent?.has(token) ?? false);
  }

  /**
   * Clear all registered services
   *
   * @description
   * Removes all service registrations from this container.
   * Does not affect parent containers.
   */
  clear(): void {
    this.services.clear();
  }

  /**
   * Create a child container
   *
   * @description
   * Creates a new container with this container as parent.
   * Services registered in the child take precedence over parent services.
   *
   * @returns A new child container
   */
  createChild(): DIContainer {
    return new DIContainer(this);
  }
}

/** Global DI container instance */
export const container = new DIContainer();

/**
 * Initialize the DI container with all extension services
 *
 * @description
 * Registers all extension services with their dependencies.
 * Services must be registered in dependency order - Logger has no
 * dependencies, so it's registered first.
 *
 * IMPORTANT: Services must be registered in dependency order!
 * Logger has no dependencies, so it's registered first.
 *
 * @param context - VS Code extension context for disposable registration
 *
 * @example
 * ```typescript
 * export async function activate(context: vscode.ExtensionContext) {
 *   await initializeContainer(context);
 *   const manager = container.get<IExtensionManager>(TYPES.ExtensionManager);
 * }
 * ```
 */
export async function initializeContainer(context: {
  subscriptions: { dispose(): void }[];
}): Promise<void> {
  // Dynamic imports to avoid circular dependencies
  const { Logger } = await import('../utils/logger');
  const { ConfigurationService } = await import('../services/ConfigurationService');
  const { KeypressService } = await import('../services/KeypressService');
  const { ExtensionManager } = await import('../managers/ExtensionManager');
  const { AccessibilityService } = await import('../services/AccessibilityService');

  // Register Logger first (no dependencies)
  container.registerSingleton<ILogger>(TYPES.Logger, () => {
    const logger = Logger.create();
    context.subscriptions.push({ dispose: () => logger.dispose() });
    return logger;
  });

  // Register ConfigurationService (depends on Logger)
  container.registerSingleton<IConfigurationService>(TYPES.ConfigurationService, () => {
    const logger = container.get<ILogger>(TYPES.Logger);
    return ConfigurationService.create(logger);
  });

  // Register AccessibilityService (depends on Logger)
  container.registerSingleton<IAccessibilityService>(TYPES.AccessibilityService, () => {
    const logger = container.get<ILogger>(TYPES.Logger);
    return AccessibilityService.create(logger);
  });

  // Register KeypressService (depends on Logger and ConfigurationService)
  container.registerSingleton<IKeypressService>(TYPES.KeypressService, () => {
    const logger = container.get<ILogger>(TYPES.Logger);
    const configService = container.get<IConfigurationService>(TYPES.ConfigurationService);
    const service = KeypressService.create(logger, configService);
    context.subscriptions.push({ dispose: () => service.dispose() });
    return service;
  });

  // Register Cache utility
  const { Cache } = await import('../utils/cache');
  container.registerSingleton<ICache<unknown>>(TYPES.Cache, () => new Cache());

  // Register MetricsCollector
  const { MetricsCollector } = await import('../utils/metrics');
  container.registerSingleton<IMetricsCollector>(TYPES.MetricsCollector, () => {
    const collector = new MetricsCollector();
    // Attach to logger
    const logger = container.get<ILogger>(TYPES.Logger);
    logger.setMetricsCollector(collector);
    return collector;
  });

  // Register ExtensionManager (depends on all services)
  container.registerSingleton(TYPES.ExtensionManager, () => {
    const keypressService = container.get<IKeypressService>(TYPES.KeypressService);
    const configService = container.get<IConfigurationService>(TYPES.ConfigurationService);
    const accessibilityService = container.get<IAccessibilityService>(TYPES.AccessibilityService);
    const logger = container.get<ILogger>(TYPES.Logger);
    const manager = new ExtensionManager(
      keypressService,
      configService,
      accessibilityService,
      logger,
    );
    context.subscriptions.push({ dispose: () => manager.deactivate() });
    return manager;
  });
}

/**
 * Convenience function to resolve services from the global container
 *
 * @description
 * Shorthand for `container.get<T>(token)`.
 *
 * @template T - The service type
 * @param token - Symbol token identifying the service
 * @returns The service instance
 *
 * @example
 * ```typescript
 * const logger = getService<ILogger>(TYPES.Logger);
 * ```
 */
export function getService<T>(token: symbol): T {
  return container.get<T>(token);
}

/**
 * Check if a service is registered in the global container
 *
 * @description
 * Shorthand for `container.has(token)`.
 *
 * @param token - Symbol token identifying the service
 * @returns Whether the service is registered
 */
export function hasService(token: symbol): boolean {
  return container.has(token);
}
