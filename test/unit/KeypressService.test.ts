import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('vscode', () => ({
  commands: {
    getCommands: vi.fn(async () => [
      'editor.action.clipboardCopyAction',
      'workbench.action.showCommands',
    ]),
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
    const logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      show: vi.fn(),
      dispose: vi.fn(),
    };
    const configService = {
      isEnabled: () => true,
      getMinimumKeys: () => 2,
      getExcludedCommands: (): string[] => [],
      shouldShowCommandName: () => false,
      getLogLevel: () => 0,
      getConfiguration: () => ({
        enabled: true,
        minimumKeys: 2,
        excludedCommands: [],
        showCommandName: false,
        logLevel: 1,
      }),
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
      service,
      'inferKeysFromCommand',
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
      getConfiguration: () => ({
        enabled: true,
        minimumKeys: 2,
        excludedCommands: ['editor.action.clipboardCopyAction'],
        showCommandName: false,
        logLevel: 1,
      }),
      onConfigurationChanged: () => ({ dispose: vi.fn() }),
      updateConfiguration: vi.fn(),
      dispose: vi.fn(),
    };
    const logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      show: vi.fn(),
      dispose: vi.fn(),
    };
    const accessibilityService = {
      announce: vi.fn(async () => {}),
      announceSuccess: vi.fn(async () => {}),
      announceError: vi.fn(async () => {}),
    };

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

describe('KeypressService — new COMMAND_KEY_MAP entries', () => {
  let service: import('../../src/services/KeypressService').KeypressService;
  let showInfoMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    const vscode = await import('vscode');
    showInfoMock = vi.mocked(vscode.window.showInformationMessage);

    const logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      show: vi.fn(),
      dispose: vi.fn(),
    };
    const configService = {
      isEnabled: () => true,
      getMinimumKeys: () => 1, // 1 so single-modifier labels pass the multi-key check
      getExcludedCommands: (): string[] => [],
      shouldShowCommandName: () => false,
      getLogLevel: () => 0,
      getConfiguration: () => ({
        enabled: true,
        minimumKeys: 1,
        excludedCommands: [],
        showCommandName: false,
        logLevel: 1,
      }),
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

  afterEach(() => {
    vi.useRealTimers();
    service.dispose();
  });

  const notifiesLabel = (commandId: string, expectedLabel: string) => {
    showInfoMock.mockClear();
    service.detectKeyPress(commandId);
    vi.advanceTimersByTime(100);
    expect(showInfoMock).toHaveBeenCalledWith(expect.stringContaining(expectedLabel));
  };

  // Explorer
  it('should map filesExplorer.copy to Ctrl+C label', () => {
    notifiesLabel('filesExplorer.copy', 'Ctrl+C');
  });
  it('should map filesExplorer.cut to Ctrl+X label', () => {
    notifiesLabel('filesExplorer.cut', 'Ctrl+X');
  });
  it('should map filesExplorer.paste to Ctrl+V label', () => {
    notifiesLabel('filesExplorer.paste', 'Ctrl+V');
  });

  // Editing
  it('should map undo to Ctrl+Z label', () => {
    notifiesLabel('undo', 'Ctrl+Z');
  });
  it('should map redo to Ctrl+Y label', () => {
    notifiesLabel('redo', 'Ctrl+Y');
  });
  it('should map editor.action.selectAll to Ctrl+A label', () => {
    notifiesLabel('editor.action.selectAll', 'Ctrl+A');
  });
  it('should map actions.find to Ctrl+F label', () => {
    notifiesLabel('actions.find', 'Ctrl+F');
  });
  it('should map editor.action.startFindReplaceAction to Ctrl+H label', () => {
    notifiesLabel('editor.action.startFindReplaceAction', 'Ctrl+H');
  });
  it('should map editor.action.moveLinesUpAction to Alt+Up label', () => {
    notifiesLabel('editor.action.moveLinesUpAction', 'Alt+Up');
  });
  it('should map editor.action.moveLinesDownAction to Alt+Down label', () => {
    notifiesLabel('editor.action.moveLinesDownAction', 'Alt+Down');
  });
  it('should map editor.action.copyLinesUpAction to Shift+Alt+Up label', () => {
    notifiesLabel('editor.action.copyLinesUpAction', 'Shift+Alt+Up');
  });
  it('should map editor.action.copyLinesDownAction to Shift+Alt+Down label', () => {
    notifiesLabel('editor.action.copyLinesDownAction', 'Shift+Alt+Down');
  });
  it('should map editor.action.deleteLines to Ctrl+Shift+K label', () => {
    notifiesLabel('editor.action.deleteLines', 'Ctrl+Shift+K');
  });
  it('should map editor.action.quickFix to Ctrl+. label', () => {
    notifiesLabel('editor.action.quickFix', 'Ctrl+.');
  });

  // Workbench / nav
  it('should map workbench.action.splitEditor to Ctrl+\\ label', () => {
    notifiesLabel('workbench.action.splitEditor', 'Ctrl+\\');
  });
  it('should map workbench.action.reopenClosedEditor to Ctrl+Shift+T label', () => {
    notifiesLabel('workbench.action.reopenClosedEditor', 'Ctrl+Shift+T');
  });
  it('should map workbench.action.gotoSymbol to Ctrl+Shift+O label', () => {
    notifiesLabel('workbench.action.gotoSymbol', 'Ctrl+Shift+O');
  });
  it('should map workbench.action.openSettings to Ctrl+, label', () => {
    notifiesLabel('workbench.action.openSettings', 'Ctrl+,');
  });
  it('should map workbench.view.scm to Ctrl+Shift+G label', () => {
    notifiesLabel('workbench.view.scm', 'Ctrl+Shift+G');
  });
  it('should map workbench.view.extensions to Ctrl+Shift+X label', () => {
    notifiesLabel('workbench.view.extensions', 'Ctrl+Shift+X');
  });
  it('should map workbench.view.debug to Ctrl+Shift+D label', () => {
    notifiesLabel('workbench.view.debug', 'Ctrl+Shift+D');
  });
  it('should map workbench.actions.view.problems to Ctrl+Shift+M label', () => {
    notifiesLabel('workbench.actions.view.problems', 'Ctrl+Shift+M');
  });

  // Terminal
  it('should map workbench.action.terminal.new to Ctrl+Shift+` label', () => {
    notifiesLabel('workbench.action.terminal.new', 'Ctrl+Shift+`');
  });
});
