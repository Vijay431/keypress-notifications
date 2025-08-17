import { Disposable, ConfigurationChangeEvent, workspace } from 'vscode';
import { ILogger, IService } from '../types/extension';
import { Logger } from '../utils/logger';

/**
 * Base service class that provides common functionality for all services.
 *
 * This abstract class implements the IService interface and provides:
 * - Lifecycle management (initialize/dispose)
 * - Logger access
 * - Disposable resource management
 * - Configuration change handling
 */
export abstract class BaseService implements IService {
  protected readonly logger: ILogger;
  protected readonly disposables: Disposable[] = [];
  protected initialized = false;

  constructor(protected readonly serviceName: string) {
    this.logger = new Logger();
  }

  /**
   * Initialize the service. Override this method to provide custom initialization logic.
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      this.logger.warn(`${this.serviceName} is already initialized`);
      return;
    }

    try {
      this.logger.info(`Initializing ${this.serviceName}`);
      await this.onInitialize();
      this.initialized = true;
      this.logger.info(`${this.serviceName} initialized successfully`);
    } catch (error) {
      this.logger.error(`Failed to initialize ${this.serviceName}:`, error);
      this.initialized = false;
      throw error;
    }
  }

  /**
   * Dispose of the service and clean up resources.
   */
  public dispose(): void {
    if (!this.initialized) {
      return;
    }

    try {
      this.logger.info(`Disposing ${this.serviceName}`);
      this.onDispose();

      // Dispose all registered disposables
      this.disposables.forEach((disposable) => {
        try {
          disposable.dispose();
        } catch (error) {
          this.logger.warn(`Error disposing resource in ${this.serviceName}:`, error);
        }
      });

      this.disposables.length = 0;
      this.initialized = false;
      this.logger.info(`${this.serviceName} disposed successfully`);
    } catch (error) {
      this.logger.error(`Error disposing ${this.serviceName}:`, error);
    }
  }

  /**
   * Check if the service is initialized.
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Register a disposable resource to be cleaned up on dispose.
   */
  protected addDisposable(disposable: Disposable): void {
    this.disposables.push(disposable);
  }

  /**
   * Override this method to provide custom initialization logic.
   */
  protected abstract onInitialize(): Promise<void>;

  /**
   * Override this method to provide custom disposal logic.
   */
  protected onDispose(): void {
    // Default empty implementation
  }

  /**
   * Helper method to safely execute async operations with error handling.
   */
  protected async safeExecute<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    defaultValue?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.logger.error(`${this.serviceName}: ${errorMessage}`, error);
      return defaultValue;
    }
  }

  /**
   * Helper method to listen for configuration changes.
   */
  protected watchConfiguration(
    section: string,
    callback: (event: ConfigurationChangeEvent) => void
  ): void {
    const disposable = workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(section)) {
        callback(event);
      }
    });
    this.addDisposable(disposable);
  }
}