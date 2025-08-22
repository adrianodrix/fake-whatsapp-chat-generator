/**
 * Performance monitoring utility for critical operations
 */

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  context?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100; // Keep last 100 metrics

  /**
   * Measure the execution time of a function
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T> | T,
    context?: Record<string, unknown>
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      this.recordMetric({
        operation,
        duration,
        timestamp: new Date(),
        context,
      });

      // Log slow operations
      if (duration > 100) {
        console.warn(
          `Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`,
          context
        );
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.recordMetric({
        operation: `${operation}_ERROR`,
        duration,
        timestamp: new Date(),
        context: { ...context, error: error.message },
      });

      throw error;
    }
  }

  /**
   * Measure synchronous operations
   */
  measureSync<T>(
    operation: string,
    fn: () => T,
    context?: Record<string, unknown>
  ): T {
    const startTime = performance.now();

    try {
      const result = fn();
      const duration = performance.now() - startTime;

      this.recordMetric({
        operation,
        duration,
        timestamp: new Date(),
        context,
      });

      // Log slow operations
      if (duration > 50) {
        // Lower threshold for sync operations
        console.warn(
          `Slow sync operation detected: ${operation} took ${duration.toFixed(2)}ms`,
          context
        );
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.recordMetric({
        operation: `${operation}_ERROR`,
        duration,
        timestamp: new Date(),
        context: { ...context, error: error.message },
      });

      throw error;
    }
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);

    // Keep only the last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /**
   * Get performance statistics for an operation
   */
  getStats(operation: string) {
    const operationMetrics = this.metrics.filter(
      (m) => m.operation === operation
    );

    if (operationMetrics.length === 0) {
      return null;
    }

    const durations = operationMetrics.map((m) => m.duration);
    const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);

    // Calculate p95
    const sorted = durations.sort((a, b) => a - b);
    const p95Index = Math.ceil(sorted.length * 0.95) - 1;
    const p95 = sorted[p95Index] || max;

    return {
      operation,
      count: operationMetrics.length,
      avgDuration: avg,
      minDuration: min,
      maxDuration: max,
      p95Duration: p95,
    };
  }

  /**
   * Get all recorded metrics
   */
  getAllMetrics() {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
  }

  /**
   * Get summary of all operations
   */
  getSummary() {
    const operations = [...new Set(this.metrics.map((m) => m.operation))];
    return operations.map((op) => this.getStats(op)).filter(Boolean);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for React components to access performance monitoring
export const usePerformanceMonitor = () => {
  return performanceMonitor;
};
