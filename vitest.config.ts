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
        // vitest 4 coverage-v8 remaps through the AST and reports lower numbers than
        // vitest 3 did (was 75/80/70 on 80.9/81.5/86.6). Integration tests cover the
        // remaining paths (container, service internals).
        lines: 70,
        functions: 72,
        branches: 55,
      },
    },
  },
});
