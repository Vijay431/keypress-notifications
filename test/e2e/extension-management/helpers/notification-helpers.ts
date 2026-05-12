import * as assert from 'assert';

export function getExpectedKeyForPlatform(key: string): string {
  if (process.platform === 'darwin') {
    return key.replace(/Ctrl/g, 'Cmd');
  }
  return key;
}

export function assertNotificationMatches(
  notification: string | undefined,
  expectedKey: string,
): void {
  assert.ok(notification, 'Notification should exist');
  assert.ok(
    notification.includes(expectedKey),
    `Notification "${notification}" should include "${expectedKey}"`,
  );
}

export function assertNotificationStartsWith(
  notification: string | undefined,
  prefix: string,
): void {
  assert.ok(notification, 'Notification should exist');
  assert.ok(
    notification.startsWith(prefix),
    `Notification "${notification}" should start with "${prefix}"`,
  );
}
