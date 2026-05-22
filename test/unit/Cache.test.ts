import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Cache, createCache } from '../../src/utils/cache';

describe('Cache', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache({ maxSize: 5, defaultTTL: 60000, trackStats: true });
  });

  it('set and get a value', () => {
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  it('returns undefined for missing key', () => {
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  it('has() returns true for existing key', () => {
    cache.set('k', 'v');
    expect(cache.has('k')).toBe(true);
  });

  it('has() returns false for missing key', () => {
    expect(cache.has('missing')).toBe(false);
  });

  it('delete() removes a key', () => {
    cache.set('del', 'val');
    cache.delete('del');
    expect(cache.get('del')).toBeUndefined();
  });

  it('clear() removes all entries', () => {
    cache.set('a', '1');
    cache.set('b', '2');
    cache.clear();
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });

  it('evicts LRU when at capacity', async () => {
    // Insert keys with small delays to ensure distinct lastAccessAt timestamps
    for (let i = 0; i < 5; i++) {
      cache.set(`key${i}`, `val${i}`);
      await new Promise(r => setTimeout(r, 2));
    }
    // Access key0 to make it recently used (bump lastAccessAt above all others)
    await new Promise(r => setTimeout(r, 2));
    cache.get('key0');
    // Add one more to trigger eviction — key1 was inserted first and never re-accessed
    cache.set('key5', 'val5');
    // key1 should be evicted (oldest lastAccessAt after key0 was refreshed)
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key0')).toBe('val0');
  });

  it('getStats() tracks hits and misses', () => {
    cache.set('k', 'v');
    cache.get('k');   // hit
    cache.get('nope'); // miss
    const stats = cache.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBeCloseTo(0.5);
  });

  it('respects TTL expiry', async () => {
    const shortCache = new Cache<string>({ defaultTTL: 1 });
    shortCache.set('exp', 'val');
    await new Promise(r => setTimeout(r, 10));
    expect(shortCache.get('exp')).toBeUndefined();
    shortCache.dispose();
  });

  it('createCache factory returns a Cache instance', () => {
    const c = createCache<number>();
    expect(c).toBeInstanceOf(Cache);
    c.dispose();
  });
});
