import * as vscode from 'vscode';

import type { ILogger } from '../di';
import type { IConfigurationService } from '../di/interfaces/IConfigurationService';
import type { IKeypressService } from '../di/interfaces/IKeypressService';

import { BaseService } from './BaseService';

interface CommandExecutionEvent {
  readonly command: string;
  readonly arguments: readonly unknown[];
}

type CommandsApi = typeof vscode.commands & {
  onDidExecuteCommand?: vscode.Event<CommandExecutionEvent>;
};

interface CommandMetadata {
  keys?: string[];
  label?: string;
}

const COMMAND_METADATA = new Map<string, CommandMetadata>([
  ['editor.action.clipboardCopyAction', { keys: ['Ctrl+C'], label: 'Copy' }],
  ['editor.action.clipboardCutAction', { keys: ['Ctrl+X'], label: 'Cut' }],
  ['editor.action.clipboardPasteAction', { keys: ['Ctrl+V'], label: 'Paste' }],
  ['editor.action.commentLine', { keys: ['Ctrl+/'], label: 'Toggle Line Comment' }],
  [
    'editor.action.addSelectionToNextFindMatch',
    {
      keys: ['Ctrl+D'],
      label: 'Add Selection to Next Match',
    },
  ],
  [
    'editor.action.formatDocument',
    {
      keys: ['Shift+Alt+F'],
      label: 'Format Document',
    },
  ],
  [
    'workbench.action.showCommands',
    {
      keys: ['Ctrl+Shift+P'],
      label: 'Command Palette',
    },
  ],
  ['workbench.action.quickOpen', { keys: ['Ctrl+P'], label: 'Quick Open' }],
  ['workbench.action.findInFiles', { keys: ['Ctrl+Shift+F'], label: 'Find in Files' }],
  ['workbench.action.gotoLine', { keys: ['Ctrl+G'], label: 'Go to Line' }],
  ['workbench.action.files.save', { keys: ['Ctrl+S'], label: 'Save' }],
  [
    'workbench.action.files.saveAll',
    {
      keys: ['Ctrl+K', 'Ctrl+S'],
      label: 'Save All',
    },
  ],
  [
    'workbench.action.files.newUntitledFile',
    {
      keys: ['Ctrl+N'],
      label: 'New Untitled File',
    },
  ],
  ['workbench.action.files.openFile', { keys: ['Ctrl+O'], label: 'Open File' }],
  [
    'workbench.action.toggleSidebarVisibility',
    {
      keys: ['Ctrl+B'],
      label: 'Toggle Sidebar',
    },
  ],
  ['workbench.action.togglePanel', { keys: ['Ctrl+J'], label: 'Toggle Panel' }],
  [
    'workbench.action.terminal.toggleTerminal',
    {
      keys: ['Ctrl+`'],
      label: 'Toggle Terminal',
    },
  ],
  [
    'workbench.action.closeActiveEditor',
    {
      keys: ['Ctrl+W'],
      label: 'Close Editor',
    },
  ],
  [
    'workbench.action.newWindow',
    {
      keys: ['Ctrl+Shift+N'],
      label: 'New Window',
    },
  ],
]);

const EXTENSION_PREFIX = 'keypress-notifications';

/**
 * KeypressService listens to executed commands and displays notifications for multi-key shortcuts.
 */
export class KeypressService extends BaseService implements IKeypressService {
  private readonly NOTIFICATION_COOLDOWN = 250;
  private readonly configService: IConfigurationService;
  private enabled = true;
  private lastNotificationAt = 0;
  private lastCommandNotified: string | undefined;
  private proxyDisposables = new Map<string, vscode.Disposable>();
  private readonly notificationEmitter = new vscode.EventEmitter<string>();
  public readonly onDidShowNotification = this.notificationEmitter.event;

  private constructor(logger: ILogger, configService: IConfigurationService) {
    super(logger);
    this.configService = configService;
  }

  /**
   * Get singleton instance (legacy pattern)
   *
   * @description
   * Returns the singleton KeypressService instance.
   * Creates one if it doesn't exist using default services.
   *
   * @deprecated Use DI injection instead: `container.get<IKeypressService>(TYPES.KeypressService)`
   *
   * @example
   * ```typescript
   * const service = KeypressService.getInstance();
   * await service.initialize();
   * ```
   *
   * @category Singleton Pattern
   */
  public static getInstance(): KeypressService {
    // @ts-expect-error - Legacy singleton pattern, deprecated
    if (!KeypressService.instance) {
      const { Logger } = require('../utils/logger');
      const { ConfigurationService } = require('./ConfigurationService');
      const logger = Logger.getInstance();
      const configService = ConfigurationService.getInstance();
      // @ts-expect-error - Legacy singleton pattern, deprecated
      KeypressService.instance = new KeypressService(logger, configService);
    }
    // @ts-expect-error - Legacy singleton pattern, deprecated
    return KeypressService.instance;
  }

  /**
   * Create a new instance (DI pattern)
   *
   * @description
   * Factory method for creating a new KeypressService instance.
   * Used by the DI container for dependency injection.
   *
   * @param logger - Logger instance for diagnostics
   * @param configService - Configuration service for settings
   *
   * @example
   * ```typescript
   * container.registerSingleton<IKeypressService>(
   *   TYPES.KeypressService,
   *   () => KeypressService.create(logger, configService)
   * );
   * ```
   *
   * @category Factory Pattern
   */
  public static create(logger: ILogger, configService: IConfigurationService): KeypressService {
    return new KeypressService(logger, configService);
  }

