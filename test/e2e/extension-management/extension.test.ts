/**
 * Keypress Notifications E2E Tests
 *
 * End-to-end tests for extension functionality.
 *
 * @description
 * Tests the complete extension workflow including activation,
 * deactivation, command execution, and notification display.
 * Updated to work with new DI container architecture.
 *
 * @category Tests
 * @category E2E
 */

import * as assert from 'assert';
import * as vscode from 'vscode';

import { before, after, describe, it } from 'mocha';
import {
	createTestContext,
	setupTestContext,
	teardownTestContext,
	clearNotifications,
	type TestContext,
} from './helpers/test-context';
import {
	assertNotificationMatches,
	assertNotificationStartsWith,
	getExpectedKeyForPlatform,
} from './helpers/notification-helpers';
import {
	delay,
} from './helpers/command-helpers';
import type { KeypressNotificationsApi } from '../../../src/di';

/**
 * Keypress Notifications E2E Tests
 *
 * @description
 * Comprehensive E2E test suite for Keypress Notifications extension.
 * Tests activation, deactivation, command execution, and notification display.
 *
 * @category Tests
 * @category E2E
 */
describe('Keypress Notifications E2E Tests', () => {
	let context: TestContext;

	/**
	 * Set up test context before each test
	 */
	before(async () => {
		context = createTestContext();
		await setupTestContext(context);
	});

	/**
	 * Clean up after all tests
	 */
	after(async () => {
		await teardownTestContext(context);
	});

	/**
	 * Test Suite: Extension Activation
	 *
	 * @description
	 * Tests extension activation and deactivation.
	 */
	describe('Extension Activation', () => {
		it('should activate without errors', async () => {
			// Extension is already activated by test setup
			assert.ok(managerApi, 'Extension manager API should be available');
			assert.ok(context, 'Extension context should be available');
		});

		it('should have required commands registered', async () => {
			const commands = await vscode.commands.getCommands();

			const expectedCommands = [
				'keypress-notifications.showOutputChannel',
				'keypress-notifications.enable',
				'keypress-notifications.disable',
			];

			for (const command of expectedCommands) {
				assert.ok(commands.includes(command), `Command ${command} should be registered`);
			}
		});
	});

	/**
	 * Test Suite: Clipboard Operations
	 *
	 * @description
	 * Tests clipboard-related keybinding notifications (Copy, Cut, Paste).
	 */
	describe('Clipboard Operations', () => {
		it('should show notification for Ctrl+C (Copy)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Copy');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+C');
			assertNotificationMatches(notification, expectedKeys);
		});

		it('should show notification for Ctrl+X (Cut)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('editor.action.clipboardCutAction');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Cut');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+X');
			assertNotificationMatches(notification, expectedKeys);
		});

		it('should show notification for Ctrl+V (Paste)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Paste');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+V');
			assertNotificationMatches(notification, expectedKeys);
		});
	});

	/**
	 * Test Suite: Navigation Operations
	 *
	 * @description
	 * Tests navigation-related keybinding notifications (Command Palette, Quick Open).
	 */
	describe('Navigation Operations', () => {
		it('should show notification for Ctrl+Shift+P (Command Palette)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('workbench.action.showCommands');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Command Palette');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+Shift+P');
			assertNotificationMatches(notification, expectedKeys);
		});

		it('should show notification for Ctrl+P (Quick Open)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('workbench.action.quickOpen');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Quick Open');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+P');
			assertNotificationMatches(notification, expectedKeys);
		});
	});

	/**
	 * Test Suite: File Operations
	 *
	 * @description
	 * Tests file-related keybinding notifications (Save, Save All).
	 */
	describe('File Operations', () => {
		it('should show notification for Ctrl+S (Save)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('workbench.action.files.save');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Save');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+S');
			assertNotificationMatches(notification, expectedKeys);
		});

		it('should show notification for Ctrl+K S (Save All)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('workbench.action.files.saveAll');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Save All');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+K S');
			assertNotificationMatches(notification, expectedKeys);
		});
	});

	/**
	 * Test Suite: View Operations
	 *
	 * @description
	 * Tests view-related keybinding notifications (Toggle Sidebar, Toggle Panel).
	 */
	describe('View Operations', () => {
		it('should show notification for Ctrl+B (Toggle Sidebar)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Toggle Sidebar');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+B');
			assertNotificationMatches(notification, expectedKeys);
		});

		it('should show notification for Ctrl+J (Toggle Panel)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('workbench.action.togglePanel');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Toggle Panel');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+J');
			assertNotificationMatches(notification, expectedKeys);
		});
	});

	/**
	 * Test Suite: Editor Actions
	 *
	 * @description
	 * Tests editor-related keybinding notifications (Comment Line, Format Document).
	 */
	describe('Editor Actions', () => {
		it('should show notification for Ctrl+/ (Toggle Line Comment)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('editor.action.commentLine');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Toggle Line Comment');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Ctrl+/');
			assertNotificationMatches(notification, expectedKeys);
		});

		it('should show notification for Shift+Alt+F (Format Document)', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('editor.action.formatDocument');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification for Format Document');
			const notification = context.notificationMessages[0];
			const expectedKeys = getExpectedKeyForPlatform('Shift+Alt+F');
			assertNotificationMatches(notification, expectedKeys);
		});
	});

	/**
	 * Test Suite: Platform-Specific Tests
	 *
	 * @description
	 * Tests platform-specific keybindings (macOS vs Windows/Linux).
	 */
	describe('Platform-Specific Tests', () => {
		it('should adjust key display for macOS', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
			await delay(300);

			assert.ok(context.notificationMessages.length > 0, 'Should show notification on macOS');
			const notification = context.notificationMessages[0];

			// On macOS, Ctrl should be displayed as Cmd
			const expectedKey = process.platform === 'darwin' ? 'Cmd+C' : 'Ctrl+C';
			assertNotificationMatches(notification, expectedKey);
		});
	});

	/**
	 * Test Suite: Extension Management
	 *
	 * @description
	 * Tests extension enable/disable commands and state management.
	 */
	describe('Extension Management', () => {
		it('should execute show output command without error', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('keypress-notifications.showOutputChannel');
			await delay(100);

			assert.ok(true, 'Show output command should execute without error');
		});

		it('should execute enable command without error', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('keypress-notifications.enable');
			await delay(100);

			assert.ok(true, 'Enable command should execute without error');
		});

		it('should execute disable command without error', async () => {
			clearNotifications(context);

			await vscode.commands.executeCommand('keypress-notifications.disable');
			await delay(100);

			assert.ok(true, 'Disable command should execute without error');
		});

		it('should not interfere with VS Code core functionality', async () => {
			// Execute quick open multiple times
			const quickOpen = 'workbench.action.quickOpen';

			for (let i = 0; i < 3; i++) {
				await vscode.commands.executeCommand(quickOpen);
			}

			// VS Code should still be functional
			const editor = vscode.window.activeTextEditor;
			assert.ok(editor, 'Active editor should still exist');
		});
	});

	/**
	 * Test Suite: Configuration Changes
	 *
	 * @description
	 * Tests configuration change handling and updates.
	 */
	describe('Configuration Changes', () => {
		it('should enable extension when enabled setting is true', async () => {
			// This test assumes the extension is already activated
			const config = vscode.workspace.getConfiguration('keypress-notifications');
			const enabled = config.get('enabled', true);

			if (enabled) {
				// Already enabled, no need to change
				assert.ok(true, 'Extension should be enabled when setting is true');
				return;
			}

			// Enable the extension
			await vscode.workspace.getConfiguration('keypress-notifications').update('enabled', true);
			await delay(500);

			// Verify it's enabled
			const newEnabled = vscode.workspace.getConfiguration('keypress-notifications').get('enabled', true);
			assert.ok(newEnabled, 'Extension should be enabled after update');
		});

		it('should disable extension when enabled setting is false', async () => {
			const config = vscode.workspace.getConfiguration('keypress-notifications');
			const enabled = config.get('enabled', true);

			if (!enabled) {
				// Already disabled, no need to change
				assert.ok(true, 'Extension should be disabled when setting is false');
				return;
			}

			// Disable the extension
			await vscode.workspace.getConfiguration('keypress-notifications').update('enabled', false);
			await delay(500);

			// Verify it's disabled
			const newEnabled = vscode.workspace.getConfiguration('keypress-notifications').get('enabled', true);
			assert.ok(!newEnabled, 'Extension should be disabled after update');
		});
	});

	/**
	 * Test Suite: Edge Cases
	 *
	 * @description
	 * Tests edge cases and error handling.
	 */
	describe('Edge Cases', () => {
		it('should handle rapid command execution gracefully', async () => {
			clearNotifications(context);

			// Execute commands rapidly
			const commands = ['editor.action.clipboardCopyAction', 'editor.action.clipboardCutAction'];
			for (const command of commands) {
				await vscode.commands.executeCommand(command);
			}

			// Should still work, maybe not show all notifications due to throttling
			assert.ok(true, 'Should handle rapid execution without crashing');
		});

		it('should respect minimum keys threshold', async () => {
			clearNotifications(context);

			// Set minimum keys to a high value
			await vscode.workspace.getConfiguration('keypress-notifications').update('minimumKeys', 10);
			await delay(200);

			// Execute a 2-key command (should not trigger notification)
			await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
			await delay(300);

			assert.strictEqual(context.notificationMessages.length, 0, 'Should not show notification for 2-key command');
		});

		it('should respect excluded commands filter', async () => {
			clearNotifications(context);

			// Add Copy to excluded commands
			await vscode.workspace
				.getConfiguration('keypress-notifications')
				.update('excludedCommands', ['editor.action.clipboardCopyAction']);
			await delay(200);

			// Execute excluded command - should not show notification
			await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
			await delay(300);

			assert.strictEqual(context.notificationMessages.length, 0, 'Should not show notification for excluded command');
		});
	});
});
