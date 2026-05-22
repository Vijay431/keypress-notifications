import { describe, it, expect, vi } from 'vitest';
import { ConfigValidator } from '../../src/utils/config-validator';
import { LogLevel } from '../../src/types/extension';

const logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), show: vi.fn(), dispose: vi.fn() };

describe('ConfigValidator', () => {
  const validConfig = {
    enabled: true,
    minimumKeys: 2,
    excludedCommands: [],
    showCommandName: false,
    logLevel: LogLevel.INFO,
  };

  it('returns config unchanged when all fields are valid', () => {
    const result = ConfigValidator.validate(validConfig, logger);
    expect(result).toEqual(validConfig);
  });

  it('fixes enabled when non-boolean', () => {
    // @ts-expect-error testing invalid input
    const result = ConfigValidator.validate({ ...validConfig, enabled: 'yes' }, logger);
    expect(result.enabled).toBe(true);
  });

  it('fixes minimumKeys < 1 to 2', () => {
    const result = ConfigValidator.validate({ ...validConfig, minimumKeys: 0 }, logger);
    expect(result.minimumKeys).toBe(2);
  });

  it('clamps minimumKeys to integer', () => {
    const result = ConfigValidator.validate({ ...validConfig, minimumKeys: 2.9 }, logger);
    expect(result.minimumKeys).toBe(2);
  });

  it('fixes excludedCommands when non-array', () => {
    // @ts-expect-error testing invalid input
    const result = ConfigValidator.validate({ ...validConfig, excludedCommands: null }, logger);
    expect(result.excludedCommands).toEqual([]);
  });

  it('filters non-string items from excludedCommands', () => {
    // @ts-expect-error testing invalid input
    const result = ConfigValidator.validate({ ...validConfig, excludedCommands: ['cmd', 42, null] }, logger);
    expect(result.excludedCommands).toEqual(['cmd']);
  });

  it('fixes invalid logLevel to LogLevel.INFO', () => {
    // @ts-expect-error testing invalid input
    const result = ConfigValidator.validate({ ...validConfig, logLevel: 99 }, logger);
    expect(result.logLevel).toBe(LogLevel.INFO);
  });
});
