import type * as vscode from 'vscode';

export interface Migration {
  fromVersion: string;
  toVersion: string;
  migrate(config: vscode.WorkspaceConfiguration): Promise<void>;
}

export class ConfigMigrator {
  private migrations: Migration[] = [];

  register(migration: Migration): void {
    this.migrations.push(migration);
  }

  async runMigrations(
    config: vscode.WorkspaceConfiguration,
    currentVersion: string,
  ): Promise<void> {
    const pending = this.migrations.filter((m) => m.fromVersion === currentVersion);
    for (const migration of pending) {
      await migration.migrate(config);
    }
  }
}
