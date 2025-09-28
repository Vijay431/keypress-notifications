#!/usr/bin/env node

/**
 * Manual Test Runner
 *
 * This script launches VS Code with the extension loaded for manual testing.
 * It uses @vscode/test-electron to programmatically launch VS Code, which is
 * more reliable than depending on the 'code' CLI command being available.
 */

const {
  downloadAndUnzipVSCode,
  resolveCliArgsFromVSCodeExecutablePath,
} = require('@vscode/test-electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Find the project root directory by looking for package.json
 */
function findProjectRoot(startDir) {
  let currentDir = startDir;

  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.name === 'keypress-notifications') {
          return currentDir;
        }
      } catch {
        // Continue searching if package.json is malformed
      }
    }
    currentDir = path.dirname(currentDir);
  }

  throw new Error('Could not find project root containing package.json');
}

/**
 * Ensure mock workspace is set up
 */
function ensureMockWorkspace(projectRoot) {
  const mockWorkspacePath = path.join(projectRoot, 'test', 'mock-workspace');
  if (!fs.existsSync(mockWorkspacePath)) {
    console.log('🔧 Setting up mock workspace...');
    const setupScript = require('./setup-mock-workspace.js');
    setupScript.setupMockWorkspace();
  }
  return mockWorkspacePath;
}

/**
 * Create platform-specific spawn options and handle Windows path issues
 */
function createSpawnOptions(cli, args) {
  const isWindows = os.platform() === 'win32';

  console.log('🖥️ Platform:', os.platform());
  console.log('🔍 CLI path:', cli);
  console.log('📋 CLI args:', args.slice(0, 3).join(' '), '...');

  if (isWindows) {
    // On Windows, use shell option for better compatibility with paths containing spaces
    const spawnOptions = {
      stdio: 'inherit',
      detached: true,
      shell: true,
      windowsVerbatimArguments: false,
    };

    console.log('🪟 Using Windows-specific spawn options with shell: true');
    return { cli, args, options: spawnOptions };
  } else {
    // Non-Windows platforms
    const spawnOptions = {
      stdio: 'inherit',
      detached: true,
    };

    return { cli, args, options: spawnOptions };
  }
}

async function main() {
  try {
    console.log('🚀 Starting Manual Test for Keypress Notifications Extension...');

    // Find the project root dynamically
    const projectRoot = findProjectRoot(__dirname);
    const extensionDevelopmentPath = projectRoot.replace(/\\/g, '/');

    console.log('📁 Extension path:', extensionDevelopmentPath);

    // Ensure mock workspace is set up
    const mockWorkspacePath = ensureMockWorkspace(projectRoot);
    console.log('🏢 Mock workspace:', mockWorkspacePath);

    // Download VS Code if needed and get the executable path
    console.log('⬇️ Preparing VS Code...');
    const vscodeExecutablePath = await downloadAndUnzipVSCode();

    // Get CLI arguments for the VS Code executable
    const [cli, ...args] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);

    // Build the complete arguments for launching VS Code
    const launchArgs = [
      ...args,
      '--extensionDevelopmentPath',
      extensionDevelopmentPath,
      '--disable-extensions', // Disable other extensions
      '--disable-workspace-trust', // Skip workspace trust dialog
      '--disable-gpu-sandbox', // Improve compatibility
      '--new-window', // Open in new window
      mockWorkspacePath, // Open the mock workspace
    ];

    console.log('\n✨ Launching VS Code for manual testing...');
    console.log('💡 The extension should be loaded and ready for testing.');
    console.log('🔄 Use Ctrl+Shift+F5 to reload the extension if needed.');

    // Create platform-specific spawn configuration
    const {
      cli: spawnCli,
      args: spawnArgs,
      options: spawnOptions,
    } = createSpawnOptions(cli, launchArgs);

    // Launch VS Code with platform-specific options
    const child = spawn(spawnCli, spawnArgs, spawnOptions);

    // Handle process events
    child.on('error', (error) => {
      console.error('❌ Failed to launch VS Code:', error);
      console.error('🔍 Debug information:');
      console.error('   - Platform:', os.platform());
      console.error('   - CLI path:', cli);
      console.error('   - CLI exists:', fs.existsSync(cli));
      console.error('   - Args length:', launchArgs.length);
      console.error('   - Working directory:', process.cwd());

      if (error.code === 'EINVAL' && os.platform() === 'win32') {
        console.error('\n💡 This appears to be a Windows path issue. Common solutions:');
        console.error('   1. Ensure VS Code executable path is correct');
        console.error('   2. Try running as administrator if needed');
        console.error('   3. Check that @vscode/test-electron is up to date');
      }

      process.exit(1);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        console.log(`VS Code exited with code ${code}`);
      } else {
        console.log('✅ VS Code closed normally');
      }
    });

    // Don't wait for the child process to exit
    child.unref();

    console.log('\n🎉 VS Code should now be launching with your extension loaded!');
    console.log('📝 Try the following manual tests:');
    console.log('   • Copy some text (Ctrl+C) - should show notification');
    console.log('   • Cut some text (Ctrl+X) - should show notification');
    console.log('   • Paste some text (Ctrl+V) - should show notification');
    console.log('   • Check the output panel for logs');
    console.log('   • Use F12 to open DevTools if needed');
  } catch (err) {
    console.error('❌ Manual test launch failed:', err);
    process.exit(1);
  }
}

main();
