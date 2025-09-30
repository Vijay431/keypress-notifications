# 📝 Changelog

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
