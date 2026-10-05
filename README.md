<div align="center">
  <img src="logo.png" alt="Keypress Notifications" width="128" />
</div>

# Keypress Notifications

[![CI](https://github.com/Vijay431/keypress-notifications/actions/workflows/ci.yml/badge.svg)](https://github.com/Vijay431/keypress-notifications/actions/workflows/ci.yml)
[![VS Code Marketplace](https://vsmarketplacebadges.dev/version-short/VijayGangatharan.keypress-notifications.svg)](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications)
[![Open VSX Registry](https://img.shields.io/open-vsx/v/VijayGangatharan/keypress-notifications)](https://open-vsx.org/extension/VijayGangatharan/keypress-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Installs](https://vsmarketplacebadges.dev/installs-short/VijayGangatharan.keypress-notifications.svg)](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/VijayGangatharan.keypress-notifications.svg)](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications)
[![Rating](https://vsmarketplacebadges.dev/rating-short/VijayGangatharan.keypress-notifications.svg)](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications&ssr=false#review-details)

> Never lose track of which shortcut you just pressed.

---

## About the Project

### The "Why"

VS Code gives you zero feedback about which keyboard shortcut you triggered. You pressed _something_ — but what? This tiny blind spot compounds fast: during screencasts and tutorials, your audience can't follow your keystrokes. In pair-programming sessions, your colleague doesn't know what you just did. When streaming or presenting, viewers stare at a result with no context. And when you're _learning_ new keybindings yourself, muscle memory can't form if nothing confirms you hit the right combo.

Keypress Notifications plugs that gap. Every time you trigger one of **42 common VS Code keybindings**, a toast notification pops up — **"You've pressed Ctrl+C"** — so there's always on-screen confirmation of what happened.

### Features

- **Visual Feedback**: On-screen toast notification confirms every triggered keybinding.
- **Screencast & Stream Ready**: Viewers see the shortcut label as you press it, without extra software.
- **Pair Programming Friendly**: Your keys are visible without any extra screen-share setup.
- **Accessible**: On-screen text confirmation of every action alongside screen reader support.
- **Muscle Memory Builder**: Instant reinforcement each time you press the right combo.

### Tech Stack

- TypeScript
- Node.js
- VS Code Extension API

### Visuals

<div align="center">
  <img src="https://raw.githubusercontent.com/Vijay431/keypress-notifications/main/public/demo.gif" alt="Keypress Notifications demo" />
  <br/>
  <em>On-screen toast for every supported keybinding</em>
</div>

---

## Setup & Installation

### Prerequisites

- **VS Code**: Version `1.111.0` or later.

### Install Commands

**VS Code Marketplace** (recommended):

```bash
ext install VijayGangatharan.keypress-notifications
```

Or search **"Keypress Notifications"** in the Extensions view (`Ctrl+Shift+X`).

**Open VSX** (VS Codium / other open-source VS Code builds):
[open-vsx.org/extension/VijayGangatharan/keypress-notifications](https://open-vsx.org/extension/VijayGangatharan/keypress-notifications)

**Command line:**

```bash
code --install-extension VijayGangatharan.keypress-notifications
```

---

## Usage

### Quick Start

1. **Install** from VS Code Marketplace
2. **Open** any file in VS Code
3. **Press** a supported shortcut (e.g. `Ctrl+S` to save)
4. **See** the toast notification — _"You've pressed Ctrl+S"_

That's it. No configuration needed for the default experience.

### Commands

Open the Command Palette (`Ctrl+Shift+P`) and search for:

| Command                                 | Description                       |
| --------------------------------------- | --------------------------------- |
| **Keypress Notifications: Enable**      | Turn notifications on             |
| **Keypress Notifications: Disable**     | Turn notifications off            |
| **Keypress Notifications: Show Status** | Open the extension output channel |

### Configuration

All settings live under the `keypress-notifications.*` namespace in your VS Code `settings.json`:

| Setting            | Type     | Default  | Description                                                                                            |
| ------------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `enabled`          | boolean  | `true`   | Enable or disable notifications                                                                        |
| `minimumKeys`      | number   | `2`      | Minimum number of keys in a combination before a notification fires                                    |
| `excludedCommands` | string[] | `[]`     | Commands to suppress notifications for                                                                 |
| `showCommandName`  | boolean  | `false`  | Append the command ID in parentheses, e.g. `You've pressed Ctrl+C (editor.action.clipboardCopyAction)` |
| `logLevel`         | string   | `"info"` | Logging verbosity: `"debug"`, `"info"`, `"warn"`, or `"error"`                                         |

### Supported Shortcuts

The extension covers 42 common commands across the Editor, Explorer, Workbench, and Terminal.

<details>
<summary>Click to view all supported shortcuts</summary>

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

**Workbench / Navigation**
| Shortcut | Action |
|---|---|
| Ctrl+S | Save |
| Ctrl+K S (Mac: Option+Cmd+S) | Save All |
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

</details>

---

## Getting Help & Contributing

### Troubleshooting

<details>
<summary>Notifications not appearing</summary>

1. **Check extension status**: open Command Palette → _Keypress Notifications: Show Status_ — look for `enabled: true` in the output.
2. **Enable the extension**: Command Palette → _Keypress Notifications: Enable_.
3. **Check `minimumKeys`**: default is `2`, so single-key presses won't fire. Lower it in settings if needed.
4. **Check `excludedCommands`**: the command may be in your exclusion list.
5. **Unsupported shortcut**: notifications only fire for the 42 curated keybindings above — arbitrary shortcuts are not wrapped.
</details>

<details>
<summary>Shortcut not in the list</summary>
The extension wraps a curated set of 42 common commands. To request coverage for a shortcut, open an issue with the VS Code command ID and your use case.
</details>

<details>
<summary>Notifications are too noisy</summary>

- Add commands to `keypress-notifications.excludedCommands` (use the VS Code command ID, e.g. `editor.action.clipboardCopyAction`).
- Raise `keypress-notifications.minimumKeys` to suppress shorter combos.
</details>

### Contribution Guidelines

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines, including how to set up the local development environment. Please open an issue to discuss significant changes before submitting a Pull Request.

### Contact

**Vijay Gangatharan**

- 📧 Email: <vijayanand431@gmail.com>
- 🐙 [GitHub Repository](https://github.com/Vijay431/keypress-notifications)

---

## Additional Sections

### Roadmap

- Future updates will explore adding coverage for more VS Code keybindings based on user requests.

### Credits / Acknowledgments

Thanks goes to these wonderful people (and AI assistants) for their contributions:

- Vijay Gangatharan
- Claude (Anthropic)
- The VS Code Extension API team for excellent documentation.
- All contributors and users who provide feedback.

### License

This project is licensed under the [MIT License](LICENSE).
