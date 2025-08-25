import React from 'react';
import {
  ChatBubbleLeftRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface EmptyStateProps {
  onLoadDemo: () => void;
  onStartChat: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onLoadDemo,
  onStartChat,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="mb-6">
        <div className="relative">
          <ChatBubbleLeftRightIcon className="w-24 h-24 text-gray-300" />
          <SparklesIcon className="w-8 h-8 text-wa-accent absolute -top-2 -right-2" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        Comece a criar sua conversa
      </h2>

      <p className="text-gray-600 mb-8 max-w-md">
        Crie mockups realistas de conversas do WhatsApp para apresentações,
        tutoriais, storyboards ou demonstrações de produtos.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onStartChat}
          className="px-6 py-3 bg-wa-accent text-white font-medium rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-wa-accent focus:ring-offset-2"
          aria-label="Começar nova conversa"
        >
          Começar do zero
        </button>

        <button
          onClick={onLoadDemo}
          className="px-6 py-3 bg-white text-wa-primary font-medium rounded-lg border-2 border-wa-primary hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-wa-primary focus:ring-offset-2"
          aria-label="Ver demonstração"
        >
          Ver demonstração
        </button>
      </div>

      <div className="mt-12 text-sm text-gray-500">
        <p className="mb-2">💡 Dicas rápidas:</p>
        <ul className="space-y-1">
          <li>
            Pressione{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs">
              ?
            </kbd>{' '}
            para ver atalhos de teclado
          </li>
          <li>Clique em mensagens para editá-las</li>
          <li>
            Use{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs">
              Tab
            </kbd>{' '}
            para alternar remetente
          </li>
        </ul>
      </div>
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
