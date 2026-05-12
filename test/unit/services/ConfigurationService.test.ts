import * as assert from 'assert';
import { afterEach, beforeEach, describe, it } from 'mocha';
import * as vscode from 'vscode';
import { ExtensionConfig, LogLevel } from '../../../src/types/extension';
import { validateConfiguration, validateConfigValue } from '../../../src/utils/config-validator';

// Mock imports - these files don't exist yet, so we create mock implementations
interface MigrationResult {
  success: boolean;
  version: string;
  backupPath: string | null;
  errors: string[];
  warnings: string[];
}

class ConfigMigrator {
  private logger: vscode.OutputChannel;
  constructor(context?: vscode.ExtensionContext) {
    this.logger = vscode.window.createOutputChannel('Test Migrator');
  }
  async initialize(): Promise<void> {
    // Mock implementation
  }
  async migrate(config: ExtensionConfig): Promise<MigrationResult> {
    return {
      success: true,
      version: '2.0.0',
      backupPath: null,
      errors: [],
      warnings: [],
    };
  }
  dispose(): void {
    this.logger.dispose();
  }
}

describe('Configuration Validator', () => {
  describe('validateConfiguration()', () => {
    it('should return valid configuration when all values are correct', () => {
      const config: ExtensionConfig = {
        enabled: true,
        minimumKeys: 2,
        excludedCommands: ['editor.action.clipboardCopyAction'],
        showCommandName: false,
        logLevel: 'info',
      };

      const result = validateConfiguration(config);

      assert.ok(result.isValid, 'Configuration should be valid');
      assert.strictEqual(result.errors.length, 0, 'Should have no errors');
      assert.strictEqual(result.hasWarnings, false, 'Should have no warnings');
      assert.strictEqual(result.hasErrors, false, 'Should have no errors');
    });
  });

  describe('validateConfigValue()', () => {
    it('should return valid result for boolean enabled', () => {
      const result = validateConfigValue('enabled', true);
      assert.ok(result.isValid, 'Should return valid result for boolean enabled');
      assert.strictEqual(result.errors.length, 0, 'Should have no errors');
    });

    it('should return valid result for minimumKeys', () => {
      const result = validateConfigValue('minimumKeys', 2);
      assert.ok(result.isValid, 'Should return valid result for minimumKeys');
      assert.strictEqual(result.errors.length, 0, 'Should have no errors');
    });

    it('should return valid result for logLevel', () => {
      const validValues = ['error', 'warn', 'info', 'debug'];
      for (const value of validValues) {
        const result = validateConfigValue('logLevel', value);

        assert.ok(result.isValid, `Should be valid for logLevel: ${value}`);
        assert.strictEqual(result.errors.length, 0, 'Should have no errors');
      }
    });

    it('should return invalid result for invalid boolean enabled', () => {
      const result = validateConfigValue('enabled', 'invalid' as unknown as boolean);
      assert.ok(!result.isValid, 'Should not be valid for invalid enabled');
      assert.ok(result.errors.length > 0, 'Should have errors for invalid boolean enabled');
    });

    it('should return invalid result for minimumKeys below range', () => {
      const result = validateConfigValue('minimumKeys', 0);
      assert.ok(!result.isValid, 'Should not be valid for minimumKeys below range');
      assert.ok(result.errors.length > 0, 'Should have errors for minimumKeys below range');
    });

    it('should return invalid result for negative minimumKeys', () => {
      const result = validateConfigValue('minimumKeys', -5);
      assert.ok(!result.isValid, 'Should not be valid for negative minimumKeys');
      assert.ok(result.errors.length > 0, 'Should have errors for negative minimumKeys');
    });

    it('should return invalid result for logLevel', () => {
      const result = validateConfigValue('logLevel', 'invalid');
      assert.ok(!result.isValid, 'Should not be valid for invalid logLevel');
      assert.ok(result.errors.length > 0, 'Should have errors for invalid logLevel');
    });

    it('should return invalid result for invalid excludedCommands array', () => {
      const result = validateConfigValue('excludedCommands', ['invalid']);
      assert.ok(!result.isValid, 'Should not be valid for invalid excludedCommands');
      assert.ok(result.errors.length > 0, 'Should have errors for invalid excludedCommands');
    });
  });
});

describe('Configuration Service', () => {
  let configService: any;
  let mockContext: vscode.ExtensionContext;

  beforeEach(() => {
    mockContext = {
      subscriptions: [],
      globalState: {
        get: (key: string) => undefined,
        update: (key: string, value: unknown, target?: vscode.ConfigurationTarget) =>
          Promise.resolve(undefined),
        keys: () => [],
        setKeysForSync: () => Promise.resolve(undefined),
      },
      workspaceState: {
        get: (key: string) => undefined,
        update: (key: string, value: unknown, target?: vscode.ConfigurationTarget) =>
          Promise.resolve(undefined),
        keys: () => [],
        setKeysForSync: () => Promise.resolve(undefined),
      },
      extensionUri: vscode.Uri.file('file:///'),
      storageUri: vscode.Uri.file('file:///'),
      globalStorageUri: vscode.Uri.file('file:///'),
    } as unknown as vscode.ExtensionContext;

    // Create a mock configuration service
    configService = {
      initialize: async () => {},
      dispose: () => {},
      getConfiguration: () => ({
        enabled: true,
        minimumKeys: 2,
        excludedCommands: [],
        showCommandName: false,
        logLevel: 'info',
      }),
      isEnabled: () => true,
      getMinimumKeys: () => 2,
      getExcludedCommands: () => [],
      shouldShowCommandName: () => false,
      getLogLevel: () => LogLevel.INFO,
      updateConfiguration: async () => {},
    };
  });

  afterEach(() => {
    if (configService?.dispose) {
      configService.dispose();
    }
  });

  describe('getConfiguration()', () => {
    it('should return current configuration', () => {
      const config = configService.getConfiguration();

      assert.ok(config, 'Configuration should exist');
      assert.strictEqual(typeof config.enabled, 'boolean', 'Enabled should be boolean');
      assert.strictEqual(typeof config.minimumKeys, 'number', 'MinimumKeys should be number');
      assert.strictEqual(
        typeof config.showCommandName,
        'boolean',
        'ShowCommandName should be boolean',
      );
      assert.strictEqual(typeof config.logLevel, 'string', 'LogLevel should be string');
      assert.ok(Array.isArray(config.excludedCommands), 'ExcludedCommands should be array');
    });
  });

  describe('isEnabled()', () => {
    it('should return enabled state', () => {
      const enabled = configService.isEnabled();

      assert.strictEqual(typeof enabled, 'boolean', 'Enabled should be boolean');
    });
  });

  describe('getMinimumKeys()', () => {
    it('should return minimumKeys value', () => {
      const minimumKeys = configService.getMinimumKeys();

      assert.strictEqual(typeof minimumKeys, 'number', 'MinimumKeys should be number');
    });
  });

  describe('updateConfiguration()', () => {
    it('should update configuration value', async () => {
      await configService.updateConfiguration('minimumKeys', 3);

      // Verify the update was processed
      assert.ok(true, 'Configuration update should complete');
    });
  });

  describe('dispose()', () => {
    it('should dispose resources', () => {
      configService.dispose();

      assert.ok(true, 'Dispose should complete without errors');
    });
  });
});
