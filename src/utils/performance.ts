/**
 * Utilitários para monitoramento de performance
 * Implementa validação de 60fps e métricas de rendering
 * Integrado com Sentry para monitoring em produção
 */

import { useState, useRef, useEffect } from 'react';
import { captureMessage } from '@/monitoring/sentry';

// Interfaces principais definidas na história
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  category: 'render' | 'export' | 'interaction' | 'bundle';
  threshold?: number;
}

export interface PerformanceBudget {
  renderTime: number; // Max 16ms for 60fps
  exportTime: number; // Max 2s for image export
  bundleSize: number; // Max 200KB gzipped
  interactionDelay: number; // Max 100ms for interactions
}

// Interface para compatibilidade com código existente
interface PerformanceMetrics {
  fps: number;
  frameDrops: number;
  averageFrameTime: number;
  isTargetMet: boolean;
}

// Performance budgets padrão
export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = Object.freeze({
  renderTime: 16, // 60fps
  exportTime: 2000, // 2s
  bundleSize: 200 * 1024, // 200KB
  interactionDelay: 100, // 100ms
});

// Storage para métricas coletadas
const performanceMetrics: PerformanceMetric[] = [];
const maxMetricsHistory = 100;

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
 * Verifica se está em modo desenvolvimento
 */
export const isDevelopment = (): boolean => {
  // Em Jest/Node, process.env é disponível
  if (typeof process !== 'undefined') {
    return process.env.NODE_ENV === 'development';
  }

  // Em browser com Vite
  if (typeof window !== 'undefined') {
    try {
      // Em desenvolvimento, não conseguimos acessar import.meta.env em Jest
      // Assumir que está em desenvolvimento se window existe mas import.meta falha
      return true;
    } catch {
      return false;
    }
  }

  return false;
};

/**
 * Verifica se performance monitoring está ativado
 */
export const isPerformanceMonitoringEnabled = (): boolean => {
  // Em Jest/Node, usar process.env
  if (typeof process !== 'undefined') {
    return process.env.VITE_PERFORMANCE_MONITORING === 'true';
  }

  // Em browser com Vite
  if (typeof window !== 'undefined') {
    try {
      // Em desenvolvimento, não conseguimos acessar import.meta.env em Jest
      // Assumir monitoring ativo se window existe mas import.meta falha
      return true;
    } catch {
      return false;
    }
  }

  return false;
};

/**
 * Mede performance de uma operação específica
 */
export const measurePerformance = (name: string, fn: () => void): number => {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (isDevelopment()) {
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

  if (isDevelopment()) {
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

      entries.forEach((entry) => {
        const layoutEntry = entry as PerformanceEntry & {
          value?: number;
          hadRecentInput?: boolean;
        };
        if (layoutEntry.hadRecentInput) return;
        cumulativeLayoutShift += layoutEntry.value || 0;
      });

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
    // Só ativar em desenvolvimento
    if (!isDevelopment() || !isPerformanceMonitoringEnabled()) {
      return;
    }

    monitorRef.current = new PerformanceMonitor(setMetrics);
    monitorRef.current.start();

    return () => {
      monitorRef.current?.stop();
    };
  }, []);

  return metrics;
};

/**
 * Registra uma métrica de performance
 */
export const recordPerformanceMetric = (
  name: string,
  value: number,
  category: PerformanceMetric['category'],
  threshold?: number
): void => {
  // Só gravar métricas em desenvolvimento
  if (!isDevelopment() || !isPerformanceMonitoringEnabled()) {
    return;
  }

  const metric: PerformanceMetric = {
    name,
    value,
    timestamp: new Date(),
    category,
    threshold,
  };

  performanceMetrics.push(metric);

  // Manter histórico limitado
  if (performanceMetrics.length > maxMetricsHistory) {
    performanceMetrics.splice(0, performanceMetrics.length - maxMetricsHistory);
  }

  // Log se excedeu threshold
  if (threshold && value > threshold) {
    console.warn(
      `Performance threshold exceeded for ${name}: ${value.toFixed(2)}ms > ${threshold}ms`
    );
  }

  // Log categorizado
  const categoryLabel = `Performance [${category.toUpperCase()}]`;
  console.log(`${categoryLabel} ${name}: ${value.toFixed(2)}ms`);
};

/**
 * Obtém métricas registradas por categoria
 */
export const getPerformanceMetrics = (
  category?: PerformanceMetric['category']
): PerformanceMetric[] => {
  if (category) {
    return performanceMetrics.filter((m) => m.category === category);
  }
  return [...performanceMetrics];
};

/**
 * Limpa histórico de métricas
 */
export const clearPerformanceMetrics = (): void => {
  performanceMetrics.length = 0;
};

/**
 * Monitora performance de Canvas export operations
 */
export const measureCanvasOperation = async <T>(
  name: string,
  operation: () => Promise<T>,
  threshold?: number
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await operation();
    const duration = performance.now() - startTime;

    recordPerformanceMetric(
      name,
      duration,
      'export',
      threshold || DEFAULT_PERFORMANCE_BUDGET.exportTime
    );

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    recordPerformanceMetric(`${name}_failed`, duration, 'export');
    throw error;
  }
};

/**
 * Monitora performance de rendering de componentes
 */
export const measureRenderOperation = <T>(
  name: string,
  operation: () => T,
  threshold?: number
): T => {
  const startTime = performance.now();

  try {
    const result = operation();
    const duration = performance.now() - startTime;

    recordPerformanceMetric(
      name,
      duration,
      'render',
      threshold || DEFAULT_PERFORMANCE_BUDGET.renderTime
    );

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    recordPerformanceMetric(`${name}_failed`, duration, 'render');
    throw error;
  }
};

