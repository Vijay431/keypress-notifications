import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('vscode', () => ({
  window: {
    showInformationMessage: vi.fn(),
    showWarningMessage: vi.fn(),
    showErrorMessage: vi.fn(),
    createOutputChannel: () => ({ appendLine: vi.fn(), show: vi.fn(), dispose: vi.fn() }),
  },
  commands: { executeCommand: vi.fn(), registerCommand: vi.fn(() => ({ dispose: vi.fn() })) },
  workspace: {
    getConfiguration: () => ({ get: (_k: string, def?: unknown) => def, update: vi.fn() }),
    onDidChangeConfiguration: () => ({ dispose: vi.fn() }),
  },
  ConfigurationTarget: { Global: 1 },
}));

const makeLogger = () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), show: vi.fn(), dispose: vi.fn() });
const makeA11y = () => ({ announce: vi.fn(async () => {}), announceSuccess: vi.fn(async () => {}), announceError: vi.fn(async () => {}) });
const makeConfig = (enabled = true) => ({
  isEnabled: () => enabled,
  getMinimumKeys: () => 2,
  getExcludedCommands: (): string[] => [],
  shouldShowCommandName: () => false,
  getLogLevel: () => 1,
  getConfiguration: () => ({ enabled, minimumKeys: 2, excludedCommands: [], showCommandName: false, logLevel: 1 }),
  onConfigurationChanged: () => ({ dispose: vi.fn() }),
  updateConfiguration: vi.fn(async () => {}),
  dispose: vi.fn(),
});

describe('EnableCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('execute() calls updateConfiguration("enabled", true) and returns success', async () => {
    const { EnableCommand } = await import('../../src/commands/EnableCommand');
    const config = makeConfig();
    const cmd = new EnableCommand(makeLogger(), makeA11y(), config);
    const result = await cmd.execute();
    expect(config.updateConfiguration).toHaveBeenCalledWith('enabled', true);
    expect(result.success).toBe(true);
  });
});

describe('DisableCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('execute() calls updateConfiguration("enabled", false) and returns success', async () => {
    const { DisableCommand } = await import('../../src/commands/DisableCommand');
    const config = makeConfig();
    const cmd = new DisableCommand(makeLogger(), makeA11y(), config);
    const result = await cmd.execute();
    expect(config.updateConfiguration).toHaveBeenCalledWith('enabled', false);
    expect(result.success).toBe(true);
  });
});

describe('ShowOutputChannelCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('execute() returns success', async () => {
    const { ShowOutputChannelCommand } = await import('../../src/commands/ShowOutputChannelCommand');
    const cmd = new ShowOutputChannelCommand(makeLogger(), makeA11y(), makeConfig());
    const result = await cmd.execute();
    expect(result.success).toBe(true);
  });
});
