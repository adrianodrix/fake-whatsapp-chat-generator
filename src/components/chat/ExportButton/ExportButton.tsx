import React, { memo } from 'react';
import type { ExportButtonProps } from './ExportButton.types';

/**
 * Botão de exportação para o ChatHeader
 * Renderiza um ícone de download que abre o modal de export
 */
export const ExportButton: React.FC<ExportButtonProps> = memo(
  ({ onClick, disabled = false, className = '' }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="Exportar conversa"
        title="Exportar conversa como imagem"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  }
);

ExportButton.displayName = 'ExportButton';
