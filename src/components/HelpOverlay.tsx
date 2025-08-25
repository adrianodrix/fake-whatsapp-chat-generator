import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutInfo {
  keys: string;
  description: string;
}

const shortcuts: ShortcutInfo[] = [
  { keys: '?', description: 'Mostrar esta ajuda' },
  { keys: 'Ctrl + Shift + Delete', description: 'Limpar conversa' },
  { keys: 'Ctrl + N', description: 'Nova mensagem' },
  { keys: 'Tab', description: 'Alternar entre remetente e destinatário' },
  { keys: 'Ctrl + E', description: 'Exportar conversa como imagem' },
  { keys: 'Ctrl + D', description: 'Carregar conversa de demonstração' },
  { keys: 'Escape', description: 'Fechar modais e overlays' },
  { keys: 'Enter', description: 'Enviar mensagem (no campo de input)' },
  { keys: 'Shift + Enter', description: 'Nova linha (no campo de input)' },
];

export const HelpOverlay: React.FC<HelpOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 id="help-title" className="text-xl font-semibold text-gray-900">
            Atalhos de Teclado
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Fechar ajuda"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto">
          <div className="space-y-1">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 hover:bg-gray-50 px-3 rounded-md transition-colors"
              >
                <span className="text-sm text-gray-700">
                  {shortcut.description}
                </span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Dicas Adicionais
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Clique em qualquer mensagem para editá-la inline</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Arraste e solte imagens para adicionar fotos de perfil
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Use o botão de toggle para alternar rapidamente o remetente
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Todas as conversas são salvas automaticamente no navegador
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Pressione{' '}
            <kbd className="px-1 py-0.5 text-xs bg-gray-100 border border-gray-200 rounded">
              ESC
            </kbd>{' '}
            ou clique fora para fechar
          </p>
        </div>
      </div>
    </div>
  );
};

HelpOverlay.displayName = 'HelpOverlay';
