/**
 * Metrics Collector Interface
 *
 * Defines the contract for collecting and reporting performance metrics.
 *
 * @description
 * Tracks operation duration, success rates, and other performance indicators.
 * Provides summary statistics for monitoring and analysis.
 *
 * @category Services
 * @see MetricsCollector - Implementation in utils/metrics.ts
 */

/**
 * Individual metric data point
 *
 * @description
 * Represents a single recorded operation with its outcome.
 */
export interface MetricData {
  /** Name of the operation that was measured */
  operation: string;
  /** Duration in milliseconds */
  duration: number;
  /** Whether the operation succeeded */
  success: boolean;
  /** Error message if operation failed */
  error?: string;
  /** Additional metadata about the operation */
  metadata?: Record<string, unknown>;
}

/**
 * Metrics summary statistics
 *
 * @description
 * Aggregated statistics across all recorded metrics.
 */
export interface MetricsSummary {
  /** Total number of operations recorded */
  count: number;
  /** Average duration in milliseconds */
  averageDuration: number;
  /** Success rate (0-1) */
  successRate: number;
}

/**
 * Metrics Collector Interface
 *
 * @description
 * Records and reports performance metrics for extension operations.
 * Used for monitoring performance and identifying bottlenecks.
 *
 * @example
 * ```typescript
 * class MyService {
 *   constructor(
 *     private readonly logger: ILogger,
 *     private readonly metrics: IMetricsCollector,
 *   ) {}
 *
 *   async performOperation() {
 *     const start = Date.now();
 *     let success = false;
 *     try {
 *       // ... operation logic
 *       success = true;
 *     } finally {
 *       const duration = Date.now() - start;
 *       this.metrics.record({
 *         operation: 'performOperation',
 *         duration,
 *         success,
 *       });
 *     }
 *   }
 * }
 * }
 * ```
 *
 * @category Service Interfaces
 */
export interface IMetricsCollector {
  /**
   * Record a metric data point
   *
   * @description
   * Stores a single operation's metrics.
   * Automatically tracks summary statistics.
   *
   * @param data - The metric data to record
   *
   * @example
   * ```typescript
   * metrics.record({
   *   operation: 'saveFile',
   *   duration: 125,
   *   success: true,
   *   metadata: { fileSize: 1024 }
   * });
   * ```
   */
  record(data: MetricData): void;

  /**
   * Get all recorded metrics
   *
   * @description
   * Returns all metric data points currently recorded.
   *
   * @returns Array of all recorded metrics
   *
   * @example
   * ```typescript
   * const allMetrics = metrics.getMetrics();
   * console.log(`Total operations: ${allMetrics.length}`);
   * ```
   */
  getMetrics(): MetricData[];

  /**
   * Clear all recorded metrics
   *
   * @description
   * Removes all metric data and resets summary statistics.
   * Useful for starting fresh measurement periods.
   *
   * @example
   * ```typescript
   * metrics.clear();
   * ```
   */
  clear(): void;

  /**
   * Get summary statistics
   *
   * @description
   * Returns aggregated statistics across all recorded metrics.
   * Includes count, average duration, and success rate.
   *
   * @returns Summary of all metrics
   *
   * @example
   * ```typescript
   * const summary = metrics.getSummary();
   * console.log(`Average: ${summary.averageDuration}ms`);
   * console.log(`Success rate: ${(summary.successRate * 100).toFixed(1)}%`);
   * ```
   */
  getSummary(): MetricsSummary;
}
