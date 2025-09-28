import { workspace } from 'vscode';
import { BaseService } from './BaseService';
import { KeybindingInfo, KeyCombination } from '../types/extension';

/**
 * Service responsible for reading and parsing VS Code keybinding configurations.
 * 
 * This service provides:
 * - Reading user's keybinding configuration
 * - Parsing key combinations to identify multi-key bindings
 * - Filtering keybindings based on criteria (minimum keys, exclusions)
 * - Converting key strings to human-readable formats
 */
export class KeybindingReaderService extends BaseService {
  private keybindings: KeybindingInfo[] = [];
  private multiKeyBindings = new Map<string, KeybindingInfo>();

  constructor() {
    super('KeybindingReaderService');
  }

  protected override async onInitialize(): Promise<void> {
    await this.loadKeybindings();
    this.logger.debug('KeybindingReaderService initialized');
  }

  protected override onDispose(): void {
    this.keybindings = [];
    this.multiKeyBindings.clear();
  }

  /**
   * Load keybindings from VS Code configuration.
   */
  private async loadKeybindings(): Promise<void> {
    try {
      // Load keybindings from configuration
      const configuration = workspace.getConfiguration();
      const userKeybindings = configuration.get<KeybindingInfo[]>('keyboard.shortcuts', []);
      
      // Parse and store keybindings
      this.keybindings = userKeybindings;
      
      // Build map of multi-key bindings
      this.buildMultiKeyBindingsMap();
      
      this.logger.info(`Loaded ${this.keybindings.length} keybindings, ${this.multiKeyBindings.size} multi-key bindings`);
    } catch (error) {
      this.logger.error('Failed to load keybindings:', error);
      // Continue with empty keybindings to avoid breaking the extension
      this.keybindings = [];
      this.multiKeyBindings.clear();
    }
  }

  /**
   * Build a map of command IDs to their multi-key bindings.
   */
  private buildMultiKeyBindingsMap(): void {
    this.multiKeyBindings.clear();
    
    for (const binding of this.keybindings) {
      if (this.isMultiKeyBinding(binding.key)) {
        this.multiKeyBindings.set(binding.command, binding);
      }
    }
  }

  /**
   * Check if a key string represents a multi-key combination.
   */
  private isMultiKeyBinding(keyString: string): boolean {
    const parsed = this.parseKeyString(keyString);
    return parsed.modifiers.length > 0; // Has at least one modifier key
  }

  /**
   * Parse a key string into its components.
   */
  public parseKeyString(keyString: string): KeyCombination {
    const parts = keyString.toLowerCase().split('+').map(part => part.trim());
    const modifiers: string[] = [];
    let key = '';

    for (const part of parts) {
      switch (part) {
        case 'ctrl':
        case 'control':
          modifiers.push('Ctrl');
          break;
        case 'alt':
          modifiers.push('Alt');
          break;
        case 'shift':
          modifiers.push('Shift');
          break;
        case 'cmd':
        case 'meta':
          modifiers.push(process.platform === 'darwin' ? 'Cmd' : 'Win');
          break;
        default:
          // This is the main key
          key = part.toUpperCase();
          break;
      }
    }

    const formatted = modifiers.length > 0 
      ? `${modifiers.join('+')}+${key}` 
      : key;

    return {
      modifiers,
      key,
      formatted
    };
  }

  /**
   * Get keybinding information for a specific command.
   */
  public getKeybindingForCommand(commandId: string): KeybindingInfo | undefined {
    return this.multiKeyBindings.get(commandId);
  }

  /**
   * Get all multi-key bindings.
   */
  public getMultiKeyBindings(): Map<string, KeybindingInfo> {
    return new Map(this.multiKeyBindings);
  }

  /**
   * Check if a command has a multi-key binding.
   */
  public hasMultiKeyBinding(commandId: string): boolean {
    return this.multiKeyBindings.has(commandId);
  }

  /**
   * Reload keybindings from configuration.
   */
  public async reload(): Promise<void> {
    await this.loadKeybindings();
  }

  /**
   * Get the number of keys in a key combination.
   */
  public getKeyCount(keyString: string): number {
    const parsed = this.parseKeyString(keyString);
    return parsed.modifiers.length + (parsed.key ? 1 : 0);
  }

  /**
   * Check if a keybinding meets the minimum key requirement.
   */
  public meetsMinimumKeys(keyString: string, minimumKeys: number): boolean {
    return this.getKeyCount(keyString) >= minimumKeys;
  }

  /**
   * Filter commands based on exclusion patterns.
   */
  public isCommandExcluded(commandId: string, excludedCommands: string[]): boolean {
    return excludedCommands.some(pattern => {
      // Support simple glob patterns
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(commandId);
      }
      return commandId === pattern;
    });
  }

  /**
   * Get all commands that should trigger notifications based on configuration.
   */
  public getNotifiableCommands(minimumKeys: number, excludedCommands: string[]): string[] {
    const commands: string[] = [];

    for (const [commandId, binding] of this.multiKeyBindings) {
      if (!this.meetsMinimumKeys(binding.key, minimumKeys)) {
        continue;
      }

      if (this.isCommandExcluded(commandId, excludedCommands)) {
        continue;
      }

      commands.push(commandId);
    }

    return commands;
  }
}