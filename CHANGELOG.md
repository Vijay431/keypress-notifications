# 📝 Changelog

## [2.0.0]

### Added

- **KeypressService:** expanded from 19 to 42 wrapped commands, adding coverage across the Explorer and workbench. New notifications fire for: Explorer copy/cut/paste (`filesExplorer.*`), undo/redo, select-all, find, find-replace, move/copy lines up/down, delete line, quick-fix, split editor, reopen closed editor, go to symbol, open settings, SCM view, Extensions view, Debug view, Problems view, and new terminal.
- Scheduled GitHub Actions cache cleanup removes caches not used for 7 days or more every 3 days at 08:00 IST.
- pnpm-based daily security audit workflow (`security-audit.yml`) replaces the removed npm-based one; respects `pnpm-workspace.yaml` overrides so phantom high-severity reports no longer occur.
- `audit` job in `ci.yml` runs `pnpm audit --audit-level=high` on every PR/push; `dependency-review` job blocks high-severity dependency introductions on pull requests.
- `size/override` label added to `.github/labels.yml` — the documented escape hatch for the PR commit-size hard-fail on intentionally large PRs.
- VS Code 1.111.0 engine target with @types/vscode ^1.111.0 and @types/node ^22
- 19 contributes.keybindings entries — core notification feature now fires in production
- ACM-aligned test harness: test/suite/ with test/runTests.ts (Mocha TDD via @vscode/test-electron)
- Unit tests for AccessibilityService, Logger, CommandRegistry, ExtensionManager, ConfigMigrator
- husky and lint-staged pre-commit hooks
- .cursorignore, .coderabbit.yaml, tsconfig.eslint.json added
- public/ directory placeholder

### Changed

- **Docs:** README and Marketplace metadata rewritten for discoverability — pain-point pitch, install badges, demo media slot, "Who it's for" use cases, expanded keywords, `Education` category, gallery banner.
- **License:** changed from Proprietary to MIT (open source).
- **ExtensionManager:** services now injected via constructor instead of DI lazy getters, matching project DI conventions; double-dispose on `context.subscriptions` removed; dev-mode banner now uses `context.extensionMode === ExtensionMode.Development` instead of `process.env.NODE_ENV`.
- **NOTICE.md:** dependency license statement updated to accurately reflect multi-license devDependency set (MIT, ISC, Apache-2.0, BSD, BlueOak-1.0.0, EPL-2.0).

### Fixed

- **ExtensionManager:** removed redundant `dispose()` method that double-disposed `commandRegistry` and all services already managed by `context.subscriptions`.
- **KeypressService:** `commandKeyMap` hoisted to `private static readonly COMMAND_KEY_MAP` to avoid per-instance allocation.
- **Logger:** added `_resetInstance()` static method for test isolation, replacing unsafe `as unknown as` cast in unit tests.
- **CommandRegistry:** `registerCommand` now disposes the existing `vscode.Disposable` before re-registering the same command ID, preventing a disposable leak.
- **ConfigMigrator:** magic string `'__kn_migrationVersion'` hoisted to a `static readonly` class constant.
- **CI workflows:** `persist-credentials: false` added to all `actions/checkout` steps (ci, release, all-contributors, labels-sync, pr-commit-size) to prevent token persistence.
- **pr-commit-size:** `github.base_ref` moved into an `env:` variable to eliminate template-injection code-execution risk.
- **release:** workflow-level `contents: write` permission narrowed to `contents: read`; `contents: write` promoted to the `create-release` job only.
- **ci:** removed `cache: pnpm` from all `actions/setup-node` steps; restore-only jobs never run `pnpm install`, so setup-node's post-job store-save failed with `Path Validation Error` and broke the `Warm node_modules cache` matrix. `node_modules` (`actions/cache`, keyed on runner OS + Node version + `pnpm-lock.yaml`) is now the sole dependency cache.
- Log-level configuration now correctly maps string setting to numeric LogLevel enum
- Logger.setLogLevel() now called on activate and config change
- KeypressService and ConfigurationService disposables now properly wired to context.subscriptions
- Untracked setTimeout in detectKeyPress() now cleared on dispose
- ConfigValidator no longer incorrectly resets logLevel to INFO on every activation
- KeypressService wrapper registration bounded to 19 known commands (was hundreds via getCommands())

### Tests

- **extension.test.ts:** fixed `any` types, tautological assertion (`ext.isActive || true`), and replaced fixed `setTimeout` waits with a `waitFor()` polling helper to de-flake the integration suite.
- **DIContainer.test.ts / ExtensionManager.test.ts:** all `it()` descriptions now start with "should " per project convention.
- **tsconfig.test.json:** `src/**/*` removed from `include` so relaxed test compiler flags no longer apply to source files.
- `logo.png` recompressed: resized 1120×1120 → 256×256 and palette-quantized (~102 KB → ~5 KB).
- `vsce`/`ovsx` `dependencies` set to `false`; extension is fully esbuild-bundled with no runtime deps so vsce no longer scans node_modules during packaging.
- `dist/meta.json`, `pnpm-workspace.yaml`, and `.vscode-test.mjs` excluded from the `.vsix` via `.vscodeignore`; total package size drops from ~118 KB to ~20 KB.
- Build output now prints a single standard budget warning (`⚠️  WARNING: bundle X KB exceeds budget Y KB (+Z KB)`) only when the bundle exceeds the 50 KB target; removed verbose under-budget message.

### Removed

- npm-based `security-audit.yml` (was on `main`, generated false-positive daily alerts because npm ignores pnpm overrides).
- Dead code: Cache, memoize, IMetricCollector (unused utilities never wired in production)
- Obsolete scripts: create-minimal, test:full, test:minimal, test:quick, test:clean, validate:lockfile
- Unused devDependencies: fs-extra, picocolors, fast-glob

### Security

- pnpm workspace overrides added for serialize-javascript, diff, tmp, fast-uri, postcss, brace-expansion — reduces pnpm audit to 0 vulnerabilities

---

<details>
<summary><h2>[1.0.0]</h2></summary>

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

</details>

<details>
<summary><h2>🌟 [0.0.1]</h2></summary>

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

</details>
