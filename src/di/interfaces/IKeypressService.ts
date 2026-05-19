import type * as vscode from 'vscode';

export interface IKeypressService extends vscode.Disposable {
  initialize(): Promise<void>;
  enable(): Promise<void>;
  disable(): Promise<void>;
  isInitialized(): boolean;
}
