import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      vscode: path.resolve(__dirname, 'test/__mocks__/vscode.ts'),
    },
  },
  test: {
    include: ['test/unit/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/extension.ts',
        'src/**/index.ts', // barrel re-exports — no logic
        'src/di/interfaces/**', // TypeScript interfaces — no runtime code
        'src/commands/ICommandHandler.ts', // pure interface — no runtime code
      ],
      thresholds: {
        lines: 75,
        functions: 80,
        branches: 70,
      },
    },
  },
});
