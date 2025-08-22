import React, { memo, useRef, useEffect } from 'react';
import type { ChatContainerProps } from './ChatContainer.types';
import { ChatHeader } from '../ChatHeader';
import { MessageBubble } from '../MessageBubble';
import { MessageInput } from '../MessageInput';

/**
 * Container principal do chat que replica o layout do WhatsApp
 * Inclui header, área de mensagens e input inferior
 */
export const ChatContainer: React.FC<ChatContainerProps> = memo(
  ({
    messages,
    profiles,
    activeSender,
    inputValue,
    onInputChange,
    onSendMessage,
    onSenderToggle,
    onProfileEdit,
    loading = false,
  }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll para última mensagem
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
      <div className="flex flex-col h-screen max-h-screen bg-wa-bg-chat">
        {/* Header */}
        <ChatHeader
          profile={profiles.contact}
          onProfileEdit={onProfileEdit}
          showOnlineStatus={false}
        />

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {/* WhatsApp background pattern (optional) */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm30 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Messages */}
          <div className="relative z-10 space-y-1">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-wa-text-secondary">
                  <div className="mb-2">
                    <svg
                      className="w-16 h-16 mx-auto opacity-50"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Comece uma conversa digitando uma mensagem abaixo
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showActions={true}
                />
              ))
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center py-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-wa-text-secondary rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-wa-text-secondary rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-wa-text-secondary rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <MessageInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSendMessage}
          onSenderToggle={onSenderToggle}
          activeSender={activeSender}
          disabled={loading}
        />
      </div>
    );
  }
);

ChatContainer.displayName = 'ChatContainer';
