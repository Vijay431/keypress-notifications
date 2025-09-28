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
  "keypress-notifications.minimumKeys": 2
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

## 🎨 Configuration Examples

### Default Setup

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2
}
```

### Quiet Mode

For fewer notifications:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 3
}
```

### All Keys Mode

For maximum feedback (can be noisy):

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 1
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

- `Keypress Notifications: Activate`
- `Keypress Notifications: Deactivate`

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
