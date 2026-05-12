# GitHub Copilot Instructions for Keypress Notifications

This VS Code extension shows on-screen notifications when multi-key shortcuts are executed. It is written in TypeScript with strict mode enabled and uses a lightweight custom dependency injection (DI) container.

## Architecture Overview

```
src/
├── extension.ts           # Entry point: activate() wires up the DI container
├── di/
│   ├── container.ts       # Lightweight DI container (no external libraries)
│   ├── types.ts           # Symbol tokens used as DI keys
│   ├── index.ts           # Re-exports
│   └── interfaces/        # One interface file per service contract
├── services/
│   ├── BaseService.ts     # Abstract base: initialize/enable/disable/dispose lifecycle
│   ├── KeypressService.ts # Core: intercepts VS Code commands, matches COMMAND_METADATA, throttles (250ms)
│   ├── ConfigurationService.ts  # Type-safe VS Code settings wrapper + migration
│   └── AccessibilityService.ts  # Screen reader support
├── managers/
│   ├── ExtensionManager.ts  # Coordinates activation/deactivation lifecycle
│   └── CommandRegistry.ts   # Instantiates and registers VS Code commands
├── commands/
│   ├── BaseCommandHandler.ts  # Base class: success()/error() builders, accessibility, logging
│   ├── EnableExtensionCommand.ts
│   ├── DisableExtensionCommand.ts
│   └── ShowOutputChannelCommand.ts
├── types/
│   └── extension.ts       # ExtensionConfig (typed settings shape), LogLevel enum
└── utils/
    ├── logger.ts           # Leveled logging to VS Code output channel
    ├── cache.ts            # TTL cache
    ├── metrics.ts          # Performance tracking
    ├── config-migrator.ts  # Settings version migrations
    └── config-validator.ts # Runtime configuration validation
```

## Key Patterns

### Adding a New VS Code Command
1. Create `src/commands/MyCommand.ts` extending `BaseCommandHandler`
2. Implement the `execute()` method; use `this.success()` / `this.error()` for results
3. Register in `src/managers/CommandRegistry.ts`
4. Add the command to `package.json` `contributes.commands`

### Adding a New Service
1. Define the interface in `src/di/interfaces/IMyService.ts`
2. Add a Symbol token in `src/di/types.ts`
3. Create `src/services/MyService.ts` extending `BaseService`
4. Register in `src/di/container.ts` and export from `src/di/index.ts`

### COMMAND_METADATA Map
`KeypressService.ts` maintains a static map from VS Code command IDs to notification metadata (display name, key count). To add support for a new keybinding, add an entry to this map — no other code changes are needed.

## Code Rules

- **No `any` types** — strict TypeScript with `noImplicitAny` and `exactOptionalPropertyTypes`
- **No comments explaining what code does** — only comment WHY (non-obvious constraints, workarounds)
- **No external runtime dependencies** — the bundled extension must have zero `dependencies` in `package.json`
- **Services must extend `BaseService`** — to inherit the `initialize/enable/disable/dispose` lifecycle
- **Commands must extend `BaseCommandHandler`** — to inherit logging, accessibility, and result helpers

## Testing

- **Unit tests**: `test/unit/` — run with `npm run test:unit` (no VS Code runtime needed)
- **E2E tests**: `test/e2e/` — run with `npm test` (downloads a real VS Code instance via `@vscode/test-electron`)
- Build before running tests: `tsc -p tsconfig.test.json`

## Build

`esbuild.config.ts` bundles everything to `dist/extension.js`. Production builds (`npm run vscode:prepublish`) drop `console`/`debugger` calls, minify, and check bundle size stays under 50 KB.
