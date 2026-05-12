/**
 * Cache Utility
 *
 * Provides caching with TTL expiration and LRU eviction.
 *
 * @description
 * Generic cache with time-to-live expiration and least-recently-used eviction.
 * Thread-safe for concurrent access with configurable size limits.
 *
 * @category Utilities
 * @category Caching
 *
 * @example
 * ```typescript
 * const cache = new Cache<string>({ defaultTTL: 60000 }); // 1 minute
 * cache.set('user:123', 'John Doe');
 * const user = cache.get('user:123'); // 'John Doe'
 * ```
 */

import type { ICache, CacheConfig, CacheStats } from '../di';

/**
 * Cache entry with metadata
 *
 * @description
 * Internal structure storing cached value with expiration and access tracking.
 *
 * @template T - The type of value being cached
 */
interface CacheEntry<T> {
  /** The cached value */
  value: T;
  /** Timestamp when entry was created */
  createdAt: number;
  /** Timestamp when entry expires (0 = never expires) */
  expiresAt: number;
  /** Number of times this entry was accessed */
  accessCount: number;
  /** Timestamp of last access */
  lastAccessAt: number;
}

/**
 * Default cache configuration
 *
 * @description
 * Sensible defaults for production use.
 */
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxSize: 100,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  trackStats: true,
};

/**
 * Generic cache with TTL expiration and LRU eviction
 *
 * @description
 * Thread-safe cache with time-to-live expiration and least-recently-used eviction.
 * Automatically expires entries after TTL and evicts oldest entries when size limit is reached.
 *
 * @template T - The type of values to cache
 *
 * @example
 * ```typescript
 * const cache = new Cache<string>({
 *   maxSize: 50,
 *   defaultTTL: 60000, // 1 minute
 *   trackStats: true,
 * });
 *
 * cache.set('key', 'value', 30000); // Custom TTL: 30 seconds
 * const value = cache.get('key');
 *
 * const stats = cache.getStats();
 * console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
 * ```
 *
 * @category Utilities
 * @category Caching
 */
export class Cache<T> implements ICache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private stats = { hits: 0, misses: 0, expired: 0, evicted: 0 };
  private cleanupTimer?: NodeJS.Timeout;

  /**
	 * Create a new cache instance
	 *
	 * @description
	 * Initializes cache with configuration and starts periodic cleanup.
	 *
	 * @param config - Partial configuration overriding defaults
	 *
	 * @example
	 * ```typescript
	 * const cache = new Cache<string>({ defaultTTL: 60000 });
	 * ```
	 */
  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };

    // Periodic cleanup of expired entries
    if (this.config.defaultTTL > 0) {
      this.cleanupTimer = setInterval(
        () => this.cleanup(),
        Math.min(this.config.defaultTTL, 60000),
      );
    }
  }

  /**
	 * Set a value in the cache
	 *
	 * @description
	 * Stores a value with an optional time-to-live.
	 * If cache is at maxSize, evicts LRU entry first.
	 *
	 * @param key - Unique key for the value
	 * @param value - Value to cache
	 * @param ttl - Optional TTL in milliseconds (uses default if not specified)
	 *
	 * @example
	 * ```typescript
	 * // Cache for 5 minutes (default)
	 * cache.set('user', userData);
	 *
	 * // Cache for 30 seconds
	 * cache.set('session', sessionData, 30000);
	 * ```
	 *
	 * @category Cache Operations
	 */
  public set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const entryTTL = ttl ?? this.config.defaultTTL;

    // Enforce size limit with LRU eviction
    if (this.config.maxSize > 0 && this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      createdAt: now,
      expiresAt: entryTTL > 0 ? now + entryTTL : Number.MAX_SAFE_INTEGER,
      accessCount: 0,
      lastAccessAt: now,
    });
  }

  /**
	 * Get a value from the cache
	 *
	 * @description
	 * Retrieves a cached value if it exists and hasn't expired.
	 * Updates access statistics and timestamp for LRU tracking.
	 *
	 * @param key - Key of the value to retrieve
	 * @returns The cached value, or undefined if not found or expired
	 *
	 * @example
	 * ```typescript
	 * const value = cache.get('key');
	 * if (value !== undefined) {
	 *   // Use cached value
	 * } else {
	 *   // Compute and cache
	 * }
	 * ```
	 *
	 * @category Cache Operations
	 */
  public get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.expired++;
      return undefined;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessAt = Date.now();
    this.stats.hits++;

    return entry.value;
  }

  /**
	 * Check if a key exists in the cache
	 *
	 * @description
	 * Returns true if the key exists and hasn't expired.
	 * Does not update access statistics.
	 *
	 * @param key - Key to check
	 * @returns Whether the key exists and is valid
	 *
	 * @example
	 * ```typescript
	 * if (cache.has('config')) {
	 *   // Key exists
	 * }
	 * ```
	 *
	 * @category Cache Operations
	 */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {return false;}
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.expired++;
      return false;
    }
    return true;
  }

  /**
	 * Delete a key from the cache
	 *
	 * @description
	 * Removes a key from the cache regardless of expiration.
	 *
	 * @param key - Key to delete
	 * @returns Whether the key was found and deleted
	 *
	 * @example
	 * ```typescript
	 * cache.delete('old-data');
	 * ```
	 *
	 * @category Cache Operations
	 */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
	 * Clear all entries from the cache
	 *
	 * @description
	 * Removes all cached entries and resets statistics.
	 *
	 * @example
	 * ```typescript
	 * cache.clear();
	 * ```
	 *
	 * @category Cache Operations
	 */
  public clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, expired: 0, evicted: 0 };
  }

  /**
	 * Get cache statistics
	 *
	 * @description
	 * Returns performance metrics for the cache.
	 * Only includes statistics if trackStats is enabled in config.
	 *
	 * @returns Current cache statistics
	 *
	 * @example
	 * ```typescript
	 * const stats = cache.getStats();
	 * console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
	 * console.log(`Cached entries: ${stats.size}`);
	 * ```
	 *
	 * @category Cache Statistics
	 */
  public getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      expired: this.stats.expired,
      evicted: this.stats.evicted,
    };
  }

  /**
	 * Clean up expired entries
	 *
	 * @description
	 * Removes all entries that have exceeded their TTL.
	 * Normally called automatically by a periodic timer.
	 *
	 * @returns Number of entries removed
	 *
	 * @example
	 * ```typescript
	 * const removed = cache.cleanup();
	 * console.log(`Cleaned up ${removed} expired entries`);
	 * ```
	 *
	 * @category Cache Maintenance
	 */
  public cleanup(): number {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }
    this.stats.expired += removed;
    return removed;
  }

  /**
	 * Dispose of cache resources
	 *
	 * @description
	 * Clears all entries and stops the periodic cleanup timer.
	 * Called automatically during extension deactivation.
	 *
	 * @example
	 * ```typescript
	 * cache.dispose();
	 * ```
	 *
	 * @category Lifecycle
	 */
  public dispose(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.clear();
  }

  /**
	 * Evict least-recently-used entry
	 *
	 * @description
	 * Finds and removes the entry with the oldest last access time.
	 * Called automatically when cache reaches maxSize.
	 *
	 * @category Cache Maintenance
	 * @private
	 */
  private evictLRU(): void {
    let lruKey: string | undefined;
    let lruTime = Number.MAX_SAFE_INTEGER;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessAt < lruTime) {
        lruTime = entry.lastAccessAt;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.stats.evicted++;
    }
  }
}

