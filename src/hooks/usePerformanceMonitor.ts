/**
 * Hook para monitoramento de performance de componentes React
 * Integra React Profiler com sistema de métricas
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  recordPerformanceMetric,
  DEFAULT_PERFORMANCE_BUDGET,
  isDevelopment,
  isPerformanceMonitoringEnabled,
} from '../utils/performance';

export interface ComponentPerformanceData {
  componentName: string;
  renderTime: number;
  renderCount: number;
  averageRenderTime: number;
  isPerformant: boolean;
}

/**
 * Hook para monitoramento de performance de componentes específicos
 */
export const usePerformanceMonitor = (componentName: string) => {
  const [performanceData, setPerformanceData] =
    useState<ComponentPerformanceData>({
      componentName,
      renderTime: 0,
      renderCount: 0,
      averageRenderTime: 0,
      isPerformant: true,
    });

  const renderTimesRef = useRef<number[]>([]);
  const maxHistory = 50; // Manter histórico das últimas 50 renderizações

  // Callback para React Profiler
  const onRenderCallback = useCallback(
    (_id: string, phase: 'mount' | 'update', actualDuration: number) => {
      // Só ativar em desenvolvimento com flag
      if (!isDevelopment() || !isPerformanceMonitoringEnabled()) {
        return;
      }

      // Registrar métrica no sistema global
      recordPerformanceMetric(
        `${componentName}_${phase}`,
        actualDuration,
        'render',
        DEFAULT_PERFORMANCE_BUDGET.renderTime
      );

      // Atualizar estado local
      renderTimesRef.current.push(actualDuration);

      // Manter histórico limitado
      if (renderTimesRef.current.length > maxHistory) {
        renderTimesRef.current.shift();
      }

      // Não atualizar state durante render para evitar loop infinito
      // Apenas registrar a métrica no sistema global
      // A atualização do state será feita em um efeito separado
    },
    [componentName]
  );

  // Reset quando componentName mudar
  useEffect(() => {
    renderTimesRef.current = [];
    setPerformanceData({
      componentName,
      renderTime: 0,
      renderCount: 0,
      averageRenderTime: 0,
      isPerformant: true,
    });
  }, [componentName]);

  // Atualizar performance data periodicamente (sem causar re-render durante render)
  useEffect(() => {
    const interval = setInterval(() => {
      if (renderTimesRef.current.length > 0) {
        const renderCount = renderTimesRef.current.length;
        const totalTime = renderTimesRef.current.reduce(
          (sum, time) => sum + time,
          0
        );
        const averageRenderTime = totalTime / renderCount;
        const lastRenderTime =
          renderTimesRef.current[renderTimesRef.current.length - 1];
        const isPerformant =
          averageRenderTime <= DEFAULT_PERFORMANCE_BUDGET.renderTime;

        setPerformanceData((prev) => {
          // Só atualizar se houver mudança real
          if (
            prev?.renderCount !== renderCount ||
            prev?.averageRenderTime !== averageRenderTime
          ) {
            return {
              componentName,
              renderTime: lastRenderTime,
              renderCount,
              averageRenderTime,
              isPerformant,
            };
          }
          return prev;
        });
      }
    }, 1000); // Atualizar a cada 1 segundo

    return () => clearInterval(interval);
  }, [componentName]);

  return {
    performanceData,
    onRenderCallback,

    // Função para resetar métricas manualmente
    resetMetrics: useCallback(() => {
      renderTimesRef.current = [];
      setPerformanceData({
        componentName,
        renderTime: 0,
        renderCount: 0,
        averageRenderTime: 0,
        isPerformant: true,
      });
    }, [componentName]),

    // Função para obter histórico completo
    getRenderHistory: useCallback(() => [...renderTimesRef.current], []),

    // Função para verificar se componente está performático
    isHealthy: useCallback(() => {
      if (renderTimesRef.current.length === 0) return true;

      const recentRenders = renderTimesRef.current.slice(-10); // Últimas 10 renderizações
      const avgRecent =
        recentRenders.reduce((sum, time) => sum + time, 0) /
        recentRenders.length;

      return avgRecent <= DEFAULT_PERFORMANCE_BUDGET.renderTime;
    }, []),
  };
};

/**
 * Hook específico para monitoramento de listas (MessageList, etc)
 */
export const useListPerformanceMonitor = (
  componentName: string,
  itemCount: number
) => {
  const { performanceData, onRenderCallback, resetMetrics, isHealthy } =
    usePerformanceMonitor(componentName);

  const [listMetrics, setListMetrics] = useState({
    itemCount,
    renderTimePerItem: 0,
    isEfficient: true,
  });

  useEffect(() => {
    if (performanceData.renderCount > 0 && itemCount > 0) {
      const renderTimePerItem = performanceData.averageRenderTime / itemCount;
      const isEfficient = renderTimePerItem <= 1; // Max 1ms per item

      setListMetrics({
        itemCount,
        renderTimePerItem,
        isEfficient,
      });
    }
  }, [performanceData, itemCount]);

  return {
    performanceData,
    listMetrics,
    onRenderCallback,
    resetMetrics,
    isHealthy,
  };
};

/**
 * Hook para monitoramento global de performance da aplicação
 */
export const useGlobalPerformanceMonitor = () => {
  const [globalStats, setGlobalStats] = useState({
    totalComponents: 0,
    performantComponents: 0,
    averageRenderTime: 0,
    healthScore: 100,
  });

  // Esta função será chamada pelo PerformancePanel para atualizar stats
  const updateGlobalStats = useCallback(
    (components: ComponentPerformanceData[]) => {
      const totalComponents = components.length;
      const performantComponents = components.filter(
        (c) => c.isPerformant
      ).length;
      const totalRenderTime = components.reduce(
        (sum, c) => sum + c.averageRenderTime,
        0
      );
      const averageRenderTime =
        totalComponents > 0 ? totalRenderTime / totalComponents : 0;
      const healthScore =
        totalComponents > 0
          ? (performantComponents / totalComponents) * 100
          : 100;

      setGlobalStats({
        totalComponents,
        performantComponents,
        averageRenderTime,
        healthScore,
      });
    },
    []
  );

  return {
    globalStats,
    updateGlobalStats,
  };
};
