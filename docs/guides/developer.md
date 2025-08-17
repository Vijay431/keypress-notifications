# 🛠️ Developer Guide

## 🎯 Welcome Contributors!

Thank you for your interest in contributing to **Keypress Notifications**! This guide will help you set up your development environment and understand the codebase.

---

## 🚀 Quick Development Setup

### Prerequisites

Before you start, ensure you have:

- **Node.js**: 20.x LTS (recommended) or 16.x minimum
- **pnpm**: Latest version (preferred) or npm
- **VS Code**: Latest stable version
- **Git**: For version control

### 1️⃣ Clone and Setup

```bash
# Clone the repository
git clone https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension.git
cd vscode-keypress_snackbar_notification-extension

# Install dependencies
pnpm install

# Build the extension
pnpm run compile

# Run tests to verify setup
pnpm test
```

### 2️⃣ Development Workflow

```bash
# Start development with auto-reload
pnpm run test:dev

# Or separately:
pnpm run watch     # Auto-compile on changes
pnpm run test:manual  # Launch extension in dev host
```

---

## 🏗️ Architecture Overview

### 📁 Project Structure

```
keypress-notifications/
├── 📂 src/                      # Source code
│   ├── 📄 extension.ts          # Main entry point
│   ├── 📂 managers/             # High-level coordinators
│   │   ├── ExtensionManager.ts  # Central coordinator
│   │   └── CommandManager.ts    # Command registration
│   ├── 📂 services/             # Business logic
│   │   ├── KeypressNotificationService.ts  # Core functionality
│   │   ├── NotificationService.ts          # Notification display
│   │   └── ConfigurationService.ts         # Settings management
│   ├── 📂 types/               # TypeScript definitions
│   ├── 📂 utils/               # Shared utilities
│   └── 📂 test/                # Test files
├── 📂 docs/                    # Documentation
├── 📂 .github/                 # GitHub workflows & templates
├── 📄 package.json             # Extension manifest
├── 📄 tsconfig.json            # TypeScript configuration
└── 📄 esbuild.config.js        # Build configuration
```

### 🧩 Core Components

#### 🎯 ExtensionManager
**Location**: `src/managers/ExtensionManager.ts`  
**Purpose**: Central coordinator that orchestrates all services and manages extension lifecycle.

```typescript
export class ExtensionManager {
  private services: Map<string, BaseService>;
  
  async activate(context: vscode.ExtensionContext): Promise<void>
  async deactivate(): Promise<void>
}
```

#### ⌨️ KeypressNotificationService  
**Location**: `src/services/KeypressNotificationService.ts`  
**Purpose**: Core service that detects keypress events by overriding VS Code commands.

```typescript
export class KeypressNotificationService extends BaseService {
  private registerCommandOverrides(): void
  private handleKeypressDetected(command: string): Promise<void>
}
```

#### 🔔 NotificationService
**Location**: `src/services/NotificationService.ts`  
**Purpose**: Handles displaying notifications to users with customizable formatting.

```typescript
export class NotificationService extends BaseService {
  async showNotification(message: string, type?: NotificationType): Promise<void>
}
```

#### ⚙️ ConfigurationService
**Location**: `src/services/ConfigurationService.ts`  
**Purpose**: Manages extension configuration and settings changes.

```typescript
export class ConfigurationService extends BaseService {
  getConfiguration<T>(key: string): T
  onConfigurationChange(callback: () => void): vscode.Disposable
}
```

---

## 🔧 Development Commands

### 🏗️ Building & Compilation

```bash
# Compile TypeScript
pnpm run compile

# Watch mode (auto-compile on changes)
pnpm run watch

# Production build (optimized)
pnpm run package

# Clean build artifacts
pnpm run clean
```

### 🧪 Testing

```bash
# Run all tests
pnpm test

# Run only E2E tests
pnpm run test:e2e

# Run tests in watch mode  
pnpm run test:watch

# Quick test (compile + test)
pnpm run test:quick

# Manual testing with extension host
pnpm run test:manual

# Setup mock workspace for testing
pnpm run test:setup
```

### 🕵️ Code Quality

```bash
# Lint code
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Type checking
pnpm run check-types

# Format code
pnpm run format
```

---

## 🧪 Testing Strategy

### Test Environment Setup

The extension includes a comprehensive testing infrastructure:

#### 🎮 Manual Testing
```bash
# Launch extension in development host with mock workspace
pnpm run test:manual
```

