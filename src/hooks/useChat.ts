import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContextDefinition';

/**
 * Hook para usar o ChatContext
 * Garante que o componente está dentro do ChatProvider
 */
export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat deve ser usado dentro de ChatProvider');
  }

  return context;
};
