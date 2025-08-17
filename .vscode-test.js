const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig([
  {
    label: 'unitTests',
    files: 'dist/test/unit/**/*.test.js',
    version: 'stable',
    mocha: {
      ui: 'bdd',
      timeout: 20000,
      reporter: 'spec'
    }
  },
  {
    label: 'e2eTests',
    files: 'dist/test/e2e/**/*.test.js',
    version: 'stable',
    launchArgs: [
      '--disable-extensions',
      '--disable-workspace-trust'
    ],
    mocha: {
      ui: 'bdd',
      timeout: 30000,
      reporter: 'spec'
    }
  },
  {
    label: 'manualTests',
    files: 'dist/test/e2e/**/*.test.js',
    version: 'stable',
    workspaceFolder: './test/mock-workspace',
    launchArgs: [
      '--disable-extensions',
      '--disable-workspace-trust',
      '--disable-telemetry'
    ],
    mocha: {
      ui: 'bdd',
      timeout: 60000,
      reporter: 'spec'
    }
  }
]);