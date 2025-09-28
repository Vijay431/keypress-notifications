---
layout: default
title: Configuration Guide
parent: Guides
nav_order: 2
description: "Complete configuration options for Keypress Notifications"
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
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "info",
  "keypress-notifications.excludedCommands": []
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

### `keypress-notifications.showCommandName`

**Type**: `boolean`
**Default**: `true`
**Description**: Include the command name in notifications.

```json
{
  "keypress-notifications.showCommandName": true
}
```

**When enabled**: "Copy detected! 📄✨"
**When disabled**: "Keybinding detected! ⌨️"

### `keypress-notifications.logLevel`

**Type**: `string`
**Default**: `"info"`
**Options**: `"error"`, `"warn"`, `"info"`, `"debug"`
**Description**: Control logging verbosity in the output channel.

```json
{
  "keypress-notifications.logLevel": "info"
}
```

**Levels**:
- `error`: Only errors and critical issues
- `warn`: Warnings and errors
- `info`: General information, warnings, and errors
- `debug`: Detailed debugging information

### `keypress-notifications.excludedCommands`

**Type**: `array`
**Default**: `[]`
**Description**: List of commands to exclude from notifications.

```json
{
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "workbench.action.quickOpenNavigateNext"
  ]
}
```

**Common exclusions**:
- `editor.action.triggerSuggest`: IntelliSense popup
- `workbench.action.quickOpenNavigateNext`: Quick Open navigation
- `editor.action.wordHighlight.trigger`: Word highlighting

---

## 🎨 Configuration Examples

### Minimal Setup (Quiet)

For users who want minimal notifications:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 3,
  "keypress-notifications.showCommandName": false,
  "keypress-notifications.logLevel": "warn",
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "workbench.action.quickOpenNavigateNext",
    "editor.action.clipboardCopyAction"
  ]
}
```

### Power User Setup (Detailed)

For users who want comprehensive feedback:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 1,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "debug",
  "keypress-notifications.excludedCommands": []
}
```

### Learning Mode (Educational)

Perfect for learning VS Code shortcuts:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "info",
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest"
  ]
}
```

### Presentation Mode

For demos and presentations:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "error",
  "keypress-notifications.excludedCommands": [
    "workbench.action.quickOpen",
    "editor.action.triggerSuggest",
    "workbench.action.files.save"
  ]
}
```

---

## 🏢 Workspace Configuration

### Per-Workspace Settings

Configure different settings for different projects:

**`.vscode/settings.json`** (in your project root):

```json
{
  "keypress-notifications.minimumKeys": 3,
  "keypress-notifications.excludedCommands": [
    "editor.action.formatDocument"
  ]
}
```

### Team Configuration

Share configuration with your team by committing workspace settings:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "warn"
}
```

### Environment-Specific Settings

Different settings for different environments:

**Development**:
```json
{
  "keypress-notifications.logLevel": "debug",
  "keypress-notifications.minimumKeys": 1
}
```

**Production**:
```json
{
  "keypress-notifications.logLevel": "error",
  "keypress-notifications.minimumKeys": 3
}
```

---

## 🔧 Advanced Configuration

### Command Filtering

#### Exclude Noisy Commands

Common commands that generate too many notifications:

```json
{
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "editor.action.triggerParameterHints",
    "workbench.action.quickOpenNavigateNext",
    "workbench.action.quickOpenNavigatePrevious",
    "editor.action.wordHighlight.trigger",
    "editor.action.wordHighlight.next",
    "editor.action.wordHighlight.prev"
  ]
}
```

#### Include Only Specific Commands

To monitor only specific commands, exclude most and enable few:

```json
{
  "keypress-notifications.excludedCommands": [
    "editor.action.*",
    "workbench.action.*"
  ]
}
```

**Note**: Wildcard patterns are not currently supported. List commands explicitly.

### Logging Configuration

#### Development Debugging

For extension development and troubleshooting:

```json
{
  "keypress-notifications.logLevel": "debug"
}
```

Then view logs:
1. **Open Command Palette** (`Ctrl+Shift+P`)
2. **Run**: `Keypress Notifications: Show Output Channel`
3. **Monitor** detailed execution logs

#### Production Monitoring

For production environments:

```json
{
  "keypress-notifications.logLevel": "error"
}
```

Only critical issues will be logged.

---

## 🎛️ Runtime Configuration

### Dynamic Enable/Disable

Control the extension during runtime:

**Command Palette** (`Ctrl+Shift+P`):
- `🟢 Keypress Notifications: Activate`
- `🔴 Keypress Notifications: Deactivate`

### Quick Settings Toggle

Create custom keybindings for quick toggles:

**`keybindings.json`**:
```json
[
  {
    "key": "ctrl+k ctrl+n",
    "command": "keypress-notifications.activate"
  },
  {
    "key": "ctrl+k ctrl+d",
    "command": "keypress-notifications.deactivate"
  }
]
```

---

## 📊 Configuration Profiles

### Profile 1: First-Time User

New to VS Code, wants to learn shortcuts:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "info",
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest"
  ]
}
```

