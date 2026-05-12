/**
 * Configuration migrator for Keypress Notifications
 *
 * Handles migration from v1.x to v2.0.0
 */

import * as vscode from 'vscode';

import { ExtensionConfig, LogLevel } from '../types/extension';

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
  logLevel: 'error' | 'warn' | 'info' | 'debug';
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
    const backupPath = `${this.context!.globalStorageUri.fsPath}/config-backup-${timestamp}.json`;

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
   * Restore configuration from backup
   */
  private async restoreFromBackup(backupPath: string): Promise<void> {
    try {
      const content = await vscode.workspace.fs.readFile(vscode.Uri.file(backupPath));
      const decoder = new TextDecoder();
      const configData = JSON.parse(decoder.decode(content));

      await vscode.workspace.getConfiguration(this.configSection).update(
        'minimumKeys',
        configData.minimumKeys,
        vscode.ConfigurationTarget.Global,
      );

      await vscode.workspace.getConfiguration(this.configSection).update(
        'logLevel',
        configData.logLevel,
        vscode.ConfigurationTarget.Global,
      );

      await vscode.workspace.getConfiguration(this.configSection).update(
        'excludedCommands',
        configData.excludedCommands,
        vscode.ConfigurationTarget.Global,
      );

      await vscode.workspace.getConfiguration(this.configSection).update(
        'showCommandName',
        configData.showCommandName,
        vscode.ConfigurationTarget.Global,
      );

      await vscode.workspace.getConfiguration(this.configSection).update(
        'enabled',
        configData.enabled,
        vscode.ConfigurationTarget.Global,
      );

      this.logger.appendLine(`Configuration restored from ${backupPath}`);
    } catch (error) {
      throw new Error(`Failed to restore configuration from ${backupPath}: ${error}`);
    }
  }

  /**
   * Migrate V1 to V2
   */
  public async migrate(): Promise<MigrationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
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

      if (currentVersion !== ConfigVersion.V1) {
        return {
          success: false,
          version: currentVersion,
          backupPath: null,
          errors: ['Configuration is not at v1.0.0 format'],
          warnings: [],
        };
      }

      const backupPath = await this.backupConfig();
      const v1Config = currentConfig as unknown as V1Config;
      this.logger.appendLine(`Configuration backed up to ${backupPath}`);

      // Migrate to V2 format
      const migratedConfig = this.migrateToV2(v1Config);
      const version = ConfigVersion.V2;

      await vscode.workspace.getConfiguration(this.configSection).update('enabled', migratedConfig.enabled);
      await vscode.workspace.getConfiguration(this.configSection).update('minimumKeys', migratedConfig.minimumKeys);
      await vscode.workspace.getConfiguration(this.configSection).update('excludedCommands', migratedConfig.excludedCommands);
      await vscode.workspace.getConfiguration(this.configSection).update('showCommandName', migratedConfig.showCommandName);
      await vscode.workspace.getConfiguration(this.configSection).update('logLevel', migratedConfig.logLevel);

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
   * Migrate V1 config to V2 format
   */
  private migrateToV2(v1Config: V1Config): V2Config {
    return {
      enabled: v1Config.enabled,
      minimumKeys: v1Config.minimumKeys,
      excludedCommands: v1Config.excludedCommands,
      showCommandName: v1Config.showCommandName,
      logLevel: this.migrateLogLevel(v1Config.logLevel),
      notificationOptions: undefined,
      accessibility: undefined,
    };
  }

  /**
   * Migrate log level
   */
  private migrateLogLevel(v1LogLevel: 'error' | 'warn' | 'info' | 'debug'): LogLevel {
    switch (v1LogLevel) {
      case 'error':
        return LogLevel.ERROR;
      case 'warn':
        return LogLevel.WARN;
      case 'info':
        return LogLevel.INFO;
      case 'debug':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
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
    if (!this.context) {
      return;
    }

    const storageUri = this.context.globalStorageUri;
    let files: [string, vscode.FileType][];
    try {
      files = await vscode.workspace.fs.readDirectory(storageUri);
    } catch {
      return;
    }

    const backups = files
      .filter(([name, type]) => type === vscode.FileType.File && name.startsWith('config-backup-') && name.endsWith('.json'))
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
