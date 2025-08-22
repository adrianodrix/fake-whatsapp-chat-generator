/**
 * Utilitários para monitoramento de performance
 * Implementa validação de 60fps e métricas de rendering
 */

import { useState, useRef, useEffect } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameDrops: number;
  averageFrameTime: number;
  isTargetMet: boolean;
}

/**
 * Monitor de performance para validar target de 60fps
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private frameDrops = 0;
  private frameTimes: number[] = [];
  private isMonitoring = false;
  private animationId?: number;
  private onUpdate?: (metrics: PerformanceMetrics) => void;

  constructor(onUpdate?: (metrics: PerformanceMetrics) => void) {
    this.onUpdate = onUpdate;
  }

  /**
   * Inicia o monitoramento de FPS
   */
  start(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.frameCount = 0;
    this.frameDrops = 0;
    this.frameTimes = [];
    this.lastTime = performance.now();

    this.measureFrame();
  }

  /**
   * Para o monitoramento
   */
  stop(): void {
    this.isMonitoring = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  /**
   * Obtém métricas atuais
   */
  getMetrics(): PerformanceMetrics {
    const fps = this.calculateFPS();
    const averageFrameTime =
      this.frameTimes.length > 0
        ? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
        : 0;

    return {
      fps,
      frameDrops: this.frameDrops,
      averageFrameTime,
      isTargetMet: fps >= 58, // Pequena margem para variações
    };
  }

  private measureFrame = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastTime;

    // Frame ideal: 16.67ms (60fps)
    if (frameTime > 20) {
      // > 50fps considerado frame drop
      this.frameDrops++;
    }

    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift(); // Manter apenas últimos 60 frames
    }

    this.frameCount++;
    this.lastTime = currentTime;

    // Atualizar métricas a cada segundo
    if (this.frameCount % 60 === 0 && this.onUpdate) {
      this.onUpdate(this.getMetrics());
    }

    this.animationId = requestAnimationFrame(this.measureFrame);
  };

  private calculateFPS(): number {
    if (this.frameTimes.length < 2) return 0;

    const recentFrameTimes = this.frameTimes.slice(-60);
    const averageFrameTime =
      recentFrameTimes.reduce((a, b) => a + b, 0) / recentFrameTimes.length;

    return averageFrameTime > 0 ? 1000 / averageFrameTime : 0;
  }
}

/**
 * Mede performance de uma operação específica
 */
export const measurePerformance = (name: string, fn: () => void): number => {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (import.meta.env.DEV) {
    console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);
  }

  return duration;
};

/**
 * Mede performance de operações assíncronas
 */
export const measureAsyncPerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> => {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (import.meta.env.DEV) {
    console.log(`Async Performance [${name}]: ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
};

/**
 * Monitora métricas de First Paint e layout shifts
 */
export const setupPerformanceObserver = (): void => {
  if (typeof PerformanceObserver === 'undefined') return;

  // First Paint monitoring
  try {
    const paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          const fcp = entry.startTime;
          console.log(`First Contentful Paint: ${fcp.toFixed(2)}ms`);

          // Target: < 200ms
          if (fcp > 200) {
            console.warn(`FCP target missed: ${fcp.toFixed(2)}ms > 200ms`);
          }
        }
      });
    });

    paintObserver.observe({ entryTypes: ['paint'] });
  } catch {
    console.debug('Paint observer not supported');
  }

  // Layout shift monitoring
  try {
    const layoutObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      let cumulativeLayoutShift = 0;

      entries.forEach(
        (
          entry: PerformanceEntry & { value?: number; hadRecentInput?: boolean }
        ) => {
          if (entry.hadRecentInput) return;
          cumulativeLayoutShift += entry.value || 0;
        }
      );

      if (cumulativeLayoutShift > 0.1) {
        console.warn(
          `High layout shift detected: ${cumulativeLayoutShift.toFixed(3)}`
        );
      }
    });

    layoutObserver.observe({ entryTypes: ['layout-shift'] });
  } catch {
    console.debug('Layout shift observer not supported');
  }
};

/**
 * Hook React para monitoramento de performance
 */
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const monitorRef = useRef<PerformanceMonitor | null>(null);

  useEffect(() => {
    monitorRef.current = new PerformanceMonitor(setMetrics);
    monitorRef.current.start();

    return () => {
      monitorRef.current?.stop();
    };
  }, []);

  return metrics;
};
