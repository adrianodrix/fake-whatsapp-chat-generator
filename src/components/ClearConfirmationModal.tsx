import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ClearConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearConfirmationModal: React.FC<ClearConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-title"
      aria-describedby="clear-description"
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
          </div>

          <div className="flex-1">
            <h3
              id="clear-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Limpar conversa?
            </h3>

            <p id="clear-description" className="text-sm text-gray-600 mb-6">
              Esta ação irá remover todas as mensagens da conversa atual. Esta
              ação não pode ser desfeita.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label="Cancelar"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Confirmar limpeza"
              >
                Limpar conversa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ClearConfirmationModal.displayName = 'ClearConfirmationModal';
