# Mock Workspace for Keypress Notifications Extension

This workspace contains sample files for manual testing of the Keypress Notifications extension.

## How to Test

1. Run the manual testing command: `npm run test:manual`
2. VS Code will open in Extension Development Host mode with this workspace
3. Try the following operations to test the extension:

### Copy Operations (Ctrl+C)
- Select text in any file and press Ctrl+C
- You should see a notification: "Copy (Ctrl+C) detected"

### Cut Operations (Ctrl+X)
- Select text in any file and press Ctrl+X
- You should see a notification: "Cut (Ctrl+X) detected"
- The selected text should be removed

### Paste Operations (Ctrl+V)
- Position cursor anywhere and press Ctrl+V
- You should see a notification: "Paste (Ctrl+V) detected"
- Previously copied/cut content should be inserted

## Test Files

- `sample.js` - JavaScript code for testing
- `sample.ts` - TypeScript code for testing
- `sample.json` - JSON configuration file
- `sample.md` - Markdown documentation
- `sample.txt` - Plain text file

## Extension Commands

Test these commands from the Command Palette (Ctrl+Shift+P):

- `Keypress Notifications: Activate`
- `Keypress Notifications: Deactivate` 
- `Keypress Notifications: Show Output Channel`

## Configuration Testing

Open VS Code settings and search for "keypress" to test:
- Enable/disable the extension
- Change log levels
- Verify context menu integration