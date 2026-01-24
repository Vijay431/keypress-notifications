import * as vscode from 'vscode';

import { ExtensionConfig, LogLevel } from '../types/extension';
import { Logger } from '../utils/logger';

export class ConfigurationService implements vscode.Disposable {
  private static instance: ConfigurationService | undefined;
  private logger: Logger;
  private readonly configSection = 'keypress-notifications';
  private disposables: vscode.Disposable[] = [];
  private initialized = false;
  private currentConfig: ExtensionConfig;

  private constructor() {
    this.logger = Logger.getInstance();
    this.currentConfig = this.readConfiguration();
    this.applyLogLevel(this.currentConfig.logLevel);
  }

  public static getInstance(): ConfigurationService {
    this.instance ??= new ConfigurationService();
    return this.instance;
  }

  public async initialize(): Promise<void> {
    this.logger.debug('Initializing ConfigurationService');
    this.initialized = true;
  }

  public getConfiguration(): ExtensionConfig {
    return this.currentConfig;
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

  public getLogLevel(): 'error' | 'warn' | 'info' | 'debug' {
    return this.getConfiguration().logLevel;
  }

  public onConfigurationChanged(callback: () => void): vscode.Disposable {
    const disposable = vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(this.configSection)) {
        this.refreshConfiguration();
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
    target?: vscode.ConfigurationTarget,
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.configSection);
    await config.update(key, value, target);
    this.logger.info(`Configuration updated: ${key} = ${JSON.stringify(value)}`);
    this.refreshConfiguration();
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public dispose(): void {
    this.logger.debug('Disposing ConfigurationService');

    this.disposables.forEach((disposable) => {
      try {
        disposable.dispose();
      } catch (error) {
        this.logger.warn('Error disposing resource in ConfigurationService', error);
      }
    });

    this.disposables = [];
    this.initialized = false;
    ConfigurationService.instance = undefined;
  }

  private refreshConfiguration(): void {
    this.currentConfig = this.readConfiguration();
    this.applyLogLevel(this.currentConfig.logLevel);
  }

  private readConfiguration(): ExtensionConfig {
    const config = vscode.workspace.getConfiguration(this.configSection);

    return {
      enabled: config.get<boolean>('enabled', true),
      logLevel: config.get<'error' | 'warn' | 'info' | 'debug'>('logLevel', 'info'),
      minimumKeys: config.get<number>('minimumKeys', 2),
      excludedCommands: config.get<string[]>('excludedCommands', []),
      showCommandName: config.get<boolean>('showCommandName', false),
    };
  }

  private applyLogLevel(level: 'error' | 'warn' | 'info' | 'debug'): void {
    let targetLevel: LogLevel;

    switch (level) {
      case 'error':
        targetLevel = LogLevel.ERROR;
        break;
      case 'warn':
        targetLevel = LogLevel.WARN;
        break;
      case 'debug':
        targetLevel = LogLevel.DEBUG;
        break;
      case 'info':
      default:
        targetLevel = LogLevel.INFO;
        break;
    }

    this.logger.setLogLevel(targetLevel);
  }
}