This opens a new VS Code window with:
- Extension loaded in development mode
- Pre-configured test workspace
- Sample files for testing different scenarios

#### 🤖 Automated Testing
```bash
# Run E2E tests
pnpm run test:e2e
```

Tests are located in `test/e2e/` and cover:
- Extension activation/deactivation
- Command override functionality
- Configuration changes
- Cross-platform compatibility

#### 📁 Mock Workspace
Location: `test/mock-workspace/`

Contains sample files for testing:
- `sample.js` - JavaScript code
- `sample.ts` - TypeScript with complex syntax
- `sample.json` - Configuration file
- `sample.md` - Markdown with formatting
- `sample.txt` - Plain text

### Writing Tests

Example test structure:

```typescript
// test/e2e/feature.test.ts
import * as vscode from 'vscode';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';

describe('Feature Tests', () => {
  before(async () => {
    // Setup test environment
    await vscode.extensions.getExtension('VijayGangatharan.keypress-notifications')?.activate();
  });

  it('should detect copy command', async () => {
    // Test implementation
  });
});
```

---

## 🔄 Node.js Compatibility Development

### Multi-Version Testing

The project supports Node.js 16-22+. Test across versions:

```bash
# Using nvm (Node Version Manager)
nvm use 16 && pnpm test
nvm use 18 && pnpm test  
nvm use 20 && pnpm test
nvm use 22 && pnpm test
```

### Compatibility Guidelines

1. **ES2020 Target**: Code compiles to ES2020 for broad compatibility
2. **No Node.js Specific APIs**: Avoid Node.js APIs not available in extension host
3. **Polyfills**: Use polyfills for missing features in older Node versions
4. **CI Testing**: All versions tested automatically in CI

---

## 🎨 Code Style & Standards

### ESLint Configuration

The project uses ESLint with TypeScript rules:

```json
// eslint.config.mjs
export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    rules: {
      "@stylistic/semi": ["error", "always"],
      "curly": ["error", "all"],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "import",
          "format": ["camelCase", "PascalCase"]
        }
      ]
    }
  }
];
```

### Coding Standards

1. **Naming Conventions**:
   - Classes: `PascalCase`
   - Functions/Variables: `camelCase`  
   - Constants: `UPPER_SNAKE_CASE`
   - Files: `PascalCase.ts` for classes, `camelCase.ts` for utilities

2. **TypeScript Guidelines**:
   - Use strict type checking
   - Prefer interfaces over types for object shapes
   - Use enums for constants with meaning
   - Document public APIs with JSDoc

3. **Error Handling**:
   - Always handle errors appropriately
   - Use structured logging via logger utility
   - Fail gracefully without breaking VS Code

4. **Performance**:
   - Avoid synchronous operations
   - Use disposables for cleanup
   - Minimize extension activation time

### Example Code Style

```typescript
/**
 * Service responsible for handling keypress notifications
 */
export class KeypressNotificationService extends BaseService {
  private readonly commandOverrides = new Map<string, vscode.Disposable>();
  
  /**
   * Initializes the service and registers command overrides
   */
  public async initialize(): Promise<void> {
    try {
      this.registerCommandOverrides();
      this.logger.info('KeypressNotificationService initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize KeypressNotificationService', error);
      throw error;
    }
  }
  
  private registerCommandOverrides(): void {
    const commands = [
      'editor.action.clipboardCopyAction',
      'editor.action.clipboardCutAction',
      'editor.action.clipboardPasteAction'
    ];
    
    commands.forEach(command => {
      const disposable = vscode.commands.registerCommand(command, async () => {
        await this.handleKeypressDetected(command);
        await vscode.commands.executeCommand(`original.${command}`);
      });
      
      this.commandOverrides.set(command, disposable);
      this.addDisposable(disposable);
    });
  }
}
```

---

## 🔍 Debugging

### VS Code Debugging Setup

1. **Launch Configuration** (`.vscode/launch.json`):
   ```json
   {
     "type": "extensionHost",
     "request": "launch",
     "name": "Run Extension",
     "runtimeExecutable": "${execPath}",
     "args": [
       "--extensionDevelopmentPath=${workspaceFolder}",
       "--extensionTestsPath=${workspaceFolder}/out/test"
     ],
     "sourceMaps": true
   }
   ```

2. **Debug Process**:
   - Set breakpoints in TypeScript source
   - Press `F5` or use Debug panel
   - Extension opens in new VS Code window
   - Debug in original window

