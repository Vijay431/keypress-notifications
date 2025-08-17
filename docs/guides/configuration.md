# ⚙️ Configuration Guide

## 🎯 Overview

**Keypress Notifications** is highly configurable to fit your workflow perfectly! This guide covers all available settings and how to customize them.

---

## 🔧 Quick Configuration

### Opening Settings

There are several ways to access VS Code settings:

1. **Settings UI** (Recommended for beginners):
   - Press `Ctrl+,` (or `Cmd+,` on macOS)
   - Search for "keypress-notifications"

2. **Settings JSON** (For advanced users):
   - Press `Ctrl+Shift+P` → "Preferences: Open Settings (JSON)"
   - Add configuration manually

3. **Workspace Settings**:
   - `.vscode/settings.json` in your project folder
   - Only affects current workspace

---

## 📋 All Configuration Options

### ✅ `keypress-notifications.enabled`

**Description**: Master switch to enable/disable all notifications  
**Type**: `boolean`  
**Default**: `true`  
**Scope**: User, Workspace

```json
{
  "keypress-notifications.enabled": true
}
```

**Examples**:
- `true` - Extension active, notifications will appear
- `false` - Extension disabled, no notifications

**Use Cases**:
- Temporarily disable during screen recording
- Turn off during presentations
- Disable in specific workspaces

---

### 📊 `keypress-notifications.logLevel`

**Description**: Controls logging verbosity for debugging  
**Type**: `string`  
**Default**: `"info"`  
**Options**: `"error"`, `"warn"`, `"info"`, `"debug"`  
**Scope**: User, Workspace

```json
{
  "keypress-notifications.logLevel": "info"
}
```

**Log Levels Explained**:
- `"error"` - Only critical errors (minimal logging)
- `"warn"` - Errors and warnings  
- `"info"` - Normal operation info (recommended)
- `"debug"` - Verbose debugging info (performance impact)

**When to Change**:
- Set to `"error"` for better performance
- Set to `"debug"` when troubleshooting issues
- Use `"info"` for normal usage

---

### 🔢 `keypress-notifications.minimumKeys`

**Description**: Minimum number of keys required to show notification  
**Type**: `number`  
**Default**: `2`  
**Range**: `1` to `5`  
**Scope**: User, Workspace

```json
{
  "keypress-notifications.minimumKeys": 2
}
```

**Examples**:
- `1` - Show for single keys (like `F1`, `Escape`)
- `2` - Show for combinations like `Ctrl+C`, `Ctrl+V` (default)
- `3` - Only show for complex combinations like `Ctrl+Shift+P`

**Performance Impact**: 
- Lower values = more notifications = slight performance impact
- Higher values = fewer notifications = better performance

---

### 📝 `keypress-notifications.showCommandName`

**Description**: Include command name in notification text  
**Type**: `boolean`  
**Default**: `true`  
**Scope**: User, Workspace

```json
{
  "keypress-notifications.showCommandName": true
}
```

**Notification Examples**:
- `true`: "Copy detected! (editor.action.clipboardCopyAction) 📄✨"
- `false`: "Copy detected! 📄✨"

**Benefits**:
- `true` - More informative, great for learning command names
- `false` - Cleaner notifications, less visual clutter

---

### 🚫 `keypress-notifications.excludedCommands`

**Description**: Array of command IDs to exclude from notifications  
**Type**: `array` of `string`  
**Default**: `["editor.action.triggerSuggest", "editor.action.triggerParameterHints", "workbench.action.quickOpenNavigateNext"]`  
**Scope**: User, Workspace

```json
{
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "editor.action.triggerParameterHints",
    "workbench.action.quickOpenNavigateNext"
  ]
}
```

**Common Commands to Exclude**:
```json
{
  "keypress-notifications.excludedCommands": [
    // Autocomplete & IntelliSense
    "editor.action.triggerSuggest",
    "editor.action.triggerParameterHints",
    
    // Navigation
    "workbench.action.quickOpenNavigateNext",
    "workbench.action.quickOpenNavigatePrevious",
    
    // Frequent actions
    "editor.action.moveLinesDownAction",
    "editor.action.moveLinesUpAction",
    
    // Cursor movement
    "cursorDown", 
    "cursorUp",
    "cursorLeft",
    "cursorRight"
  ]
}
```

**Wildcard Support**: 
```json
{
  "keypress-notifications.excludedCommands": [
    "editor.action.*",  // Exclude all editor actions
    "workbench.*",      // Exclude all workbench commands
    "*.suggest*"        // Exclude anything with 'suggest' in name
  ]
}
```

---

## 🎨 Configuration Examples

### 🔰 Beginner Configuration
Perfect for learning VS Code keybindings:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.logLevel": "info",
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "editor.action.triggerParameterHints"
  ]
}
```

### 🚀 Power User Configuration
Optimized for performance and reduced noise:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.logLevel": "error",
  "keypress-notifications.minimumKeys": 3,
  "keypress-notifications.showCommandName": false,
  "keypress-notifications.excludedCommands": [
    "editor.action.*",
    "workbench.action.quickOpen*",
    "cursorDown",
    "cursorUp",
    "cursorLeft",
    "cursorRight",
    "*.suggest*",
    "*trigger*"
  ]
}
```

