import React, { memo } from 'react';
import type { ProgressBarProps } from './ProgressBar.types';

/**
 * Barra de progresso para indicar status de operações assíncronas
 */
export const ProgressBar: React.FC<ProgressBarProps> = memo(
  ({ progress, label, showPercentage = true, className = '' }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
      <div className={`w-full ${className}`}>
        {(label || showPercentage) && (
          <div className="flex justify-between mb-1">
            {label && <span className="text-sm text-gray-600">{label}</span>}
            {showPercentage && (
              <span className="text-sm text-gray-600">
                {Math.round(clampedProgress)}%
              </span>
            )}
          </div>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-wa-primary h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${clampedProgress}%` }}
            role="progressbar"
            aria-valuenow={clampedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
