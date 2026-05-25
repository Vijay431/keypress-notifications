# 📝 Changelog

## [Unreleased]

### Added
- Scheduled GitHub Actions cache cleanup removes caches not used for 7 days or more every 3 days at 08:00 IST.
- pnpm-based daily security audit workflow (`security-audit.yml`) replaces the removed npm-based one; respects `pnpm-workspace.yaml` overrides so phantom high-severity reports no longer occur.
- `audit` job in `ci.yml` runs `pnpm audit --audit-level=high` on every PR/push; `dependency-review` job blocks high-severity dependency introductions on pull requests.

### Removed
- npm-based `security-audit.yml` (was on `main`, generated false-positive daily alerts because npm ignores pnpm overrides).

## [2.0.0] - 2026-05-23

### Added
- VS Code 1.111.0 engine target with @types/vscode ^1.111.0 and @types/node ^22
- 19 contributes.keybindings entries — core notification feature now fires in production
- ACM-aligned test harness: test/suite/ with test/runTests.ts (Mocha TDD via @vscode/test-electron)
- Unit tests for AccessibilityService, Logger, CommandRegistry, ExtensionManager, ConfigMigrator
- husky and lint-staged pre-commit hooks
- .cursorignore, .coderabbit.yaml, tsconfig.eslint.json added
- public/ directory placeholder

### Fixed
- Log-level configuration now correctly maps string setting to numeric LogLevel enum
- Logger.setLogLevel() now called on activate and config change
- KeypressService and ConfigurationService disposables now properly wired to context.subscriptions
- Untracked setTimeout in detectKeyPress() now cleared on dispose
- ConfigValidator no longer incorrectly resets logLevel to INFO on every activation
- KeypressService wrapper registration bounded to 19 known commands (was hundreds via getCommands())

### Removed
- Dead code: Cache, memoize, IMetricCollector (unused utilities never wired in production)
- Obsolete scripts: create-minimal, test:full, test:minimal, test:quick, test:clean, validate:lockfile
- Unused devDependencies: fs-extra, picocolors, fast-glob

### Security
- pnpm workspace overrides added for serialize-javascript, diff, tmp, fast-uri, postcss, brace-expansion — reduces pnpm audit to 0 vulnerabilities

---


Updates and improvements to the Keypress Notifications VS Code extension.

---

## [1.0.0] - 2025-09-28

### 🔧 **Build System & Infrastructure**

- **📦 npm Migration**: Migrated from pnpm to npm for better ecosystem compatibility
- **⚡ Optimized Scripts**: Streamlined build, test, and development commands
- **🔒 Enhanced Security**: Using package-lock.json for dependency integrity
- **📚 Documentation**: Updated all documentation to reflect current implementation
- **🔄 CI/CD Enhancements**:
  - Added node_modules caching for faster builds
  - Improved dependency analysis and validation
  - Enhanced code quality checks
  - Package validation and bundle analysis stages

### 📈 **Testing & Quality**

- **✅ Fixed TypeScript Errors**: Resolved compilation issues for cleaner builds
- **🎮 Enhanced Test Framework**: Improved E2E test reliability with multiple test modes
- **📊 Bundle Optimization**: Maintained minimal extension package size
- **🔧 Developer Tools**: Added development scripts for better workflow
- **🧪 Test Commands**:
  - `npm run test:full`: Full tests without optimization
  - `npm run test:minimal`: Minimal test run
  - `npm run test:quick`: Fast compile + test for CI
  - `npm run test:clean`: Clean test artifacts

### 🔄 **Architecture Improvements**

- **🏗️ Manager Pattern**: Introduced ExtensionManager for better lifecycle management
- **📦 Service Architecture**:
  - `ExtensionManager`: Coordinates extension lifecycle
  - `KeypressService`: Core keypress detection functionality
  - `ConfigurationService`: Centralized configuration management
  - `BaseService`: Abstract base class for consistent service patterns
- **📖 Accurate Documentation**: Updated all docs to match actual implementation
- **⚙️ Configuration**: Four settings (enabled, minimumKeys, excludedCommands, showCommandName)

### **Migration Notes**

✅ **Zero Breaking Changes**: All functionality remains identical for end users
✅ **Improved Development**: Better build process and testing workflow
✅ **Enhanced Architecture**: Cleaner separation of concerns with manager and service patterns
✅ **Accurate Documentation**: All docs now match the actual implementation

---

## 🌟 [0.0.1] - December 28, 2024

### 🎉 **Initial Release**

The first version of Keypress Notifications for VS Code.

### ✨ **Features**

- Basic keybinding detection for common multi-key combinations
- Simple notifications when commands are executed
- Support for clipboard operations (Copy, Cut, Paste)
- Basic commands: Activate, Deactivate, Show Output
- Configuration options for enabling/disabling notifications

### 🏗️ **Foundation**

- VS Code 1.90.0+ compatibility
- Proper extension lifecycle management
- Clean activation and deactivation
