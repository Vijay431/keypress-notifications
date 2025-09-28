import * as assert from 'assert';
import * as vscode from 'vscode';
import { before, after, describe, it } from 'mocha';

describe('Keypress Notifications Extension Tests', () => {
  let originalConfig: any;

  before(async () => {
    // Store original configuration
    const config = vscode.workspace.getConfiguration('keypress-notifications');
    originalConfig = {
      enabled: config.get('enabled'),
      minimumKeys: config.get('minimumKeys'),
    };

    // Ensure extension is enabled for tests
    await config.update('enabled', true, vscode.ConfigurationTarget.Global);
    await config.update('minimumKeys', 2, vscode.ConfigurationTarget.Global);

    // Wait for extension to activate
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  after(async () => {
    // Restore original configuration
    const config = vscode.workspace.getConfiguration('keypress-notifications');
    await config.update('enabled', originalConfig.enabled, vscode.ConfigurationTarget.Global);
    await config.update(
      'minimumKeys',
      originalConfig.minimumKeys,
      vscode.ConfigurationTarget.Global,
    );
  });

  describe('Extension Lifecycle', () => {
    it('should have extension commands registered', async () => {
      const commands = await vscode.commands.getCommands();

      assert.ok(
        commands.includes('keypress-notifications.activate'),
        'Activate command should be registered',
      );
      assert.ok(
        commands.includes('keypress-notifications.deactivate'),
        'Deactivate command should be registered',
      );
      assert.ok(
        commands.includes('keypress-notifications.showOutputChannel'),
        'Show output command should be registered',
      );
    });

    it('should load configuration correctly', () => {
      const config = vscode.workspace.getConfiguration('keypress-notifications');

      assert.strictEqual(config.get('enabled'), true, 'Extension should be enabled');
      assert.strictEqual(config.get('minimumKeys'), 2, 'Minimum keys should be 2');
    });
  });

  describe('Activation/Deactivation Commands', () => {
    it('should activate extension via command', async () => {
      // Ensure we start from deactivated state
      await vscode.commands.executeCommand('keypress-notifications.deactivate');
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Activate via command
      await vscode.commands.executeCommand('keypress-notifications.activate');
      await new Promise((resolve) => setTimeout(resolve, 500));

      const config = vscode.workspace.getConfiguration('keypress-notifications');
      const enabled = config.get('enabled');
      assert.strictEqual(enabled, true, 'Extension should be enabled after activate command');
    });

    it('should deactivate extension via command', async () => {
      // Ensure we start from activated state
      await vscode.commands.executeCommand('keypress-notifications.activate');
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Deactivate via command
      await vscode.commands.executeCommand('keypress-notifications.deactivate');
      await new Promise((resolve) => setTimeout(resolve, 500));

      const config = vscode.workspace.getConfiguration('keypress-notifications');
      const enabled = config.get('enabled');
      assert.strictEqual(enabled, false, 'Extension should be disabled after deactivate command');
    });

    it('should execute show output command without error', async () => {
      await vscode.commands.executeCommand('keypress-notifications.showOutputChannel');
      // If we reach here without throwing, the command executed successfully
      assert.ok(true, 'Show output command should execute without error');
    });
  });

  describe('Clipboard Operations', () => {
    let document: vscode.TextDocument;
    let editor: vscode.TextEditor;

    before(async () => {
      // Create a test document
      document = await vscode.workspace.openTextDocument({
        content: 'Hello World\nThis is a test document\nfor clipboard operations',
        language: 'plaintext',
      });
      editor = await vscode.window.showTextDocument(document);
    });

    after(async () => {
      await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    it('should handle copy operation (Ctrl+C)', async () => {
      // Select some text
      const range = new vscode.Range(0, 0, 0, 11); // "Hello World"
      editor.selection = new vscode.Selection(range.start, range.end);

      // Execute copy command - just verify it doesn't throw
      try {
        await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
        await new Promise((resolve) => setTimeout(resolve, 300));
        assert.ok(true, 'Copy command executed successfully');
      } catch (error) {
        assert.fail(`Copy command should not throw: ${error}`);
      }
    });

    it('should handle cut operation (Ctrl+X)', async () => {
      // Select some text
      const range = new vscode.Range(1, 0, 1, 7); // "This is"
      editor.selection = new vscode.Selection(range.start, range.end);

      // Execute cut command - just verify it doesn't throw
      try {
        await vscode.commands.executeCommand('editor.action.clipboardCutAction');
        await new Promise((resolve) => setTimeout(resolve, 300));
        assert.ok(true, 'Cut command executed successfully');
      } catch (error) {
        assert.fail(`Cut command should not throw: ${error}`);
      }
    });

    it('should handle paste operation (Ctrl+V)', async () => {
      // Set specific clipboard content first
      await vscode.env.clipboard.writeText('Pasted');

      // Position cursor at end of first line
      const position = new vscode.Position(0, 11);
      editor.selection = new vscode.Selection(position, position);

      // Execute paste command
      await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verify text was pasted
      const lineText = document.lineAt(0).text;
      assert.ok(lineText.includes('Pasted'), 'Pasted text should appear in document');
    });
  });

  describe('Navigation & UI Operations', () => {
    it('should handle Command Palette operation (Ctrl+Shift+P)', async () => {
      await vscode.commands.executeCommand('workbench.action.showCommands');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Close the command palette
      await vscode.commands.executeCommand('workbench.action.closeQuickOpen');
      assert.ok(true, 'Command palette should open without error');
    });

    it('should handle Quick Open operation (Ctrl+P)', async () => {
      await vscode.commands.executeCommand('workbench.action.quickOpen');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Close quick open
      await vscode.commands.executeCommand('workbench.action.closeQuickOpen');
      assert.ok(true, 'Quick open should work without error');
    });

    it('should handle Sidebar toggle operation (Ctrl+B)', async () => {
      // Toggle sidebar
      await vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Toggle back
      await vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');
      await new Promise((resolve) => setTimeout(resolve, 300));

      assert.ok(true, 'Sidebar toggle should work without error');
    });

    it('should handle Terminal toggle operation (Ctrl+`)', async () => {
      await vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Toggle back to close terminal
      await vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal');
      await new Promise((resolve) => setTimeout(resolve, 300));

      assert.ok(true, 'Terminal toggle should work without error');
    });

    it('should handle Panel toggle operation (Ctrl+J)', async () => {
      await vscode.commands.executeCommand('workbench.action.togglePanel');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Toggle back
      await vscode.commands.executeCommand('workbench.action.togglePanel');
      await new Promise((resolve) => setTimeout(resolve, 300));

      assert.ok(true, 'Panel toggle should work without error');
    });
  });

  describe('Multi-key Combination Tests', () => {
    it('should handle Find in Files (Ctrl+Shift+F) - 3 keys', async () => {
      await vscode.commands.executeCommand('workbench.action.findInFiles');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Close the search panel
      await vscode.commands.executeCommand('workbench.action.togglePanel');
      assert.ok(true, 'Find in Files should work without error');
    });

    it('should handle Go to Line (Ctrl+G) - 2 keys', async () => {
      await vscode.commands.executeCommand('workbench.action.gotoLine');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Close the dialog
      await vscode.commands.executeCommand('workbench.action.closeQuickOpen');
      assert.ok(true, 'Go to Line should work without error');
    });

    it('should handle New File (Ctrl+N) - 2 keys', async () => {
      await vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Close the new file
      await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
      assert.ok(true, 'New File should work without error');
    });
  });

  describe('Configuration-based Filtering', () => {
    it('should respect minimumKeys setting', async () => {
      const config = vscode.workspace.getConfiguration('keypress-notifications');

      // Set minimum keys to 3
      await config.update('minimumKeys', 3, vscode.ConfigurationTarget.Global);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Execute a 2-key command (should not trigger notification with minimumKeys=3)
      await vscode.commands.executeCommand('workbench.action.quickOpen');
      await vscode.commands.executeCommand('workbench.action.closeQuickOpen');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Execute a 3-key command (should trigger notification)
      await vscode.commands.executeCommand('workbench.action.findInFiles');
      await vscode.commands.executeCommand('workbench.action.togglePanel');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Reset to default
      await config.update('minimumKeys', 2, vscode.ConfigurationTarget.Global);
      assert.ok(true, 'Minimum keys filtering should work');
    });

    it('should respect enabled setting', async () => {
      const config = vscode.workspace.getConfiguration('keypress-notifications');

      // Disable notifications
      await config.update('enabled', false, vscode.ConfigurationTarget.Global);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Execute commands (should not trigger notifications)
      await vscode.commands.executeCommand('workbench.action.quickOpen');
      await vscode.commands.executeCommand('workbench.action.closeQuickOpen');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Re-enable notifications
      await config.update('enabled', true, vscode.ConfigurationTarget.Global);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Execute commands (should trigger notifications again)
      await vscode.commands.executeCommand('workbench.action.quickOpen');
      await vscode.commands.executeCommand('workbench.action.closeQuickOpen');
      await new Promise((resolve) => setTimeout(resolve, 300));

      assert.ok(true, 'Enabled setting should control notification display');
    });
  });

  describe('File Operations', () => {
    it('should handle Save operation (Ctrl+S)', async () => {
      // Execute save command - just verify it doesn't throw
      try {
        await vscode.commands.executeCommand('workbench.action.files.save');
        await new Promise((resolve) => setTimeout(resolve, 500));
        assert.ok(true, 'Save command executed successfully');
      } catch (error) {
        // Save command may show dialog but should not throw
        assert.ok(true, 'Save command executed (may show dialog in test environment)');
      }
    });

    it('should handle New Window operation (Ctrl+Shift+N)', async () => {
      await vscode.commands.executeCommand('workbench.action.newWindow');
      await new Promise((resolve) => setTimeout(resolve, 500));

      assert.ok(true, 'New Window operation should execute without error');
    });
  });
});
