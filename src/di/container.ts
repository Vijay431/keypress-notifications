import { type IAccessibilityService } from './interfaces/IAccessibilityService';
import { type IConfigurationService } from './interfaces/IConfigurationService';
import { type IKeypressService } from './interfaces/IKeypressService';
import { type ILogger } from './interfaces/ILogger';
import { TYPES } from './types';

type ServiceFactory<T> = () => T;

interface ServiceDescriptor<T> {
  factory: ServiceFactory<T>;
  instance?: T;
  isInstantiated: boolean;
}

export class DIContainer {
  private services = new Map<symbol, ServiceDescriptor<unknown>>();
  private parent?: DIContainer;

  constructor(parent?: DIContainer) {
    if (parent !== undefined) {
      this.parent = parent;
    }
  }

  registerSingleton<T>(token: symbol, factory: ServiceFactory<T>): this {
    this.services.set(token, { factory, instance: undefined, isInstantiated: false });
    return this;
  }

  registerInstance<T>(token: symbol, instance: T): this {
    this.services.set(token, { factory: () => instance, instance, isInstantiated: true });
    return this;
  }

  get<T>(token: symbol): T {
    const descriptor = this.services.get(token);
    if (descriptor) {
      if (!descriptor.isInstantiated) {
        descriptor.instance = descriptor.factory();
        descriptor.isInstantiated = true;
      }
      return descriptor.instance as T;
    }
    if (this.parent) {
      return this.parent.get<T>(token);
    }
    throw new Error(`Service not registered: ${token.toString()}`);
  }

  has(token: symbol): boolean {
    return this.services.has(token) || (this.parent?.has(token) ?? false);
  }

  clear(): void {
    this.services.clear();
  }

  createChild(): DIContainer {
    return new DIContainer(this);
  }
}

export const container = new DIContainer();

export async function initializeContainer(context: {
  subscriptions: { dispose(): void }[];
}): Promise<void> {
  container.clear();
  // Dynamic imports to avoid circular dependencies
  const { Logger } = await import('../utils/logger');
  const { ConfigurationService } = await import('../services/ConfigurationService');
  const { AccessibilityService } = await import('../services/AccessibilityService');
  const { KeypressService } = await import('../services/KeypressService');

  // Logger — root service (no deps)
  container.registerSingleton<ILogger>(TYPES.Logger, () => {
    const logger = Logger.getInstance();
    context.subscriptions.push({ dispose: () => logger.dispose() });
    return logger;
  });

  // Services that depend only on Logger
  container.registerSingleton<IConfigurationService>(TYPES.ConfigurationService, () => {
    const logger = container.get<ILogger>(TYPES.Logger);
    return ConfigurationService.create(logger);
  });

  container.registerSingleton<IAccessibilityService>(TYPES.AccessibilityService, () => {
    const logger = container.get<ILogger>(TYPES.Logger);
    return AccessibilityService.create(logger);
  });

  // KeypressService depends on Logger + ConfigurationService + AccessibilityService
  container.registerSingleton<IKeypressService>(TYPES.KeypressService, () => {
    const logger = container.get<ILogger>(TYPES.Logger);
    const configService = container.get<IConfigurationService>(TYPES.ConfigurationService);
    const accessibilityService = container.get<IAccessibilityService>(TYPES.AccessibilityService);
    return KeypressService.create(logger, configService, accessibilityService);
  });
}

export function getService<T>(token: symbol): T {
  return container.get<T>(token);
}

export function hasService(token: symbol): boolean {
  return container.has(token);
}
