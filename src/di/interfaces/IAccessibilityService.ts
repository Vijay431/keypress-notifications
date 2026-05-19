import type * as vscode from 'vscode';

export interface IAccessibilityService extends vscode.Disposable {
  announce(message: string): Promise<void>;
  isInitialized(): boolean;
}
