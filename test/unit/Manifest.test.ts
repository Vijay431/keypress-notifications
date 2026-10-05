import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import { COMMAND_KEY_MAP } from '../../src/services/KeypressService';

interface Keybinding {
  key: string;
  command: string;
  when?: string;
}

interface Manifest {
  contributes: { keybindings: Keybinding[] };
}

const PREFIX = 'keypress-notifications.wrapper.';

const manifest = JSON.parse(
  readFileSync(resolve(__dirname, '../../package.json'), 'utf8'),
) as Manifest;
const wrapperBindings = manifest.contributes.keybindings.filter((b) =>
  b.command.startsWith(PREFIX),
);

describe('package.json manifest vs COMMAND_KEY_MAP', () => {
  it('should have one wrapper keybinding per COMMAND_KEY_MAP entry', () => {
    expect(wrapperBindings.length).toBe(Object.keys(COMMAND_KEY_MAP).length);
  });

  it('should map every wrapper command suffix back to a COMMAND_KEY_MAP key', () => {
    const suffixes = new Set(Object.keys(COMMAND_KEY_MAP).map((id) => id.replace(/\./g, '_')));
    for (const binding of wrapperBindings) {
      expect(suffixes.has(binding.command.slice(PREFIX.length))).toBe(true);
    }
  });

  it('should gate every wrapper binding on keypress-notifications.enabled', () => {
    for (const binding of wrapperBindings) {
      expect(binding.when ?? '').toContain('keypress-notifications.enabled');
    }
  });

  it('should bind saveAll to ctrl+k s', () => {
    const binding = wrapperBindings.find(
      (b) => b.command === `${PREFIX}workbench_action_files_saveAll`,
    );
    expect(binding?.key).toBe('ctrl+k s');
  });
});
