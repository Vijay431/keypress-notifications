interface CacheEntry<T> {
  value: T;
  createdAt: number;
  expiresAt: number;
  accessCount: number;
  lastAccessAt: number;
}

export interface CacheConfig {
  maxSize: number; // 0 = unlimited
  defaultTTL: number; // 0 = no expiration
  trackStats: boolean;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  expired: number;
  evicted: number;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxSize: 100,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  trackStats: true,
};

export class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private stats = { hits: 0, misses: 0, expired: 0, evicted: 0 };
  private cleanupTimer: NodeJS.Timeout | undefined;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
    if (this.config.defaultTTL > 0) {
      this.cleanupTimer = setInterval(
        () => {
          this.cleanup();
        },
        Math.min(this.config.defaultTTL, 60000),
      );
    }
  }

  public set(key: string, value: T, ttl?: number): void {
    // Evict LRU if we're at capacity
    if (this.config.maxSize > 0 && this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const now = Date.now();
    const effectiveTTL = ttl !== undefined ? ttl : this.config.defaultTTL;
    const expiresAt = effectiveTTL > 0 ? now + effectiveTTL : 0;

    this.cache.set(key, {
      value,
      createdAt: now,
      expiresAt,
      accessCount: 0,
      lastAccessAt: now,
    });
  }

  public get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (entry === undefined) {
      if (this.config.trackStats) {
        this.stats.misses++;
      }
      return undefined;
    }

    // Check expiration
    if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      if (this.config.trackStats) {
        this.stats.expired++;
        this.stats.misses++;
      }
      return undefined;
    }

    // Update access tracking
    entry.accessCount++;
    entry.lastAccessAt = Date.now();

    if (this.config.trackStats) {
      this.stats.hits++;
    }

    return entry.value;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry === undefined) {
      return false;
    }
    if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

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

  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  public cleanup(): number {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt > 0 && now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
        if (this.config.trackStats) {
          this.stats.expired++;
        }
      }
    }
    return removed;
  }

  private evictLRU(): void {
    let oldestKey: string | undefined;
    let oldestAccess = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessAt < oldestAccess) {
        oldestAccess = entry.lastAccessAt;
        oldestKey = key;
      }
    }

    if (oldestKey !== undefined) {
      this.cache.delete(oldestKey);
      if (this.config.trackStats) {
        this.stats.evicted++;
      }
    }
  }

  public dispose(): void {
    if (this.cleanupTimer !== undefined) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.cache.clear();
  }
}

export function createCache<T>(config?: Partial<CacheConfig>): Cache<T> {
  return new Cache<T>(config);
}

export function memoize(
  ttl?: number,
  keyGenerator?: (...args: unknown[]) => string,
): MethodDecorator {
  const cache = new Cache<unknown>(ttl !== undefined ? { defaultTTL: ttl } : {});

  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

    descriptor.value = function (...args: unknown[]): unknown {
      const cacheKey = keyGenerator
        ? keyGenerator(...args)
        : `${String(propertyKey)}:${JSON.stringify(args)}`;

      const cached = cache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }

      const result = originalMethod.apply(this, args);
      cache.set(cacheKey, result);
      return result;
    };

    return descriptor;
  };
}
