#!/usr/bin/env node

/**
 * End-to-End Test Runner for Keypress Notifications VS Code Extension
 * Optimized testing with minimal extension packages
 */

import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    const extensionDevelopmentPath = path.resolve(__dirname, '../../..');

    // Use minimal extension if optimization is enabled (default)
    const useOptimization = process.env['SKIP_OPTIMIZATION'] !== 'true';
    const testWorkspace = useOptimization
      ? path.resolve(extensionDevelopmentPath, '.vscode-test/minimal-extension')
      : extensionDevelopmentPath;

    // The path to test runner (compiled test files)
    const extensionTestsPath = path.resolve(__dirname, './index');

    console.log(`🧪 Running Keypress Notifications E2E tests...`);
    console.log(`📁 Extension path: ${testWorkspace}`);
    console.log(`🔧 Using optimization: ${useOptimization}`);

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath: testWorkspace,
      extensionTestsPath,
      launchArgs: [
        '--disable-extensions',
        '--disable-workspace-trust',
        '--user-data-dir=' + path.resolve(extensionDevelopmentPath, '.vscode-test/user-data-isolated'),
      ],
    });

    console.log('✅ All tests passed!');
  } catch (err) {
    console.error('❌ Failed to run tests:', err);
    process.exit(1);
  }
}

main();
