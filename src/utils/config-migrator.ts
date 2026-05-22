import type { ILogger } from '../types/extension';

type MigrationFn = (config: Record<string, unknown>) => Record<string, unknown>;

interface Migration {
  version: number;
  description: string;
  migrate: MigrationFn;
}

export class ConfigMigrator {
  private static readonly CURRENT_VERSION = 1;

  private static readonly migrations: Migration[] = [
    // Future migrations added here
    // Example: { version: 2, description: '...', migrate: (cfg) => ({...cfg, newField: defaultVal}) }
  ];

  public static migrate(
    config: Record<string, unknown>,
    logger: ILogger,
  ): Record<string, unknown> {
    const storedVersion = (config['_configVersion'] as number | undefined) ?? 0;

    if (storedVersion >= ConfigMigrator.CURRENT_VERSION) {
      return config;
    }

    let migrated = { ...config };

    for (const migration of ConfigMigrator.migrations) {
      if (storedVersion < migration.version) {
        logger.info(`Migrating config to version ${migration.version}: ${migration.description}`);
        migrated = migration.migrate(migrated);
      }
    }

    migrated['_configVersion'] = ConfigMigrator.CURRENT_VERSION;
    return migrated;
  }

  public static getCurrentVersion(): number {
    return ConfigMigrator.CURRENT_VERSION;
  }
}
