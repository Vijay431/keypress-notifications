# Keypress Notifications v2.0.0 Migration Guide

## Overview

This guide helps you migrate from Keypress Notifications v1.x to v2.0.0.

**Important**: v2.0.0 contains breaking changes. Your configuration will be automatically migrated on first launch, but we recommend backing up your settings.

## What's Changed

### Breaking Changes

1. **Configuration Format**
   - New `notificationOptions` object with additional settings
   - New `accessibility` object for accessibility features
   - Legacy configuration structure is no longer supported

2. **API Changes**
   - Complete rewrite of public API
   - New events for statistics, history, and lifecycle
   - Old API methods are deprecated

3. **Data Storage**
   - Statistics and history now stored in VS Code globalState
   - New storage format for better performance

4. **Command Changes**
   - New commands added (see README)
   - Some commands renamed for consistency

### New Features

- 📊 Statistics dashboard with usage tracking
- 🎛️ Configuration presets (Learning, Quiet, Presentation, Developer)
- 💡 Intelligent configuration suggestions
- 📝 Notification history with search and export
- ⏸️ Pause/Resume functionality
- 🎨 Enhanced notifications with icons and grouping
- ⌨️ Keyboard shortcuts
- ♿ Accessibility features
- 🌍 Internationalization support
- 🎓 Interactive onboarding

## Automatic Migration

On first launch of v2.0.0, you'll see:

```
⚠️ Keypress Notifications v2.0 detected

Your v1.x configuration will be automatically migrated.

Backup saved to: ~/.vscode/keypress-backup-YYYY-MM-DD-HHMMSS.json

[Continue Migration] [View Changes] [Keep Old Config]
```

### Migration Process

1. **Backup**: Your current configuration is backed up
2. **Validate**: Configuration is validated against v2.0.0 schema
3. **Migrate**: Settings are transformed to new format
4. **Verify**: Migrated configuration is verified
5. **Apply**: New configuration is applied

## Manual Migration

If automatic migration fails or you prefer manual migration:

### Step 1: Backup Current Configuration

```bash
# Export current VS Code settings
code --list-extensions | grep keypress
# Or manually backup ~/.vscode/settings.json
```

### Step 2: Update Configuration

**v1.x Configuration**:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.excludedCommands": [],
  "keypress-notifications.showCommandName": false,
  "keypress-notifications.logLevel": "info"
}
```

**v2.0.0 Configuration**:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.excludedCommands": [],
  "keypress-notifications.showCommandName": false,
  "keypress-notifications.logLevel": "info",
  "keypress-notifications.notificationOptions": {
    "duration": 3000,
    "position": "bottomRight",
    "showIcon": true,
    "showTimestamp": false,
    "grouping": false,
    "sound": "none"
  },
  "keypress-notifications.accessibility": {
    "announceToScreenReader": true,
    "reduceMotion": false,
    "highContrastMode": false,
    "keyboardDismiss": true
  }
}
```

### Step 3: Apply New Configuration

Open VS Code Settings (`Ctrl+,`) and search for "keypress notifications". Update your settings manually.

## New Settings

### Notification Options

| Setting                             | Type    | Default       | Description                                                        |
| ----------------------------------- | ------- | ------------- | ------------------------------------------------------------------ |
| `notificationOptions.duration`      | number  | 3000          | Notification duration in milliseconds                              |
| `notificationOptions.position`      | string  | "bottomRight" | Notification position (bottomRight, bottomLeft, topRight, topLeft) |
| `notificationOptions.showIcon`      | boolean | true          | Show category icons in notifications                               |
| `notificationOptions.showTimestamp` | boolean | false         | Show timestamp in notifications                                    |
| `notificationOptions.grouping`      | boolean | false         | Group rapid successive notifications                               |
| `notificationOptions.sound`         | string  | "none"        | Sound feedback (none, default, subtle)                             |

### Accessibility Options

| Setting                                | Type    | Default | Description                                    |
| -------------------------------------- | ------- | ------- | ---------------------------------------------- |
| `accessibility.announceToScreenReader` | boolean | true    | Announce notifications to screen readers       |
| `accessibility.reduceMotion`           | boolean | false   | Reduce animation motion                        |
| `accessibility.highContrastMode`       | boolean | false   | Use high contrast colors                       |
| `accessibility.keyboardDismiss`        | boolean | true    | Allow dismissing notifications with Escape key |

