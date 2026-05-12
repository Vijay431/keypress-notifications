import * as vscode from 'vscode';

const CONFIG_SECTION = 'keypress-notifications';

export function getConfiguration<T>(key: string): T | undefined {
  return vscode.workspace.getConfiguration(CONFIG_SECTION).get<T>(key);
}

export async function updateConfiguration(key: string, value: unknown): Promise<void> {
  await vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .update(key, value, vscode.ConfigurationTarget.Global);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