### 🎬 Presentation Mode
Minimal notifications during demos:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.logLevel": "error",
  "keypress-notifications.minimumKeys": 4,
  "keypress-notifications.showCommandName": false,
  "keypress-notifications.excludedCommands": [
    "*"
  ]
}
```

### 🧑‍💻 Developer Configuration
Balanced for coding workflows:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.logLevel": "warn",
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "editor.action.triggerParameterHints",
    "workbench.action.quickOpenNavigateNext",
    "workbench.action.quickOpenNavigatePrevious",
    "cursorDown",
    "cursorUp"
  ]
}
```

---

## 🌍 Workspace-Specific Configuration

### Project-Level Settings

Create `.vscode/settings.json` in your project:

```json
{
  "keypress-notifications.enabled": false,
  "keypress-notifications.excludedCommands": [
    "git.commitAndPush",
    "git.commitStaged"
  ]
}
```

### Language-Specific Configuration

Configure for specific file types:

```json
{
  "[typescript]": {
    "keypress-notifications.minimumKeys": 3
  },
  "[markdown]": {
    "keypress-notifications.enabled": false
  },
  "[json]": {
    "keypress-notifications.showCommandName": false
  }
}
```

---

## 🔍 Command ID Discovery

### How to Find Command IDs

1. **Command Palette Method**:
   - Press `Ctrl+Shift+P`
   - Run "Developer: Reload Window"
   - Open Developer Console (`Help` → `Toggle Developer Tools`)
   - Watch console while executing commands

2. **Keybinding UI**:
   - Press `Ctrl+K Ctrl+S` (Keyboard Shortcuts)
   - Search for the action you want
   - The "Command" column shows the ID

3. **Extension Output**:
   - Open Output panel (`Ctrl+Shift+U`)
   - Select "Keypress Notifications"
   - Enable debug logging to see command IDs

### Common Command Categories

| Category | Example Commands | Pattern |
|---|---|---|
| **Editor Actions** | Copy, Cut, Paste | `editor.action.*` |
| **Workbench** | Open files, panels | `workbench.*` |
| **Git** | Commit, push, pull | `git.*` |
| **Search** | Find, replace | `search.*` |
| **Navigation** | Go to file, symbol | `workbench.action.quick*` |

---

## 🎛️ Advanced Configuration

### Multi-Root Workspace Configuration

For multi-root workspaces, configure per folder:

```json
{
  "folders": [
    {
      "name": "Frontend",
      "path": "./frontend"
    },
    {
      "name": "Backend", 
      "path": "./backend"
    }
  ],
  "settings": {
    "keypress-notifications.minimumKeys": 2
  }
}
```

### User vs Workspace Settings Priority

1. **Workspace settings** (highest priority)
2. **Folder settings** (multi-root workspaces)  
3. **User settings** (global defaults)
4. **Default settings** (lowest priority)

### Settings Sync

To sync settings across devices:
1. Enable VS Code Settings Sync
2. User settings will sync automatically
3. Workspace settings remain local

---

## 🔧 Troubleshooting Configuration

### Settings Not Taking Effect

1. **Reload Window**: `Ctrl+Shift+P` → "Developer: Reload Window"
2. **Check Scope**: Ensure setting is in correct scope (User vs Workspace)
3. **Validate JSON**: Check for syntax errors in settings.json
4. **Reset to Defaults**: Remove custom settings to test

### Performance Issues

1. **Reduce Log Level**: Set to `"error"`
2. **Increase Minimum Keys**: Set to `3` or higher
3. **Add Exclusions**: Exclude frequently triggered commands
4. **Disable Temporarily**: Set `enabled` to `false`

### Finding the Right Balance

**Too Many Notifications?**
- Increase `minimumKeys`
- Add more commands to `excludedCommands`
- Set `showCommandName` to `false`

**Too Few Notifications?**
- Decrease `minimumKeys`
- Remove items from `excludedCommands`
- Check that `enabled` is `true`

---

## 📚 Configuration Schema

The complete JSON schema for validation:

```json
{
  "keypress-notifications.enabled": {
    "type": "boolean",
    "default": true,
    "description": "Enable or disable keypress notifications"
  },
  "keypress-notifications.logLevel": {
    "type": "string",
    "enum": ["error", "warn", "info", "debug"],
    "default": "info",
    "description": "Set the logging level for the extension"
  },
  "keypress-notifications.minimumKeys": {
    "type": "number",
    "default": 2,
    "minimum": 1,
    "maximum": 5,
    "description": "Minimum number of keys in combination to show notification"
  },
  "keypress-notifications.showCommandName": {
    "type": "boolean", 
    "default": true,
    "description": "Show the command name along with the key combination"
  },
  "keypress-notifications.excludedCommands": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "default": [
      "editor.action.triggerSuggest",
      "editor.action.triggerParameterHints",
      "workbench.action.quickOpenNavigateNext"
    ],
    "description": "List of command IDs to exclude from notifications"
  }
}
```

---

## 🚀 Next Steps

- 🎯 **Test Your Configuration**: Try different keybindings to see the results
- 📖 **Read Developer Guide**: Learn about extending the extension
- 🎨 **Customize Further**: Explore VS Code's notification settings
- 💬 **Share Your Setup**: Contribute your configuration to the community!

**Need Help?** Check our [Troubleshooting Guide](./troubleshooting.md) or [open an issue](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension/issues)!