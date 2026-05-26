---
layout: default
title: Basic Usage Examples
parent: Examples
nav_order: 1
description: 'Getting started with Keypress Notifications - common scenarios and examples'
---

# 🎯 Basic Usage Examples

Learn how to use Keypress Notifications through practical examples and common scenarios.

{: .fs-6 .fw-300 }

---

## 🚀 Your First Notification

### Step 1: Verify Installation

1. **Open VS Code**
2. **Open any file** (or create a new one)
3. **Press** `Ctrl+C` (copy)
4. **Look for notification**: "Copy detected! 📄✨"

If you see the notification, you're ready to go! 🎉

### Step 2: Try More Shortcuts

Try these common keybindings:

| Shortcut       | Action          | Expected Notification            |
| -------------- | --------------- | -------------------------------- |
| `Ctrl+C`       | Copy            | "Copy detected! 📄✨"            |
| `Ctrl+X`       | Cut             | "Cut detected! ✂️💫"             |
| `Ctrl+V`       | Paste           | "Paste detected! 📋🎯"           |
| `Ctrl+Shift+P` | Command Palette | "Command Palette detected! 🎯🚀" |
| `Ctrl+K S`     | Save All        | "Save All detected! 💾🔥"        |

---

## 📝 Common Workflows

### Text Editing Workflow

Perfect for content creation and editing:

```
1. Select text → No notification (single action)
2. Ctrl+C (copy) → "Copy detected! 📄✨"
3. Move cursor → No notification
4. Ctrl+V (paste) → "Paste detected! 📋🎯"
5. Ctrl+Z (undo) → "Undo detected! ↩️⚡"
```

### Development Workflow

Typical coding scenarios:

```
1. Ctrl+Shift+P → "Command Palette detected! 🎯🚀"
2. Type "format" → No notification
3. Enter → No notification
4. Ctrl+K S → "Save All detected! 💾🔥"
5. Ctrl+Shift+F → "Find in Files detected! 🔍⚡"
```

### Navigation Workflow

Moving around your codebase:

```
1. Ctrl+P → "Quick Open detected! 📁⚡"
2. Type filename → No notification
3. Enter → No notification
4. Ctrl+G → "Go to Line detected! 🎯📍"
5. Type line number → No notification
```

---

## 🎮 Interactive Examples

### Example 1: Learning New Shortcuts

**Scenario**: You want to learn VS Code shortcuts and get confirmation they work.

**Setup**:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.excludedCommands": [],
  "keypress-notifications.showCommandName": true
}
```

**Try these shortcuts**:

1. `Ctrl+Shift+E` → "Explorer detected! 📁🌟"
2. `Ctrl+Shift+F` → "Find in Files detected! 🔍⚡"
3. `Ctrl+Shift+G` → "Source Control detected! 🔄💫"
4. `Ctrl+Shift+X` → "Extensions detected! 🧩✨"
5. `Ctrl+Shift+D` → "Debug detected! 🐛🔍"

### Example 2: Clipboard Operations

**Scenario**: Working with text and want copy/paste feedback.

**Test sequence**:

1. **Select some text** in any file
2. **Press** `Ctrl+C` → See "Copy detected! 📄✨"
3. **Move cursor** to new location
4. **Press** `Ctrl+V` → See "Paste detected! 📋🎯"
5. **Press** `Ctrl+Z` → See "Undo detected! ↩️⚡"

### Example 3: File Operations

**Scenario**: Managing files and wanting save confirmation.

**Test sequence**:

1. **Make changes** to a file
2. **Press** `Ctrl+S` → See "Save detected! 💾⚡"
3. **Press** `Ctrl+K S` → See "Save All detected! 💾🔥"
4. **Press** `Ctrl+W` → See "Close detected! ❌💫"

---

## 🔧 Customization Examples

### Quiet Mode

**Use case**: Experienced user who only wants complex shortcut feedback.

**Configuration**:

```json
{
  "keypress-notifications.minimumKeys": 3,
  "keypress-notifications.excludedCommands": [
    "editor.action.clipboardCopyAction",
    "editor.action.clipboardPasteAction"
  ]
}
```

**Result**: Only see notifications for 3+ key combinations, no copy/paste notifications.

### Verbose Mode

**Use case**: New user who wants to see all multi-key shortcuts.

**Configuration**:

```json
{
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.excludedCommands": []
}
```

**Result**: See all 2+ key combinations with full command names.

### Presentation Mode

**Use case**: Demonstrating VS Code features to an audience.

**Configuration**:

```json
{
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "workbench.action.quickOpenNavigateNext"
  ]
}
```

**Result**: Clear notifications for demonstrations without noise.

---

## 🎯 Use Case Scenarios

### Scenario 1: Learning VS Code

**Profile**: New VS Code user
**Goal**: Learn keyboard shortcuts effectively

**Recommended settings**:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.excludedCommands": [],
  "keypress-notifications.showCommandName": true
}
```

**Learning approach**:

