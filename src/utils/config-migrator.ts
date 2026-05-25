import  { type ILogger } from '../types/extension';

type MigrationFn = (config: Record<string, unknown>) => Record<string, unknown>;

interface Migration {
  version: number;
  description: string;
  migrate: MigrationFn;
}

export class ConfigMigrator {
  private static readonly CURRENT_VERSION = 1;
  private static readonly MIGRATION_VERSION_KEY = '__kn_migrationVersion';

  private static readonly migrations: Migration[] = [
    // Future migrations added here
    // Example: { version: 2, description: '...', migrate: (cfg) => ({ ...cfg }) }
  ];

  public static migrate(
    config: Record<string, unknown>,
    logger: ILogger,
  ): Record<string, unknown> {
    const storedVersion = (config[ConfigMigrator.MIGRATION_VERSION_KEY] as number | undefined) ?? 0;

    if (storedVersion >= ConfigMigrator.CURRENT_VERSION) {
      return config;
    }

    let migrated = { ...config };

    const sortedMigrations = [...ConfigMigrator.migrations].sort((a, b) => a.version - b.version);
    for (const migration of sortedMigrations) {
      const inRange =
        storedVersion < migration.version &&
        migration.version <= ConfigMigrator.CURRENT_VERSION;
      if (inRange) {
        logger.info(`Migrating config to version ${migration.version}: ${migration.description}`);
        migrated = migration.migrate(migrated);
      }
    }

    migrated[ConfigMigrator.MIGRATION_VERSION_KEY] = ConfigMigrator.CURRENT_VERSION;
    return migrated;
  }

  public static getCurrentVersion(): number {
    return ConfigMigrator.CURRENT_VERSION;
  }
}
