# Repository Guidelines

## Project Structure & Module Organization

This is a TypeScript VS Code extension. Source code lives in `src/`: command handlers in `src/commands/`, services in `src/services/`, dependency injection in `src/di/`, managers in `src/managers/`, shared types in `src/types/`, and helpers in `src/utils/`. Unit tests are in `test/unit/`, integration tests in `test/suite/`, mocks in `test/__mocks__/`, and fixtures in `test/fixtures/`. Packaged extension assets are in `public/`. Do not edit generated output in `dist/` or `out-test/`.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies.
- `pnpm run build`: bundle the extension with esbuild.
- `pnpm run watch`: rebuild during extension development.
- `pnpm run lint`: run Biome (lint and format check).
- `pnpm run lint:fix`: apply Biome safe fixes.
- `pnpm run lint:md`: run markdownlint.
- `pnpm run format`: format the repository with Biome.
- `pnpm run typecheck`: TypeScript type checking (no emit).
- `pnpm run test:unit`: run Vitest unit tests.
- `pnpm run test:unit:coverage`: run Vitest unit tests and produce `coverage/lcov.info`.
- `pnpm run test:integration`: compile tests and run VS Code integration tests with `@vscode/test-cli` (`.vscode-test.mjs`). On Linux, wrap it in `xvfb-run -a`.
- `pnpm run check:prerelease`: fail on prerelease direct dependencies.
- `pnpm run smoke:bundle`: load the production bundle outside VS Code.
- `pnpm run package`: create a `.vsix` package.

Use Node.js 22+ and pnpm. Development uses Node 24 LTS (`.nvmrc` = `lts/jod`). For manual testing, open the repo in VS Code and press `F5`.

## Coding Style & Naming Conventions

Write TypeScript and keep modules focused by responsibility. Use PascalCase for classes and service files such as `KeypressService.ts`, camelCase for functions and variables, and command names matching package command IDs. Biome handles linting and formatting. Avoid committing compiled `.js` or `.js.map` files under `src/`, `test/`, or `scripts/`.

## Testing Guidelines

Add unit tests in `test/unit/*.test.ts` for services, utilities, and validators. Add integration tests in `test/suite/*.test.ts` when changes touch VS Code commands, keybindings, notifications, or editor interactions. Use `test/fixtures/` when possible. Run integration tests before user-facing behavior changes. Debug a test from the Test Explorer (Extension Test Runner, reads `.vscode-test.mjs`); there is no launch entry for it.

## Commit & Pull Request Guidelines

Use Conventional Commits, for example `feat(keypress): add new shortcut wrapper`, `fix(config): respect logLevel setting`, or `test(unit): cover KeypressService`. Husky runs Biome and markdownlint on staged files and commitlint on the message. Branch from `main` using prefixes such as `feature/`, `fix/`, `docs/`, or `refactor/`.

Pull requests should include a clear description, linked issues when applicable, and screenshots or recordings for visible VS Code UI changes. Before opening a PR, run `pnpm run lint`, `pnpm run lint:md`, `pnpm run typecheck`, `pnpm run build`, and relevant tests. Update `README.md` and `CHANGELOG.md` when commands or maintainer procedures change.

## Architecture

> **Note:** The definitive source of truth for architectural decisions, system overview, data flow, component boundaries, and runtime/codebase Mermaid diagrams is now located in [ARCHITECTURE.md](ARCHITECTURE.md).

Please consult `ARCHITECTURE.md` for architectural context before proposing sweeping design changes or when navigating complex module boundaries.

## Security & Configuration Tips

Do not commit secrets, local VS Code state, generated packages, coverage output, or build artifacts. Review `SECURITY.md` for vulnerability reporting. Configuration changes should update `package.json`, related types in `src/types/`, and tests together. Third-party tooling changes should keep `THIRDPARTY.md` current.

Workflows: `ci.yml` runs Biome, markdownlint, typecheck, commitlint, tests, `pnpm audit`, dependency review, a bundle smoke test, and the build matrix. `security-daily.yml` runs daily and on `pnpm-lock.yaml`/`package.json` changes on `main`, and opens one issue only for high or critical findings. `codeql.yml` and `scorecard.yml` run static analysis and supply-chain scoring. `release.yml` runs on a `v*` tag push, gates the tag with `.github/scripts/release-gate.sh`, and can be re-run through `workflow_dispatch` by actors in `RELEASE_WHITELIST_ACTORS`. Every action is pinned to a commit SHA.
