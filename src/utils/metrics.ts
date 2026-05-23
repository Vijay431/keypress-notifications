export interface MetricData {
  operation: string;
  duration: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface IMetricCollector {
  record(data: MetricData): void;
  getMetrics(): MetricData[];
  clear(): void;
  getSummary(): {
    count: number;
    averageDuration: number;
    successRate: number;
  };
}
