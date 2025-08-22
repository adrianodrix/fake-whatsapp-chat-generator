import React, { memo } from 'react';
import type { MessageBubbleProps } from './MessageBubble.types';

/**
 * Componente de bolha de mensagem que replica o visual do WhatsApp
 *
 * @example
 * ```tsx
 * <MessageBubble
 *   message={message}
 *   onEdit={handleEdit}
 *   isEditing={isEditing}
 * />
 * ```
 */
export const MessageBubble: React.FC<MessageBubbleProps> = memo(
  ({ message, isEditing = false, showActions = false }) => {
    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const renderStatusIcon = () => {
      const iconClass = `w-4 h-4 ${
        message.status === 'read'
          ? 'text-wa-check-read'
          : 'text-wa-check-default'
      }`;

      switch (message.status) {
        case 'sent':
          return (
            <svg className={iconClass} viewBox="0 0 16 15" fill="currentColor">
              <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
            </svg>
          );
        case 'delivered':
        case 'read':
          return (
            <svg className={iconClass} viewBox="0 0 16 15" fill="currentColor">
              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-1.181-1.158a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l1.714 1.677c.143.14.361.125.484-.033L15.073 3.379a.365.365 0 0 0-.063-.51z" />
              <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
            </svg>
          );
        default:
          return null;
      }
    };

    const isUser = message.sender === 'user';

    const wrapperClasses = `
    flex w-full mb-2
    ${isUser ? 'justify-end' : 'justify-start'}
  `
      .trim()
      .replace(/\s+/g, ' ');

    const bubbleClasses = `
    max-w-bubble p-3 rounded-lg shadow-sm relative group
    ${
      isUser
        ? 'bg-wa-bubble-sent rounded-br-sm'
        : 'bg-wa-bubble-received rounded-bl-sm'
    }
    ${isEditing ? 'ring-2 ring-wa-accent' : ''}
    ${showActions ? 'hover:shadow-md transition-shadow' : ''}
  `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div className={wrapperClasses}>
        <div className={bubbleClasses}>
          <div className="break-words">
            <p className="text-wa-text-primary text-sm leading-relaxed mb-1">
              {message.text}
            </p>

            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-wa-text-meta text-xs">
                {formatTime(message.timestamp)}
              </span>

              {message.sender === 'user' && (
                <div className="flex-shrink-0">{renderStatusIcon()}</div>
              )}
            </div>
          </div>

          {/* Ações de hover (futuro) */}
          {showActions && (
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Placeholder para ações futuras */}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';
