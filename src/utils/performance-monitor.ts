/**
 * Performance monitoring utility for critical operations
 * Addresses PERF-001 risk from QA assessment
 */

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 100; // Keep last 100 metrics
  private readonly slowOperationThreshold = 50; // 50ms threshold for slow operations

  /**
   * Monitor a synchronous operation
   */
  monitor<T>(
    operation: string,
    fn: () => T,
    metadata?: Record<string, unknown>
  ): T {
    const start = performance.now();

    try {
      const result = fn();
      const duration = performance.now() - start;

      this.recordMetric(operation, duration, metadata);

      if (duration > this.slowOperationThreshold) {
        console.warn(
          `Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`,
          metadata
        );
      }

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration, { ...metadata, error: true });
      throw error;
    }
  }

  /**
   * Monitor an async operation
   */
  async monitorAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const start = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - start;

      this.recordMetric(operation, duration, metadata);

      if (duration > this.slowOperationThreshold) {
        console.warn(
          `Slow async operation detected: ${operation} took ${duration.toFixed(2)}ms`,
          metadata
        );
      }

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration, { ...metadata, error: true });
      throw error;
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(
    operation: string,
    duration: number,
    metadata?: Record<string, unknown>
  ) {
    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: new Date(),
      metadata,
    };

    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /**
   * Get performance statistics for an operation
   */
  getStats(operation?: string): {
    count: number;
    avgDuration: number;
    maxDuration: number;
    minDuration: number;
    slowOperations: number;
  } {
    const relevantMetrics = operation
      ? this.metrics.filter((m) => m.operation === operation)
      : this.metrics;

    if (relevantMetrics.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        maxDuration: 0,
        minDuration: 0,
        slowOperations: 0,
      };
    }

    const durations = relevantMetrics.map((m) => m.duration);
    const slowOperations = relevantMetrics.filter(
      (m) => m.duration > this.slowOperationThreshold
    ).length;

    return {
      count: relevantMetrics.length,
      avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations),
      slowOperations,
    };
  }

  /**
   * Get all recorded metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Check if performance is degrading
   */
  isPerformanceDegrading(operation: string, windowSize: number = 10): boolean {
    const recentMetrics = this.metrics
      .filter((m) => m.operation === operation)
      .slice(-windowSize);

    if (recentMetrics.length < windowSize) {
      return false;
    }

    const recentAvg =
      recentMetrics.slice(-5).reduce((sum, m) => sum + m.duration, 0) / 5;

    const previousAvg =
      recentMetrics.slice(0, 5).reduce((sum, m) => sum + m.duration, 0) / 5;

    // Consider performance degrading if recent average is 50% slower
    return recentAvg > previousAvg * 1.5;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for monitoring method performance
 */
export function monitorPerformance(operation?: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const operationName =
      operation ||
      `${(target as { constructor: { name: string } }).constructor.name}.${propertyKey}`;

    descriptor.value = function (...args: unknown[]) {
      return performanceMonitor.monitor(operationName, () =>
        originalMethod.apply(this, args)
      );
    };

    return descriptor;
  };
}

/**
 * Higher-order function for monitoring function performance
 */
export function withPerformanceMonitoring<
  T extends (...args: unknown[]) => unknown,
>(fn: T, operation: string): T {
  return ((...args: unknown[]) => {
    return performanceMonitor.monitor(operation, () => fn(...args));
  }) as T;
}
