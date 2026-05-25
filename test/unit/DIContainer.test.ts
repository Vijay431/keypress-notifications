import { describe, it, expect, beforeEach } from 'vitest';
import { DIContainer } from '../../src/di/container';

describe('DIContainer', () => {
  let container: DIContainer;

  beforeEach(() => {
    container = new DIContainer();
  });

  it('should register and resolve a singleton', () => {
    const token = Symbol('Test');
    container.registerSingleton<string>(token, () => 'hello');
    expect(container.get<string>(token)).toBe('hello');
  });

  it('should return the same instance on multiple gets (singleton)', () => {
    const token = Symbol('Counter');
    let count = 0;
    container.registerSingleton<number>(token, () => ++count);
    const a = container.get<number>(token);
    const b = container.get<number>(token);
    expect(a).toBe(b);
    expect(count).toBe(1);
  });

  it('should store a pre-built instance via registerInstance', () => {
    const token = Symbol('Obj');
    const obj = { value: 42 };
    container.registerInstance(token, obj);
    expect(container.get(token)).toBe(obj);
  });

  it('should return true from has() for registered tokens', () => {
    const token = Symbol('HasTest');
    container.registerSingleton(token, () => 1);
    expect(container.has(token)).toBe(true);
  });

  it('should return false from has() for unregistered tokens', () => {
    expect(container.has(Symbol('Missing'))).toBe(false);
  });

  it('should throw for unregistered token', () => {
    expect(() => container.get(Symbol('Unknown'))).toThrow('Service not registered');
  });

  it('should remove all registrations on clear()', () => {
    const token = Symbol('Clear');
    container.registerSingleton(token, () => 1);
    container.clear();
    expect(container.has(token)).toBe(false);
  });

  it('should fall back to parent from child container', () => {
    const token = Symbol('Parent');
    container.registerSingleton<string>(token, () => 'from-parent');
    const child = container.createChild();
    expect(child.get<string>(token)).toBe('from-parent');
  });

  it('should allow child container to override parent', () => {
    const token = Symbol('Override');
    container.registerSingleton<string>(token, () => 'parent');
    const child = container.createChild();
    child.registerSingleton<string>(token, () => 'child');
    expect(child.get<string>(token)).toBe('child');
  });
});
