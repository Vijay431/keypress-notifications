# Copilot Instructions

Keypress Notifications is a TypeScript VS Code extension using pnpm, esbuild, Vitest unit tests, and `@vscode/test-electron` E2E tests.

## Architecture

- Extension activation starts in `src/extension.ts` — calls `initializeContainer`, then activates `ExtensionManager`.
- `src/di/container.ts` implements a lightweight custom DI container (Symbol tokens in `src/di/types.ts`). All services are singletons.
- `src/services/` — `KeypressService` (core: wraps VS Code commands, detects multi-key combos, throttles notifications), `ConfigurationService` (typed workspace config access), `AccessibilityService` (screen reader stub).
- `src/commands/` — each VS Code command is a class extending `BaseCommandHandler`. Use `this.success()` / `this.error()` for results, `this.logger` (via `ILogger`) for logging.
- `src/managers/CommandRegistry.ts` — instantiates and registers command handlers with VS Code.
- `src/managers/ExtensionManager.ts` — coordinates activation/deactivation lifecycle.
- DI contracts live in `src/di/interfaces/`; shared types in `src/types/extension.ts`.
- Keep user-facing docs in `README.md` and `CHANGELOG.md` aligned with behavior changes.

## Development Rules

- Use TypeScript strict mode — no `any`, `noImplicitAny`, `exactOptionalPropertyTypes`, `noUnusedLocals`.
- Zero runtime dependencies — everything bundles into `dist/extension.js` at build time.
- Do not commit generated output in `dist/`, `out/`, `.vsix` files, or compiled `.js`/`.js.map` files.
- Prefer focused changes and Conventional Commits.
- Update `package.json`, related types, tests, and docs together when configuration or command behavior changes.

## Commands

- Install: `pnpm install`
- Build: `pnpm run build`
- Lint: `pnpm run lint`
- Type check: `pnpm run check-types`
- Unit tests: `pnpm run test:unit`
- Coverage: `pnpm run test:unit:coverage`
- E2E tests: `pnpm test` (downloads VS Code, requires `xvfb` on Linux)
- Package VSIX: `pnpm run package`

Run `pnpm run check-types` and `pnpm run test:unit` before any user-facing behavior or DI wiring changes.

## Workflow Cache Automation

- CI and release workflows cache pnpm package data and warm `node_modules` for faster jobs.
- `.github/workflows/cache-cleanup.yml` runs every 3 days at 08:00 IST and deletes GitHub Actions cache entries not used for 7 days or more.
- `.github/workflows/security-audit.yml` runs daily at 02:00 UTC using `pnpm audit` (respects `pnpm-workspace.yaml` overrides); creates a GitHub issue only when high or critical vulnerabilities are found.
- Keep README, CHANGELOG, CLAUDE.md, CONTRIBUTING.md, AGENTS.md, and this file aligned when workflow cache or security-audit behavior changes.

## Assistant Conventions

### Communication

Default to **caveman mode** (terse: drop articles/filler/pleasantries; fragments OK). Keep technical substance exact. Code/commits/PRs/security warnings stay in normal English. Disable on request ("normal mode").

### Shell commands

Prepend `rtk` to all shell invocations when available — 60-90% token savings on dev ops. Examples: `rtk git status`, `rtk pnpm test`, `rtk ls`. Fallback to direct command if `rtk` unavailable, or for compound predicates (`find -not`, `find -exec`) which rtk does not support.
