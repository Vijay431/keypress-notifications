import { workspace, ConfigurationTarget, Disposable } from 'vscode';
import { ExtensionConfig } from '../types/extension';
import { BaseService } from './BaseService';

/**
 * Service responsible for managing extension configuration.
 *
 * This service provides:
 * - Configuration loading and caching
 * - Configuration change notifications
 * - Type-safe configuration access
 * - Configuration validation
 */
export class ConfigurationService extends BaseService {
  private static instance: ConfigurationService | undefined;
  private readonly configSection = 'keypress-notifications';
  private currentConfig: ExtensionConfig | undefined;

  private constructor() {
    super('ConfigurationService');
  }

  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  public static resetInstance(): void {
    if (ConfigurationService.instance) {
      ConfigurationService.instance.dispose();
      ConfigurationService.instance = undefined;
    }
  }

  protected async onInitialize(): Promise<void> {
    try {
      this.loadConfiguration();
      this.watchConfigurationChanges();
    } catch (error) {
      this.logger.error('Failed to initialize configuration service:', error);
      throw error;
    }
  }

  /**
   * Get the current configuration.
   */
  public getConfiguration(): ExtensionConfig {
    if (!this.currentConfig) {
      this.loadConfiguration();
    }
    return this.currentConfig!;
  }

  /**
   * Check if the extension is enabled.
   */
  public isEnabled(): boolean {
    return this.getConfiguration().enabled;
  }

  /**
   * Get the current log level.
   */
  public getLogLevel(): string {
    return this.getConfiguration().logLevel;
  }

  /**
   * Get the minimum number of keys required for notifications.
   */
  public getMinimumKeys(): number {
    return this.getConfiguration().minimumKeys;
  }

  /**
   * Get the list of excluded command patterns.
   */
  public getExcludedCommands(): string[] {
    return this.getConfiguration().excludedCommands;
  }

  /**
   * Check if command names should be shown in notifications.
   */
  public shouldShowCommandName(): boolean {
    return this.getConfiguration().showCommandName;
  }

  /**
   * Update a configuration value.
   */
  public async updateConfiguration<T>(
    key: string,
    value: T,
    target?: ConfigurationTarget
  ): Promise<void> {
    const config = workspace.getConfiguration(this.configSection);
    await config.update(key, value, target);
    this.logger.info(`Configuration updated: ${key} = ${JSON.stringify(value)}`);
  }

  /**
   * Register a callback for configuration changes.
   */
  public onConfigurationChanged(callback: (config: ExtensionConfig) => void): Disposable {
    const disposable = workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(this.configSection)) {
        this.loadConfiguration();
        callback(this.currentConfig!);
      }
    });

    this.addDisposable(disposable);
    return disposable;
  }

  /**
   * Load configuration from VS Code settings.
   */
  private loadConfiguration(): void {
    try {
      const config = workspace.getConfiguration(this.configSection);

      this.currentConfig = {
        enabled: config.get<boolean>('enabled', true),
        logLevel: config.get<'error' | 'warn' | 'info' | 'debug'>('logLevel', 'info'),
        minimumKeys: config.get<number>('minimumKeys', 2),
        excludedCommands: config.get<string[]>('excludedCommands', [
          'editor.action.triggerSuggest',
          'editor.action.triggerParameterHints',
          'workbench.action.quickOpenNavigateNext'
        ]),
        showCommandName: config.get<boolean>('showCommandName', true),
      };

      this.logger.debug('Configuration loaded:', this.currentConfig);
    } catch (error) {
      this.logger.error('Failed to load configuration:', error);
      // Use default configuration if loading fails
      this.currentConfig = {
        enabled: true,
        logLevel: 'info',
        minimumKeys: 2,
        excludedCommands: [
          'editor.action.triggerSuggest',
          'editor.action.triggerParameterHints',
          'workbench.action.quickOpenNavigateNext'
        ],
        showCommandName: true,
      };
    }
  }

  /**
   * Set up configuration change watching.
   */
  private watchConfigurationChanges(): void {
    this.watchConfiguration(this.configSection, () => {
      this.logger.info('Configuration changed, reloading...');
      this.loadConfiguration();
    });
  }
}