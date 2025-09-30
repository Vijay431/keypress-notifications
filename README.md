# ⌨️ Keypress Notifications for VS Code 🔔

<div align="center">

**🎯 Get instant visual feedback when you execute multi-key combinations in VS Code.**

[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg?style=flat-square&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.102.0+-blue.svg?style=flat-square&logo=visual-studio-code)](https://code.visualstudio.com/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg?style=flat-square)](#)

[🐛 Report Bug](https://github.com/Vijay431/keypress-notifications/issues) • [💡 Request Feature](https://github.com/Vijay431/keypress-notifications/issues)

</div>

---

## ✨ What This Extension Does

Simple and straightforward: this extension shows you notifications when you execute common multi-key combinations in VS Code. Perfect for when you want visual confirmation that your keybinding actually worked.

Great for:

- 🧠 **Visual learners** who like immediate feedback
- 🎓 **Teaching/learning** situations to demonstrate actions
- 🐛 **Debugging** when you're not sure if a command executed

## 🎮 Features

### ⌨️ Detected Commands

The extension shows notifications for these common multi-key combinations:

**Clipboard Operations:**

- Copy (Ctrl+C), Cut (Ctrl+X), Paste (Ctrl+V)

**Navigation & Search:**

- Command Palette (Ctrl+Shift+P), Quick Open (Ctrl+P)
- Find in Files (Ctrl+Shift+F), Go to Line (Ctrl+G)

**View Operations:**

- Toggle Sidebar (Ctrl+B), Toggle Terminal (Ctrl+`)
- Toggle Panel (Ctrl+J)

**File Operations:**

- Save (Ctrl+S), Save All (Ctrl+K S)
- New File (Ctrl+N), Open File (Ctrl+O)

**Editor Operations:**

- Format Document (Shift+Alt+F), Comment Line (Ctrl+/)
- Add Selection to Next Match (Ctrl+D)

### 🎛️ Commands

Access via Command Palette (`Ctrl+Shift+P`):

- **Keypress Notifications: Enable** - Enable notifications
- **Keypress Notifications: Disable** - Disable notifications
- **Keypress Notifications: Show Status** - Show status message

### ⚙️ Configuration

- Automatically enabled on VS Code startup
- Configurable minimum key count (default: 2)
- Simple enable/disable toggle

---

## 🚀 Installation & Usage

### Installation

1. Open Extensions in VS Code (`Ctrl+Shift+X`)
2. Search for "Keypress Notifications"
3. Click Install
4. The extension activates automatically

### Usage

No setup needed! The extension works immediately:

- Use any multi-key combination (like `Ctrl+C`, `Ctrl+Shift+P`, etc.)
- See a notification confirming the command was detected
- Commands can be controlled via the Command Palette (`Ctrl+Shift+P`)

### Configuration

Available settings in VS Code:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2
}
```

## 🏗️ How It Works

Simple architecture:

- **Extension Entry Point** (`src/extension.ts`): Handles activation and command registration
- **ExtensionManager** (`src/managers/ExtensionManager.ts`): Coordinates extension lifecycle and services
- **KeypressService** (`src/services/KeypressService.ts`): Detects and shows notifications for multi-key commands
- **ConfigurationService** (`src/services/ConfigurationService.ts`): Manages extension settings
- **Configuration**: Basic settings for enabling/disabling and minimum key count

The extension works by tracking common multi-key command executions and displaying notifications when they're detected.

## 🛠️ Development

### Setup

```bash
npm install     # Install dependencies
npm run build   # Build the extension
npm test        # Run tests
```

### Available Commands

```bash
npm run build          # Build TypeScript with esbuild
npm run watch          # Watch mode for development
npm run package        # Create VSIX package
npm run lint           # Run ESLint
npm run lint:fix       # Fix linting issues
npm run format         # Format code with Prettier
npm run check-types    # TypeScript type checking
npm run validate:lockfile  # Validate package-lock.json
```

### Testing

```bash
npm test                # Run E2E tests
npm run test:full       # Run full tests (no optimization)
npm run test:minimal    # Minimal test run
npm run test:quick      # Fast compile + test for CI
npm run test:clean      # Clean test directories
```

## 📋 Requirements

- **VS Code**: Version 1.102.0 or higher
- **Node.js**: Version 16.0.0 or higher (for development)

## 🐛 Issues & Support

Found a bug or have a feature request? Please [create an issue](https://github.com/Vijay431/keypress-notifications/issues).

## 📄 License

This project is licensed under the **Proprietary License**.

## 👨‍💻 Author

**Vijay Gangatharan**
📧 [vijayanand431@gmail.com](mailto:vijayanand431@gmail.com)
🐙 [GitHub Profile](https://github.com/Vijay431)
