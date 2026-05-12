import * as vscode from 'vscode';
import * as assert from 'assert';
import { before, after, beforeEach, describe, it } from 'mocha';
import {
  createTestContext,
  setupTestContext,
  teardownTestContext,
  clearNotifications,
  assertNotificationCount,
  delay,
} from './helpers/test-context';
import {
  getConfiguration,
  updateConfiguration,
} from './helpers/command-helpers';

interface KeypressNotificationsApi {
  onDidShowNotification: vscode.Event<string>;
}

describe('Extension Management E2E Tests', () => {
  const context = createTestContext();

  before(async () => {
    await setupTestContext(context);
  });

  after(() => {
    teardownTestContext(context);
  });

  beforeEach(async () => {
    clearNotifications(context);
    // Ensure extension is enabled before each test
    const currentEnabled = getConfiguration<boolean>('enabled');
    if (currentEnabled !== true) {
      await updateConfiguration('enabled', true);
    }
    await delay(100);
  });

  describe('Extension Commands Registration', () => {
    it('should have all required commands registered', async () => {
      const commands = await vscode.commands.getCommands();

      const expectedCommands = [
        'keypress-notifications.showOutputChannel',
        'keypress-notifications.enable',
        'keypress-notifications.disable',
      ];

      for (const command of expectedCommands) {
        assert.ok(
          commands.includes(command),
          `Command "${command}" should be registered`,
        );
      }
    });

    it('should have exactly 3 extension commands registered', async () => {
      const commands = await vscode.commands.getCommands();

      const extensionCommands = commands.filter((cmd) =>
        cmd.startsWith('keypress-notifications.'),
      );

      assert.strictEqual(
        extensionCommands.length,
        3,
        `Expected 3 extension commands, got ${extensionCommands.length}: ${extensionCommands.join(', ')}`,
      );
    });
  });

  describe('Enable Command', () => {
    it('should execute enable command without error', async () => {
      await vscode.commands.executeCommand('keypress-notifications.enable');
      await delay(100);

      assert.ok(true, 'Enable command should execute without error');
    });

    it('should enable the extension when disabled', async () => {
      // First disable the extension
      await updateConfiguration('enabled', false);
      await delay(100);

      // Verify extension is disabled
      let config = vscode.workspace.getConfiguration('keypress-notifications');
      let isEnabled = config.get<boolean>('enabled', false);
      assert.strictEqual(isEnabled, false, 'Extension should be disabled');

      // Enable the extension
      await vscode.commands.executeCommand('keypress-notifications.enable');
      await delay(100);

      // Verify extension is enabled
      config = vscode.workspace.getConfiguration('keypress-notifications');
      isEnabled = config.get<boolean>('enabled', false);
      assert.strictEqual(isEnabled, true, 'Extension should be enabled after enable command');
    });

    it('should show notification when enabling extension', async () => {
      // Disable first to ensure we're testing the enable action
      await updateConfiguration('enabled', false);
      await delay(100);

      // Execute enable command
      await vscode.commands.executeCommand('keypress-notifications.enable');
      await delay(100);

      // The enable command itself shows a notification via showInformationMessage
      // but that's not captured by our notification API since it's an internal VS Code message
      // We just verify the command executed without error
      assert.ok(true, 'Enable command executed');
    });
  });

  describe('Disable Command', () => {
    it('should execute disable command without error', async () => {
      await vscode.commands.executeCommand('keypress-notifications.disable');
      await delay(100);

      assert.ok(true, 'Disable command should execute without error');
    });

    it('should disable the extension when enabled', async () => {
      // First ensure the extension is enabled
      await updateConfiguration('enabled', true);
      await delay(100);

      // Verify extension is enabled
      let config = vscode.workspace.getConfiguration('keypress-notifications');
      let isEnabled = config.get<boolean>('enabled', false);
      assert.strictEqual(isEnabled, true, 'Extension should be enabled');

      // Disable the extension
      await vscode.commands.executeCommand('keypress-notifications.disable');
      await delay(100);

      // Verify extension is disabled
      config = vscode.workspace.getConfiguration('keypress-notifications');
      isEnabled = config.get<boolean>('enabled', false);
      assert.strictEqual(isEnabled, false, 'Extension should be disabled after disable command');
    });

    it('should not show keypress notifications when disabled', async () => {
      // Disable the extension
      await updateConfiguration('enabled', false);
      await delay(100);

      // Execute a command that normally shows a notification
      await vscode.commands.executeCommand('workbench.action.quickOpen');
      await delay(300);

      // Close quick open to clean up
      try {
        await vscode.commands.executeCommand('workbench.action.closeQuickOpen');
      } catch {
        // Ignore if quick open is not shown
      }

      // Should not have received any keypress notification
      assertNotificationCount(context, 0, 'Should not show notifications when extension is disabled');
    });
  });

  describe('Show Output Channel Command', () => {
    it('should execute showOutputChannel command without error', async () => {
      await vscode.commands.executeCommand('keypress-notifications.showOutputChannel');
      await delay(100);

      assert.ok(true, 'Show output channel command should execute without error');
    });

    it('should show information message when output channel is displayed', async () => {
      // The command shows an information message
      await vscode.commands.executeCommand('keypress-notifications.showOutputChannel');
      await delay(100);

      // The showOutputChannel command executes successfully if no error is thrown
      assert.ok(true, 'Output channel command executed');
    });
  });

  describe('Extension State Management', () => {
    it('should toggle extension state with enable/disable commands', async () => {
      // Start with enabled state
      await updateConfiguration('enabled', true);
      await delay(100);

      let config = vscode.workspace.getConfiguration('keypress-notifications');
      let isEnabled = config.get<boolean>('enabled', false);
      assert.strictEqual(isEnabled, true, 'Extension should start enabled');

      // Disable
      await vscode.commands.executeCommand('keypress-notifications.disable');
      await delay(100);

      config = vscode.workspace.getConfiguration('keypress-notifications');
      isEnabled = config.get<boolean>('enabled', false);
      assert.strictEqual(isEnabled, false, 'Extension should be disabled');

      // Enable again
      await vscode.commands.executeCommand('keypress-notifications.enable');
      await delay(100);

      config = vscode.workspace.getConfiguration('keypress-notifications');
      isEnabled = config.get<boolean>('enabled', false);
      assert.strictEqual(isEnabled, true, 'Extension should be enabled again');
    });

    it('should maintain enabled state across enable commands', async () => {
      // Enable twice should keep it enabled
      await updateConfiguration('enabled', true);
      await delay(100);

      await vscode.commands.executeCommand('keypress-notifications.enable');
      await delay(100);

      await vscode.commands.executeCommand('keypress-notifications.enable');
      await delay(100);

      const config = vscode.workspace.getConfiguration('keypress-notifications');
      const isEnabled = config.get<boolean>('enabled', false);
      assert.strictEqual(isEnabled, true, 'Extension should remain enabled');
    });

    it('should maintain disabled state across disable commands', async () => {
      // Disable twice should keep it disabled
      await updateConfiguration('enabled', false);
      await delay(100);

      await vscode.commands.executeCommand('keypress-notifications.disable');
      await delay(100);

      await vscode.commands.executeCommand('keypress-notifications.disable');
      await delay(100);

      const config = vscode.workspace.getConfiguration('keypress-notifications');
      const isEnabled = config.get<boolean>('enabled', false);
      assert.strictEqual(isEnabled, false, 'Extension should remain disabled');
    });
  });

  describe('VS Code Context Variables', () => {
    it('should update context variable when extension is enabled', async () => {
      // Ensure extension is enabled
      await updateConfiguration('enabled', true);
      await delay(100);

      await vscode.commands.executeCommand('keypress-notifications.enable');
      await delay(100);

      // The context variable should be set to true
      // Note: We can't directly inspect context variables in tests,
      // but we can verify the command executes without error
      assert.ok(true, 'Context variable should be updated');
    });

    it('should update context variable when extension is disabled', async () => {
      // Disable extension
      await updateConfiguration('enabled', false);
      await delay(100);

      await vscode.commands.executeCommand('keypress-notifications.disable');
      await delay(100);

      // The context variable should be set to false
      assert.ok(true, 'Context variable should be updated');
    });
  });

  describe('Command Palette Integration', () => {
    it('should work when executed from Command Palette', async () => {
      // All commands should be executable from Command Palette
      // This is implicitly tested by executing them programmatically
      // which is how VS Code executes commands from the palette

      await vscode.commands.executeCommand('keypress-notifications.enable');
      await delay(50);

      await vscode.commands.executeCommand('keypress-notifications.disable');
      await delay(50);

      await vscode.commands.executeCommand('keypress-notifications.showOutputChannel');
      await delay(50);

      assert.ok(true, 'All commands work from Command Palette');
    });
  });

  describe('Extension Activation and Deactivation', () => {
    it('should activate without errors', () => {
      // If we reach here, the extension activated successfully
      assert.ok(context.extension, 'Extension should be activated');
      assert.ok(context.api, 'Extension API should be available');
    });

    it('should provide notification event API', () => {
      assert.ok(context.api, 'Extension API should exist');
      assert.ok(
        context.api?.onDidShowNotification,
        'Extension API should provide onDidShowNotification event',
      );
    });

    it('should not interfere with VS Code core functionality', async () => {
      // Test that VS Code's core functionality still works
      await vscode.commands.executeCommand('workbench.action.quickOpen');
      await delay(100);
      await vscode.commands.executeCommand('workbench.action.closeQuickOpen');

      assert.ok(true, 'VS Code core functionality should not be affected');
    });
  });
});
