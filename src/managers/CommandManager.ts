import { window, commands, Disposable } from 'vscode';
import { ConfigurationService } from '../services/ConfigurationService';
import { Logger } from '../utils/logger';

/**
 * Manager responsible for registering and handling VS Code commands.
 */
export class CommandManager {
  private readonly configService = ConfigurationService.getInstance();
  private readonly logger = new Logger();
  private readonly disposables: Disposable[] = [];
  private activated = false;

  public async activate(): Promise<void> {
    await this.registerAllCommands();
    this.activated = true;
  }

  public deactivate(): void {
    this.disposables.forEach(d => d.dispose());
    this.disposables.length = 0;
    this.activated = false;
  }

  public isActivated(): boolean {
    return this.activated;
  }

  /**
   * Register all extension commands.
   */
  private async registerAllCommands(): Promise<void> {
    this.disposables.push(
      commands.registerCommand('keypress-notifications.activate', () => this.activateExtension()),
      commands.registerCommand('keypress-notifications.deactivate', () => this.deactivateExtension()),
      commands.registerCommand('keypress-notifications.showOutputChannel', () => this.showOutputChannel())
    );

    this.logger.info('All commands registered successfully');
  }

  /**
   * Activate extension command handler.
   */
  private async activateExtension(): Promise<void> {
    try {
      await this.configService.updateConfiguration('enabled', true);
      window.showInformationMessage('Keypress Notifications Activated');
      this.logger.info('Extension activated via command');
    } catch (error) {
      this.logger.error('Error activating extension:', error);
      window.showErrorMessage('Failed to activate extension');
    }
  }

  /**
   * Deactivate extension command handler.
   */
  private async deactivateExtension(): Promise<void> {
    try {
      await this.configService.updateConfiguration('enabled', false);
      window.showInformationMessage('Keypress Notifications Deactivated');
      this.logger.info('Extension deactivated via command');
    } catch (error) {
      this.logger.error('Error deactivating extension:', error);
      window.showErrorMessage('Failed to deactivate extension');
    }
  }

  /**
   * Show output channel command handler.
   */
  private async showOutputChannel(): Promise<void> {
    try {
      this.logger.show();
      this.logger.info('Output channel shown via command');
    } catch (error) {
      this.logger.error('Error showing output channel:', error);
      window.showErrorMessage('Failed to show output channel');
    }
  }
}