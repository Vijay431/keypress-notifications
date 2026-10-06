import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGet = vi.fn(<T>(_key: string, defaultValue?: T): T => defaultValue as T);
const mockUpdate = vi.fn(async () => {});
const mockOnDidChangeConfiguration = vi.fn(() => ({ dispose: vi.fn() }));

vi.mock('vscode', () => ({
  workspace: {
    getConfiguration: () => ({ get: mockGet, update: mockUpdate }),
    onDidChangeConfiguration: mockOnDidChangeConfiguration,
  },
  ConfigurationTarget: { Global: 1, Workspace: 2, WorkspaceFolder: 3 },
  window: {
    createOutputChannel: () => ({ appendLine: vi.fn(), show: vi.fn(), dispose: vi.fn() }),
    showInformationMessage: vi.fn(),
  },
  commands: { executeCommand: vi.fn(), registerCommand: vi.fn(() => ({ dispose: vi.fn() })) },
}));

import { LogLevel } from '../../src/types/extension';

describe('ConfigurationService', () => {
  let logger: {
    debug: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    show: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      show: vi.fn(),
      dispose: vi.fn(),
    };
  });

  it('should return true from isEnabled() by default', async () => {
    mockGet.mockImplementation((_key: string, def?: unknown) => def);
    const { ConfigurationService } = await import('../../src/services/ConfigurationService');
    const svc = ConfigurationService.create(logger);
    expect(svc.isEnabled()).toBe(true);
  });

  it('should return 2 from getMinimumKeys() by default', async () => {
    mockGet.mockImplementation((_key: string, def?: unknown) => def);
    const { ConfigurationService } = await import('../../src/services/ConfigurationService');
    const svc = ConfigurationService.create(logger);
    expect(svc.getMinimumKeys()).toBe(2);
  });

  it('should return [] from getExcludedCommands() by default', async () => {
    mockGet.mockImplementation((_key: string, def?: unknown) => def);
    const { ConfigurationService } = await import('../../src/services/ConfigurationService');
    const svc = ConfigurationService.create(logger);
    expect(svc.getExcludedCommands()).toEqual([]);
  });

  it('should return false from shouldShowCommandName() by default', async () => {
    mockGet.mockImplementation((_key: string, def?: unknown) => def);
    const { ConfigurationService } = await import('../../src/services/ConfigurationService');
    const svc = ConfigurationService.create(logger);
    expect(svc.shouldShowCommandName()).toBe(false);
  });

  it('should return LogLevel.INFO from getLogLevel() by default', async () => {
    mockGet.mockImplementation((_key: string, def?: unknown) => def);
    const { ConfigurationService } = await import('../../src/services/ConfigurationService');
    const svc = ConfigurationService.create(logger);
    expect(svc.getLogLevel()).toBe(LogLevel.INFO);
  });

  it('should call vscode config.update on updateConfiguration', async () => {
    const { ConfigurationService } = await import('../../src/services/ConfigurationService');
    const svc = ConfigurationService.create(logger);
    await svc.updateConfiguration('enabled', false);
    expect(mockUpdate).toHaveBeenCalledWith('enabled', false, 1); // ConfigurationTarget.Global = 1
  });
});
