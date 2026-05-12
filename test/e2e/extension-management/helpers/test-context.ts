import * as assert from 'assert';
import * as vscode from 'vscode';

const EXTENSION_ID = 'VijayGangatharan.keypress-notifications';

export interface TestContext {
  extension: vscode.Extension<unknown> | undefined;
  api: { onDidShowNotification: vscode.Event<string> } | undefined;
  managerApi: unknown;
  notificationMessages: string[];
  _subscription: vscode.Disposable | undefined;
}

export function createTestContext(): TestContext {
  return {
    extension: undefined,
    api: undefined,
    managerApi: undefined,
    notificationMessages: [],
    _subscription: undefined,
  };
}

export async function setupTestContext(ctx: TestContext): Promise<void> {
  const ext = vscode.extensions.getExtension(EXTENSION_ID);
  ctx.extension = ext;
  if (ext) {
    const api = await ext.activate();
    ctx.api = api as { onDidShowNotification: vscode.Event<string> };
    ctx.managerApi = api;
    if (ctx.api?.onDidShowNotification) {
      ctx._subscription = ctx.api.onDidShowNotification((msg: string) => {
        ctx.notificationMessages.push(msg);
      });
    }
  }
}

export function teardownTestContext(ctx: TestContext): void {
  ctx._subscription?.dispose();
  ctx._subscription = undefined;
}

export function clearNotifications(ctx: TestContext): void {
  ctx.notificationMessages = [];
}

export function assertNotificationCount(
  ctx: TestContext,
  expected: number,
  message?: string,
): void {
  assert.strictEqual(
    ctx.notificationMessages.length,
    expected,
    message ?? `Expected ${expected} notification(s), got ${ctx.notificationMessages.length}`,
  );
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
