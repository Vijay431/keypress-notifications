import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { KeypressService } from '../../src/services/KeypressService';

const showInformationMessage = vi.fn();
const registerCommand = vi.fn((_id: string, _h: (...a: unknown[]) => unknown) => ({
  dispose: vi.fn(),
}));
const executeCommand = vi.fn(async () => undefined);

vi.mock('vscode', () => ({
  commands: {
    registerCommand: (id: string, h: (...a: unknown[]) => unknown) => registerCommand(id, h),
    executeCommand: (...a: unknown[]) => (executeCommand as (...x: unknown[]) => unknown)(...a),
  },
  window: { showInformationMessage: (m: string) => showInformationMessage(m) },
}));

const logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };
const a11y = {
  announce: vi.fn(async () => {}),
  announceSuccess: vi.fn(async () => {}),
  announceError: vi.fn(async () => {}),
};
const makeConfig = (over: Partial<Record<string, unknown>> = {}) => ({
  isEnabled: () => over['enabled'] ?? true,
  getMinimumKeys: () => 2,
  getExcludedCommands: () => (over['excluded'] as string[]) ?? [],
  shouldShowCommandName: () => over['showName'] ?? false,
});

const make = (over: Partial<Record<string, unknown>> = {}) =>
  KeypressService.create(logger as never, makeConfig(over) as never, a11y);

describe('KeypressService detection flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should notify after the short delay for a multi-key command', () => {
    const svc = make();
    svc.detectKeyPress('editor.action.clipboardCopyAction');
    expect(showInformationMessage).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60);
    expect(showInformationMessage).toHaveBeenCalledWith("You've pressed Ctrl+C");
    expect(a11y.announce).toHaveBeenCalled();
  });

  it('should ignore excluded commands', () => {
    const svc = make({ excluded: ['undo'] });
    svc.detectKeyPress('undo');
    vi.advanceTimersByTime(60);
    expect(showInformationMessage).not.toHaveBeenCalled();
  });

  it('should join quick successive commands into one notification', () => {
    const svc = make();
    svc.detectKeyPress('editor.action.clipboardCopyAction');
    svc.detectKeyPress('editor.action.clipboardPasteAction');
    expect(showInformationMessage).toHaveBeenCalledWith("You've pressed Ctrl+C → Ctrl+V");
    expect(svc.getState().actionBufferLength).toBe(0);
  });

  it('should label an unmapped command by its last segment and skip a single-part combo', () => {
    const svc = make();
    svc.detectKeyPress('some.unknown.thing');
    vi.advanceTimersByTime(60);
    expect(showInformationMessage).not.toHaveBeenCalled();
    expect(svc.getState().actionBufferLength).toBe(1);
  });

  it('should adjust Ctrl to Cmd on macOS', () => {
    const original = process.platform;
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    try {
      make().detectKeyPress('undo');
      vi.advanceTimersByTime(60);
      expect(showInformationMessage).toHaveBeenCalledWith("You've pressed Cmd+Z");
    } finally {
      Object.defineProperty(process, 'platform', { value: original });
    }
  });

  it('should add the shortcut note when showCommandName is on', () => {
    make({ showName: true }).detectKeyPress('undo');
    vi.advanceTimersByTime(60);
    expect(showInformationMessage).toHaveBeenCalledWith(
      "You've pressed Ctrl+Z (keyboard shortcut detected)",
    );
  });

  it('should register wrappers that detect and then run the original command', async () => {
    const svc = make();
    await svc.initialize();
    const call = registerCommand.mock.calls.find(([id]) => id.endsWith('wrapper.undo'));
    expect(call).toBeDefined();
    await call?.[1]('arg');
    expect(executeCommand).toHaveBeenCalledWith('undo', 'arg');
    vi.advanceTimersByTime(60);
    expect(showInformationMessage).toHaveBeenCalledTimes(1);
  });

  it('should skip detection but still run the command when disabled', async () => {
    const svc = make();
    await svc.initialize();
    await svc.disable();
    expect(svc.getState().enabled).toBe(false);
    const call = registerCommand.mock.calls.find(([id]) => id.endsWith('wrapper.undo'));
    await call?.[1]();
    vi.advanceTimersByTime(60);
    expect(showInformationMessage).not.toHaveBeenCalled();
    expect(executeCommand).toHaveBeenCalledWith('undo');
    await svc.enable();
    expect(svc.getState().enabled).toBe(true);
  });

  it('should clear timers and tolerate disposables that throw', async () => {
    const svc = make();
    await svc.initialize();
    registerCommand.mockReturnValueOnce({
      dispose: vi.fn(() => {
        throw new Error('x');
      }),
    });
    svc.detectKeyPress('undo');
    expect(() => svc.dispose()).not.toThrow();
    vi.advanceTimersByTime(60);
    expect(showInformationMessage).not.toHaveBeenCalled();
  });
});
