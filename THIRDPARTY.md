# Third-Party Notices

Keypress Notifications has **no runtime dependencies**. All packages listed below are development-only tools used to build, test, lint, and publish the extension. They are not bundled into or distributed with the extension itself.

---

## Development Dependencies

| Package | License | Notes |
|---|---|---|
| @vitest/coverage-v8 | MIT | Code coverage via V8 |
| @vscode/test-electron | MIT | VS Code extension test runner |
| @vscode/vsce | MIT | VS Code extension packaging tool |
| all-contributors-cli | MIT | Contributors table generator |
| esbuild | MIT | TypeScript/JavaScript bundler |
| eslint | MIT | JavaScript/TypeScript linter |
| glob | ISC | File pattern matching |
| husky | MIT | Git hook manager |
| lint-staged | MIT | Run linters on staged files |
| mocha | MIT | Test framework (used via @vscode/test-electron) |
| ovsx | EPL-2.0 | Open VSX Registry publishing tool |
| prettier | MIT | Code formatter |
| rimraf | ISC | Cross-platform `rm -rf` |
| tsx | MIT | TypeScript execution engine |
| typescript | Apache-2.0 | TypeScript compiler |
| vitest | MIT | Unit test framework |

### Transitive dependency licenses (selected)

The following licenses appear among transitive development dependencies:

| License | Representative packages |
|---|---|
| Apache-2.0 | `@ampproject/remapping`, `@eslint/*`, `detect-libc`, `eslint-visitor-keys`, `typescript` |
| BSD-2-Clause | `rc` (also MIT or Apache-2.0) |
| ISC | `glob`, `rimraf` |
| MIT | Majority of the dependency graph |
| 0BSD | `tslib` |
| (MIT AND Zlib) | `pako` |
| (MIT OR GPL-3.0-or-later) | `jszip` |
| EPL-2.0 | `ovsx` |

The full license list can be reproduced at any time by running:

```sh
pnpm licenses list
```

---

## EPL-2.0 Notice (ovsx)

`ovsx` is licensed under the Eclipse Public License 2.0. It is used only as a CLI publishing tool and is not incorporated into the extension binary. The full text of EPL-2.0 is available at <https://www.eclipse.org/legal/epl-2.0/>.

---

## Apache-2.0 Notice (typescript)

`typescript` is licensed under the Apache License 2.0 by Microsoft Corporation. It is used only at compile time and is not incorporated into the extension binary. The full text of Apache-2.0 is available at <https://www.apache.org/licenses/LICENSE-2.0>.
