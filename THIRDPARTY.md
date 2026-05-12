# Third-Party Software Notices

Keypress Notifications for VS Code does **not bundle any runtime dependencies** — the extension package (`dist/extension.js`) contains only the original source code. All packages listed below are development-time tools used to build, test, or lint the project; none of them are shipped to end users.

---

## Development Dependencies

| Package | Version Range | License | Purpose |
|---------|--------------|---------|---------|
| [@eslint/js](https://github.com/eslint/eslint) | ^10.0.0 | MIT | ESLint core JS rules |
| [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic) | ^5.2.2 | MIT | ESLint stylistic rules |
| [@types/fs-extra](https://github.com/DefinitelyTyped/DefinitelyTyped) | ^11.0.4 | MIT | TypeScript types for fs-extra |
| [@types/mocha](https://github.com/DefinitelyTyped/DefinitelyTyped) | ^10.0.10 | MIT | TypeScript types for Mocha |
| [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped) | ^22.19.7 | MIT | TypeScript types for Node.js |
| [@types/vscode](https://github.com/microsoft/vscode) | ^1.102.0 | MIT | VS Code API type definitions |
| [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) | ^8.44.1 | MIT | TypeScript-specific ESLint rules |
| [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint) | ^8.44.1 | MIT | TypeScript parser for ESLint |
| [@vscode/test-cli](https://github.com/microsoft/vscode-test) | ^0.0.11 | MIT | VS Code test CLI runner |
| [@vscode/test-electron](https://github.com/microsoft/vscode-test) | ^2.5.2 | MIT | VS Code E2E test infrastructure |
| [@vscode/vsce](https://github.com/microsoft/vscode-vsce) | ^3.6.1 | MIT | VS Code extension packaging tool |
| [c8](https://github.com/bcoe/c8) | ^10.1.3 | ISC | Native V8 code coverage reporter |
| [esbuild](https://github.com/evanw/esbuild) | ^0.27.2 | MIT | JavaScript/TypeScript bundler |
| [eslint](https://github.com/eslint/eslint) | ^9.31.0 | MIT | JavaScript/TypeScript linter |
| [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) | ^2.32.0 | MIT | ESLint rules for ES6 imports |
| [eslint-plugin-mocha](https://github.com/lo1tuma/eslint-plugin-mocha) | ^11.1.0 | MIT | ESLint rules for Mocha tests |
| [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node) | ^11.1.0 | MIT | ESLint rules for Node.js |
| [eslint-plugin-promise](https://github.com/eslint-community/eslint-plugin-promise) | ^7.2.1 | ISC | ESLint rules for Promises |
| [eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security) | ^3.0.1 | Apache-2.0 | ESLint security rules |
| [fast-glob](https://github.com/mrmlnc/fast-glob) | ^3.3.3 | MIT | Fast file-system globbing |
| [fs-extra](https://github.com/jprichardson/node-fs-extra) | ^11.3.0 | MIT | Extended Node.js filesystem module |
| [mocha](https://github.com/mochajs/mocha) | ^11.7.1 | MIT | JavaScript test framework |
| [picocolors](https://github.com/alexeyraspopov/picocolors) | ^1.1.1 | ISC | Terminal color formatting |
| [prettier](https://github.com/prettier/prettier) | ^3.6.2 | MIT | Opinionated code formatter |
| [tsx](https://github.com/privatenumber/tsx) | ^4.19.2 | MIT | TypeScript execute (Node.js enhancer) |
| [typescript](https://github.com/microsoft/TypeScript) | ^5.9.3 | Apache-2.0 | TypeScript language compiler |
| [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) | ^8.38.0 | MIT | TypeScript ESLint tooling |

---

## Notes

- **ISC** and **MIT** licenses are permissive and compatible with this project's MIT license.
- **Apache-2.0** packages (`eslint-plugin-security`, `typescript`) are used only at build time; their license is compatible with distribution of the compiled extension under MIT.
- Exact installed versions are locked in `package-lock.json`. The table above shows declared version ranges from `package.json`.

For the full text of each license, refer to the respective package's `node_modules/<package>/LICENSE` file or the package's GitHub repository.
