import { 
  StatusBarItem, 
  StatusBarAlignment, 
  window, 
  Progress, 
  ProgressLocation, 
  CancellationToken, 
  QuickPickItem, 
  QuickPickOptions, 
  InputBoxOptions, 
  OpenDialogOptions, 
  SaveDialogOptions, 
  Uri 
} from 'vscode';
import { BaseService } from './BaseService';

/**
 * Notification service for user messaging and feedback.
 *
 * Provides:
 * - Standardized user notifications
 * - Progress reporting
 * - Status bar integration
 * - Quick pick dialogs
 */
export class NotificationService extends BaseService {
  private statusBarItem: StatusBarItem;

  constructor() {
    super('NotificationService');
    this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
  }

  protected async onInitialize(): Promise<void> {
    this.addDisposable(this.statusBarItem);
    this.logger.debug('NotificationService initialized');
  }

  /**
   * Show an information message.
   */
  public async showInfo(message: string, ...items: string[]): Promise<string | undefined> {
    this.logger.info(`Info notification: ${message}`);
    return window.showInformationMessage(message, ...items);
  }

  /**
   * Show a warning message.
   */
  public async showWarning(message: string, ...items: string[]): Promise<string | undefined> {
    this.logger.warn(`Warning notification: ${message}`);
    return window.showWarningMessage(message, ...items);
  }

  /**
   * Show an error message.
   */
  public async showError(message: string, ...items: string[]): Promise<string | undefined> {
    this.logger.error(`Error notification: ${message}`);
    return window.showErrorMessage(message, ...items);
  }

  /**
   * Show a progress notification.
   */
  public async withProgress<T>(
    title: string,
    task: (progress: Progress<{ message?: string; increment?: number }>) => Promise<T>
  ): Promise<T> {
    return window.withProgress(
      {
        location: ProgressLocation.Notification,
        title,
        cancellable: false,
      },
      async (progress) => {
        this.logger.info(`Progress started: ${title}`);
        try {
          const result = await task(progress);
          this.logger.info(`Progress completed: ${title}`);
          return result;
        } catch (error) {
          this.logger.error(`Progress failed: ${title}`, error);
          throw error;
        }
      }
    );
  }

  /**
   * Show a cancellable progress notification.
   */
  public async withCancellableProgress<T>(
    title: string,
    task: (
      progress: Progress<{ message?: string; increment?: number }>,
      token: CancellationToken
    ) => Promise<T>
  ): Promise<T> {
    return window.withProgress(
      {
        location: ProgressLocation.Notification,
        title,
        cancellable: true,
      },
      async (progress, token) => {
        this.logger.info(`Cancellable progress started: ${title}`);
        try {
          const result = await task(progress, token);
          this.logger.info(`Cancellable progress completed: ${title}`);
          return result;
        } catch (error) {
          if (token.isCancellationRequested) {
            this.logger.info(`Progress cancelled: ${title}`);
          } else {
            this.logger.error(`Progress failed: ${title}`, error);
          }
          throw error;
        }
      }
    );
  }

  /**
   * Update status bar with message.
   */
  public updateStatusBar(text: string, tooltip?: string, command?: string): void {
    this.statusBarItem.text = text;
    this.statusBarItem.tooltip = tooltip;
    this.statusBarItem.command = command;
    this.statusBarItem.show();
    this.logger.debug(`Status bar updated: ${text}`);
  }

  /**
   * Hide status bar item.
   */
  public hideStatusBar(): void {
    this.statusBarItem.hide();
    this.logger.debug('Status bar hidden');
  }

  /**
   * Show quick pick dialog.
   */
  public async showQuickPick<T extends QuickPickItem>(
    items: T[],
    options?: QuickPickOptions
  ): Promise<T | undefined> {
    const result = await window.showQuickPick(items, options);
    this.logger.debug(`Quick pick result: ${result?.label || 'none'}`);
    return result;
  }

  /**
   * Show input box dialog.
   */
  public async showInputBox(options?: InputBoxOptions): Promise<string | undefined> {
    const result = await window.showInputBox(options);
    this.logger.debug(`Input box result: ${result ? 'provided' : 'none'}`);
    return result;
  }

  /**
   * Show confirmation dialog.
   */
  public async showConfirmation(
    message: string,
    confirmText = 'Yes',
    cancelText = 'No'
  ): Promise<boolean> {
    const result = await window.showInformationMessage(
      message,
      { modal: true },
      confirmText,
      cancelText
    );
    const confirmed = result === confirmText;
    this.logger.debug(`Confirmation dialog: ${confirmed ? 'confirmed' : 'cancelled'}`);
    return confirmed;
  }

  /**
   * Show open dialog.
   */
  public async showOpenDialog(options?: OpenDialogOptions): Promise<Uri[] | undefined> {
    const result = await window.showOpenDialog(options);
    this.logger.debug(`Open dialog result: ${result?.length || 0} files selected`);
    return result;
  }

  /**
   * Show save dialog.
   */
  public async showSaveDialog(options?: SaveDialogOptions): Promise<Uri | undefined> {
    const result = await window.showSaveDialog(options);
    this.logger.debug(`Save dialog result: ${result?.fsPath || 'none'}`);
    return result;
  }

  /**
   * Show temporary status bar message.
   */
  public showTemporaryStatus(text: string, duration = 3000): void {
    this.updateStatusBar(text);
    setTimeout(() => {
      this.hideStatusBar();
    }, duration);
  }
}