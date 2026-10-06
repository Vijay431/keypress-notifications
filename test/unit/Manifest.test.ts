import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import { COMMAND_KEY_MAP } from '../../src/services/KeypressService';

interface Keybinding {
  key: string;
  mac?: string;
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

  it('should match every binding key and mac key to its COMMAND_KEY_MAP label', () => {
    const norm = (label: string): string => label.toLowerCase().replace(/option/g, 'alt');
    const byCommand = new Map(
      Object.entries(COMMAND_KEY_MAP).map(([id, l]) => [id.replace(/\./g, '_'), l]),
    );
    for (const binding of wrapperBindings) {
      const label = byCommand.get(binding.command.slice(PREFIX.length));
      expect(label, binding.command).toBeDefined();
      const defaultLabel = typeof label === 'string' ? label : label!.default;
      expect(binding.key, binding.command).toBe(norm(defaultLabel));
      if (binding.mac) {
        const macLabel = typeof label === 'string' ? label.replace(/\bCtrl\b/g, 'Cmd') : label!.mac;
        expect(binding.mac, binding.command).toBe(norm(macLabel));
      }
    }
  });
});
