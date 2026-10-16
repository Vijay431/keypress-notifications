import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfigurationService } from '../../src/services/ConfigurationService';
import { LogLevel } from '../../src/types/extension';

const values: Record<string, unknown> = {};
const update = vi.fn(async () => {});
let changeHandler: ((e: { affectsConfiguration: (s: string) => boolean }) => void) | undefined;

vi.mock('vscode', () => ({
  workspace: {
    getConfiguration: () => ({
      get: (key: string, def?: unknown) => (key in values ? values[key] : def),
      update: (...args: unknown[]) => (update as (...a: unknown[]) => Promise<void>)(...args),
    }),
    onDidChangeConfiguration: (h: typeof changeHandler) => {
      changeHandler = h;
      return { dispose: vi.fn() };
    },
  },
  window: { createOutputChannel: () => ({ appendLine: vi.fn(), dispose: vi.fn() }) },
  ConfigurationTarget: { Global: 1, Workspace: 2 },
}));

const logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };

describe('ConfigurationService values', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const k of Object.keys(values)) {
      delete values[k];
    }
  });

  it('should read defaults', () => {
    const svc = ConfigurationService.create(logger as never);
    expect(svc.getConfiguration()).toEqual({
      enabled: true,
      minimumKeys: 2,
      excludedCommands: [],
      showCommandName: false,
      logLevel: LogLevel.INFO,
    });
  });

  it('should expose each setting through its getter', () => {
    Object.assign(values, {
      enabled: false,
      minimumKeys: 3,
      excludedCommands: ['undo'],
      showCommandName: true,
      logLevel: 'error',
    });
    const svc = ConfigurationService.create(logger as never);
    expect(svc.isEnabled()).toBe(false);
    expect(svc.getMinimumKeys()).toBe(3);
    expect(svc.getExcludedCommands()).toEqual(['undo']);
    expect(svc.shouldShowCommandName()).toBe(true);
    expect(svc.getLogLevel()).toBe(LogLevel.ERROR);
  });

  it('should fall back to INFO for an unknown log level', () => {
    values['logLevel'] = 'verbose';
    expect(ConfigurationService.create(logger as never).getLogLevel()).toBe(LogLevel.INFO);
  });

  it('should call back only when its own section changes', () => {
    const svc = ConfigurationService.create(logger as never);
    const cb = vi.fn();
    svc.onConfigurationChanged(cb);
    changeHandler?.({ affectsConfiguration: () => false });
    expect(cb).not.toHaveBeenCalled();
    changeHandler?.({ affectsConfiguration: (s) => s === 'keypress-notifications' });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should write a setting to the given target, defaulting to Global', async () => {
    const svc = ConfigurationService.create(logger as never);
    await svc.updateConfiguration('enabled', false);
    await svc.updateConfiguration('minimumKeys', 4, 2);
    expect(update).toHaveBeenNthCalledWith(1, 'enabled', false, 1);
    expect(update).toHaveBeenNthCalledWith(2, 'minimumKeys', 4, 2);
  });

  it('should dispose listeners and tolerate one that throws', () => {
    const svc = ConfigurationService.create(logger as never);
    const d = svc.onConfigurationChanged(() => {});
    d.dispose = () => {
      throw new Error('x');
    };
    expect(() => svc.dispose()).not.toThrow();
  });

  it('should return one deprecated singleton', () => {
    expect(ConfigurationService.getInstance()).toBe(ConfigurationService.getInstance());
  });
});
