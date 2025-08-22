import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Message,
  MessageSender,
  ChatState,
  ChatActions,
  ChatContextType,
} from '../types/message';
import type { ChatProfiles } from '../types/profile';
import { ChatContext } from './ChatContextDefinition';
import { loadProfiles, saveProfiles } from '../utils/storage';

interface ChatProviderProps {
  children: ReactNode;
}

const initialProfiles: ChatProfiles = {
  user: {
    id: 'user',
    name: 'Você',
    initials: 'VC',
    isOnline: true,
  },
  contact: {
    id: 'contact',
    name: 'Contato',
    initials: 'CT',
    isOnline: false,
  },
};

export const ChatProvider: React.FC<ChatProviderProps> = React.memo(
  ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeSender, setActiveSender] = useState<MessageSender>('user');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [profiles, setProfiles] = useState<ChatProfiles>(initialProfiles);

    // Carrega perfis do localStorage na inicialização
    useEffect(() => {
      const storedProfiles = loadProfiles();
      if (storedProfiles) {
        setProfiles(storedProfiles);
      }
    }, []);

    // Função para atualizar perfis com persistência
    const updateProfiles = (newProfiles: ChatProfiles) => {
      setProfiles(newProfiles);
      saveProfiles(newProfiles);
    };

    const addMessage = useCallback(
      (text: string, sender?: MessageSender) => {
        const newMessage: Message = {
          id: uuidv4(),
          text: text.trim(),
          sender: sender || activeSender,
          timestamp: new Date(),
          status: (sender || activeSender) === 'user' ? 'sent' : 'delivered',
          type: 'text',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setMessages((prev) => {
          const newMessages = [...prev, newMessage];
          // Ordenação cronológica automática baseada em timestamp
          return newMessages.sort((a, b) => {
            const timeA =
              a.timestamp instanceof Date
                ? a.timestamp.getTime()
                : new Date(a.timestamp).getTime();
            const timeB =
              b.timestamp instanceof Date
                ? b.timestamp.getTime()
                : new Date(b.timestamp).getTime();
            return timeA - timeB;
          });
        });
      },
      [activeSender]
    );

    const updateMessage = useCallback(
      (id: string, updates: Partial<Message>) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === id
              ? { ...message, ...updates, updatedAt: new Date() }
              : message
          )
        );
      },
      []
    );

    const deleteMessage = useCallback((id: string) => {
      setMessages((prev) => prev.filter((message) => message.id !== id));
    }, []);

    const setActiveSenderCallback = useCallback((sender: MessageSender) => {
      setActiveSender(sender);
    }, []);

    const setEditingCallback = useCallback((messageId: string | null) => {
      setIsEditing(messageId);
    }, []);

    const actions = useMemo<ChatActions>(
      () => ({
        addMessage,
        updateMessage,
        deleteMessage,
        setActiveSender: setActiveSenderCallback,
        setEditing: setEditingCallback,
      }),
      [
        addMessage,
        updateMessage,
        deleteMessage,
        setActiveSenderCallback,
        setEditingCallback,
      ]
    );

    const state = useMemo<ChatState>(
      () => ({
        messages,
        activeSender,
        isEditing,
      }),
      [messages, activeSender, isEditing]
    );

    const value = useMemo(
      () => ({
        state,
        actions,
        profiles,
        setProfiles: updateProfiles,
      }),
      [state, actions, profiles]
    );

    return (
      <ChatContext.Provider value={{ ...value } as ChatContextType}>
        {children}
      </ChatContext.Provider>
    );
  }
);

ChatProvider.displayName = 'ChatProvider';
