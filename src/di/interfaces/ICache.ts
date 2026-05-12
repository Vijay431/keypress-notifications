/**
 * Cache Service Interface
 *
 * Defines the contract for caching with TTL expiration and LRU eviction.
 *
 * @description
 * Generic cache interface supporting time-based expiration, size limits,
 * and access statistics. Thread-safe for concurrent access.
 *
 * @category Services
 * @see Cache - Implementation in utils/cache.ts
 */

/**
 * Cache configuration options
 *
 * @description
 * Configures cache behavior including size limits and expiration.
 */
export interface CacheConfig {
  /** Maximum number of entries (0 = unlimited) */
  maxSize: number;
  /** Default time-to-live in milliseconds (0 = no expiration) */
  defaultTTL: number;
  /** Whether to track access statistics */
  trackStats: boolean;
}

/**
 * Cache access statistics
 *
 * @description
 * Summary of cache performance metrics.
 */
export interface CacheStats {
  /** Current number of cached entries */
  size: number;
  /** Number of cache hits (valid entries found) */
  hits: number;
  /** Number of cache misses (entries not found or expired) */
  misses: number;
  /** Hit rate (0-1), calculated as hits / (hits + misses) */
  hitRate: number;
  /** Number of entries that expired and were removed */
  expired: number;
  /** Number of entries evicted due to size limit */
  evicted: number;
}

/**
 * Cache Service Interface
 *
 * @description
 * Generic cache with TTL (time-to-live) expiration and LRU (least recently used)
 * eviction. Type-safe cache for any value type.
 *
 * @template T - The type of values to cache
 *
 * @example
 * ```typescript
 * const cache = new Cache<string>();
 * cache.set('user:123', 'John Doe', 60000); // Cache for 1 minute
 * const name = cache.get('user:123');
 *
 * const stats = cache.getStats();
 * console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
 * ```
 *
 * @category Service Interfaces
 */
export interface ICache<T> {
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
	 * // Cache for 5 minutes
	 * cache.set('data', result, 5 * 60 * 1000);
	 *
	 * // Cache with default TTL
	 * cache.set('user', user);
	 * ```
	 */
  set(key: string, value: T, ttl?: number): void;

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
	 */
  get(key: string): T | undefined;

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
	 */
  has(key: string): boolean;

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
	 */
  delete(key: string): boolean;

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
	 */
  clear(): void;

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
	 */
  getStats(): CacheStats;

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
	 */
  cleanup(): number;

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
	 */
  dispose(): void;
}