## New Commands

### Keyboard Shortcuts

| Action               | Shortcut                        | Description                  |
| -------------------- | ------------------------------- | ---------------------------- |
| Toggle Extension     | `Ctrl+Alt+K` (Mac: `Cmd+Alt+K`) | Enable/disable extension     |
| Show Status          | `Ctrl+Alt+Shift+K`              | Show extension status        |
| Dismiss Notification | `Escape`                        | Dismiss current notification |

### Configuration Commands

| Command                                   | Description                       |
| ----------------------------------------- | --------------------------------- |
| `keypress-notifications.applyPreset`      | Apply a configuration preset      |
| `keypress-notifications.showSuggestions`  | Show intelligent suggestions      |
| `keypress-notifications.showStatistics`   | Open statistics dashboard         |
| `keypress-notifications.exportStatistics` | Export statistics to file         |
| `keypress-notifications.showHistory`      | Open notification history panel   |
| `keypress-notifications.exportHistory`    | Export history to file            |
| `keypress-notifications.pause5min`        | Pause notifications for 5 minutes |
| `keypress-notifications.pause1hour`       | Pause notifications for 1 hour    |
| `keypress-notifications.pauseUntilReload` | Pause until VS Code reload        |
| `keypress-notifications.resume`           | Resume paused notifications       |

## Configuration Presets

### Learning Mode

Perfect for beginners learning VS Code keybindings:

```json
{
  "keypress-notifications.minimumKeys": 1,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.notificationDuration": 5000
}
```

### Quiet Mode

Minimal notifications for power users:

```json
{
  "keypress-notifications.minimumKeys": 3,
  "keypress-notifications.excludedCommands": [
    "editor.action.clipboardCopyAction",
    "editor.action.clipboardPasteAction",
    "editor.action.clipboardCutAction"
  ],
  "keypress-notifications.notificationDuration": 2000
}
```

### Presentation Mode

Optimized for teaching and demos:

```json
{
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.notificationDuration": 3000,
  "keypress-notifications.excludedCommands": [
    "workbench.action.toggleSidebarVisibility",
    "workbench.action.togglePanel"
  ]
}
```

### Developer Mode

Detailed logging for debugging:

```json
{
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "debug",
  "keypress-notifications.notificationDuration": 4000
}
```

## Rollback

If you need to rollback to v1.x:

### Automatic Rollback

If migration fails, you'll be prompted:

```
❌ Migration Failed

Your v1.x configuration has been restored.

[Open Backup File] [View Error Logs]
```

### Manual Rollback

1. Open backup file: `~/.vscode/keypress-backup-YYYY-MM-DD-HHMMSS.json`
2. Copy configuration to your VS Code settings
3. Uninstall v2.0.0 extension
4. Install v1.x extension

## Troubleshooting

### Migration Fails

1. Check Output Channel for detailed error logs
2. Verify your configuration file is valid JSON
3. Try manual migration (see above)
4. Report issue with error logs

### Settings Not Applied

1. Reload VS Code window (`Ctrl+Shift+P` → "Reload Window")
2. Check for conflicting settings
3. Verify configuration file permissions

### Extension Not Working After Migration

1. Check Output Channel for errors
2. Verify extension is enabled in Extensions panel
3. Try resetting to defaults (Command Palette → "Reset Configuration")
4. Rollback to v1.x if issues persist

## Need Help?

- 📖 [Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/Vijay431/keypress-notifications/issues)
- 💬 [Discussions](https://github.com/Vijay431/keypress-notifications/discussions)

## Checklist

Before migrating:

- [ ] Backup current configuration
- [ ] Review breaking changes
- [ ] Read new features documentation

After migrating:

- [ ] Verify extension is enabled
- [ ] Test notifications with Ctrl+C
- [ ] Review new configuration options
- [ ] Try a preset
- [ ] Check statistics dashboard
- [ ] Test keyboard shortcuts
- [ ] Customize accessibility settings

## Version History

- v2.0.0 - Major release with breaking changes
- v1.x - Previous versions
