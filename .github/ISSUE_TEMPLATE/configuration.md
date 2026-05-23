---
name: Configuration Issue
about: Report problems with extension settings or configuration
title: '[CONFIG] '
labels: configuration
assignees: ''
---

## Configuration Issue Type (check one)

- [ ] **Settings Problem** - Issue with VS Code settings
- [ ] **Extension Settings** - Issue with keypress-notifications.\* settings
- [ ] **Configuration Not Applied** - Settings not taking effect
- [ ] **Invalid Configuration** - Configuration causing errors
- [ ] **Default Configuration** - Question about default settings

## Issue Description

Describe the configuration problem.

**Summary:**
Brief description of configuration issue.

**Expected Behavior:**
What should happen with correct configuration?

**Actual Behavior:**
What is actually happening?

## Configuration Details

**Current VS Code Settings (settings.json):**

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.excludedCommands": [],
  "keypress-notifications.showCommandName": false,
  "keypress-notifications.logLevel": "info"
}
```

**Settings Not Working:**
Which specific settings are not working?

- [ ] `keypress-notifications.enabled`
- [ ] `keypress-notifications.minimumKeys`
- [ ] `keypress-notifications.excludedCommands`
- [ ] `keypress-notifications.showCommandName`
- [ ] `keypress-notifications.logLevel`
- [ ] Other: ______

## Environment

- **VS Code:** Version (e.g., 1.102.0)
- **Extension:** Version (e.g., 1.1.0)
- **OS:** Windows/macOS/Linux
- **VS Code Settings Location:**
  - [ ] User Settings
  - [ ] Workspace Settings

## Reproduction Steps

1. Change setting to ______
2. Reload VS Code / Restart
3. Try to trigger notification
4. Configuration doesn't take effect

## Error Messages

```bash
[Paste any error messages from VS Code]
```

**Output Channel:**

```
[Paste output from "Keypress Notifications" output channel]
```

## Configuration Validation

- [ ] Restarted VS Code after changing settings
- [ ] Verified settings.json syntax
- [ ] Checked for typos in setting names
- [ ] Tested with default settings

## Additional Information

**Did it work before?**

- [ ] Yes, worked with extension version ______
- [ ] No, never worked

**Recent Changes:**

- [ ] Updated VS Code
- [ ] Updated extension
- [ ] Changed settings
- [ ] Installed new extension

## Priority

How critical is this configuration issue?

- [ ] Critical - Extension completely unusable
- [ ] High - Major feature not working
- [ ] Medium - Important settings not working
- [ ] Low - Minor configuration issue
