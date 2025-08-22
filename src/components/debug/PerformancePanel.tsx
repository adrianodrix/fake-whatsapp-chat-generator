/**
 * Performance Debug Panel - Development Only
 * Mostra métricas em tempo real de performance da aplicação
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getPerformanceMetrics,
  checkPerformanceBudgets,
  clearPerformanceMetrics,
  type PerformanceMetric,
} from '../../utils/performance';

interface PerformancePanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const PerformancePanelContent: React.FC<PerformancePanelProps> = ({
  isOpen,
  onToggle,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Atualizar métricas periodicamente
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(getPerformanceMetrics());
    };

    updateMetrics();

    if (autoRefresh && isOpen) {
      const interval = setInterval(updateMetrics, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isOpen]);

  const budgetResults = useMemo(() => checkPerformanceBudgets(), []);

  const metricsByCategory = useMemo(() => {
    const categories = ['render', 'export', 'interaction', 'bundle'] as const;
    return categories.reduce(
      (acc, category) => {
        acc[category] = metrics
          .filter((m) => m.category === category)
          .slice(-10); // Últimas 10 métricas
        return acc;
      },
      {} as Record<(typeof categories)[number], PerformanceMetric[]>
    );
  }, [metrics]);

  const handleClearMetrics = useCallback(() => {
    clearPerformanceMetrics();
    setMetrics([]);
  }, []);

  const formatTime = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
    return `${ms.toFixed(2)}ms`;
  };

  const getStatusColor = (passed: boolean) => {
    return passed ? 'text-green-600' : 'text-red-600';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'render':
        return '🎨';
      case 'export':
        return '📸';
      case 'interaction':
        return '👆';
      case 'bundle':
        return '📦';
      default:
        return '⚡';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Open Performance Panel"
      >
        ⚡
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <h3 className="font-semibold text-gray-900">Performance Monitor</h3>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Controls */}
      <div className="px-4 py-2 border-b border-gray-200 flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
          Auto-refresh
        </label>
        <button
          onClick={handleClearMetrics}
          className="ml-auto text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Clear Metrics
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-64 p-4">
        {/* Budget Status */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Performance Budgets
          </h4>
          <div className="space-y-1">
            {budgetResults.map((result) => (
              <div
                key={result.category}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600">{result.category}:</span>
                <span className={getStatusColor(result.passed)}>
                  {result.metrics.length} metrics
                  {result.passed ? ' ✓' : ' ✗'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics by Category */}
        {Object.entries(metricsByCategory).map(
          ([category, categoryMetrics]) =>
            categoryMetrics.length > 0 && (
              <div key={category} className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  {getCategoryIcon(category)}{' '}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>
                <div className="space-y-1">
                  {categoryMetrics.map((metric, idx) => (
                    <div
                      key={`${metric.name}-${idx}`}
                      className="flex items-center justify-between text-xs"
                    >
                      <span
                        className="text-gray-600 truncate max-w-[200px]"
                        title={metric.name}
                      >
                        {metric.name}
                      </span>
                      <span className="text-gray-900 font-mono">
                        {formatTime(metric.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        {/* Empty State */}
        {metrics.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            No metrics recorded yet. Interact with the app to see performance
            data.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Total Metrics: {metrics.length}</span>
            <span>
              Avg Render:{' '}
              {metricsByCategory.render.length > 0
                ? formatTime(
                    metricsByCategory.render.reduce(
                      (sum, m) => sum + m.value,
                      0
                    ) / metricsByCategory.render.length
                  )
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PerformancePanel: React.FC<PerformancePanelProps> = (props) => {
  // Só renderizar em desenvolvimento
  if (!import.meta.env.DEV || !import.meta.env.VITE_PERFORMANCE_DASHBOARD) {
    return null;
  }

  return <PerformancePanelContent {...props} />;
};
