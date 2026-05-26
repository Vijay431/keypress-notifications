# Contributing to Keypress Notifications

Thank you for your interest in contributing to Keypress Notifications! We welcome contributions from the community and appreciate your help in making this VS Code extension better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 22+ required; Node.js 22 LTS recommended)
- [PNPM](https://pnpm.io/) (install with `npm install -g pnpm`)
- [Visual Studio Code](https://code.visualstudio.com/) (version 1.111+ for development and testing)
- [Git](https://git-scm.com/)
- Run `pnpm run system:verify` after install to set up Husky git hooks

### Types of Contributions

We welcome several types of contributions:

- **Bug Reports** — Help us identify and fix issues
- **Feature Requests** — Suggest new functionality
- **Documentation** — Improve or add documentation
- **Code Contributions** — Fix bugs or implement features

## Development Setup

### 1. Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/keypress-notifications.git
   cd keypress-notifications
   ```

### 2. Install Dependencies

```bash
pnpm install
pnpm run system:verify   # sets up Husky pre-commit hooks
```

### 3. Build the Extension

```bash
pnpm run build
```

### 4. Run Tests

```bash
# Unit tests (fast, no VS Code required)
pnpm run test:unit

# Integration tests (launches a real VS Code instance)
pnpm run test:integration
```

### 5. Open in VS Code

Press `F5` to launch the Extension Development Host with the extension loaded.

## Project Architecture

Keypress Notifications follows a layered architecture with dependency injection:

- **`src/extension.ts`** — Entry point; bootstraps DI container and ExtensionManager
- **`src/di/`** — DI container, service tokens, interfaces
- **`src/services/`** — KeypressService (command wrapper + notification), ConfigurationService, AccessibilityService
- **`src/managers/`** — ExtensionManager (lifecycle), CommandRegistry (VS Code command registration)
- **`src/commands/`** — EnableCommand, DisableCommand, ShowOutputChannelCommand
- **`src/utils/`** — Logger, ConfigValidator, ConfigMigrator
- **`src/types/`** — Shared TypeScript types and enums

Services are registered as singletons in the DI container (`src/di/container.ts`) and retrieved via `getService<T>(TYPES.X)`. New services must be registered there before use.

## Making Changes

### Branch Naming

```
feat/short-description
fix/short-description
chore/short-description
docs/short-description
```

### Code Style

- TypeScript strict mode — no `any`, no implicit returns, no unused locals
- No runtime dependencies — this extension has zero runtime deps by design
- Use `unknown` in catch blocks (`useUnknownInCatchVariables` is on)
- Prefer `readonly` for fields that don't change after construction
- All async operations must handle errors — unhandled rejections fail silently in the extension host
- **pnpm only** — do not use npm or yarn

### Adding a New Keyboard Shortcut

1. Add the command→key mapping to `commandKeyMap` in `src/services/KeypressService.ts`
2. Add a corresponding `contributes.keybindings` entry in `package.json`
3. Add a unit test in `test/unit/KeypressService.test.ts`
4. Add an integration test in `test/suite/extension.test.ts`

### Adding a New VS Code Command

1. Create a handler in `src/commands/` implementing `ICommandHandler`
2. Register it in `ExtensionManager.activate()` via `CommandRegistry.registerCommands()`
3. Add a `contributes.commands` entry in `package.json`
4. Write unit tests for the handler

## Submitting Changes

### Before Submitting

```bash
pnpm run check-types     # TypeScript must compile clean
pnpm run lint            # ESLint must pass
pnpm run format:check    # Prettier must pass
pnpm run test:unit       # All unit tests must pass
pnpm run build           # Extension must build
```

### Pull Request Process

1. Ensure all checks above pass locally
2. Write a clear PR description explaining what changed and why
3. Reference any related issues with `Fixes #N` or `Relates to #N`
4. Keep PRs focused — one feature or fix per PR
5. Update documentation if your change affects behavior

### Workflow Automation

CI and release workflows use GitHub Actions cache for pnpm package storage and `node_modules` warm starts. The cache cleanup workflow removes repository cache entries tied to deleted branches or closed pull requests; age-based cleanup is handled by repository settings. The PR security workflow (`.github/workflows/security-pr.yml`) runs on every PR and push to `main`/`v2`: `pnpm audit --audit-level=high` blocks high/critical CVEs, and `actions/dependency-review-action` gates PR dependency changes. The daily security workflow (`.github/workflows/security-daily.yml`) runs at 02:00 UTC and on `pnpm-lock.yaml`/`package.json` changes on `main`; it creates a GitHub issue only when high or critical vulnerabilities are detected and respects `pnpm-workspace.yaml` overrides so patched transitive dependencies do not produce false alerts. Update these workflows and maintainer docs together when changing schedules, cache keys, retention rules, or audit behavior.

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Ctrl+Z (undo) to notification shortcuts
fix: dispose ConfigurationService on deactivation
docs: update README with new configuration options
chore: bump @types/vscode to ^1.111.0
```

## Style Guidelines

### TypeScript

- Follow the existing code patterns in `src/`
- Services receive dependencies via constructor injection (not `getService` inside methods)
- Use `@deprecated` JSDoc on static singleton getters that exist for backwards compatibility
- Dispose all VS Code `Disposable` objects — push them to `context.subscriptions` or track in `this.disposables`

### Tests

- Unit tests: `test/unit/*.test.ts` — use vitest, mock the `vscode` module via `test/__mocks__/vscode.ts`
- Integration tests: `test/suite/*.test.ts` — use Mocha TDD style (`suite/test/suiteSetup`)
- Every new feature needs both unit tests (for logic) and integration tests (for VS Code behaviour)

### Documentation

- Update `CHANGELOG.md` with your changes under an `[Unreleased]` section
- Update `README.md` if you add user-visible configuration or commands
- Update `THIRDPARTY.md` if you add a new dependency

## Community

- Open an issue for bugs or feature requests before starting work on large changes
- Ask questions by opening a GitHub Discussion or issue

Thank you for contributing to Keypress Notifications!
