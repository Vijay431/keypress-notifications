# Repository Guidelines

## Project Structure & Module Organization

This is a TypeScript VS Code extension. Runtime source lives in `src/`: `extension.ts`
is the activation entry point, `services/` contains behavior, `commands/` contains
command handlers, `managers/` coordinates lifecycle wiring, `di/` defines the dependency
container, and `utils/` holds shared helpers. Tests live in `test/unit/` for Mocha unit
coverage and `test/e2e/` for VS Code Electron scenarios. Docs are under `docs/`, helper
scripts under `scripts/`, and the icon is `logo.png`. Treat `dist/`, `.vscode-test/`,
`.vscode-test-web/`, `node_modules/`, and `*.vsix` files as generated output.

## Build, Test, and Development Commands

- `npm run build`: bundle the extension with esbuild into `dist/`.
- `npm run watch`: rebuild during local development.
- `npm run check-types`: run TypeScript with `--noEmit`.
- `npm run lint` / `npm run lint:fix`: check or fix ESLint issues in `src/`.
- `npm run format:check` / `npm run format`: verify or apply Prettier formatting.
- `npm run test:unit`: compile tests and run Mocha unit tests from `dist/test/unit/`.
- `npm test`: build, create the minimal fixture, compile tests, and run e2e tests.
- `npm run package`: create a VSIX with `vsce`.

## Coding Style & Naming Conventions

Use 2-space indentation, LF line endings, final newlines, semicolons, single quotes,
and trailing commas where valid. Keep TypeScript lines near 100 characters. Prefer
interfaces in `src/di/interfaces/` for service contracts and PascalCase class names such
as `KeypressService` or `ShowOutputChannelCommand`. Variables and functions should be
`camelCase`; constants may be `UPPER_CASE`. Avoid `any` in production code.

## Testing Guidelines

Add unit tests beside the matching area in `test/unit/**` with `*.test.ts` names. Use
Mocha `describe`/`it` suites and avoid exclusive tests. For behavior that needs VS Code
activation, command execution, or extension lifecycle coverage, add e2e tests under
`test/e2e/`. Run at least `npm run check-types`, `npm run lint`, and the relevant test
command before opening a PR.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit prefixes such as `feat:`, `fix:`,
`chore:`, `docs:`, and `refactor:`. Keep commits focused and imperative. Pull requests
should describe the user-facing change, list verification commands run, link related
issues, and include screenshots or screen recordings when notification behavior or VS
Code UI changes.

## Security & Configuration Tips

Configuration keys are declared in `package.json` and typed in `src/types/extension.ts`;
keep those in sync. Be careful with command interception, filesystem access, and logging:
avoid leaking workspace data, and preserve the existing security lint rules rather than
silencing them broadly.
