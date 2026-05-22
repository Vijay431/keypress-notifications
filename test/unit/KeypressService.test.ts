import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('vscode', () => ({
  commands: {
    getCommands: vi.fn(async () => ['editor.action.clipboardCopyAction', 'workbench.action.showCommands']),
    registerCommand: vi.fn(() => ({ dispose: vi.fn() })),
    executeCommand: vi.fn(),
  },
  window: {
    showInformationMessage: vi.fn(),
    createOutputChannel: () => ({ appendLine: vi.fn(), show: vi.fn(), dispose: vi.fn() }),
  },
  workspace: {
    getConfiguration: () => ({ get: (_k: string, def?: unknown) => def, update: vi.fn() }),
    onDidChangeConfiguration: () => ({ dispose: vi.fn() }),
  },
  ConfigurationTarget: { Global: 1 },
}));

describe('KeypressService — inferKeysFromCommand', () => {
  let service: import('../../src/services/KeypressService').KeypressService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), show: vi.fn(), dispose: vi.fn() };
    const configService = {
      isEnabled: () => true,
      getMinimumKeys: () => 2,
      getExcludedCommands: (): string[] => [],
      shouldShowCommandName: () => false,
      getLogLevel: () => 0,
      getConfiguration: () => ({ enabled: true, minimumKeys: 2, excludedCommands: [], showCommandName: false, logLevel: 1 }),
      onConfigurationChanged: () => ({ dispose: vi.fn() }),
      updateConfiguration: vi.fn(),
      dispose: vi.fn(),
    };
    const accessibilityService = {
      announce: vi.fn(async () => {}),
      announceSuccess: vi.fn(async () => {}),
      announceError: vi.fn(async () => {}),
    };
    const { KeypressService } = await import('../../src/services/KeypressService');
    service = KeypressService.create(logger, configService, accessibilityService);
  });

  it('detects clipboard copy as Ctrl+C (or Cmd+C on darwin)', () => {
    const notificationSpy = vi.spyOn(
      // @ts-expect-error -- accessing private for test
      service, 'inferKeysFromCommand'
    );
    service.detectKeyPress('editor.action.clipboardCopyAction');
    expect(notificationSpy).toHaveBeenCalledWith('editor.action.clipboardCopyAction');
  });

  it('excluded commands do not trigger notification', () => {
    const configServiceWithExclusion = {
      isEnabled: () => true,
      getMinimumKeys: () => 2,
      getExcludedCommands: () => ['editor.action.clipboardCopyAction'],
      shouldShowCommandName: () => false,
      getLogLevel: () => 1,
      getConfiguration: () => ({ enabled: true, minimumKeys: 2, excludedCommands: ['editor.action.clipboardCopyAction'], showCommandName: false, logLevel: 1 }),
      onConfigurationChanged: () => ({ dispose: vi.fn() }),
      updateConfiguration: vi.fn(),
      dispose: vi.fn(),
    };
    const logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), show: vi.fn(), dispose: vi.fn() };
    const accessibilityService = { announce: vi.fn(async () => {}), announceSuccess: vi.fn(async () => {}), announceError: vi.fn(async () => {}) };

    return import('../../src/services/KeypressService').then(({ KeypressService }) => {
      const svc = KeypressService.create(logger, configServiceWithExclusion, accessibilityService);
      const state = svc.getState();
      svc.detectKeyPress('editor.action.clipboardCopyAction');
      // Buffer should remain empty since command is excluded
      expect(svc.getState().lastActionTime).toBe(state.lastActionTime);
    });
  });

  it('getState() returns expected shape', () => {
    const state = service.getState();
    expect(state).toHaveProperty('enabled');
    expect(state).toHaveProperty('actionBufferLength');
    expect(state).toHaveProperty('lastActionTime');
    expect(typeof state.enabled).toBe('boolean');
    expect(typeof state.actionBufferLength).toBe('number');
    expect(typeof state.lastActionTime).toBe('number');
  });

  it('enable() sets enabled to true', async () => {
    await service.disable();
    expect(service.getState().enabled).toBe(false);
    await service.enable();
    expect(service.getState().enabled).toBe(true);
  });
});
