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

  it('should return a singleton from getInstance()', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const a = Logger.getInstance();
    const b = Logger.getInstance();
    expect(a).toBe(b);
  });

  it('should return the same singleton from create() as getInstance()', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const a = Logger.getInstance();
    const b = Logger.create();
    expect(a).toBe(b);
  });

  it('should not call appendLine for debug at default INFO level', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    // Default level is INFO, so DEBUG is filtered
    logger.debug('should be filtered');
    expect(mockAppendLine).not.toHaveBeenCalled();
  });

  it('should call appendLine for info at INFO level', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.info('some info message');
    expect(mockAppendLine).toHaveBeenCalledWith(expect.stringContaining('some info message'));
  });

  it('should call appendLine for debug() after setLogLevel(DEBUG)', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const { LogLevel } = await import('../../src/types/extension');
    const logger = Logger.getInstance();
    logger.setLogLevel(LogLevel.DEBUG);
    logger.debug('debug message');
    expect(mockAppendLine).toHaveBeenCalledWith(expect.stringContaining('debug message'));
  });

  it('should call appendLine with the message on warn()', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.warn('warning message');
    expect(mockAppendLine).toHaveBeenCalledWith(expect.stringContaining('warning message'));
  });

  it('should call appendLine with the message on error()', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.error('error message');
    expect(mockAppendLine).toHaveBeenCalledWith(expect.stringContaining('error message'));
  });

  it('should call outputChannel.show() on show()', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.show();
    expect(mockShow).toHaveBeenCalled();
  });

  it('should call outputChannel.dispose() on dispose()', async () => {
    const { Logger } = await import('../../src/utils/logger');
    const logger = Logger.getInstance();
    logger.dispose();
    expect(mockDispose).toHaveBeenCalled();
  });
});
