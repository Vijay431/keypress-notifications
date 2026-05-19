import type * as vscode from 'vscode';
import type { ExtensionConfig } from '../../types/extension';

export interface IConfigurationService extends vscode.Disposable {
  initialize(): Promise<void>;
  getConfiguration(): ExtensionConfig;
  isEnabled(): boolean;
  getMinimumKeys(): number;
  getExcludedCommands(): string[];
  shouldShowCommandName(): boolean;
  getLogLevel(): 'error' | 'warn' | 'info' | 'debug';
  onConfigurationChanged(callback: () => void): vscode.Disposable;
  updateConfiguration<T>(key: string, value: T, target?: vscode.ConfigurationTarget): Promise<void>;
  isInitialized(): boolean;
}
