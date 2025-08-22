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
          version: 1,
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
        setMessages((prev) => {
          // Store original state for atomic rollback capability
          const originalMessages = [...prev];

          try {
            // Find target message for optimistic locking check
            const targetMessage = prev.find((msg) => msg.id === id);
            if (!targetMessage) {
              console.warn(`Message with id ${id} not found for update`);
              return prev;
            }

            // Comprehensive temporal validation before applying updates
            if (updates.timestamp) {
              const newTimestamp = updates.timestamp;
              const now = new Date();

              // Critical temporal validation: prevent inconsistent states
              if (updates.status === 'read' && newTimestamp > now) {
                console.error(
                  'Temporal validation failed: Read status cannot be set for future timestamp'
                );
                throw new Error(
                  'Status "read" cannot be set for future timestamp'
                );
              }

              // Prevent extreme future dates (more than 24h)
              const oneDayFromNow = new Date(
                now.getTime() + 24 * 60 * 60 * 1000
              );
              if (newTimestamp > oneDayFromNow) {
                console.error(
                  'Temporal validation failed: Timestamp too far in future'
                );
                throw new Error(
                  'Timestamp cannot be more than 24 hours in the future'
                );
              }

              // Validate timestamp is not in the past beyond reasonable limits (1 year)
              const oneYearAgo = new Date(
                now.getTime() - 365 * 24 * 60 * 60 * 1000
              );
              if (newTimestamp < oneYearAgo) {
                console.error(
                  'Temporal validation failed: Timestamp too far in past'
                );
                throw new Error(
                  'Timestamp cannot be more than 1 year in the past'
                );
              }
            }

            // Apply updates atomically with version control
            const updated = prev.map((message) => {
              if (message.id === id) {
                // Optimistic locking: check version if provided in updates
                if (
                  updates.version !== undefined &&
                  message.version !== undefined
                ) {
                  if (updates.version !== message.version) {
                    throw new Error(
                      `Concurrent modification detected. Expected version ${updates.version} but found ${message.version}`
                    );
                  }
                }

                // Increment version on update
                const newVersion = (message.version || 1) + 1;
                return {
                  ...message,
                  ...updates,
                  updatedAt: new Date(),
                  version: newVersion,
                };
              }
              return message;
            });

            // Reorder messages by timestamp if timestamp was updated
            if (updates.timestamp) {
              // Use a stable sort to prevent corruption
              return updated.sort((a, b) => {
                const timeA =
                  a.timestamp instanceof Date
                    ? a.timestamp.getTime()
                    : new Date(a.timestamp).getTime();
                const timeB =
                  b.timestamp instanceof Date
                    ? b.timestamp.getTime()
                    : new Date(b.timestamp).getTime();

                // Secondary sort by createdAt for stability
                if (timeA === timeB) {
                  return a.createdAt.getTime() - b.createdAt.getTime();
                }
                return timeA - timeB;
              });
            }

            return updated;
          } catch (error) {
            // Rollback on error - return original state
            console.error('Failed to update message:', error);
            return originalMessages;
          }
        });
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

    const toggleSender = useCallback(() => {
      setActiveSender((current) => (current === 'user' ? 'contact' : 'user'));
    }, []);

    const actions = useMemo<ChatActions>(
      () => ({
        addMessage,
        updateMessage,
        deleteMessage,
        setActiveSender: setActiveSenderCallback,
        setEditing: setEditingCallback,
        toggleSender,
      }),
      [
        addMessage,
        updateMessage,
        deleteMessage,
        setActiveSenderCallback,
        setEditingCallback,
        toggleSender,
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
