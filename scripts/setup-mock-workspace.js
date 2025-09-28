#!/usr/bin/env node

/**
 * Mock Workspace Setup Script
 *
 * This script sets up or refreshes the mock workspace with sample data
 * for manual testing of the Keypress Notifications extension.
 */

const fs = require('fs');
const path = require('path');

const MOCK_WORKSPACE_DIR = path.join(__dirname, '..', 'test', 'mock-workspace');

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

/**
 * Write file with content
 */
function writeFile(filePath, content, description) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created/updated: ${description}`);
}

/**
 * Generate random code snippets for testing
 */
function generateRandomCodeSnippets() {
  const functions = [
    'calculateTotal',
    'processData',
    'validateInput',
    'formatOutput',
    'handleError',
    'initializeApp',
    'connectDatabase',
    'parseJSON',
  ];

  const variables = [
    'userInput',
    'apiResponse',
    'configData',
    'tempValue',
    'resultSet',
    'errorMessage',
    'statusCode',
    'timestamp',
  ];

  const comments = [
    '// TODO: Implement error handling',
    '// FIXME: Optimize this function',
    '// NOTE: This is a temporary solution',
    '// WARNING: Deprecated method - use alternative',
  ];

  return {
    randomFunction: functions[Math.floor(Math.random() * functions.length)],
    randomVariable: variables[Math.floor(Math.random() * variables.length)],
    randomComment: comments[Math.floor(Math.random() * comments.length)],
  };
}

/**
 * Generate dynamic test content
 */
function generateDynamicContent() {
  const { randomFunction, randomVariable, randomComment } = generateRandomCodeSnippets();
  const timestamp = new Date().toISOString();

  return `// Generated test content - ${timestamp}
// This file is regenerated each time you run the setup script

${randomComment}
function ${randomFunction}(input) {
  const ${randomVariable} = input || 'default value';
  
  // Try copying this entire function
  try {
    console.log('Processing:', ${randomVariable});
    return processResult(${randomVariable});
  } catch (error) {
    // Try cutting this error handling block
    console.error('Error in ${randomFunction}:', error);
    throw error;
  }
}

// Sample data array for testing selections
const testData = [
  { id: 1, name: 'Test Item 1', value: Math.random() },
  { id: 2, name: 'Test Item 2', value: Math.random() },
  { id: 3, name: 'Test Item 3', value: Math.random() }
];

// Try selecting and copying different parts of this object
const configuration = {
  apiEndpoint: 'https://api.example.com/v1',
  timeout: ${Math.floor(Math.random() * 5000) + 1000},
  retries: ${Math.floor(Math.random() * 5) + 1},
  enableLogging: ${Math.random() > 0.5},
  features: {
    ${randomVariable}: true,
    advanced${randomFunction}: ${Math.random() > 0.5},
    experimental: false
  }
};

// Test copying this arrow function
const ${randomVariable}Handler = (data) => {
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date().toISOString()
  }));
};

export { ${randomFunction}, testData, configuration, ${randomVariable}Handler };
`;
}

/**
 * Main setup function
 */
function setupMockWorkspace() {
  console.log('🚀 Setting up mock workspace for Keypress Notifications extension...\n');

  try {
    // Ensure base directories exist
    ensureDir(MOCK_WORKSPACE_DIR);
    ensureDir(path.join(MOCK_WORKSPACE_DIR, '.vscode'));
    ensureDir(path.join(MOCK_WORKSPACE_DIR, 'src'));
    ensureDir(path.join(MOCK_WORKSPACE_DIR, 'docs'));

    // Generate dynamic test file
    const dynamicContent = generateDynamicContent();
    writeFile(
      path.join(MOCK_WORKSPACE_DIR, 'dynamic-test.js'),
      dynamicContent,
      'Dynamic test file with random content',
    );

    // Create additional test files if they don't exist
    const testFiles = [
      {
        path: 'src/index.js',
        content: `// Main entry point for testing
import { calculateSum } from './utils.js';

console.log('Application starting...');
const result = calculateSum(5, 3);
console.log('Result:', result);

// Try copying different parts of this file
export default function main() {
  return 'Hello from main function';
}`,
        description: 'Source index file',
      },
      {
        path: 'src/utils.js',
        content: `// Utility functions for testing copy/cut/paste
export function calculateSum(a, b) {
  return a + b;
}

export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export const constants = {
  MAX_RETRY: 3,
  TIMEOUT: 5000,
  API_VERSION: 'v1'
};`,
        description: 'Utility functions file',
      },
      {
        path: 'docs/TESTING.md',
        content: `# Testing Documentation

## Manual Testing Checklist

- [ ] Test copy operation (Ctrl+C)
- [ ] Test cut operation (Ctrl+X) 
- [ ] Test paste operation (Ctrl+V)
- [ ] Verify notifications appear
- [ ] Test with different file types
- [ ] Test with various selection sizes

## Notes

Add your testing notes here...`,
        description: 'Testing documentation',
      },
    ];

    testFiles.forEach((file) => {
      const fullPath = path.join(MOCK_WORKSPACE_DIR, file.path);
      ensureDir(path.dirname(fullPath));

      if (!fs.existsSync(fullPath)) {
        writeFile(fullPath, file.content, file.description);
      }
    });

    // Update workspace settings
    const workspaceSettings = {
      'keypress-notifications.enabled': true,
      'keypress-notifications.logLevel': 'debug',
      'editor.wordWrap': 'on',
      'editor.minimap.enabled': true,
      'files.autoSave': 'off',
      'workbench.startupEditor': 'readme',
    };

    writeFile(
      path.join(MOCK_WORKSPACE_DIR, '.vscode', 'settings.json'),
      JSON.stringify(workspaceSettings, null, 2),
      'Workspace settings',
    );

    console.log('\n✅ Mock workspace setup completed successfully!');
    console.log(`📁 Workspace location: ${MOCK_WORKSPACE_DIR}`);
    console.log('\n🧪 To start manual testing:');
    console.log('   npm run test:manual');
    console.log('\n🔧 To launch with debugging:');
    console.log('   Use "Launch Extension with Mock Workspace" from VS Code Debug view');
  } catch (error) {
    console.error('❌ Error setting up mock workspace:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupMockWorkspace();
}

module.exports = { setupMockWorkspace };
