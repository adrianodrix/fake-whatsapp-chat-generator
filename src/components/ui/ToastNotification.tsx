import React, { useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export interface ToastNotificationProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: (id: string) => void;
}

const iconMap = {
  success: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
  error: <XCircleIcon className="w-5 h-5 text-red-600" />,
  info: <InformationCircleIcon className="w-5 h-5 text-blue-600" />,
  warning: <ExclamationCircleIcon className="w-5 h-5 text-yellow-600" />,
};

const backgroundMap = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
  warning: 'bg-yellow-50 border-yellow-200',
};

const textMap = {
  success: 'text-green-800',
  error: 'text-red-800',
  info: 'text-blue-800',
  warning: 'text-yellow-800',
};

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  id,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 p-4 mb-3 border rounded-lg shadow-sm animate-slide-up ${backgroundMap[type]}`}
    >
      {iconMap[type]}
      <p className={`flex-1 text-sm ${textMap[type]}`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded-md hover:bg-black/5 transition-colors"
        aria-label="Fechar notificação"
      >
        <XMarkIcon className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

ToastNotification.displayName = 'ToastNotification';
