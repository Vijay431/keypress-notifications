/**
 * Configuration migrator for Keypress Notifications
 *
 * Handles migration from v1.x to v2.0.0
 */

import * as vscode from 'vscode';

import { ExtensionConfig } from '../types/extension';

/**
 * Configuration version enum
 */
export enum ConfigVersion {
  V1 = '1.0.0',
  V2 = '2.0.0',
}

/**
 * V1 configuration structure (old)
 */
interface V1Config {
  enabled: boolean;
  minimumKeys: number;
  excludedCommands: string[];
  showCommandName: boolean;
  logLevel: ExtensionConfig['logLevel'];
}

/**
 * V2 configuration structure (new)
 */
interface V2Config extends ExtensionConfig {
  notificationOptions?: NotificationOptions;
  accessibility?: AccessibilityOptions;
}

interface NotificationOptions {
  duration?: number;
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  showIcon?: boolean;
  showTimestamp?: boolean;
  grouping?: boolean;
  sound?: 'none' | 'default' | 'subtle';
}

interface AccessibilityOptions {
  announceToScreenReader?: boolean;
  reduceMotion?: boolean;
  highContrastMode?: boolean;
  keyboardDismiss?: boolean;
}

/**
 * Migration result interface
 */
export interface MigrationResult {
  success: boolean;
  version: ConfigVersion;
  backupPath: string | null;
  errors: string[];
  warnings: string[];
}

/**
 * Migrator class
 */
export class ConfigMigrator {
  private configSection = 'keypress-notifications';
  private context: vscode.ExtensionContext;
  private logger: vscode.OutputChannel;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.logger = vscode.window.createOutputChannel('Keypress Migrator');
  }

  /**
   * Get current configuration version
   */
  private detectVersion(config: unknown): ConfigVersion {
    if (!config || typeof config !== 'object') {
      return ConfigVersion.V2;
    }

    if ('notificationOptions' in config || 'accessibility' in config) {
      return ConfigVersion.V2;
    }

    return ConfigVersion.V1;
  }

  /**
   * Backup current configuration
   */
  private async backupConfig(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${this.context.globalStorageUri.fsPath}/config-backup-${timestamp}.json`;

    try {
      const currentConfig = vscode.workspace.getConfiguration(this.configSection);
      const backupData = JSON.stringify(currentConfig, null, 2);
      const encoder = new TextEncoder();
      const buffer = encoder.encode(backupData);
      await vscode.workspace.fs.writeFile(vscode.Uri.file(backupPath), buffer);

      return backupPath;
    } catch (error) {
      throw new Error(`Failed to backup configuration: ${error}`);
    }
  }

  /**
   * Migrate V1 to V2
   */
  public async migrate(): Promise<MigrationResult> {
    const errors: string[] = [];
    let currentVersion: ConfigVersion = ConfigVersion.V2;

    try {
      const currentConfig = vscode.workspace.getConfiguration(this.configSection);
      currentVersion = this.detectVersion(currentConfig);

      if (currentVersion === ConfigVersion.V2) {
        return {
          success: true,
          version: currentVersion,
          backupPath: null,
          errors: [],
          warnings: ['Configuration is already at v2.0.0 format'],
        };
      }

      const backupPath = await this.backupConfig();
      const v1Config = currentConfig as unknown as V1Config;
      this.logger.appendLine(`Configuration backed up to ${backupPath}`);

      // Migrate to V2 format
      const migratedConfig = this.migrateToV2(v1Config);
      const version = ConfigVersion.V2;

      const cfg = vscode.workspace.getConfiguration(this.configSection);
      await cfg.update('enabled', migratedConfig.enabled);
      await cfg.update('minimumKeys', migratedConfig.minimumKeys);
      await cfg.update('excludedCommands', migratedConfig.excludedCommands);
      await cfg.update('showCommandName', migratedConfig.showCommandName);
      await cfg.update('logLevel', migratedConfig.logLevel);

      this.logger.appendLine('Configuration migrated to v2.0.0 from v1.0.0');
      this.logger.appendLine(`Backup saved to: ${backupPath}`);

      return {
        success: true,
        version,
        backupPath,
        errors,
        warnings: [
          'New v2.0.0 features (notificationOptions, accessibility) will use defaults',
          'Consider reviewing new configuration options in VS Code settings',
        ],
      };
    } catch (error) {
      this.logger.appendLine(`Migration failed: ${error}`);

      return {
        success: false,
        version: currentVersion,
        backupPath: null,
        errors: [`Migration failed: ${error}`],
        warnings: [],
      };
    }
  }

  /**
   * Migrate to the latest configuration version.
   */
  public async migrateToLatest(): Promise<MigrationResult> {
    return this.migrate();
  }

  /**
   * Migrate V1 config to V2 format
   */
  private migrateToV2(v1Config: V1Config): V2Config {
    return {
      enabled: v1Config.enabled,
      minimumKeys: v1Config.minimumKeys,
      excludedCommands: v1Config.excludedCommands,
      showCommandName: v1Config.showCommandName,
      logLevel: v1Config.logLevel,
    };
  }

  /**
   * Rollback migration
   */
  public async rollback(): Promise<void> {
    // Rollback implementation would restore from a backup
    this.logger.appendLine('Configuration rollback requested');
  }

  /**
   * Get migration version
   */
  public getMigrationVersion(): ConfigVersion {
    return ConfigVersion.V2;
  }

  /**
   * Cleanup old backups
   */
  public async cleanupOldBackups(): Promise<void> {
    const storageUri = this.context.globalStorageUri;
    let files: [string, vscode.FileType][];
    try {
      files = await vscode.workspace.fs.readDirectory(storageUri);
    } catch {
      return;
    }

    const backups = files
      .filter(
        ([name, type]) =>
          type === vscode.FileType.File &&
          name.startsWith('config-backup-') &&
          name.endsWith('.json'),
      )
      .sort((a, b) => b[0].localeCompare(a[0]));

    const toDelete = backups.slice(3);
    for (const [name] of toDelete) {
      await vscode.workspace.fs.delete(vscode.Uri.joinPath(storageUri, name));
    }

    this.logger.appendLine(`Cleaned up ${toDelete.length} old backups`);
  }

  /**
   * Dispose migrator
   */
  public dispose(): void {
    this.logger.dispose();
  }

  /**
   * Initialize migrator
   */
  public async initialize(): Promise<void> {
    this.logger.appendLine('Configuration migrator initialized');
  }
}
