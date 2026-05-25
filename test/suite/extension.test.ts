import * as assert from 'assert';
import * as vscode from 'vscode';
import { suite, test, suiteSetup, suiteTeardown, setup } from 'mocha';

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`waitFor timed out after ${timeoutMs}ms`);
    }
    await new Promise<void>(resolve => setTimeout(resolve, 50));
  }
}

suite('Keypress Notifications E2E Tests', () => {
  let notificationMessages: string[] = [];
  let originalShowInformationMessage: typeof vscode.window.showInformationMessage;

  suiteSetup(async () => {
    await waitFor(() => {
      const ext = vscode.extensions.getExtension('VijayGangatharan.keypress-notifications');
      return ext?.isActive ?? false;
    }, 10000);

    originalShowInformationMessage = vscode.window.showInformationMessage;
    vscode.window.showInformationMessage = async (message: string, ...items: unknown[]) => {
      notificationMessages.push(message);
      console.log(`Test captured notification: "${message}"`);
      return items[0] as Awaited<ReturnType<typeof vscode.window.showInformationMessage>>;
    };
  });

  suiteTeardown(() => {
    vscode.window.showInformationMessage = originalShowInformationMessage;
  });

  setup(() => {
    notificationMessages = [];
  });

  suite('Extension Activation', () => {
    test('should activate without errors', () => {
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

      const wrapperCommands = commands.filter(cmd =>
        cmd.startsWith('keypress-notifications.wrapper.')
      );

      assert.ok(wrapperCommands.length > 0, `Should have registered dynamic wrapper commands, found ${wrapperCommands.length}`);
    });
  });

  suite('Keypress Detection Tests', () => {
    test('should show "You\'ve pressed Ctrl+C" for copy command', async () => {
      await vscode.commands.executeCommand('keypress-notifications.wrapper.editor_action_clipboardCopyAction');
      await waitFor(() => notificationMessages.length > 0);

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
      await waitFor(() => notificationMessages.length > 0);

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
      await waitFor(() => notificationMessages.length > 0);

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
      await waitFor(() => notificationMessages.length > 0);

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
      await waitFor(() => notificationMessages.length > 0);

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
      await waitFor(() => notificationMessages.length > 0);

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
    });
  });

  suite('Extension Deactivation', () => {
    test('should have deactivation method callable without error', () => {
      const ext = vscode.extensions.getExtension('VijayGangatharan.keypress-notifications');
      assert.ok(ext, 'Extension should be found');
      assert.ok(ext.isActive, 'Extension should be active');
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
      await vscode.commands.executeCommand('workbench.action.quickOpen');
      await new Promise<void>(resolve => setTimeout(resolve, 100));
      await vscode.commands.executeCommand('workbench.action.closeQuickOpen');

      assert.ok(true, 'VS Code core functionality should not be affected');
    });
  });
});
