---
layout: default
title: Installation Guide
parent: Guides
nav_order: 1
description: 'Complete installation instructions for Keypress Notifications'
---

# 📦 Installation Guide

Complete installation instructions for the Keypress Notifications VS Code extension.

{: .fs-6 .fw-300 }

---

## 🚀 Quick Installation

### Method 1: VS Code Marketplace (Recommended)

The easiest way to install Keypress Notifications:

1. **Open VS Code**
2. **Open Extensions panel** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. **Search** for "Keypress Notifications"
4. **Click Install** on the extension by VijayGangatharan
5. **Reload VS Code** if prompted

### Method 2: Command Line

Install directly from the command line:

```bash
code --install-extension VijayGangatharan.keypress-notifications
```

### Method 3: Extensions View Command

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Type:** `Extensions: Install Extensions`
3. **Search** for "Keypress Notifications"
4. **Click Install**

---

## 📋 System Requirements

### ✅ Supported Platforms

- **🪟 Windows**: Windows 10/11 (x64)
- **🍎 macOS**: macOS 10.15+ (Intel & Apple Silicon)
- **🐧 Linux**: Ubuntu 18.04+, Debian 10+, RHEL 8+, Fedora 32+

### 🔧 Software Requirements

| Requirement    | Minimum    | Recommended   |
| -------------- | ---------- | ------------- |
| **VS Code**    | 1.90.0+    | Latest stable |
| **Node.js**    | 16.x       | 20.x LTS      |
| **Memory**     | 512MB free | 1GB+ free     |
| **Disk Space** | 5MB        | 10MB          |

### 🌐 Network Requirements

- **Internet connection** for initial download (1.5MB)
- **No ongoing network access** required after installation
- **Firewall friendly** - no external connections needed

---

## 🔍 Installation Verification

### 1. Check Extension is Installed

After installation, verify the extension is loaded:

1. **Open Extensions panel** (`Ctrl+Shift+X`)
2. **Search** for "Keypress Notifications"
3. **Verify** it shows as "Installed"

### 2. Test Basic Functionality

1. **Open any file** in VS Code
2. **Press** `Ctrl+C` (copy)
3. **Look for notification** saying "Copy detected! 📄✨"

### 3. Check Extension Commands

1. **Open Command Palette** (`Ctrl+Shift+P`)
2. **Type** "Keypress"
3. **Verify** you see commands like:
   - `🟢 Keypress Notifications: Activate`
   - `🔴 Keypress Notifications: Deactivate`
   - `📊 Keypress Notifications: Show Output Channel`

---

## 🏢 Enterprise Installation

### Group Policy Deployment (Windows)

For enterprise environments with Group Policy:

1. **Download VSIX** from marketplace
2. **Deploy via GPO** using VS Code extension deployment
3. **Configure settings** via Group Policy preferences

### Mass Deployment Script

For multiple machines:

```bash
#!/bin/bash
# mass-install.sh

# Install for all users (requires admin)
for user in $(ls /home/); do
  sudo -u $user code --install-extension VijayGangatharan.keypress-notifications
done

echo "Installation complete for all users"
```

### Docker/Container Environments

For containerized VS Code environments:

```dockerfile
# Add to your VS Code Docker image
RUN code --install-extension VijayGangatharan.keypress-notifications
```

---

## 🛠️ Manual Installation

### From VSIX File

If you need to install from a VSIX file:

1. **Download VSIX** from [GitHub Releases](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension/releases)
2. **Open Command Palette** (`Ctrl+Shift+P`)
3. **Run:** `Extensions: Install from VSIX...`
4. **Select** the downloaded VSIX file
5. **Reload VS Code** when prompted

### Offline Installation

For environments without internet access:

1. **Download VSIX** on connected machine
2. **Transfer VSIX** to target machine
3. **Install via VSIX** method above
4. **Configure settings** manually if needed

---

## ⚙️ Post-Installation Setup

### Initial Configuration

After installation, the extension works with default settings. Optionally customize:

```json
{
  "keypress-notifications.enabled": true,
  "keypress-notifications.minimumKeys": 2,
  "keypress-notifications.showCommandName": true,
  "keypress-notifications.logLevel": "info"
}
```

### First-Time Usage

1. **No setup required** - extension auto-activates
2. **Try basic shortcuts**:
   - `Ctrl+C` (copy)
   - `Ctrl+V` (paste)
   - `Ctrl+Shift+P` (command palette)
3. **See notifications** appear for multi-key combinations

---

## 🔄 Updates

### Automatic Updates

VS Code automatically updates extensions by default:

- **Check for updates** daily
- **Auto-install** patch updates
- **Prompt for** major updates

### Manual Updates

To manually check for updates:

1. **Open Extensions panel**
2. **Look for** update badge on Keypress Notifications
3. **Click Update** if available

### Update Notifications

You'll be notified of updates via:

- **VS Code notification** when update is available
- **Extension description** shows latest changes
- **Changelog** available in extension details

---

## 🔧 Troubleshooting Installation

### Common Issues

#### ❌ "Extension not found"

**Solution**: Ensure you're searching for the exact name "Keypress Notifications" by VijayGangatharan.

#### ❌ "Installation failed"

**Possible causes**:

- Insufficient disk space
- VS Code not running as administrator (Windows)
- Network connectivity issues

**Solutions**:

1. Free up disk space (5MB minimum)
2. Run VS Code as administrator
3. Check internet connection
4. Try manual VSIX installation

#### ❌ "Extension not loading"

**Solutions**:

1. Reload VS Code window (`Ctrl+Shift+P` → "Reload Window")
2. Restart VS Code completely
3. Check VS Code output panel for errors
4. Disable other extensions to test for conflicts

### Getting Help

If installation issues persist:

1. **Check our** [Troubleshooting Guide](troubleshooting)
2. **Search** [GitHub Issues](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension/issues)
3. **Create new issue** with:
   - OS and VS Code version
   - Installation method attempted
   - Error messages received
   - Steps to reproduce

---

## 🚀 Next Steps

After successful installation:

1. **📖 [Read Configuration Guide](configuration)** - Customize the extension
2. **🎯 [Try Basic Examples](../examples/basic-usage)** - See it in action
3. **⚡ [Explore Advanced Features](../examples/advanced-configuration)** - Power user setup

---

## 📋 Installation Checklist

Use this checklist to verify complete installation:

- [ ] ✅ Extension appears in Extensions panel
- [ ] ✅ Extension commands available in Command Palette
- [ ] ✅ Basic keybinding notifications work (try `Ctrl+C`)
- [ ] ✅ Extension settings accessible in VS Code settings
- [ ] ✅ No error messages in VS Code output panel

**All checked?** You're ready to use Keypress Notifications! 🎉

---

<div align="center">

**Installation complete!** 🎊

[⚙️ Configure Extension](configuration){: .btn .btn-primary } [🎯 See Examples](../examples/basic-usage){: .btn .btn-outline }

</div>
