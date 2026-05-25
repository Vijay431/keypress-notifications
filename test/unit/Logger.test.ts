import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAppendLine = vi.fn();
const mockShow = vi.fn();
const mockDispose = vi.fn();

vi.mock('vscode', () => ({
  window: {
    createOutputChannel: (_name: string) => ({
      appendLine: mockAppendLine,
      append: vi.fn(),
      show: mockShow,
      dispose: mockDispose,
      clear: vi.fn(),
    }),
  },
}));

describe('Logger', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset the singleton between tests
    const { Logger } = await import('../../src/utils/logger');
    Logger._resetInstance();
  });

  it('getInstance() returns a singleton', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const a = Logger.getInstance();
    const b = Logger.getInstance();
    expect(a).toBe(b);
  });

  it('create() returns the same singleton as getInstance()', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const a = Logger.getInstance();
    const b = Logger.create();
    expect(a).toBe(b);
  });

  it('debug at INFO log level (default) does NOT call appendLine (filtered)', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    // Default level is INFO, so DEBUG is filtered
    logger.debug('should be filtered');
    expect(mockAppendLine).not.toHaveBeenCalled();
  });

  it('info at INFO log level DOES call appendLine', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.info('some info message');
    expect(mockAppendLine).toHaveBeenCalledWith(expect.stringContaining('some info message'));
  });

  it('setLogLevel(DEBUG) allows debug() to call appendLine', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const { LogLevel } = await import('../../src/types/extension');
    const logger = Logger.getInstance();
    logger.setLogLevel(LogLevel.DEBUG);
    logger.debug('debug message');
    expect(mockAppendLine).toHaveBeenCalledWith(expect.stringContaining('debug message'));
  });

  it('warn() calls appendLine with the message', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.warn('warning message');
    expect(mockAppendLine).toHaveBeenCalledWith(expect.stringContaining('warning message'));
  });

  it('error() calls appendLine with the message', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.error('error message');
    expect(mockAppendLine).toHaveBeenCalledWith(expect.stringContaining('error message'));
  });

  it('show() calls outputChannel.show()', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.show();
    expect(mockShow).toHaveBeenCalled();
  });

  it('dispose() calls outputChannel.dispose()', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.dispose();
    expect(mockDispose).toHaveBeenCalled();
  });
});
