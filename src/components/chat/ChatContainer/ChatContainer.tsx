import React, { memo, useRef, useEffect, useMemo, useState } from 'react';
import type { ChatContainerProps } from './ChatContainer.types';
import { ChatHeader } from '../ChatHeader';
import { MessageBubble } from '../MessageBubble';
import { MessageEditPopover } from '../MessageEditPopover';
import { MessageInput } from '../MessageInput';
import { DateSeparator } from '../DateSeparator';
import { ExportModal } from '../../modals/ExportModal';
import { useMessageEdit, useIsMobile, useKeyboardAware } from '@/hooks';
import { groupMessagesByDate } from '@/utils/formatting';

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
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const { editingState, startEdit, cancelEdit, saveEdit, isEditing } =
      useMessageEdit();

    // Mobile optimization hooks
    const isMobile = useIsMobile(768);
    const { isKeyboardVisible, adjustedViewportHeight } = useKeyboardAware({
      targetRef: chatContainerRef as React.RefObject<HTMLElement>,
      offset: 16,
      enabled: isMobile,
    });

    // Group messages by date for date separators
    const groupedMessages = useMemo(() => {
      return groupMessagesByDate(messages);
    }, [messages]);

    // Auto-scroll para última mensagem
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle edit message
    const handleEditMessage = (messageId: string) => {
      const messageElement = document.querySelector(
        `[data-message-id="${messageId}"]`
      ) as HTMLElement;
      startEdit(messageId, messageElement);
    };

    return (
      <>
        <div
          ref={chatContainerRef}
          id="chat-container"
          className={`flex flex-col relative touch-manipulation overscroll-contain ${
            isMobile ? 'h-screen-safe safe-area-inset' : 'h-full'
          }`}
          style={{
            backgroundColor: '#E5DDD5',
            height:
              isMobile && isKeyboardVisible
                ? `${adjustedViewportHeight}px`
                : undefined,
          }}
        >
          {/* Header */}
          <ChatHeader
            profile={profiles.contact}
            onProfileEdit={onProfileEdit}
            onExport={() => setIsExportModalOpen(true)}
            showOnlineStatus={false}
          />

          {/* Messages area */}
          <div
            className={`flex-1 overflow-y-auto relative ${
              isMobile ? 'px-2 py-1' : 'px-3 py-2'
            }`}
          >
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
                groupedMessages.map((item) => {
                  if (item.type === 'separator') {
                    return <DateSeparator key={item.key} date={item.date!} />;
                  }

                  const message = item.message!;
                  return (
                    <div key={item.key} data-message-id={message.id}>
                      <MessageBubble
                        message={message}
                        onEdit={handleEditMessage}
                        isEditing={isEditing(message.id)}
                        showActions={true}
                      />
                    </div>
                  );
                })
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

          {/* Edit Popover */}
          {editingState.messageId && editingState.originalMessage && (
            <MessageEditPopover
              message={editingState.originalMessage}
              onSave={saveEdit}
              onCancel={cancelEdit}
              anchorEl={editingState.anchorEl}
              isVisible={true}
            />
          )}
        </div>

        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      </>
    );
  }
);

ChatContainer.displayName = 'ChatContainer';
