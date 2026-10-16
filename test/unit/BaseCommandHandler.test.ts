import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BaseCommandHandler } from '../../src/commands/BaseCommandHandler';

const showInformationMessage = vi.fn();
const showWarningMessage = vi.fn();
const showErrorMessage = vi.fn();

vi.mock('vscode', () => ({
  window: {
    showInformationMessage: (m: string) => showInformationMessage(m),
    showWarningMessage: (m: string) => showWarningMessage(m),
    showErrorMessage: (m: string) => showErrorMessage(m),
  },
}));

const logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };
const a11y = {
  announce: vi.fn(async () => {}),
  announceSuccess: vi.fn(async () => {}),
  announceError: vi.fn(async () => {}),
};

class Probe extends BaseCommandHandler {
  constructor() {
    super('Probe', logger as never, a11y);
  }
  async execute() {
    return this.success('ok');
  }
  public run() {
    return {
      errorFromError: this.error('bad', new Error('boom')),
      errorFromString: this.error('bad', 'text'),
      errorFromNothing: this.error('bad'),
    };
  }
  public async exercise() {
    this.showInfo('i');
    this.showWarning('w');
    this.showError('e');
    await this.announce('a');
    await this.announce('b', 'verbose');
    await this.announceSuccess('op', 'detail');
    await this.announceError('op', 'err');
    this.logInfo('info', { k: 1 });
  }
}

describe('BaseCommandHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should build error results from an Error, a string, or nothing', () => {
    const { errorFromError, errorFromString, errorFromNothing } = new Probe().run();
    expect(errorFromError).toEqual({ success: false, message: 'bad', error: 'boom' });
    expect(errorFromString.error).toBe('text');
    expect(errorFromNothing.error).toBe('');
  });

  it('should show VS Code messages', async () => {
    await new Probe().exercise();
    expect(showInformationMessage).toHaveBeenCalledWith('i');
    expect(showWarningMessage).toHaveBeenCalledWith('w');
    expect(showErrorMessage).toHaveBeenCalledWith('e');
  });

  it('should delegate announcements with the default and given verbosity', async () => {
    await new Probe().exercise();
    expect(a11y.announce).toHaveBeenCalledWith('a', 'normal');
    expect(a11y.announce).toHaveBeenCalledWith('b', 'verbose');
    expect(a11y.announceSuccess).toHaveBeenCalledWith('op', 'detail');
    expect(a11y.announceError).toHaveBeenCalledWith('op', 'err');
  });

  it('should prefix info logs with the handler name', async () => {
    await new Probe().exercise();
    expect(logger.info).toHaveBeenCalledWith('[Probe] info', { k: 1 });
  });
});