1. **Start with basics**: Copy (`Ctrl+C`), Paste (`Ctrl+V`), Save (`Ctrl+S`)
2. **Try navigation**: Command Palette (`Ctrl+Shift+P`), Quick Open (`Ctrl+P`)
3. **Explore panels**: Explorer (`Ctrl+Shift+E`), Terminal (`Ctrl+``)
4. **Advanced features**: Multi-cursor (`Ctrl+D`), Format (`Shift+Alt+F`)

### Scenario 2: Debugging Workflow

**Profile**: Developer debugging code
**Goal**: Confirm debug shortcuts are working

**Recommended settings**:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": false,
  "keypress-notifications.excludedCommands": ["editor.action.triggerSuggest"]
}
```

**Debug workflow**:

1. **Set breakpoint**: `F9` → No notification (single key)
2. **Start debugging**: `F5` → No notification (single key)
3. **Step over**: `F10` → No notification (single key)
4. **Toggle console**: `Ctrl+Shift+Y` → "Terminal detected! 🖥️💫"

### Scenario 3: Code Review

**Profile**: Reviewer examining code
**Goal**: Navigate efficiently with feedback

**Test workflow**:

1. **Open file**: `Ctrl+P` → "Quick Open detected! 📁⚡"
2. **Find text**: `Ctrl+F` → "Find detected! 🔍✨"
3. **Next match**: `F3` → No notification (single key)
4. **Go to definition**: `F12` → No notification (single key)
5. **Go back**: `Alt+Left` → "Go Back detected! ↩️🎯"

---

## 📊 Troubleshooting Examples

### Issue: No Notifications Appearing

**Check list**:

1. **Verify extension is enabled**:

   ```json
   { "keypress-notifications.enabled": true }
   ```

2. **Try simple test**: Press `Ctrl+C` in any file

3. **Check minimum keys setting**:

   ```json
   { "keypress-notifications.minimumKeys": 2 }
   ```

4. **Verify command not excluded**:

   ```json
   { "keypress-notifications.excludedCommands": [] }
   ```

5. **Reload VS Code**: `Ctrl+Shift+P` → "Reload Window"

### Issue: Too Many Notifications

**Solution**: Increase minimum keys or add exclusions:

```json
{
  "keypress-notifications.minimumKeys": 3,
  "keypress-notifications.excludedCommands": [
    "editor.action.triggerSuggest",
    "workbench.action.quickOpenNavigateNext"
  ]
}
```

### Issue: Missing Command Names

**Solution**: Enable command name display:

```json
{
  "keypress-notifications.showCommandName": true
}
```

---

## 🎨 Visual Examples

### What You'll See

When properly configured, you'll see notifications like:

**Basic notifications**:

- `Ctrl+C` → "Copy detected! 📄✨"
- `Ctrl+V` → "Paste detected! 📋🎯"
- `Ctrl+Z` → "Undo detected! ↩️⚡"

**Advanced notifications**:

- `Ctrl+Shift+P` → "Command Palette detected! 🎯🚀"
- `Ctrl+K S` → "Save All detected! 💾🔥"
- `Ctrl+Shift+F` → "Find in Files detected! 🔍⚡"

**With command names disabled**:

- `Ctrl+C` → "Keybinding detected! ⌨️"
- `Ctrl+Shift+P` → "Multi-key detected! 🎯"

### Notification Timing

- **Appear**: Immediately after keybinding execution
- **Duration**: 3-5 seconds (VS Code default)
- **Position**: Bottom-right corner (VS Code notification area)
- **Style**: Matches VS Code theme automatically

---

## 🚀 Next Steps

Ready to explore more advanced features?

1. **⚡ [Advanced Configuration](advanced-configuration)** - Power user setups
2. **🏢 [Enterprise Deployment](enterprise-deployment)** - Large-scale configurations
3. **🔧 [Troubleshooting Guide](../guides/troubleshooting)** - Fix any issues
4. **🏛️ [Architecture Guide](../api/architecture)** - Understand how it works

---

## 📋 Quick Reference

### Most Common Shortcuts

| Shortcut       | Command         | Notification                     |
| -------------- | --------------- | -------------------------------- |
| `Ctrl+C`       | Copy            | "Copy detected! 📄✨"            |
| `Ctrl+V`       | Paste           | "Paste detected! 📋🎯"           |
| `Ctrl+S`       | Save            | "Save detected! 💾⚡"            |
| `Ctrl+Z`       | Undo            | "Undo detected! ↩️⚡"            |
| `Ctrl+Shift+P` | Command Palette | "Command Palette detected! 🎯🚀" |

### Quick Settings

| Setting            | Quick Value                             | Effect                    |
| ------------------ | --------------------------------------- | ------------------------- |
| `minimumKeys`      | `1`                                     | Show all shortcuts        |
| `minimumKeys`      | `3`                                     | Only complex shortcuts    |
| `showCommandName`  | `true`                                  | Show command names        |
| `excludedCommands` | `["editor.action.clipboardCopyAction"]` | Exclude specific commands |
| `enabled`          | `false`                                 | Disable completely        |

---

<div align="center">

**Ready to master your VS Code shortcuts!** ⌨️✨

[⚡ Advanced Examples](advanced-configuration){: .btn .btn-primary } [🔧 Troubleshoot](../guides/troubleshooting){: .btn .btn-outline }

</div>