  public override async initialize(): Promise<void> {
    await super.initialize();
    const commandsApi = vscode.commands as CommandsApi;
    const commandEvent = commandsApi.onDidExecuteCommand;

    if (!commandEvent) {
      this.enabled = this.configService.isEnabled();
      this.registerCommandProxies();
      this.logger.warn('Command execution events unavailable; using proxy command handlers');
      return;
    }

    this.enabled = this.configService.isEnabled();

    this.registerDisposable(
      commandEvent((event) => {
        this.handleCommandExecuted(event.command);
      }),
    );

    this.logger.info('KeypressService listening for command executions');
  }

  public override async enable(): Promise<void> {
    await super.enable();
    this.enabled = true;
    this.logger.info('KeypressService enabled');
  }

  public override async disable(): Promise<void> {
    await super.disable();
    this.enabled = false;
    this.logger.info('KeypressService disabled');
  }

  private handleCommandExecuted(commandId: string): void {
    if (!this.enabled || !this.configService.isEnabled()) {
      return;
    }

    if (!commandId || commandId.startsWith(EXTENSION_PREFIX)) {
      return;
    }

    const { excludedCommands, minimumKeys, showCommandName } =
      this.configService.getConfiguration();

    if (excludedCommands.includes(commandId)) {
      this.logger.debug(`Skipping excluded command: ${commandId}`);
      return;
    }

    const metadata = this.getCommandMetadata(commandId);
    const keySequence = metadata?.keys ? this.formatKeySequence(metadata.keys) : undefined;

    if (keySequence) {
      const keyCount = this.countKeys(keySequence);
      if (keyCount < minimumKeys) {
        this.logger.debug(
          `Command ${commandId} below minimum key threshold (${keyCount}/${minimumKeys})`,
        );
        return;
      }
    } else if (!showCommandName) {
      // Without key information and showCommandName disabled, nothing to display
      return;
    }

    if (this.isThrottled(commandId)) {
      this.logger.debug(`Notification throttled for command: ${commandId}`);
      return;
    }

    const message = this.buildNotificationMessage(
      commandId,
      keySequence,
      metadata,
      showCommandName,
    );
    if (!message) {
      return;
    }

    vscode.window.showInformationMessage(message);
    this.notificationEmitter.fire(message);
    this.lastNotificationAt = Date.now();
    this.lastCommandNotified = commandId;
    this.logger.debug(`Notification shown: ${message}`);
  }

  private registerCommandProxies(): void {
    for (const [commandId] of COMMAND_METADATA) {
      this.registerProxyForCommand(commandId);
    }
  }

  private registerProxyForCommand(commandId: string): void {
    if (!this.initialized) {
      return;
    }

    if (this.proxyDisposables.has(commandId)) {
      this.logger.debug(`Proxy for ${commandId} already registered`);
      return;
    }

    const disposable = vscode.commands.registerCommand(commandId, async (...args: unknown[]) => {
      try {
        this.handleCommandExecuted(commandId);
        await vscode.commands.executeCommand(commandId, ...args);
      } catch (error) {
        this.logger.warn(`Proxy command execution failed for ${commandId}`, error);
      }
    });

    this.proxyDisposables.set(commandId, disposable);
  }

  public override dispose(): void {
    this.enabled = false;
    super.dispose();

    this.proxyDisposables.forEach((disposable) => {
      try {
        disposable.dispose();
      } catch (error) {
        this.logger.warn('Error disposing proxy command', error);
      }
    });
    this.proxyDisposables.clear();
    this.notificationEmitter.dispose();
  }

  private buildNotificationMessage(
    commandId: string,
    keySequence: string | undefined,
    metadata: CommandMetadata | undefined,
    showCommandName: boolean,
  ): string | undefined {
    if (keySequence) {
      const base = `You've pressed ${keySequence}`;
      if (showCommandName) {
        const label = metadata?.label ?? this.toTitleCase(commandId);
        return `${base} (${label})`;
      }
      return base;
    }

    if (showCommandName) {
      const label = metadata?.label ?? this.toTitleCase(commandId);
      return `Command executed: ${label}`;
    }

    return undefined;
  }

  private formatKeySequence(keys: string[]): string {
    const normalized = keys.map((key) => this.adjustForPlatform(key.trim())).filter(Boolean);
    return normalized.join(' → ');
  }

  private adjustForPlatform(keyCombo: string): string {
    if (process.platform === 'darwin') {
      return keyCombo.replace(/Ctrl/g, 'Cmd');
    }
    return keyCombo;
  }

  private countKeys(sequence: string): number {
    return sequence.split('→').reduce((sum, segment) => {
      const cleaned = segment.trim();
      if (!cleaned) {
        return sum;
      }
      return sum + cleaned.split('+').length;
    }, 0);
  }

  private isThrottled(commandId: string): boolean {
    const now = Date.now();
    if (this.lastCommandNotified !== commandId) {
      return false;
    }
    return now - this.lastNotificationAt < this.NOTIFICATION_COOLDOWN;
  }

  private getCommandMetadata(commandId: string): CommandMetadata | undefined {
    return COMMAND_METADATA.get(commandId);
  }

  private toTitleCase(commandId: string): string {
    const parts = commandId.split('.').pop() ?? commandId;
    return parts
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^\w/, (char) => char.toUpperCase());
  }

  public getState() {
    return {
      enabled: this.enabled,
      lastNotificationAt: this.lastNotificationAt,
      lastCommandNotified: this.lastCommandNotified,
    };
  }
}
