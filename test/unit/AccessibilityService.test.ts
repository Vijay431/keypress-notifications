import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('vscode', () => ({
  window: {
    createOutputChannel: () => ({ appendLine: vi.fn(), show: vi.fn(), dispose: vi.fn() }),
  },
}));

describe('AccessibilityService', () => {
  let logger: { debug: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn>; warn: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn>; show: ReturnType<typeof vi.fn>; dispose: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();
    logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), show: vi.fn(), dispose: vi.fn() };
  });

  it('create(logger) returns an instance', async () => {
    const { AccessibilityService } = await import('../../src/services/AccessibilityService');
    const svc = AccessibilityService.create(logger);
    expect(svc).toBeDefined();
  });

  it('announce(message) calls logger.debug with the message', async () => {
    const { AccessibilityService } = await import('../../src/services/AccessibilityService');
    const svc = AccessibilityService.create(logger);
    await svc.announce('hello world');
    expect(logger.debug).toHaveBeenCalledWith('[Accessibility] hello world');
  });

  it('announceSuccess(operation, detail) calls announce with formatted success message', async () => {
    const { AccessibilityService } = await import('../../src/services/AccessibilityService');
    const svc = AccessibilityService.create(logger);
    await svc.announceSuccess('Save', 'file.ts');
    expect(logger.debug).toHaveBeenCalledWith('[Accessibility] Save succeeded: file.ts');
  });

  it('announceSuccess(operation) with no detail formats without the detail suffix', async () => {
    const { AccessibilityService } = await import('../../src/services/AccessibilityService');
    const svc = AccessibilityService.create(logger);
    await svc.announceSuccess('Enable');
    expect(logger.debug).toHaveBeenCalledWith('[Accessibility] Enable succeeded');
  });

  it('announceError(operation, error) calls announce with formatted error message', async () => {
    const { AccessibilityService } = await import('../../src/services/AccessibilityService');
    const svc = AccessibilityService.create(logger);
    await svc.announceError('Initialize', 'timeout');
    expect(logger.debug).toHaveBeenCalledWith('[Accessibility] Initialize failed: timeout');
  });
});
