# Keypress Notifications

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/VijayGangatharan.keypress-notifications?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications)

A VS Code extension that shows a notification whenever you press one of the 19 most common keyboard shortcuts — handy for demos, pair programming, and learning new keybindings.

---

## Features

### Shortcut notifications

Every time you trigger one of the supported shortcuts, a VS Code information notification appears — e.g. **"You've pressed Ctrl+C"**.

Supported shortcuts:

| Shortcut | Action |
|---|---|
| Ctrl+C | Copy |
| Ctrl+X | Cut |
| Ctrl+V | Paste |
| Ctrl+S | Save |
| Ctrl+Shift+P | Command Palette |
| Ctrl+P | Quick Open |
| Ctrl+Shift+F | Find in Files |
| Ctrl+G | Go to Line |
| Ctrl+B | Toggle Sidebar |
| Ctrl+\` | Toggle Terminal |
| Ctrl+J | Toggle Panel |
| Ctrl+W | Close Editor |
| Ctrl+Shift+N | New Window |
| Ctrl+N | New File |
| Ctrl+O | Open File |
| Shift+Alt+F | Format Document |
| Ctrl+/ | Toggle Line Comment |
| Ctrl+D | Add Selection to Next Match |
| Ctrl+K S | Save All |

On macOS, the extension uses Cmd-based variants automatically.

### Configuration

All settings live under the `keypress-notifications.*` namespace:

| Setting | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enable or disable notifications |
| `minimumKeys` | number | `2` | Minimum number of keys in a combination before a notification fires |
| `excludedCommands` | string[] | `[]` | Commands to suppress notifications for |
| `showCommandName` | boolean | `false` | Include the VS Code command ID in the notification message |
| `logLevel` | string | `"info"` | Logging verbosity: `"debug"`, `"info"`, `"warn"`, or `"error"` |

### Commands

Open the Command Palette (`Ctrl+Shift+P`) and search for:

| Command | Description |
|---|---|
| **Keypress Notifications: Enable** | Turn notifications on |
| **Keypress Notifications: Disable** | Turn notifications off |
| **Keypress Notifications: Show Status** | Open the extension output channel |

---

## Requirements

- VS Code **1.111.0** or later

---

## For Contributors

The extension uses a dependency-injection container, a typed service layer, and has zero runtime dependencies. See the [architecture note in the source](src/) for details. Node.js 22+ is required for development.

CI and release workflows use GitHub Actions cache for pnpm package storage and `node_modules` warm starts. A scheduled cache cleanup workflow runs every 3 days at 08:00 IST and removes cache entries that have not been used for 7 days or more.

---

## Issues & Support

Found a bug or have a feature request? Please [open an issue](https://github.com/Vijay431/keypress-notifications/issues).

---

## License

[MIT](LICENSE)
