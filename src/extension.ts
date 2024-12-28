import * as vscode from 'vscode';

let cutCommand: vscode.Disposable;
let copyCommand: vscode.Disposable;
let pasteCommand: vscode.Disposable;
let activateCommand: vscode.Disposable;
let deactivateCommand: vscode.Disposable;

export function activate(context: vscode.ExtensionContext) {
	// Register commands for activation/deactivation
	activateCommand = vscode.commands.registerCommand('keypress-notifications.activate', () => {
		vscode.window.showInformationMessage('Keypress Notifications Activated');
	});

	deactivateCommand = vscode.commands.registerCommand('keypress-notifications.deactivate', () => {
		vscode.window.showInformationMessage('Keypress Notifications Deactivated');
		// Dispose all commands when deactivate is called
		disposeAllCommands();
	});

	// Add commands to subscriptions
	context.subscriptions.push(activateCommand, deactivateCommand);

	cutCommand = vscode.commands.registerCommand('editor.action.clipboardCutAction', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const text = editor.document.getText(selection);
			if (text) {
				await vscode.env.clipboard.writeText(text);
				await editor.edit((editBuilder) => {
					editBuilder.delete(selection);
				});
				vscode.window.showInformationMessage('Cut (Ctrl+X) detected');
			}
		}
	});

	copyCommand = vscode.commands.registerCommand('editor.action.clipboardCopyAction', async () => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			// Get the selected text
			const selection = editor.selection;
			const text = editor.document.getText(selection);
			if (text) {
				// Copy to clipboard
				await vscode.env.clipboard.writeText(text);
				vscode.window.showInformationMessage('Copy (Ctrl+C) detected');
			}
		}
	});

	pasteCommand = vscode.commands.registerCommand('editor.action.clipboardPasteAction', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const text = await vscode.env.clipboard.readText();
			await editor.edit((editBuilder) => {
				editBuilder.replace(editor.selection, text);
			});
			vscode.window.showInformationMessage('Paste (Ctrl+V) detected');
		}
	});

	// Listen for specific keyboard shortcuts
	context.subscriptions.push(copyCommand, pasteCommand, cutCommand);
}

export function deactivate() {
	disposeAllCommands();
}

// Add a helper function to dispose all commands
function disposeAllCommands() {
	if (cutCommand) {
		cutCommand.dispose();
	}
	if (copyCommand) {
		copyCommand.dispose();
	}
	if (pasteCommand) {
		pasteCommand.dispose();
	}
	if (activateCommand) {
		activateCommand.dispose();
	}
	if (deactivateCommand) {
		deactivateCommand.dispose();
	}
}
