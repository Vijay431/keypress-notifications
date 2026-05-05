/**
 * Metrics Collector Utility
 *
 * Collects and reports performance metrics for the extension.
 *
 * @description
 * Tracks operation duration, success rates, and other performance indicators.
 * Provides summary statistics for monitoring and analysis.
 *
 * @category Utilities
 * @category Metrics
 *
 * @example
 * ```typescript
 * const metrics = new MetricsCollector();
 *
 * // Record an operation
 * const start = Date.now();
 * try {
 *   // ... operation logic
 *   metrics.record({
 *     operation: 'saveFile',
 *     duration: Date.now() - start,
 *     success: true,
 *   });
 * } catch (error) {
 *   metrics.record({
 *     operation: 'saveFile',
 *     duration: Date.now() - start,
 *     success: false,
 *     error: String(error),
 *   });
 * }
 *
 * // Get summary
 * const summary = metrics.getSummary();
 * console.log(`Success rate: ${(summary.successRate * 100).toFixed(1)}%`);
 * ```
 */

import type { IMetricsCollector, MetricData, MetricsSummary } from '../di';

/**
 * Metrics Collector
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
 * @category Utilities
 * @category Metrics
 */
export class MetricsCollector implements IMetricsCollector {
  private metrics: MetricData[] = [];

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
	 *
	 * @category Metrics Recording
	 */
  public record(data: MetricData): void {
    this.metrics.push(data);
  }

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
	 *
	 * @category Metrics Access
	 */
  public getMetrics(): MetricData[] {
    return [...this.metrics];
  }

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
	 *
	 * @category Metrics Management
	 */
  public clear(): void {
    this.metrics = [];
  }

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
	 *
	 * @category Metrics Analysis
	 */
  public getSummary(): MetricsSummary {
    if (this.metrics.length === 0) {
      return {
        count: 0,
        averageDuration: 0,
        successRate: 0,
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const successCount = this.metrics.filter((m) => m.success).length;

    return {
      count: this.metrics.length,
      averageDuration: totalDuration / this.metrics.length,
      successRate: successCount / this.metrics.length,
    };
  }
}
