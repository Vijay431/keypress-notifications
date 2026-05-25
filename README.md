# Keypress Notifications

[![VS Code Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/VijayGangatharan.keypress-notifications?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications)
[![VS Code Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/VijayGangatharan.keypress-notifications)](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications)
[![VS Code Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/VijayGangatharan.keypress-notifications)](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications)
[![Open VSX Version](https://img.shields.io/open-vsx/v/VijayGangatharan/keypress-notifications?label=Open%20VSX)](https://open-vsx.org/extension/VijayGangatharan/keypress-notifications)

**Never lose track of which shortcut you just pressed.**

---

## The Problem

VS Code gives you zero feedback about which keyboard shortcut you triggered. You pressed *something* — but what?

This tiny blind spot compounds fast: during screencasts and tutorials, your audience can't follow your keystrokes. In pair-programming sessions, your colleague doesn't know what you just did. When streaming or presenting, viewers stare at a result with no context. And when you're *learning* new keybindings yourself, muscle memory can't form if nothing confirms you hit the right combo.

Keypress Notifications plugs that gap. Every time you trigger one of **42 common VS Code keybindings**, a toast notification pops up — **"You've pressed Ctrl+C"** — so there's always on-screen confirmation of what happened.

---

## Demo

![Keypress Notifications demo](https://raw.githubusercontent.com/Vijay431/keypress-notifications/main/public/demo.gif)

> **Record your own demo** — see [`public/`](public/) for a short recording guide.

---

## Who It's For

- **Screencasters & YouTube/course creators** — your shortcuts are always visible on screen
- **Live streamers** — viewers on Twitch or YouTube Live always know what you're doing
- **Teachers & workshop leads** — no more "wait, what did you just press?"
- **Pair programmers** — your partner sees your keystrokes without screen-sharing tools that need special setup
- **Accessibility users** — on-screen text confirmation of every action, alongside whatever screen reader you use
- **Keybinding learners** — instant reinforcement every time you hit the right combo

---

## Install

**VS Code Marketplace** (recommended):

```
ext install VijayGangatharan.keypress-notifications
```

Or search **"Keypress Notifications"** in the Extensions view (`Ctrl+Shift+X`).

**Open VSX** (VS Codium / other open-source VS Code builds):
[open-vsx.org/extension/VijayGangatharan/keypress-notifications](https://open-vsx.org/extension/VijayGangatharan/keypress-notifications)

---

## Features

### Shortcut notifications

Every time you trigger one of the supported shortcuts, a VS Code information notification appears — e.g. **"You've pressed Ctrl+C"**.

Supported shortcuts (Ctrl = Cmd on macOS):

**Editor**

| Shortcut | Action |
|---|---|
| Ctrl+C | Copy |
| Ctrl+X | Cut |
| Ctrl+V | Paste |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+A | Select All |
| Ctrl+F | Find |
| Ctrl+H | Find & Replace |
| Alt+Up | Move Line Up |
| Alt+Down | Move Line Down |
| Shift+Alt+Up | Copy Line Up |
| Shift+Alt+Down | Copy Line Down |
| Ctrl+Shift+K | Delete Line |
| Ctrl+. | Quick Fix |
| Shift+Alt+F | Format Document |
| Ctrl+/ | Toggle Line Comment |
| Ctrl+D | Add Selection to Next Match |

**Explorer**

| Shortcut | Action |
|---|---|
| Ctrl+C | Copy File/Folder |
| Ctrl+X | Cut File/Folder |
| Ctrl+V | Paste File/Folder |

**Workbench / navigation**

| Shortcut | Action |
|---|---|
| Ctrl+S | Save |
| Ctrl+K S | Save All |
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
| Ctrl+\\ | Split Editor |
| Ctrl+Shift+T | Reopen Closed Editor |
| Ctrl+Shift+O | Go to Symbol |
| Ctrl+, | Open Settings |
| Ctrl+Shift+G | Source Control |
| Ctrl+Shift+X | Extensions |
| Ctrl+Shift+D | Debug |
| Ctrl+Shift+M | Problems |

**Terminal**

| Shortcut | Action |
|---|---|
| Ctrl+Shift+\` | New Terminal |

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
