import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LogLevel } from '../../src/types/extension';
import { Logger } from '../../src/utils/logger';

const appendLine = vi.fn();

vi.mock('vscode', () => ({
  window: {
    createOutputChannel: () => ({ appendLine, show: vi.fn(), dispose: vi.fn() }),
  },
}));

describe('Logger development console output', () => {
  const original = process.env['NODE_ENV'];

  beforeEach(() => {
    vi.clearAllMocks();
    Logger._resetInstance();
    process.env['NODE_ENV'] = 'development';
  });

  afterEach(() => {
    process.env['NODE_ENV'] = original;
    vi.restoreAllMocks();
  });

  it('should mirror each level to the matching console method', () => {
    const spies = {
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
    const logger = Logger.create();
    logger.setLogLevel(LogLevel.DEBUG);
    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e', { code: 1 });

    for (const spy of Object.values(spies)) {
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(appendLine).toHaveBeenCalledWith(expect.stringContaining('Data: {'));
  });

  it('should skip console output outside development', () => {
    process.env['NODE_ENV'] = 'production';
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    Logger.create().info('quiet');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should drop messages below the configured level', () => {
    const logger = Logger.create();
    logger.setLogLevel(LogLevel.ERROR);
    logger.warn('hidden');
    expect(appendLine).not.toHaveBeenCalled();
  });
});
