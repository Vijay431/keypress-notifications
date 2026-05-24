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
}));

// We'll provide mock services via the DI container mock
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
  getConfiguration: vi.fn(() => ({ enabled: true, minimumKeys: 2, excludedCommands: [], showCommandName: false, logLevel: 1 })),
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

vi.mock('../../src/di', () => ({
  TYPES: {
    Logger: Symbol('Logger'),
    ConfigurationService: Symbol('ConfigurationService'),
    KeypressService: Symbol('KeypressService'),
    AccessibilityService: Symbol('AccessibilityService'),
  },
  getService: vi.fn((token: symbol) => {
    const name = token.toString();
    if (name.includes('Logger')) return mockLogger;
    if (name.includes('ConfigurationService')) return mockConfigService;
    if (name.includes('KeypressService')) return mockKeypressService;
    if (name.includes('AccessibilityService')) return mockAccessibilityService;
    throw new Error(`Unknown token: ${name}`);
  }),
}));

describe('ExtensionManager', () => {
  let context: { subscriptions: { dispose(): void }[] };

  beforeEach(() => {
    vi.clearAllMocks();
    configChangedHandler = undefined;
    context = { subscriptions: [] };
    // Restore default mock implementations
    mockConfigService.isEnabled.mockReturnValue(true);
    mockConfigService.getConfiguration.mockReturnValue({ enabled: true, minimumKeys: 2, excludedCommands: [], showCommandName: false, logLevel: 1 });
    mockKeypressService.initialize.mockResolvedValue(undefined);
    mockRegisterCommand.mockImplementation((_id: string, _handler: unknown) => ({ dispose: vi.fn() }));
  });

  it('activate(context) calls keypressService.initialize()', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager();
    await manager.activate(context);
    expect(mockKeypressService.initialize).toHaveBeenCalledOnce();
  });

  it('activate(context) registers 3 commands via CommandRegistry', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager();
    await manager.activate(context);
    // CommandRegistry calls vscode.commands.registerCommand for each command
    expect(mockRegisterCommand).toHaveBeenCalledTimes(3);
    const registeredIds = mockRegisterCommand.mock.calls.map((c) => c[0]);
    expect(registeredIds).toContain('keypress-notifications.showOutputChannel');
    expect(registeredIds).toContain('keypress-notifications.enable');
    expect(registeredIds).toContain('keypress-notifications.disable');
  });

  it('activate(context) pushes disposables to context.subscriptions', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager();
    await manager.activate(context);
    expect(context.subscriptions.length).toBeGreaterThan(0);
  });

  it('deactivate() logs "Deactivating..." via logger.info', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager();
    await manager.activate(context);
    vi.clearAllMocks();
    manager.deactivate();
    expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Deactivating'));
  });

  it('config change triggers keypressService.enable() when isEnabled returns true', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager();
    await manager.activate(context);
    mockConfigService.isEnabled.mockReturnValue(true);
    expect(configChangedHandler).toBeDefined();
    configChangedHandler!();
    // allow async microtasks
    await new Promise(r => setTimeout(r, 10));
    expect(mockKeypressService.enable).toHaveBeenCalled();
  });

  it('config change triggers keypressService.disable() when isEnabled returns false', async () => {
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager();
    await manager.activate(context);
    mockConfigService.isEnabled.mockReturnValue(false);
    expect(configChangedHandler).toBeDefined();
    configChangedHandler!();
    await new Promise(r => setTimeout(r, 10));
    expect(mockKeypressService.disable).toHaveBeenCalled();
  });

  it('activate() shows error message and rethrows when keypressService.initialize() throws', async () => {
    mockKeypressService.initialize.mockRejectedValue(new Error('init failed'));
    const { ExtensionManager } = await import('../../src/managers/ExtensionManager');
    const manager = new ExtensionManager();
    await expect(manager.activate(context)).rejects.toThrow('init failed');
    expect(mockShowErrorMessage).toHaveBeenCalledWith(
      expect.stringContaining('Failed to activate'),
    );
  });
});
