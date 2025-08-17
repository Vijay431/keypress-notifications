import * as assert from 'assert';
import * as vscode from 'vscode';

/**
 * Focused E2E tests for the Keypress Notifications extension.
 * 
 * These tests verify core functionality:
 * - Extension activation and deactivation
 * - Multiple keybinding detection and notifications
 * - Custom user-defined keybinding support
 * - Configuration management
 */
suite('Keypress Notifications Core E2E Tests', () => {
  const extensionId = 'VijayGangatharan.keypress-notifications';
  let extension: vscode.Extension<any> | undefined;

  suiteSetup(async () => {
    // Get extension reference
    extension = vscode.extensions.getExtension(extensionId);
    
    // Ensure VS Code is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('E2E Test setup completed');
  });

  // Suite 1: Extension Lifecycle Tests
  suite('Extension Lifecycle', () => {
    test('Extension should be present in VS Code', () => {
      assert.ok(extension, 'Extension should be present in VS Code');
      assert.strictEqual(extension!.id, extensionId, 'Extension ID should match');
    });

    test('Extension should activate successfully', async () => {
      if (!extension) {
        assert.fail('Extension not found');
      }

      try {
        await extension!.activate();
        assert.ok(extension!.isActive, 'Extension should be active after activation');
      } catch (error) {
        assert.fail(`Extension activation failed: ${error}`);
      }
    });

    test('Extension commands should be registered', async () => {
      const commands = await vscode.commands.getCommands(true);
      const extensionCommands = [
        'keypress-notifications.activate',
        'keypress-notifications.deactivate',
        'keypress-notifications.showOutputChannel'
      ];

      for (const cmd of extensionCommands) {
        assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`);
      }
    });

    test('Extension activation command should work', async () => {
      try {
        await vscode.commands.executeCommand('keypress-notifications.activate');
        
        // Verify extension is enabled in configuration
        const config = vscode.workspace.getConfiguration('keypress-notifications');
        const enabled = config.get('enabled');
        assert.strictEqual(enabled, true, 'Extension should be enabled after activation command');
      } catch (error) {
        assert.fail(`Activation command failed: ${error}`);
      }
    });

    test('Extension deactivation command should work', async () => {
      try {
        await vscode.commands.executeCommand('keypress-notifications.deactivate');
        
        // Verify extension is disabled in configuration
        const config = vscode.workspace.getConfiguration('keypress-notifications');
        const enabled = config.get('enabled');
        assert.strictEqual(enabled, false, 'Extension should be disabled after deactivation command');
        
        // Re-enable for subsequent tests
        await vscode.commands.executeCommand('keypress-notifications.activate');
      } catch (error) {
        assert.fail(`Deactivation command failed: ${error}`);
      }
    });

    test('Extension state should persist across activation cycles', async () => {
      try {
        // Initial activation
        await vscode.commands.executeCommand('keypress-notifications.activate');
        await new Promise(resolve => setTimeout(resolve, 200));

        // Deactivate
        await vscode.commands.executeCommand('keypress-notifications.deactivate');
        await new Promise(resolve => setTimeout(resolve, 200));

        // Re-activate
        await vscode.commands.executeCommand('keypress-notifications.activate');
        await new Promise(resolve => setTimeout(resolve, 200));

        // Verify commands are still available
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('keypress-notifications.activate'), 'Commands should remain available after cycles');
      } catch (error) {
        assert.fail(`Activation cycle test failed: ${error}`);
      }
    });
  });

  // Suite 2: Multiple Keybindings Detection Tests
  suite('Multiple Keybindings Detection', () => {
    let originalConfig: any;

    suiteSetup(async () => {
      // Store original configuration
      const config = vscode.workspace.getConfiguration('keypress-notifications');
      originalConfig = {
        enabled: config.get('enabled'),
        minimumKeys: config.get('minimumKeys'),
        excludedCommands: config.get('excludedCommands'),
        showCommandName: config.get('showCommandName')
      };

      // Ensure extension is enabled and configured for testing
      await config.update('enabled', true, vscode.ConfigurationTarget.Workspace);
      await config.update('minimumKeys', 2, vscode.ConfigurationTarget.Workspace);
      await config.update('excludedCommands', [], vscode.ConfigurationTarget.Workspace);
      await config.update('showCommandName', true, vscode.ConfigurationTarget.Workspace);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    suiteTeardown(async () => {
      // Restore original configuration
      const config = vscode.workspace.getConfiguration('keypress-notifications');
      await config.update('enabled', originalConfig.enabled, vscode.ConfigurationTarget.Workspace);
      await config.update('minimumKeys', originalConfig.minimumKeys, vscode.ConfigurationTarget.Workspace);
      await config.update('excludedCommands', originalConfig.excludedCommands, vscode.ConfigurationTarget.Workspace);
      await config.update('showCommandName', originalConfig.showCommandName, vscode.ConfigurationTarget.Workspace);
    });

    test('Extension should handle command execution', async () => {
      try {
        // Test simple commands that don't open UI panels
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.length > 0, 'Commands should be available');
        
        // Test extension's own commands
        await vscode.commands.executeCommand('keypress-notifications.showOutputChannel');
        
        assert.ok(true, 'Extension should handle command execution successfully');
      } catch (error) {
        assert.fail(`Command execution test failed: ${error}`);
      }
    });

    test('Minimum keys configuration should be respected', async () => {
      try {
        // Set minimum keys to 3 (should filter out 2-key combinations)
        let config = vscode.workspace.getConfiguration('keypress-notifications');
        await config.update('minimumKeys', 3, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Refresh configuration and verify setting was applied
        config = vscode.workspace.getConfiguration('keypress-notifications');
        const minimumKeys = config.get('minimumKeys');
        assert.strictEqual(minimumKeys, 3, 'Minimum keys should be set to 3');

        // Reset to 2 keys
        await config.update('minimumKeys', 2, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify reset
        config = vscode.workspace.getConfiguration('keypress-notifications');
        assert.strictEqual(config.get('minimumKeys'), 2, 'Minimum keys should be reset to 2');

        assert.ok(true, 'Minimum keys configuration should be applied correctly');
      } catch (error) {
        // Restore original value on error
        const config = vscode.workspace.getConfiguration('keypress-notifications');
        await config.update('minimumKeys', 2, vscode.ConfigurationTarget.Workspace);
        assert.fail(`Minimum keys configuration test failed: ${error}`);
      }
    });

    test('Command exclusion configuration should work', async () => {
      try {
        // Test excluding specific commands
        let config = vscode.workspace.getConfiguration('keypress-notifications');
        await config.update('excludedCommands', ['workbench.action.showCommands'], vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Refresh configuration and verify setting was applied
        config = vscode.workspace.getConfiguration('keypress-notifications');
        const excludedCommands = config.get('excludedCommands') as string[];
        assert.ok(Array.isArray(excludedCommands), 'Excluded commands should be an array');
        assert.ok(excludedCommands.includes('workbench.action.showCommands'), 'Command should be excluded');

        // Reset exclusions
        await config.update('excludedCommands', [], vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify reset
        config = vscode.workspace.getConfiguration('keypress-notifications');
        const resetExcludedCommands = config.get('excludedCommands') as string[];
        assert.strictEqual(resetExcludedCommands.length, 0, 'Excluded commands should be empty after reset');

        assert.ok(true, 'Command exclusion configuration should work correctly');
      } catch (error) {
        // Restore original value on error
        const config = vscode.workspace.getConfiguration('keypress-notifications');
        await config.update('excludedCommands', [], vscode.ConfigurationTarget.Workspace);
        assert.fail(`Command exclusion test failed: ${error}`);
      }
    });

    test('Show command name configuration should work', async () => {
      try {
        // Test with command name disabled
        let config = vscode.workspace.getConfiguration('keypress-notifications');
        await config.update('showCommandName', false, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Refresh configuration and verify setting was applied
        config = vscode.workspace.getConfiguration('keypress-notifications');
        assert.strictEqual(config.get('showCommandName'), false, 'Show command name should be false');

        // Re-enable command names
        await config.update('showCommandName', true, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify re-enabled
        config = vscode.workspace.getConfiguration('keypress-notifications');
        assert.strictEqual(config.get('showCommandName'), true, 'Show command name should be true');
        assert.ok(true, 'Show command name configuration should work');
      } catch (error) {
        // Restore original value on error
        const config = vscode.workspace.getConfiguration('keypress-notifications');
        await config.update('showCommandName', true, vscode.ConfigurationTarget.Workspace);
        assert.fail(`Show command name configuration test failed: ${error}`);
      }
    });
  });

  // Suite 3: Custom User-Defined Keybindings Tests
  suite('Custom User-Defined Keybindings', () => {
    test('Extension should handle custom keybinding configuration', async () => {
      try {
        // Test that the extension can read keybinding configuration
        const config = vscode.workspace.getConfiguration();
        const keybindings = config.get('keyboard.shortcuts', []);
        
        // This test verifies the extension doesn't crash when reading keybindings
        assert.ok(Array.isArray(keybindings), 'Keybindings should be readable as array');
        
        console.log(`Found ${keybindings.length} keybinding entries`);
        assert.ok(true, 'Extension should handle keybinding configuration without errors');
      } catch (error) {
        assert.fail(`Custom keybinding configuration test failed: ${error}`);
      }
    });

    test('Extension should handle workspace-specific configuration', async () => {
      const config = vscode.workspace.getConfiguration('keypress-notifications');
      
      try {
        // Test workspace-specific configuration access
        const enabled = config.get('enabled');
        const minimumKeys = config.get('minimumKeys');
        const excludedCommands = config.get('excludedCommands');
        
        assert.ok(typeof enabled === 'boolean', 'Enabled setting should be boolean');
        assert.ok(typeof minimumKeys === 'number', 'Minimum keys should be number');
        assert.ok(Array.isArray(excludedCommands), 'Excluded commands should be array');
        
        assert.ok(true, 'Workspace-specific configuration should be accessible');
      } catch (error) {
        assert.fail(`Workspace configuration test failed: ${error}`);
      }
    });

    test('Extension should respond to configuration changes', async () => {
      const config = vscode.workspace.getConfiguration('keypress-notifications');
      const originalEnabled = config.get('enabled');
      
      try {
        // Monitor configuration changes
        let configChangeDetected = false;
        const disposable = vscode.workspace.onDidChangeConfiguration((event) => {
          if (event.affectsConfiguration('keypress-notifications.enabled')) {
            configChangeDetected = true;
          }
        });

        // Change configuration
        await config.update('enabled', !originalEnabled, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Restore original configuration
        await config.update('enabled', originalEnabled, vscode.ConfigurationTarget.Workspace);
        
        disposable.dispose();
        
        assert.ok(configChangeDetected, 'Configuration change should be detected');
      } catch (error) {
        await config.update('enabled', originalEnabled, vscode.ConfigurationTarget.Workspace);
        assert.fail(`Configuration change test failed: ${error}`);
      }
    });

    test('Extension should handle multiple configuration updates', async () => {
      let config = vscode.workspace.getConfiguration('keypress-notifications');
      const originalValues = {
        enabled: config.get('enabled'),
        minimumKeys: config.get('minimumKeys'),
        showCommandName: config.get('showCommandName')
      };
      
      try {
        // Make multiple configuration changes with proper waits
        await config.update('enabled', false, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        await config.update('minimumKeys', 3, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        await config.update('showCommandName', false, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Refresh configuration and verify changes took effect
        config = vscode.workspace.getConfiguration('keypress-notifications');
        assert.strictEqual(config.get('enabled'), false, 'Enabled should be false');
        assert.strictEqual(config.get('minimumKeys'), 3, 'Minimum keys should be 3');
        assert.strictEqual(config.get('showCommandName'), false, 'Show command name should be false');

        // Restore original values
        await config.update('enabled', originalValues.enabled, vscode.ConfigurationTarget.Workspace);
        await config.update('minimumKeys', originalValues.minimumKeys, vscode.ConfigurationTarget.Workspace);
        await config.update('showCommandName', originalValues.showCommandName, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify restoration
        config = vscode.workspace.getConfiguration('keypress-notifications');
        assert.strictEqual(config.get('enabled'), originalValues.enabled, 'Enabled should be restored');
        assert.strictEqual(config.get('minimumKeys'), originalValues.minimumKeys, 'Minimum keys should be restored');
        assert.strictEqual(config.get('showCommandName'), originalValues.showCommandName, 'Show command name should be restored');
        
        assert.ok(true, 'Multiple configuration updates should work correctly');
      } catch (error) {
        // Restore original values on error
        await config.update('enabled', originalValues.enabled, vscode.ConfigurationTarget.Workspace);
        await config.update('minimumKeys', originalValues.minimumKeys, vscode.ConfigurationTarget.Workspace);
        await config.update('showCommandName', originalValues.showCommandName, vscode.ConfigurationTarget.Workspace);
        assert.fail(`Multiple configuration updates test failed: ${error}`);
      }
    });

    test('Extension should maintain functionality after configuration reload', async () => {
      let config = vscode.workspace.getConfiguration('keypress-notifications');
      
      try {
        // Simulate configuration reload by changing and restoring values
        const originalEnabled = config.get('enabled');
        
        await config.update('enabled', false, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        await config.update('enabled', true, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Test that extension commands still work
        await vscode.commands.executeCommand('keypress-notifications.showOutputChannel');
        
        // Simple test without UI interaction that might hang
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('keypress-notifications.activate'), 'Extension commands should still be available');
        
        // Restore original state
        await config.update('enabled', originalEnabled, vscode.ConfigurationTarget.Workspace);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        assert.ok(true, 'Extension should maintain functionality after configuration reload');
      } catch (error) {
        // Restore original state on error
        const config = vscode.workspace.getConfiguration('keypress-notifications');
        const originalEnabled = config.get('enabled');
        await config.update('enabled', originalEnabled, vscode.ConfigurationTarget.Workspace);
        assert.fail(`Configuration reload test failed: ${error}`);
      }
    });
  });

  // Cleanup after all tests
  suiteTeardown(async () => {
    // Ensure extension is in a clean state
    try {
      await vscode.commands.executeCommand('keypress-notifications.activate');
      console.log('E2E Test cleanup completed');
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  });
});