/**
 * Method-level memoization decorator
 *
 * @description
 * Decorator that caches method results with optional TTL expiration.
 * Automatically generates cache keys from method arguments and class name.
 *
 * @param ttl - Optional time-to-live in milliseconds (default: 5 minutes)
 * @param keyGenerator - Optional function to generate custom cache keys
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * class MyService {
 *   // Use default 5-minute TTL
 *   @memoize()
 *   async fetchData(id: string): Promise<Data> {
 *     // Expensive computation
 *   }
 *
 *   // Custom 1-hour TTL
 *   @memoize(3600000)
 *   async computeComplexResult(input: string): Promise<Result> {
 *     // Very expensive computation
 *   }
 *
 *   // Custom key generator
 *   @memoize(60000, (id, version) => `data:${id}:${version}`)
 *   async fetchWithVersion(id: string, version: number): Promise<Data> {
 *     // Version-aware data fetching
 *   }
 * }
 * ```
 *
 * @category Decorators
 * @category Caching
 */
export function memoize(
  ttl?: number,
  keyGenerator?: (...args: unknown[]) => string,
): MethodDecorator {
  // Per-method cache instance
  let methodCache: Cache<unknown> | undefined;

  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
      // Lazy initialization of cache
      if (!methodCache) {
        methodCache = new Cache<unknown>({ defaultTTL: ttl });
      }

      // Generate cache key
      const className = typeof target === 'function' ? target.name : 'Unknown';
      const methodName = String(propertyKey);
      const argsKey = keyGenerator
        ? keyGenerator(...args)
        : JSON.stringify(args);
      const cacheKey = `${className}.${methodName}:${argsKey}`;

      // Check cache
      const cached = methodCache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }

      // Execute and cache result
      const result = originalMethod.apply(this, args);

      // Handle promises
      if (result instanceof Promise) {
        return result
          .then((value: unknown) => {
            methodCache!.set(cacheKey, value);
            return value;
          })
          .catch((error: unknown) => {
            // Don't cache errors
            throw error;
          });
      }

      // Cache synchronous results
      methodCache.set(cacheKey, result);
      return result;
    };

    return descriptor;
  };
}
