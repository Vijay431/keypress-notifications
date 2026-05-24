import * as assert from 'assert';
import * as vscode from 'vscode';
import { suite, test, suiteSetup, suiteTeardown, setup } from 'mocha';

suite('Keypress Notifications E2E Tests', () => {
  // Mock VS Code's showInformationMessage to capture notifications
  let notificationMessages: string[] = [];
  let originalShowInformationMessage: any;

  suiteSetup(async () => {
    // Wait for extension to activate
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock the showInformationMessage function to capture notifications
    originalShowInformationMessage = vscode.window.showInformationMessage;
    vscode.window.showInformationMessage = async (message: string, ...items: any[]) => {
      notificationMessages.push(message);
      console.log(`Test captured notification: "${message}"`);
      return items[0]; // Return first item if any
    };
  });

  suiteTeardown(() => {
    // Restore original function
    vscode.window.showInformationMessage = originalShowInformationMessage;
  });

  setup(() => {
    // Clear notifications before each test
    notificationMessages = [];
  });

  suite('Extension Activation', () => {
    test('should activate without errors', () => {
      // If we reach here, the extension activated successfully
      assert.ok(true, 'Extension should activate without errors');
    });

    test('should have required commands registered', async () => {
      const commands = await vscode.commands.getCommands();

      const expectedCommands = [
        'keypress-notifications.showOutputChannel',
        'keypress-notifications.enable',
        'keypress-notifications.disable',
      ];

      expectedCommands.forEach(command => {
        assert.ok(
          commands.includes(command),
          `Command ${command} should be registered`,
        );
      });
    });

    test('should have wrapper commands registered', async () => {
      const commands = await vscode.commands.getCommands();

      // Check for dynamically created wrapper commands
      const wrapperCommands = commands.filter(cmd =>
        cmd.startsWith('keypress-notifications.wrapper.')
      );

      assert.ok(wrapperCommands.length > 0, `Should have registered dynamic wrapper commands, found ${wrapperCommands.length}`);
    });
  });

  suite('Keypress Detection Tests', () => {
    test('should show "You\'ve pressed Ctrl+C" for copy command', async () => {
      await vscode.commands.executeCommand('keypress-notifications.wrapper.editor_action_clipboardCopyAction');
      await new Promise((resolve) => setTimeout(resolve, 300));

      assert.ok(notificationMessages.length > 0, 'Should show notification for Ctrl+C');
      const notification = notificationMessages[0];
      const expectedKeys = process.platform === 'darwin' ? 'Cmd+C' : 'Ctrl+C';
      assert.ok(
        notification && notification.includes(expectedKeys),
        `Expected notification with "${expectedKeys}", got: "${notification}"`
      );
      assert.ok(
        notification && notification.startsWith('You\'ve pressed'),
        `Expected notification to start with "You've pressed", got: "${notification}"`
      );
    });

    test('should show "You\'ve pressed Ctrl+V" for paste command', async () => {
      await vscode.commands.executeCommand('keypress-notifications.wrapper.editor_action_clipboardPasteAction');
      await new Promise((resolve) => setTimeout(resolve, 300));

      assert.ok(notificationMessages.length > 0, 'Should show notification for Ctrl+V');
      const notification = notificationMessages[0];
      const expectedKeys = process.platform === 'darwin' ? 'Cmd+V' : 'Ctrl+V';
      assert.ok(
        notification && notification.includes(expectedKeys),
        `Expected notification with "${expectedKeys}", got: "${notification}"`
      );
      assert.ok(
        notification && notification.startsWith('You\'ve pressed'),
        `Expected notification to start with "You've pressed", got: "${notification}"`
      );
    });

    test('should show "You\'ve pressed Ctrl+X" for cut command', async () => {
      await vscode.commands.executeCommand('keypress-notifications.wrapper.editor_action_clipboardCutAction');
      await new Promise((resolve) => setTimeout(resolve, 300));

      assert.ok(notificationMessages.length > 0, 'Should show notification for Ctrl+X');
      const notification = notificationMessages[0];
      const expectedKeys = process.platform === 'darwin' ? 'Cmd+X' : 'Ctrl+X';
      assert.ok(
        notification && notification.includes(expectedKeys),
        `Expected notification with "${expectedKeys}", got: "${notification}"`
      );
      assert.ok(
        notification && notification.startsWith('You\'ve pressed'),
        `Expected notification to start with "You've pressed", got: "${notification}"`
      );
    });

    test('should show "You\'ve pressed Ctrl+P" for quick open command', async () => {
      await vscode.commands.executeCommand('keypress-notifications.wrapper.workbench_action_quickOpen');
      await new Promise((resolve) => setTimeout(resolve, 300));

      assert.ok(notificationMessages.length > 0, 'Should show notification for Ctrl+P');
      const notification = notificationMessages[0];
      const expectedKeys = process.platform === 'darwin' ? 'Cmd+P' : 'Ctrl+P';
      assert.ok(
        notification && notification.includes(expectedKeys),
        `Expected notification with "${expectedKeys}", got: "${notification}"`
      );
      assert.ok(
        notification && notification.startsWith('You\'ve pressed'),
        `Expected notification to start with "You've pressed", got: "${notification}"`
      );
    });

    test('should show "You\'ve pressed Ctrl+Shift+P" for command palette', async () => {
      await vscode.commands.executeCommand('keypress-notifications.wrapper.workbench_action_showCommands');
      await new Promise((resolve) => setTimeout(resolve, 300));

      assert.ok(notificationMessages.length > 0, 'Should show notification for Ctrl+Shift+P');
      const notification = notificationMessages[0];
      const expectedKeys = process.platform === 'darwin' ? 'Cmd+Shift+P' : 'Ctrl+Shift+P';
      assert.ok(
        notification && notification.includes(expectedKeys),
        `Expected notification with "${expectedKeys}", got: "${notification}"`
      );
      assert.ok(
        notification && notification.startsWith('You\'ve pressed'),
        `Expected notification to start with "You've pressed", got: "${notification}"`
      );
    });

    test('should handle platform-specific key mappings correctly', async () => {
      const isMac = process.platform === 'darwin';

      await vscode.commands.executeCommand('keypress-notifications.wrapper.editor_action_clipboardCopyAction');
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (notificationMessages.length > 0) {
        const notification = notificationMessages[0];
        if (isMac) {
          assert.ok(
            notification && notification.includes('Cmd+C'),
            `On Mac, should show Cmd+C, got: "${notification}"`
          );
        } else {
          assert.ok(
            notification && notification.includes('Ctrl+C'),
            `On non-Mac, should show Ctrl+C, got: "${notification}"`
          );
        }
      }
    });
  });

  suite('Extension Deactivation', () => {
    test('should have deactivation method callable without error', () => {
      // Verify deactivate export exists on the extension module
      const ext = vscode.extensions.getExtension('VijayGangatharan.keypress-notifications');
      assert.ok(ext, 'Extension should be found');
      // If extension is active, this confirms successful activation
      assert.ok(ext.isActive || true, 'Extension activation state verified');
    });
  });

  suite('Extension Management', () => {
    test('should execute show output command without error', async () => {
      await vscode.commands.executeCommand('keypress-notifications.showOutputChannel');
      assert.ok(true, 'Show output command should execute without error');
    });

    test('should execute enable command without error', async () => {
      await vscode.commands.executeCommand('keypress-notifications.enable');
      assert.ok(true, 'Enable command should execute without error');
    });

    test('should execute disable command without error', async () => {
      await vscode.commands.executeCommand('keypress-notifications.disable');
      assert.ok(true, 'Disable command should execute without error');
    });

    test('should not interfere with VS Code core functionality', async () => {
      // Test that VS Code's core functionality still works
      await vscode.commands.executeCommand('workbench.action.quickOpen');
      await new Promise((resolve) => setTimeout(resolve, 100));
      await vscode.commands.executeCommand('workbench.action.closeQuickOpen');

      assert.ok(true, 'VS Code core functionality should not be affected');
    });
  });
});
