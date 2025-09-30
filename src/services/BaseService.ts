import * as vscode from 'vscode';

import { Logger } from '../utils/logger';

/**
 * Base service class that provides common functionality for all services
 * Implements singleton pattern and provides logging capabilities
 */
export abstract class BaseService implements vscode.Disposable {
  protected logger: Logger;
  protected disposables: vscode.Disposable[] = [];
  protected initialized = false;

  constructor() {
    this.logger = Logger.getInstance();
  }

  /**
   * Initialize the service
   * Override this method in derived classes to implement service-specific initialization
   */
  public async initialize(): Promise<void> {
    this.logger.debug(`Initializing ${this.constructor.name}`);
    this.initialized = true;
  }

  /**
   * Enable the service (called when extension is enabled)
   */
  public async enable(): Promise<void> {
    this.logger.debug(`Enabling ${this.constructor.name}`);
  }

  /**
   * Disable the service (called when extension is disabled)
   */
  public async disable(): Promise<void> {
    this.logger.debug(`Disabling ${this.constructor.name}`);
  }

  /**
   * Dispose of the service and clean up resources
   */
  public dispose(): void {
    this.logger.debug(`Disposing ${this.constructor.name}`);

    this.disposables.forEach((disposable) => {
      try {
        disposable.dispose();
      } catch (error) {
        this.logger.warn(`Error disposing resource in ${this.constructor.name}`, error);
      }
    });

    this.disposables = [];
    this.initialized = false;
  }

  /**
   * Register a disposable to be cleaned up when the service is disposed
   */
  protected registerDisposable(disposable: vscode.Disposable): void {
    this.disposables.push(disposable);
  }

  /**
   * Check if the service is properly initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
}