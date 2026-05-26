import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('vscode', () => ({
  window: {
    createOutputChannel: () => ({ appendLine: vi.fn(), show: vi.fn(), dispose: vi.fn() }),
  },
}));

describe('ConfigMigrator', () => {
  let logger: {
    debug: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    show: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      show: vi.fn(),
      dispose: vi.fn(),
    };
  });

  it('getCurrentVersion() returns a number >= 1', async () => {
    const { ConfigMigrator } = await import('../../src/utils/config-migrator');
    expect(ConfigMigrator.getCurrentVersion()).toBeGreaterThanOrEqual(1);
  });

  it('when storedVersion >= CURRENT_VERSION: returns config unchanged (no migration)', async () => {
    const { ConfigMigrator } = await import('../../src/utils/config-migrator');
    const currentVersion = ConfigMigrator.getCurrentVersion();
    const input = { foo: 'bar', __kn_migrationVersion: currentVersion };
    const result = ConfigMigrator.migrate(input, logger);
    // Should be the same reference (returned as-is)
    expect(result).toBe(input);
    expect(result['__kn_migrationVersion']).toBe(currentVersion);
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('when no version in config (storedVersion === 0): stamps __kn_migrationVersion in returned config', async () => {
    const { ConfigMigrator } = await import('../../src/utils/config-migrator');
    const input: Record<string, unknown> = { enabled: true };
    const result = ConfigMigrator.migrate(input, logger);
    expect(result['__kn_migrationVersion']).toBeDefined();
    expect(typeof result['__kn_migrationVersion']).toBe('number');
    expect(result['__kn_migrationVersion']).toBeGreaterThanOrEqual(1);
  });

  it('with no migrations defined: config returned has __kn_migrationVersion set to CURRENT_VERSION', async () => {
    const { ConfigMigrator } = await import('../../src/utils/config-migrator');
    const currentVersion = ConfigMigrator.getCurrentVersion();
    const input: Record<string, unknown> = { minimumKeys: 2 };
    const result = ConfigMigrator.migrate(input, logger);
    expect(result['__kn_migrationVersion']).toBe(currentVersion);
  });

  it('migration is idempotent: calling migrate twice returns same version stamp', async () => {
    const { ConfigMigrator } = await import('../../src/utils/config-migrator');
    const input: Record<string, unknown> = { enabled: false };
    const firstResult = ConfigMigrator.migrate(input, logger);
    const secondResult = ConfigMigrator.migrate(firstResult, logger);
    expect(firstResult['__kn_migrationVersion']).toBe(secondResult['__kn_migrationVersion']);
  });

  it('original config properties are preserved after migration', async () => {
    const { ConfigMigrator } = await import('../../src/utils/config-migrator');
    const input: Record<string, unknown> = {
      enabled: true,
      minimumKeys: 3,
      excludedCommands: ['foo'],
    };
    const result = ConfigMigrator.migrate(input, logger);
    expect(result['enabled']).toBe(true);
    expect(result['minimumKeys']).toBe(3);
    expect(result['excludedCommands']).toEqual(['foo']);
  });
});
