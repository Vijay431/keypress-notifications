import type * as vscode from 'vscode';

import { type ExtensionConfig, type LogLevel } from '../../types/extension';

export interface IConfigurationService {
  getConfiguration(): ExtensionConfig;
  isEnabled(): boolean;
  getMinimumKeys(): number;
  getExcludedCommands(): string[];
  shouldShowCommandName(): boolean;
  getLogLevel(): LogLevel;
  onConfigurationChanged(callback: () => void): vscode.Disposable;
  updateConfiguration<T>(key: string, value: T, target?: vscode.ConfigurationTarget): Promise<void>;
  dispose(): void;
}