### Profile 2: Experienced Developer

Knows shortcuts, wants confirmation for complex ones:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 3,
  "keypress-notifications.showCommandName": false,
  "keypress-notifications.logLevel": "warn",
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "workbench.action.quickOpenNavigateNext",
    "editor.action.clipboardCopyAction"
  ]
}
```

### Profile 3: Accessibility User

Needs visual confirmation for all actions:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 1,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "info",
  "keypress-notifications.excludedCommands": []
}
```

### Profile 4: Presenter/Teacher

Clear feedback for demonstrations:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "error",
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "workbench.action.quickOpen"
  ]
}
```

---

## 🔄 Configuration Migration

### From Previous Versions

If upgrading from an older version, your settings will be automatically migrated. No action required.

### Backup and Restore

**Backup current settings**:
```bash
code --list-extensions --show-versions > extensions.txt
cp ~/.config/Code/User/settings.json settings-backup.json
```

**Restore settings**:
```bash
cp settings-backup.json ~/.config/Code/User/settings.json
```

---

## 🛠️ Troubleshooting Configuration

### Settings Not Taking Effect

1. **Reload VS Code** window (`Ctrl+Shift+P` → "Reload Window")
2. **Check for syntax errors** in `settings.json`
3. **Verify setting names** are spelled correctly
4. **Check workspace vs user settings** precedence

### Invalid Configuration Values

The extension validates configuration and falls back to defaults for invalid values:

- **`minimumKeys`**: Must be 1-5, defaults to 2
- **`logLevel`**: Must be valid level, defaults to "info"
- **`excludedCommands`**: Must be array, defaults to []

### Reset to Defaults

To reset all settings to defaults:

1. **Open Settings** (`Ctrl+,`)
2. **Search** "keypress notifications"
3. **Click gear** next to each setting
4. **Select** "Reset Setting"

---

## 📋 Configuration Checklist

- [ ] ✅ Extension enabled/disabled as desired
- [ ] ✅ Minimum keys set appropriately for your workflow
- [ ] ✅ Command names shown/hidden per preference
- [ ] ✅ Log level appropriate for your needs
- [ ] ✅ Excluded commands list customized
- [ ] ✅ Settings work as expected after reload
- [ ] ✅ Workspace-specific settings configured if needed

---

## 🚀 Next Steps

After configuring the extension:

1. **🎯 [Try Basic Examples](../examples/basic-usage)** - Test your configuration
2. **⚡ [Explore Advanced Features](../examples/advanced-configuration)** - Power user tips
3. **🔧 [Troubleshooting Guide](troubleshooting)** - Fix any issues

---

<div align="center">

**Configuration complete!** 🎊

[🎯 See Examples](../examples/basic-usage){: .btn .btn-primary } [🔧 Troubleshoot](troubleshooting){: .btn .btn-outline }

</div>