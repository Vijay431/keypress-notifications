---
layout: default
title: Configuration Guide
parent: Guides
nav_order: 2
description: 'Complete configuration options for Keypress Notifications'
---

# ⚙️ Configuration Guide

Customize Keypress Notifications to fit your workflow perfectly.

{: .fs-6 .fw-300 }

---

## 🎯 Quick Configuration

### Access Settings

Configure the extension through VS Code settings:

1. **Open Settings** (`Ctrl+,` / `Cmd+,`)
2. **Search** for "keypress notifications"
3. **Modify** settings as needed

Or edit `settings.json` directly:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.excludedCommands": [],
  "keypress-notifications.showCommandName": false
}
```

---

## 📋 Complete Settings Reference

### `keypress-notifications.enabled`

**Type**: `boolean`
**Default**: `true`
**Description**: Enable or disable the extension entirely.

```json
{
  "keypress-notifications.enabled": true
}
```

**Use cases**:

- Quickly disable all notifications
- Temporarily pause during presentations
- Disable for specific workspaces

### `keypress-notifications.minimumKeys`

**Type**: `number`
**Default**: `2`
**Range**: `1-5`
**Description**: Minimum number of keys required to trigger a notification.

```json
{
  "keypress-notifications.minimumKeys": 2
}
```

**Examples**:

- `1`: Shows notifications for single keys (very noisy)
- `2`: Shows Ctrl+C, Ctrl+V (recommended)
- `3`: Shows Ctrl+Shift+P, Ctrl+K S (quieter)
- `4+`: Only complex multi-key combinations

### `keypress-notifications.excludedCommands`

**Type**: `array`
**Default**: `[]`
**Description**: List of command IDs to exclude from showing notifications.

```json
{
  "keypress-notifications.excludedCommands": [
    "editor.action.clipboardCopyAction",
    "editor.action.clipboardPasteAction"
  ]
}
```

**Use cases**:
- Exclude specific commands you don't want notifications for
- Reduce notification noise for frequently used commands
- Customize which commands trigger notifications

### `keypress-notifications.showCommandName`

**Type**: `boolean`
**Default**: `false`
**Description**: Whether to show the actual VS Code command name in notifications.

```json
{
  "keypress-notifications.showCommandName": true
}
```

**Use cases**:
- Debug which command is being executed
- Learn VS Code command IDs
- Verify correct command detection

## 🎨 Configuration Examples

### Default Setup

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.excludedCommands": [],
  "keypress-notifications.showCommandName": false
}
```

### Quiet Mode

For fewer notifications:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 3,
  "keypress-notifications.excludedCommands": [
    "editor.action.clipboardCopyAction",
    "editor.action.clipboardPasteAction"
  ]
}
```

### Learning Mode

Show command names to learn VS Code:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true
}
```

### Disabled

```json
{
  "keypress-notifications.enabled": false
}
```

---

## 🏢 Workspace Configuration

### Per-Workspace Settings

Configure different settings for different projects:

**`.vscode/settings.json`** (in your project root):

```json
{
  "keypress-notifications.minimumKeys": 3
}
```

### Team Configuration

Share configuration with your team by committing workspace settings:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2
}
```

---

## 🎛️ Runtime Configuration

Control the extension during runtime using the Command Palette (`Ctrl+Shift+P`):

- `Keypress Notifications: Enable` - Enable the extension
- `Keypress Notifications: Disable` - Disable the extension
- `Keypress Notifications: Show Status` - Show current status

---

## 🛠️ Troubleshooting Configuration

### Settings Not Taking Effect

1. **Reload VS Code** window (`Ctrl+Shift+P` → "Reload Window")
2. **Check for syntax errors** in `settings.json`
3. **Verify setting names** are spelled correctly

### Reset to Defaults

To reset all settings to defaults:

1. **Open Settings** (`Ctrl+,`)
2. **Search** "keypress notifications"
3. **Click gear** next to each setting
4. **Select** "Reset Setting"

---

_Need help with configuration? [Open an issue](https://github.com/Vijay431/keypress-notifications/issues)!_
