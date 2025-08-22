import React, { memo } from 'react';
import type { DateSeparatorProps } from './DateSeparator.types';
import { formatDateTime, isToday } from '@/utils/formatting';

/**
 * Separador de data para indicar mudança de dia entre mensagens
 */
export const DateSeparator: React.FC<DateSeparatorProps> = memo(({ date }) => {
  const formatDate = (date: Date): string => {
    if (isToday(date)) {
      return 'Hoje';
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Ontem';
    }

    return formatDateTime(date);
  };

  return (
    <div className="flex items-center justify-center py-2 mx-auto">
      <div className="bg-wa-bg-pattern/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
        <span className="text-xs text-wa-text-secondary font-medium">
          {formatDate(date)}
        </span>
      </div>
    </div>
  );
});

DateSeparator.displayName = 'DateSeparator';
