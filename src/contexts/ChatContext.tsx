import React, { useState, useMemo, ReactNode } from 'react';
import type {
  Message,
  MessageSender,
  ChatState,
  ChatActions,
  ChatContextType,
} from '../types/message';
import type { ChatProfiles } from '../types/profile';
import { ChatContext } from './ChatContextDefinition';

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

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSender, setActiveSender] = useState<MessageSender>('user');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ChatProfiles>(initialProfiles);

  const actions = useMemo<ChatActions>(
    () => ({
      addMessage: (text: string, sender?: MessageSender) => {
        const newMessage: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: text.trim(),
          sender: sender || activeSender,
          timestamp: new Date(),
          status: (sender || activeSender) === 'user' ? 'sent' : 'delivered',
          type: 'text',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
      },

      updateMessage: (id: string, updates: Partial<Message>) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === id
              ? { ...message, ...updates, updatedAt: new Date() }
              : message
          )
        );
      },

      deleteMessage: (id: string) => {
        setMessages((prev) => prev.filter((message) => message.id !== id));
      },

      setActiveSender,
      setEditing: setIsEditing,
    }),
    [activeSender]
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
      setProfiles,
    }),
    [state, actions, profiles]
  );

  return (
    <ChatContext.Provider value={{ ...value } as ChatContextType}>
      {children}
    </ChatContext.Provider>
  );
};
