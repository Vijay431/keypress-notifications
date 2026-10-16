import { describe, expect, it, vi } from 'vitest';

import { container, getService, hasService, initializeContainer } from '../../src/di/container';
import { TYPES } from '../../src/di/types';

describe('initializeContainer', () => {
  it('should register every service and resolve them lazily', async () => {
    const context = { subscriptions: [] as { dispose(): void }[] };
    await initializeContainer(context);

    for (const token of [
      TYPES.Logger,
      TYPES.ConfigurationService,
      TYPES.AccessibilityService,
      TYPES.KeypressService,
    ]) {
      expect(hasService(token)).toBe(true);
    }
    expect(hasService(TYPES.CommandRegistry)).toBe(false);

    const keypress = getService(TYPES.KeypressService);
    expect(keypress).toBeDefined();
    expect(getService(TYPES.KeypressService)).toBe(keypress);
  });

  it('should add a logger disposal hook to the extension context', async () => {
    const context = { subscriptions: [] as { dispose(): void }[] };
    await initializeContainer(context);
    expect(context.subscriptions).toHaveLength(0);

    const logger = getService<{ dispose(): void }>(TYPES.Logger);
    const dispose = vi.spyOn(logger, 'dispose');
    expect(context.subscriptions).toHaveLength(1);
    context.subscriptions[0]?.dispose();
    expect(dispose).toHaveBeenCalled();
  });

  it('should clear earlier registrations when called again', async () => {
    const stale = Symbol('stale');
    container.registerInstance(stale, 1);
    await initializeContainer({ subscriptions: [] });
    expect(hasService(stale)).toBe(false);
  });
});
