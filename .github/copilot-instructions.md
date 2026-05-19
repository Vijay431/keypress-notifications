# Copilot Instructions

Keypress Notifications is a TypeScript VS Code extension using pnpm, esbuild, Vitest unit tests,
and `@vscode/test-electron` E2E tests. It intercepts VS Code command execution and shows
on-screen notifications when multi-key shortcuts are executed.

## Architecture

- Extension activation starts in `src/extension.ts`.
- Command handlers live in `src/commands/`; each handler extends `BaseCommandHandler`.
- Services live in `src/services/`; shared contracts in `src/di/interfaces/` and `src/types/`.
- DI container in `src/di/container.ts` wires services as singletons.
- `KeypressService` owns the `COMMAND_METADATA` map and 250ms throttle logic.

## Development Rules

- Use TypeScript and existing service/DI patterns.
- Do not commit generated output in `dist/`, `out/`, `.vsix` files, or compiled `.js`/`.js.map`.
- Prefer focused changes and Conventional Commits.
- Update `package.json`, related types, tests, and docs together when configuration or
  command behavior changes.
- Zero runtime dependencies: everything bundles into `dist/extension.js`.

## Commands

- Install: `pnpm install`
- Build: `pnpm run build`
- Lint: `pnpm run lint`
- Unit tests: `pnpm run test:unit`
- Coverage: `pnpm run test:unit:coverage`
- E2E tests: `pnpm test`
- Package VSIX: `pnpm run package`

## Assistant Conventions

Default to **caveman mode** (terse: drop articles/filler/pleasantries; fragments OK).
Keep technical substance exact. Code/commits/PRs/security warnings stay in normal English.
Disable on request ("normal mode").

Prepend `rtk` to shell invocations when available — 60-90% token savings. Examples:
`rtk git status`, `rtk pnpm test`. Fallback to direct command if `rtk` unavailable.
