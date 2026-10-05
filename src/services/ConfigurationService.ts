import * as vscode from 'vscode';

import { type IConfigurationService } from '../di/interfaces/IConfigurationService';
import { type ILogger } from '../di/interfaces/ILogger';
import { ExtensionConfig, LogLevel } from '../types/extension';

const LOG_LEVEL_MAP: Readonly<Record<string, LogLevel>> = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
};

export class ConfigurationService implements IConfigurationService {
  private readonly configSection = 'keypress-notifications';
  private readonly disposables: vscode.Disposable[] = [];

  private constructor(private readonly logger: ILogger) {}

  public static create(logger: ILogger): ConfigurationService {
    return new ConfigurationService(logger);
  }

  public getConfiguration(): ExtensionConfig {
    const config = vscode.workspace.getConfiguration(this.configSection);
    const logLevelStr = config.get<string>('logLevel', 'info');
    // eslint-disable-next-line security/detect-object-injection
    const logLevel = LOG_LEVEL_MAP[logLevelStr] ?? LogLevel.INFO;
    return {
      enabled: config.get<boolean>('enabled', true),
      minimumKeys: config.get<number>('minimumKeys', 2),
      excludedCommands: config.get<string[]>('excludedCommands', []),
      showCommandName: config.get<boolean>('showCommandName', false),
      logLevel,
    };
  }

  public isEnabled(): boolean {
    return this.getConfiguration().enabled;
  }

  public getMinimumKeys(): number {
    return this.getConfiguration().minimumKeys;
  }

  public getExcludedCommands(): string[] {
    return this.getConfiguration().excludedCommands;
  }

  public shouldShowCommandName(): boolean {
    return this.getConfiguration().showCommandName;
  }

  public getLogLevel(): LogLevel {
    return this.getConfiguration().logLevel;
  }

  public onConfigurationChanged(callback: () => void): vscode.Disposable {
    const disposable = vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(this.configSection)) {
        this.logger.info('Configuration changed');
        callback();
      }
    });
    this.disposables.push(disposable);
    return disposable;
  }

  public async updateConfiguration<T>(
    key: string,
    value: T,
    target: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global,
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.configSection);
    await config.update(key, value, target);
    this.logger.info(`Configuration updated: ${key} = ${JSON.stringify(value)}`);
  }

  public dispose(): void {
    this.disposables.forEach((d) => {
      try {
        d.dispose();
      } catch {
        // ignore
      }
    });
    this.disposables.length = 0;
  }
}
