import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRegisterCommand = vi.fn((_id: string, _handler: unknown) => ({ dispose: vi.fn() }));
const mockExecuteCommand = vi.fn(async () => undefined);
const mockShowErrorMessage = vi.fn(async () => undefined);

vi.mock('vscode', () => ({
  commands: {
    registerCommand: mockRegisterCommand,
    executeCommand: mockExecuteCommand,
  },
  window: {
    showErrorMessage: mockShowErrorMessage,
    createOutputChannel: () => ({ appendLine: vi.fn(), show: vi.fn(), dispose: vi.fn() }),
  },
}));

describe('CommandRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset registerCommand to return a fresh disposable spy each call
    mockRegisterCommand.mockImplementation((_id: string, _handler: unknown) => ({
      dispose: vi.fn(),
    }));
  });

  const makeMetadata = (id = 'test.command', successResult = true, throwOnExecute = false) => {
    const mockExecute = vi.fn(async () => {
      if (throwOnExecute) {
        throw new Error('handler exploded');
      }
      return successResult
        ? { success: true, message: 'ok' }
        : { success: false, message: 'something went wrong', error: 'detail' };
    });
    const handlerFactory = vi.fn(() => ({ execute: mockExecute }));
    return {
      id,
      title: 'Test Command',
      category: 'Test',
      handlerFactory,
      mockExecute,
    };
  };

  it('registerCommand(metadata) registers and hasCommand(id) returns true', async () => {
    const { CommandRegistry } = await import('../../src/managers/CommandRegistry');
    const registry = new CommandRegistry();
    const meta = makeMetadata();
    registry.registerCommand(meta);
    expect(registry.hasCommand(meta.id)).toBe(true);
  });

  it('registerCommands([...]) registers multiple commands', async () => {
    const { CommandRegistry } = await import('../../src/managers/CommandRegistry');
    const registry = new CommandRegistry();
    const m1 = makeMetadata('cmd.one');
    const m2 = makeMetadata('cmd.two');
    registry.registerCommands([m1, m2]);
    expect(registry.hasCommand('cmd.one')).toBe(true);
    expect(registry.hasCommand('cmd.two')).toBe(true);
  });

  it('getCommand(id) returns the metadata', async () => {
    const { CommandRegistry } = await import('../../src/managers/CommandRegistry');
    const registry = new CommandRegistry();
    const meta = makeMetadata('my.cmd');
    registry.registerCommand(meta);
    const result = registry.getCommand('my.cmd');
    expect(result).toBeDefined();
    expect(result!.id).toBe('my.cmd');
    expect(result!.title).toBe('Test Command');
  });

  it('getRegisteredCommands() returns all registered metadata', async () => {
    const { CommandRegistry } = await import('../../src/managers/CommandRegistry');
    const registry = new CommandRegistry();
    const m1 = makeMetadata('cmd.a');
    const m2 = makeMetadata('cmd.b');
    registry.registerCommands([m1, m2]);
    const all = registry.getRegisteredCommands();
    expect(all).toHaveLength(2);
    expect(all.map((m) => m.id)).toContain('cmd.a');
    expect(all.map((m) => m.id)).toContain('cmd.b');
  });

  it('unregisterCommand(id) disposes the disposable and removes it (hasCommand returns false)', async () => {
    const { CommandRegistry } = await import('../../src/managers/CommandRegistry');
    const registry = new CommandRegistry();
    const disposeSpy = vi.fn();
    mockRegisterCommand.mockReturnValueOnce({ dispose: disposeSpy });
    const meta = makeMetadata('removable.cmd');
    registry.registerCommand(meta);
    expect(registry.hasCommand('removable.cmd')).toBe(true);
    registry.unregisterCommand('removable.cmd');
    expect(disposeSpy).toHaveBeenCalled();
    expect(registry.hasCommand('removable.cmd')).toBe(false);
  });

  it('executeCommand(id, ...args) calls vscode.commands.executeCommand', async () => {
    const { CommandRegistry } = await import('../../src/managers/CommandRegistry');
    const registry = new CommandRegistry();
    await registry.executeCommand('some.command', 'arg1', 42);
    expect(mockExecuteCommand).toHaveBeenCalledWith('some.command', 'arg1', 42);
  });

  it('handler throws → showErrorMessage is called', async () => {
    const { CommandRegistry } = await import('../../src/managers/CommandRegistry');
    const registry = new CommandRegistry();
    const meta = makeMetadata('throw.cmd', true, true);
    registry.registerCommand(meta);

    // Retrieve the registered handler from the mock and invoke it
    const registeredHandler = mockRegisterCommand.mock.calls[0]?.[1] as
      | (() => Promise<void>)
      | undefined;
    expect(registeredHandler).toBeDefined();
    await registeredHandler!();

    expect(mockShowErrorMessage).toHaveBeenCalledWith(expect.stringContaining('handler exploded'));
  });

  it('result.success === false → showErrorMessage is called', async () => {
    const { CommandRegistry } = await import('../../src/managers/CommandRegistry');
    const registry = new CommandRegistry();
    const meta = makeMetadata('fail.cmd', false, false);
    registry.registerCommand(meta);

    const registeredHandler = mockRegisterCommand.mock.calls[0]?.[1] as
      | (() => Promise<void>)
      | undefined;
    expect(registeredHandler).toBeDefined();
    await registeredHandler!();

    expect(mockShowErrorMessage).toHaveBeenCalledWith(
      expect.stringContaining('something went wrong'),
    );
  });

  it('dispose() disposes all registered commands', async () => {
    const { CommandRegistry } = await import('../../src/managers/CommandRegistry');
    const registry = new CommandRegistry();
    const dispose1 = vi.fn();
    const dispose2 = vi.fn();
    mockRegisterCommand
      .mockReturnValueOnce({ dispose: dispose1 })
      .mockReturnValueOnce({ dispose: dispose2 });
    const m1 = makeMetadata('d.cmd1');
    const m2 = makeMetadata('d.cmd2');
    registry.registerCommands([m1, m2]);
    registry.dispose();
    expect(dispose1).toHaveBeenCalled();
    expect(dispose2).toHaveBeenCalled();
    expect(registry.hasCommand('d.cmd1')).toBe(false);
    expect(registry.hasCommand('d.cmd2')).toBe(false);
  });
});