/**
 * Verifica se performance budgets estão sendo atendidos
 */
export const checkPerformanceBudgets = (
  budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET
): { category: string; passed: boolean; metrics: PerformanceMetric[] }[] => {
  const results = [];

  // Check render performance
  const renderMetrics = getPerformanceMetrics('render');
  const avgRenderTime =
    renderMetrics.length > 0
      ? renderMetrics.reduce((sum, m) => sum + m.value, 0) /
        renderMetrics.length
      : 0;

  results.push({
    category: 'render',
    passed: avgRenderTime <= budget.renderTime,
    metrics: renderMetrics.slice(-10), // últimas 10 métricas
  });

  // Check export performance
  const exportMetrics = getPerformanceMetrics('export');
  const avgExportTime =
    exportMetrics.length > 0
      ? exportMetrics.reduce((sum, m) => sum + m.value, 0) /
        exportMetrics.length
      : 0;

  results.push({
    category: 'export',
    passed: avgExportTime <= budget.exportTime,
    metrics: exportMetrics.slice(-5), // últimas 5 métricas
  });

  return results;
};

// === NOVAS FUNCIONALIDADES INTEGRADAS COM SENTRY ===

/**
 * Detectar se prefers-reduced-motion está ativado
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Observer para mudanças em prefers-reduced-motion
 */
export const observeReducedMotionPreference = (
  callback: (prefersReduced: boolean) => void
) => {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mediaQuery.addEventListener('change', handler);

  // Retornar cleanup function
  return () => mediaQuery.removeEventListener('change', handler);
};

/**
 * Performance timing measurements com Sentry integration
 */
export const measurePerformanceWithSentry = <T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> => {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    performance.mark(`${name}-start`);
  }

  const result = fn();

  if (result instanceof Promise) {
    return result.then((value) => {
      if (isDev) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        if (performance.getEntriesByName) {
          const measure = performance.getEntriesByName(name, 'measure')[0];
          if (measure) {
            console.log(
              `[Performance] ${name}: ${measure.duration.toFixed(2)}ms`
            );
          }
        }

        // Log para Sentry se demorou muito
        if (performance.getEntriesByName) {
          const measure = performance.getEntriesByName(name, 'measure')[0];
          if (measure && measure.duration > 1000) {
            captureMessage(
              `Slow operation: ${name} took ${measure.duration.toFixed(2)}ms`,
              'warning'
            );
          }
        }
      }
      return value;
    });
  } else {
    if (isDev) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      if (performance.getEntriesByName) {
        const measure = performance.getEntriesByName(name, 'measure')[0];
        if (measure) {
          console.log(
            `[Performance] ${name}: ${measure.duration.toFixed(2)}ms`
          );

          // Log para Sentry se demorou muito
          if (measure.duration > 100) {
            captureMessage(
              `Slow operation: ${name} took ${measure.duration.toFixed(2)}ms`,
              'warning'
            );
          }
        }
      }
    }
    return result;
  }
};

/**
 * Debounce para otimizar eventos frequentes
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle para limitar frequência de execução
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy loading de images com Intersection Observer
 */
export const lazyLoadImage = (img: HTMLImageElement, src: string): void => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          image.src = src;
          image.classList.remove('lazy');
          observer.unobserve(image);
        }
      });
    });

    imageObserver.observe(img);
  } else {
    // Fallback para browsers sem Intersection Observer
    img.src = src;
  }
};

/**
 * Memory cleanup utilities
 */
export const cleanupResources = () => {
  // Limpar performance entries antigas
  if (performance.clearMarks) {
    performance.clearMarks();
  }
  if (performance.clearMeasures) {
    performance.clearMeasures();
  }

  console.log('[Performance] Resources cleaned up');
};

/**
 * Monitor Core Web Vitals com Sentry integration
 */
export const observeWebVitals = () => {
  // Só executar em produção
  if (process.env.NODE_ENV !== 'production') return;

  // First Contentful Paint (FCP)
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        const fcp = entry.startTime;
        console.log(`[WebVitals] FCP: ${fcp.toFixed(2)}ms`);

        if (fcp > 1500) {
          captureMessage(`Poor FCP: ${fcp.toFixed(2)}ms`, 'warning');
        }
      }
    }
  }).observe({ entryTypes: ['paint'] });

  // Largest Contentful Paint (LCP)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    const lcp = lastEntry.startTime;

    console.log(`[WebVitals] LCP: ${lcp.toFixed(2)}ms`);

    if (lcp > 2500) {
      captureMessage(`Poor LCP: ${lcp.toFixed(2)}ms`, 'warning');
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const layoutEntry = entry as PerformanceEntry & {
        value?: number;
        hadRecentInput?: boolean;
      };
      if (!layoutEntry.hadRecentInput) {
        clsValue += layoutEntry.value || 0;
      }
    }

    if (clsValue > 0.1) {
      console.warn(`[WebVitals] High CLS: ${clsValue.toFixed(3)}`);
      captureMessage(`High CLS: ${clsValue.toFixed(3)}`, 'warning');
    }
  }).observe({ entryTypes: ['layout-shift'] });
};

/**
 * Bundle size monitoring
 */
export const logBundleInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '[Bundle] App version:',
      process.env.VITE_APP_VERSION || '1.0.0'
    );
    console.log('[Bundle] Build mode:', process.env.NODE_ENV);
  }
};

/**
 * Request Animation Frame com fallback
 */
export const requestAnimationFrame = (
  callback: FrameRequestCallback
): number => {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  } else {
    // Fallback para browsers antigos
    return window.setTimeout(callback, 16) as unknown as number;
  }
};

export const cancelAnimationFrame = (id: number): void => {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    window.clearTimeout(id);
  }
};
