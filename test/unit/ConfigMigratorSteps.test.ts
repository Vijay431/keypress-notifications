import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfigMigrator } from '../../src/utils/config-migrator';

type Migration = {
  version: number;
  description: string;
  migrate: (c: Record<string, unknown>) => Record<string, unknown>;
};
const migrations = (ConfigMigrator as unknown as { migrations: Migration[] }).migrations;

describe('ConfigMigrator migration steps', () => {
  afterEach(() => {
    migrations.length = 0;
  });

  it('should run in-range migrations in version order and stamp the version', () => {
    const order: number[] = [];
    migrations.push(
      {
        version: 1,
        description: 'second',
        migrate: (c) => {
          order.push(1);
          return { ...c, b: 2 };
        },
      },
      {
        version: 0,
        description: 'skipped: not newer than stored version',
        migrate: (c) => {
          order.push(0);
          return c;
        },
      },
      {
        version: 99,
        description: 'skipped: beyond current version',
        migrate: (c) => {
          order.push(99);
          return c;
        },
      },
    );
    const logger = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const result = ConfigMigrator.migrate({ a: 1 }, logger);

    expect(order).toEqual([1]);
    expect(result).toMatchObject({ a: 1, b: 2, __kn_migrationVersion: 1 });
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('version 1'));
  });

  it('should return the config untouched when already current', () => {
    const cfg = { __kn_migrationVersion: ConfigMigrator.getCurrentVersion() };
    expect(ConfigMigrator.migrate(cfg, { info: vi.fn() } as never)).toBe(cfg);
  });
});