### Logging & Diagnostics

```typescript
// Use the built-in logger
import { logger } from '../utils/logger';

export class MyService {
  private handleEvent(): void {
    logger.debug('Processing event', { eventType: 'keypress' });
    
    try {
      // ... logic
      logger.info('Event processed successfully');
    } catch (error) {
      logger.error('Failed to process event', error);
    }
  }
}
```

### Common Debug Scenarios

1. **Extension Not Activating**:
   - Check package.json activationEvents
   - Verify main entry point
   - Check for syntax errors

2. **Commands Not Working**:
   - Verify command registration
   - Check command ID matches package.json
   - Ensure proper disposal

3. **Configuration Issues**:
   - Validate configuration schema
   - Check setting scope (user vs workspace)
   - Verify configuration change handling

---

## 📦 Build & Release Process

### Build Configuration

The project uses esbuild for fast compilation:

```javascript
// esbuild.config.js
const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  format: 'cjs',
  minify: production,
  sourcemap: !production,
  platform: 'node',
  outfile: 'dist/extension.js',
  external: ['vscode'],
  watch: watch ? {
    onRebuild(error, result) {
      console.log('[watch] build finished');
    },
  } : false,
});
```

### Release Workflow

1. **Version Bump**: Update version in `package.json`
2. **Changelog**: Update `CHANGELOG.md` with changes
3. **Build**: Run `pnpm run package` for production build
4. **Test**: Ensure all tests pass across platforms
5. **Tag**: Create git tag `v1.0.0`
6. **CI/CD**: GitHub Actions handles marketplace publishing

### Packaging for Distribution

```bash
# Install VSCE (VS Code Extension manager)
npm install -g vsce

# Package extension
vsce package

# Publish to marketplace (CI handles this)
vsce publish
```

---

## 🤝 Contributing Guidelines

### Pull Request Process

1. **Fork & Clone**: Fork repository and clone locally
2. **Branch**: Create feature branch from `master`
3. **Develop**: Make changes following coding standards
4. **Test**: Ensure all tests pass
5. **Document**: Update relevant documentation
6. **Submit**: Create pull request with descriptive title

### PR Requirements

- ✅ All tests pass
- ✅ Code follows style guidelines
- ✅ TypeScript compiles without errors
- ✅ No new ESLint warnings
- ✅ Documentation updated if needed
- ✅ CHANGELOG.md updated for user-facing changes

### Issue Reporting

Use appropriate issue templates:
- 🐛 **Bug Report**: For functionality issues
- ✨ **Feature Request**: For new functionality
- 📚 **Documentation**: For documentation improvements
- 🚀 **Performance**: For performance issues
- 🔧 **Compatibility**: For compatibility problems

---

## 🔬 Advanced Development

### VS Code API Usage

Key VS Code APIs used in this extension:

```typescript
// Command registration
vscode.commands.registerCommand('command.id', handler);

// Configuration access
vscode.workspace.getConfiguration('keypress-notifications');

// Notifications
vscode.window.showInformationMessage('Message');

// Extension context
context.subscriptions.push(disposable);
```

### Extension Host Communication

The extension runs in the Extension Host process:

```typescript
// Extension activation
export function activate(context: vscode.ExtensionContext) {
  const manager = new ExtensionManager();
  return manager.activate(context);
}

// Extension deactivation  
export function deactivate() {
  return ExtensionManager.getInstance()?.deactivate();
}
```

### Performance Optimization

1. **Lazy Loading**: Load services only when needed
2. **Debouncing**: Debounce frequent events
3. **Efficient Disposals**: Properly dispose resources
4. **Memory Management**: Avoid memory leaks

---

## 📚 Resources & References

### VS Code Extension Development
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### Project Resources
- [GitHub Repository](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension)
- [Issue Tracker](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension/issues)
- [Documentation Site](https://vijay431.github.io/vscode-keypress_snackbar_notification-extension/)
- [Marketplace Page](https://marketplace.visualstudio.com/items?itemName=VijayGangatharan.keypress-notifications)

### Community
- [GitHub Discussions](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension/discussions)
- [Contact](mailto:vijayanand431@gmail.com)

---

**🎉 Happy coding! Thank you for contributing to Keypress Notifications!**

💡 **Pro Tip**: Star the repository ⭐ and join our community to stay updated with the latest developments!