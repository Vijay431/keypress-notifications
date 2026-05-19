interface TimingEntry {
  label: string;
  durationMs: number;
  timestamp: number;
}

export class MetricsTracker {
  private timings: TimingEntry[] = [];
  private starts = new Map<string, number>();

  start(label: string): void {
    this.starts.set(label, performance.now());
  }

  end(label: string): number {
    const startTime = this.starts.get(label);
    if (startTime === undefined) {
      return 0;
    }
    const durationMs = performance.now() - startTime;
    this.timings.push({ label, durationMs, timestamp: Date.now() });
    this.starts.delete(label);
    return durationMs;
  }

  getTimings(): readonly TimingEntry[] {
    return this.timings;
  }

  clear(): void {
    this.timings = [];
    this.starts.clear();
  }
}
