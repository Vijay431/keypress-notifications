import type { ILogger } from './interfaces/ILogger';
import type { IConfigurationService } from './interfaces/IConfigurationService';
import type { IKeypressService } from './interfaces/IKeypressService';
import type { IAccessibilityService } from './interfaces/IAccessibilityService';
import { TYPES } from './types';

type ServiceFactory<T> = () => T;

interface ServiceDescriptor<T> {
  factory: ServiceFactory<T>;
  instance?: T;
  isInstantiated: boolean;
}

export class DIContainer {
  private services = new Map<symbol, ServiceDescriptor<unknown>>();

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
    if (!descriptor) {
      throw new Error(`Service not registered: ${token.toString()}`);
    }
    if (!descriptor.isInstantiated) {
      descriptor.instance = descriptor.factory();
      descriptor.isInstantiated = true;
    }
    return descriptor.instance as T;
  }

  has(token: symbol): boolean {
    return this.services.has(token);
  }

  clear(): void {
    this.services.clear();
  }
}

export const container = new DIContainer();

export async function initializeContainer(context: {
  subscriptions: { dispose(): void }[];
}): Promise<void> {
  const { Logger } = await import('../utils/logger');
  const { ConfigurationService } = await import('../services/ConfigurationService');
  const { KeypressService } = await import('../services/KeypressService');
  const { AccessibilityService } = await import('../services/AccessibilityService');

  container.registerSingleton<ILogger>(TYPES.Logger, () => {
    const logger = Logger.getInstance();
    context.subscriptions.push({ dispose: () => logger.dispose() });
    return logger;
  });

  container.registerSingleton<IConfigurationService>(TYPES.ConfigurationService, () => {
    const instance = ConfigurationService.getInstance();
    context.subscriptions.push({ dispose: () => instance.dispose() });
    return instance;
  });

  container.registerSingleton<IAccessibilityService>(TYPES.AccessibilityService, () => {
    const instance = new AccessibilityService();
    context.subscriptions.push({ dispose: () => instance.dispose() });
    return instance;
  });

  container.registerSingleton<IKeypressService>(TYPES.KeypressService, () => {
    const instance = new KeypressService();
    context.subscriptions.push({ dispose: () => instance.dispose() });
    return instance;
  });
}

export function getService<T>(token: symbol): T {
  return container.get<T>(token);
}
