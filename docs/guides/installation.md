# 📦 Installation Guide

## 🚀 Quick Start

Getting **Keypress Notifications** up and running is super easy! Follow these simple steps:

### 1️⃣ Install from VS Code Marketplace

#### 🖱️ GUI Installation (Recommended)
1. Open VS Code
2. Click the Extensions icon in the sidebar (or press `Ctrl+Shift+X`)
3. Search for "**Keypress Notifications**"
4. Click **Install** on the extension by `VijayGangatharan`
5. 🎉 You're done! The extension will activate automatically.

#### ⌨️ Command Line Installation
```bash
# Quick one-liner installation
code --install-extension VijayGangatharan.keypress-notifications
```

### 2️⃣ Verify Installation

After installation, verify everything is working:

1. **Check Status**: Look for the extension in your Extensions panel
2. **Test Functionality**: 
   - Select some text in any file
   - Press `Ctrl+C` (copy)
   - You should see a notification: "Copy detected! 📄✨"
3. **Access Commands**: Press `Ctrl+Shift+P` and search for "Keypress Notifications"

---

## 🔧 Node.js Compatibility Matrix

Our extension is tested across multiple Node.js versions to ensure broad compatibility:

| Node.js Version | Support Status | Notes |
|---|---|---|
| **22.x** | ✅ Fully Supported | Latest features, recommended for new setups |
| **20.x LTS** | ✅ Fully Supported | **Recommended** - Most stable |
| **18.x LTS** | ✅ Fully Supported | Great for enterprise environments |
| **16.x** | ✅ Supported | Minimum version, basic functionality |
| **14.x** | ❌ Not Supported | End of life, please upgrade |

### 🎯 Recommended Setup
- **Development**: Node.js 20.x LTS
- **Production**: Node.js 20.x LTS  
- **CI/CD**: Node.js 20.x LTS
- **Minimum**: Node.js 16.x

---

## 💻 Platform Support

### ✅ Fully Supported Platforms

| Platform | Version | Architecture | Status |
|---|---|---|---|
| **Windows** | 10, 11 | x64, ARM64 | ✅ Full Support |
| **macOS** | 12+, 13+, 14+ | Intel, Apple Silicon | ✅ Full Support |
| **Linux** | Ubuntu 20.04+, Debian 11+ | x64, ARM64 | ✅ Full Support |

### 🛠️ Development Environments

| Environment | Support Status | Notes |
|---|---|---|
| **VS Code Desktop** | ✅ Primary Target | Full feature set |
| **VS Code Insiders** | ✅ Supported | May have early features |
| **WSL/WSL2** | ✅ Supported | Windows Subsystem for Linux |
| **Remote Development** | ✅ Supported | SSH, Containers, WSL |
| **GitHub Codespaces** | ✅ Supported | Cloud development |
| **Docker Containers** | ✅ Supported | Containerized development |

---

## 📋 VS Code Requirements

### Minimum Requirements
- **VS Code Version**: 1.90.0 or higher
- **Node.js**: 16.0.0 or higher (see compatibility matrix above)
- **Memory**: 100MB available RAM
- **Storage**: 5MB disk space

### Recommended Requirements  
- **VS Code Version**: Latest stable release
- **Node.js**: 20.x LTS
- **Memory**: 200MB available RAM
- **Storage**: 10MB disk space

---

## 🔧 Advanced Installation Options

### 📦 Manual Installation (VSIX)

If you need to install manually or in offline environments:

1. **Download VSIX**: Get the latest `.vsix` file from [GitHub Releases](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension/releases)
2. **Install via Command**:
   ```bash
   code --install-extension keypress-notifications-0.1.0.vsix
   ```
3. **Install via GUI**:
   - Open Extensions panel (`Ctrl+Shift+X`)
   - Click the `...` menu → "Install from VSIX..."
   - Select your downloaded `.vsix` file

### 🏢 Enterprise Installation

For organizations deploying to multiple machines:

#### Group Policy (Windows)
```json
{
  "recommendations": [
    "VijayGangatharan.keypress-notifications"
  ]
}
```

#### Settings Sync
Enable VS Code Settings Sync to automatically install on new machines.

#### Dockerfile Example
```dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu
RUN code --install-extension VijayGangatharan.keypress-notifications
```

---

## 🔍 Troubleshooting Installation

### Common Issues & Solutions

#### ❌ Extension Won't Install
**Problem**: "Extension not found" or installation fails
**Solutions**:
1. Update VS Code to latest version
2. Check your internet connection
3. Try installing via command line
4. Restart VS Code and try again

#### ❌ Extension Won't Activate
**Problem**: Extension installed but not working
**Solutions**:
1. Check Node.js version: `node --version`
2. Reload VS Code window: `Ctrl+Shift+P` → "Developer: Reload Window"
3. Check Developer Console for errors: `Help` → `Toggle Developer Tools`
4. Disable other extensions temporarily to check for conflicts

#### ❌ Notifications Not Showing
**Problem**: Extension active but no notifications appear
**Solutions**:
1. Check extension settings: `Ctrl+,` → search "keypress-notifications"
2. Ensure `enabled` is set to `true`
3. Test with different keybindings
4. Check VS Code notification settings

#### ❌ Performance Issues
**Problem**: VS Code slow after installation
**Solutions**:
1. Check Node.js version compatibility
2. Adjust log level: Set `logLevel` to `"error"` instead of `"debug"`
3. Add frequently used commands to `excludedCommands`
4. Restart VS Code

### 🔍 Debug Information

To help with troubleshooting, gather this information:

```bash
# System info
code --version
node --version
npm --version

# OS info (Linux/macOS)
uname -a

# OS info (Windows)
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
```

### 📞 Getting Help

If you're still having issues:

1. 🔍 **Search Issues**: Check [GitHub Issues](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension/issues)
2. 🐛 **Report Bug**: Use our [Bug Report Template](./../.github/ISSUE_TEMPLATE/bug_report.yml)
3. 💬 **Ask Community**: Start a [GitHub Discussion](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension/discussions)
4. 📧 **Contact**: Email [vijayanand431@gmail.com](mailto:vijayanand431@gmail.com)

---

## ⚙️ Post-Installation Setup

### Quick Configuration

After installation, you might want to customize the extension:

1. **Open Settings**: `Ctrl+,` or `File` → `Preferences` → `Settings`
2. **Search**: Type "keypress-notifications"
3. **Configure**: Adjust settings to your preferences

### Essential Settings

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.logLevel": "info",
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true
}
```

### 🎯 Next Steps

- 📖 **Read Configuration Guide**: Learn about all available settings
- 🎨 **Customize Experience**: Adjust notifications to your workflow  
- 🧪 **Test Features**: Try different keybindings and commands
- ⭐ **Star Repository**: Show your support on GitHub!

---

## 🔄 Updating the Extension

### Automatic Updates (Default)
VS Code automatically updates extensions by default. The extension will update in the background.

### Manual Updates
1. Open Extensions panel (`Ctrl+Shift+X`)
2. Find "Keypress Notifications"
3. Click **Update** if available
4. Restart VS Code if prompted

### 📦 Version Information
Check your current version: Extensions panel → Keypress Notifications → Version number

---

**🎉 That's it! You're ready to enhance your VS Code experience with visual keybinding feedback!**

💡 **Pro Tip**: Give this repository a ⭐ if you find the extension useful!