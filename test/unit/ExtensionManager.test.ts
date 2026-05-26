import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockExecuteCommand = vi.fn(async () => undefined);
const mockRegisterCommand = vi.fn((_id: string, _handler: unknown) => ({ dispose: vi.fn() }));
const mockShowErrorMessage = vi.fn(async () => undefined);
const mockShowInformationMessage = vi.fn(async () => undefined);

vi.mock('vscode', () => ({
  commands: {
    executeCommand: mockExecuteCommand,
    registerCommand: mockRegisterCommand,
  },
  window: {
    showErrorMessage: mockShowErrorMessage,
    showInformationMessage: mockShowInformationMessage,
    createOutputChannel: () => ({ appendLine: vi.fn(), show: vi.fn(), dispose: vi.fn() }),
  },
  workspace: {
    getConfiguration: () => ({ get: (_k: string, def?: unknown) => def, update: vi.fn() }),
    onDidChangeConfiguration: () => ({ dispose: vi.fn() }),
  },
  ConfigurationTarget: { Global: 1 },
  ExtensionMode: { Development: 1, Test: 2, Production: 3 },
}));

const mockLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  show: vi.fn(),
  dispose: vi.fn(),
  setLogLevel: vi.fn(),
};

const mockKeypressService = {
  initialize: vi.fn(async () => {}),
  enable: vi.fn(async () => {}),
  disable: vi.fn(async () => {}),
  dispose: vi.fn(),
  detectKeyPress: vi.fn(),
  getState: vi.fn(() => ({ enabled: true, actionBufferLength: 0, lastActionTime: 0 })),
};

let configChangedHandler: (() => void) | undefined;

const mockConfigService = {
  isEnabled: vi.fn(() => true),
  getMinimumKeys: vi.fn(() => 2),
  getExcludedCommands: vi.fn((): string[] => []),
  shouldShowCommandName: vi.fn(() => false),
  getLogLevel: vi.fn(() => 1),
  getConfiguration: vi.fn(() => ({
    enabled: true,
    minimumKeys: 2,
    excludedCommands: [],
    showCommandName: false,
    logLevel: 1,
  })),
  onConfigurationChanged: vi.fn((handler: () => void) => {
    configChangedHandler = handler;
    return { dispose: vi.fn() };
  }),
  updateConfiguration: vi.fn(),
  dispose: vi.fn(),
};

const mockAccessibilityService = {
  announce: vi.fn(async () => {}),
  announceSuccess: vi.fn(async () => {}),
  announceError: vi.fn(async () => {}),
};

describe('ExtensionManager', () => {
  let context: { subscriptions: { dispose(): void }[]; extensionMode: number };

  beforeEach(() => {
    vi.clearAllMocks();
    configChangedHandler = undefined;
    context = { subscriptions: [], extensionMode: 3 }; // Production mode by default
    mockConfigService.isEnabled.mockReturnValue(true);
    mockConfigService.getConfiguration.mockReturnValue({
      enabled: true,
      minimumKeys: 2,
      excludedCommands: [],
      showCommandName: false,
      logLevel: 1,
    });
    mockKeypressService.initialize.mockResolvedValue(undefined);
    mockRegisterCommand.mockImplementation((_id: string, _handler: unknown) => ({
      dispose: vi.fn(),
    }));
  });

  it('should call keypressService.initialize() on activate', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager(
      mockLogger,
      mockConfigService,
      mockKeypressService,
      mockAccessibilityService,
    );
    await manager.activate(context);
    expect(mockKeypressService.initialize).toHaveBeenCalledOnce();
  });

  it('should register 3 commands via CommandRegistry on activate', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager(
      mockLogger,
      mockConfigService,
      mockKeypressService,
      mockAccessibilityService,
    );
    await manager.activate(context);
    expect(mockRegisterCommand).toHaveBeenCalledTimes(3);
    const registeredIds = mockRegisterCommand.mock.calls.map((c) => c[0]);
    expect(registeredIds).toContain('keypress-notifications.showOutputChannel');
    expect(registeredIds).toContain('keypress-notifications.enable');
    expect(registeredIds).toContain('keypress-notifications.disable');
  });

  it('should push disposables to context.subscriptions on activate', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager(
      mockLogger,
      mockConfigService,
      mockKeypressService,
      mockAccessibilityService,
    );
    await manager.activate(context);
    expect(context.subscriptions.length).toBeGreaterThan(0);
  });

  it('should log "Deactivating..." on deactivate', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager(
      mockLogger,
      mockConfigService,
      mockKeypressService,
      mockAccessibilityService,
    );
    await manager.activate(context);
    vi.clearAllMocks();
    manager.deactivate();
    expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Deactivating'));
  });

  it('should call keypressService.enable() on config change when isEnabled is true', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager(
      mockLogger,
      mockConfigService,
      mockKeypressService,
      mockAccessibilityService,
    );
    await manager.activate(context);
    mockConfigService.isEnabled.mockReturnValue(true);
    expect(configChangedHandler).toBeDefined();
    configChangedHandler!();
    await new Promise((r) => setTimeout(r, 10));
    expect(mockKeypressService.enable).toHaveBeenCalled();
  });

  it('should call keypressService.disable() on config change when isEnabled is false', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager(
      mockLogger,
      mockConfigService,
      mockKeypressService,
      mockAccessibilityService,
    );
    await manager.activate(context);
    mockConfigService.isEnabled.mockReturnValue(false);
    expect(configChangedHandler).toBeDefined();
    configChangedHandler!();
    await new Promise((r) => setTimeout(r, 10));
    expect(mockKeypressService.disable).toHaveBeenCalled();
  });

  it('should show error message and rethrow when keypressService.initialize() throws', async () => {
    mockKeypressService.initialize.mockRejectedValue(new Error('init failed'));
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager(
      mockLogger,
      mockConfigService,
      mockKeypressService,
      mockAccessibilityService,
    );
    await expect(manager.activate(context)).rejects.toThrow('init failed');
    expect(mockShowErrorMessage).toHaveBeenCalledWith(
      expect.stringContaining('Failed to activate'),
    );
  });
});
