import React, { useState } from 'react';
import { ChatProvider } from './contexts/ChatContext';
import { useChat } from './hooks/useChat';
import { ChatContainer } from './components/chat';
import type { ChatProfiles } from './types/profile';

/**
 * Componente interno que usa o ChatContext
 */
const ChatApp: React.FC = () => {
  const { state, actions } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [profiles] = useState<ChatProfiles>({
    user: {
      id: 'user',
      name: 'Você',
      initials: 'VC',
      isOnline: true,
    },
    contact: {
      id: 'contact',
      name: 'João Silva',
      initials: 'JS',
      isOnline: true,
    },
  });

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      actions.addMessage(inputValue);
      setInputValue('');
    }
  };

  const handleSenderToggle = () => {
    actions.setActiveSender(state.activeSender === 'user' ? 'contact' : 'user');
  };

  // Função para adicionar mensagens de exemplo
  const addExampleMessages = () => {
    const exampleMessages = [
      { text: 'Oi! Como você está?', sender: 'contact' as const },
      { text: 'Olá! Estou bem, obrigado! E você?', sender: 'user' as const },
      { text: 'Também estou bem! Que bom saber.', sender: 'contact' as const },
      {
        text: 'Vamos marcar um café qualquer dia desses?',
        sender: 'user' as const,
      },
      { text: 'Claro! Seria ótimo! 😊', sender: 'contact' as const },
    ];

    exampleMessages.forEach((msg, index) => {
      setTimeout(() => {
        actions.addMessage(msg.text, msg.sender);
      }, index * 200);
    });
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Botão para adicionar mensagens de exemplo quando não houver mensagens */}
      {state.messages.length === 0 && (
        <button
          onClick={addExampleMessages}
          className="mb-4 px-4 py-2 bg-wa-accent text-white rounded-lg hover:bg-wa-secondary transition-colors"
        >
          Carregar conversa de exemplo
        </button>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <ChatContainer
          messages={state.messages}
          profiles={profiles}
          activeSender={state.activeSender}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          onSenderToggle={handleSenderToggle}
        />
      </div>
    </div>
  );
};

/**
 * App principal com providers
 */
const App: React.FC = () => {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

export default App;
