/* eslint-disable react-refresh/only-export-components */
/**
 * Test utilities para providers e renderização de componentes
 * Facilita testes que precisam dos contexts da aplicação
 */

import React, { useState, useMemo } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ChatContext } from '@/contexts/ChatContextDefinition';
import type {
  ChatProfiles,
  Message,
  MessageSender,
  ChatState,
  ChatContextType,
} from '@/types';

// Mock dos perfis padrão para testes
export const mockProfiles: ChatProfiles = {
  user: {
    id: 'user',
    name: 'João',
    initials: 'JO',
    isOnline: true,
  },
  contact: {
    id: 'contact',
    name: 'Maria',
    initials: 'MA',
    isOnline: true,
  },
};

// Mock de mensagens padrão para testes
export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Olá! Como você está?',
    sender: 'contact',
    timestamp: new Date('2025-01-01T10:00:00Z'),
    status: 'read',
    type: 'text',
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-01T10:00:00Z'),
  },
  {
    id: '2',
    text: 'Oi! Estou bem, obrigado!',
    sender: 'user',
    timestamp: new Date('2025-01-01T10:01:00Z'),
    status: 'read',
    type: 'text',
    createdAt: new Date('2025-01-01T10:01:00Z'),
    updatedAt: new Date('2025-01-01T10:01:00Z'),
  },
];

// Provider wrapper customizado para testes
interface TestProvidersProps {
  children: React.ReactNode;
  initialMessages?: Message[];
  initialProfiles?: ChatProfiles;
}

export const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  initialMessages = mockMessages,
  initialProfiles = mockProfiles,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeSender, setActiveSender] = useState<MessageSender>('user');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ChatProfiles>(initialProfiles);

  const state: ChatState = {
    messages,
    profiles,
    activeSender,
    isEditing,
  };

  const actions = useMemo(
    () => ({
      addMessage: (text: string) => {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          text,
          sender: activeSender,
          timestamp: new Date(),
          status: 'sent' as const,
          type: 'text' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      },
      updateMessage: (id: string, updates: Partial<Message>) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
        );
      },
      deleteMessage: (id: string) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      },
      setActiveSender,
      updateProfiles: setProfiles,
      setIsEditing,
    }),
    [activeSender]
  );

  const value: ChatContextType = { state, actions };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Função de render customizada que inclui os providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialMessages?: Message[];
  initialProfiles?: ChatProfiles;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialMessages,
    initialProfiles,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders
      initialMessages={initialMessages}
      initialProfiles={initialProfiles}
    >
      {children}
    </TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export tudo do testing-library para conveniência
export * from '@testing-library/react';
export { renderWithProviders as render };
