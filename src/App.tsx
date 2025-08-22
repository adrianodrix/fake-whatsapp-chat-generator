import React, { useState } from 'react';
import { ChatProvider } from './contexts/ChatContext';
import { useChat } from './hooks/useChat';
import { useProfiles } from './hooks/useProfiles';
import { ChatContainer } from './components/chat';
import { ProfilePanel } from './components/chat/ProfilePanel';
import type { Profile } from './types/profile';

/**
 * Componente interno que usa o ChatContext
 */
const ChatApp: React.FC = () => {
  const { state, actions } = useChat();
  const { profiles, updateUserProfile, updateContactProfile } = useProfiles();
  const [inputValue, setInputValue] = useState('');
  const [showProfiles, setShowProfiles] = useState(false);

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
        <div className="mb-4 space-x-2">
          <button
            onClick={addExampleMessages}
            className="px-4 py-2 bg-wa-accent text-white rounded-lg hover:bg-wa-secondary transition-colors"
          >
            Carregar conversa de exemplo
          </button>
          <button
            onClick={() => setShowProfiles(!showProfiles)}
            className="px-4 py-2 bg-wa-primary text-white rounded-lg hover:bg-wa-secondary transition-colors"
          >
            {showProfiles ? 'Ocultar' : 'Configurar'} Perfis
          </button>
        </div>
      )}

      <div className="w-full max-w-4xl flex gap-4">
        {/* Profile Configuration */}
        {showProfiles && (
          <div className="w-80 space-y-4">
            <ProfilePanel
              profile={profiles.user}
              label="Seu Perfil"
              onProfileUpdate={(profile: Profile) => updateUserProfile(profile)}
            />
            <ProfilePanel
              profile={profiles.contact}
              label="Contato"
              onProfileUpdate={(profile: Profile) =>
                updateContactProfile(profile)
              }
            />
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 max-w-md h-[600px] bg-white rounded-lg shadow-xl overflow-hidden">
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
