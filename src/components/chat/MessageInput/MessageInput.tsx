import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import type { MessageInputProps } from './MessageInput.types';
import { useDebounce } from '../../../hooks/useDebounce';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { validateMessage } from '../../../utils/validation';

/**
 * Input de nova mensagem com toggle de remetente
 * Replica o input do WhatsApp com ícones e funcionalidades
 */
export const MessageInput: React.FC<MessageInputProps> = memo(
  ({
    value,
    onChange,
    onSend,
    onSenderToggle,
    activeSender,
    disabled = false,
    placeholder = 'Digite uma mensagem',
  }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const isMobile = useIsMobile();
    const debouncedValue = useDebounce(value, 300);

    // Auto-resize textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
      }
    }, [value]);

    // Validação com debounce
    useEffect(() => {
      if (debouncedValue.trim()) {
        const result = validateMessage(debouncedValue);
        setValidationError(result.isValid ? null : result.error || null);
      } else {
        setValidationError(null);
      }
    }, [debouncedValue]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter sem Shift envia mensagem
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (value.trim() && !validationError) {
            onSend();
          }
        }
        // Shift+Enter permite nova linha (comportamento padrão do textarea)
        // Tab alterna remetente
        if (e.key === 'Tab') {
          e.preventDefault();
          onSenderToggle();
        }
      },
      [value, validationError, onSend, onSenderToggle]
    );

    const handleSend = useCallback(() => {
      if (value.trim() && !disabled && !validationError) {
        onSend();
      }
    }, [value, disabled, validationError, onSend]);

    const senderColor =
      activeSender === 'user' ? 'text-wa-accent' : 'text-wa-secondary';

    // Mostrar contador de caracteres após 1000 caracteres
    const showCharCounter = value.length > 1000;
    const charCounterColor =
      value.length > 4096 ? 'text-red-500' : 'text-wa-text-secondary';

    return (
      <div className="bg-wa-bg-pattern p-3 border-t border-gray-200">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          {/* Sender toggle button */}
          <button
            onClick={onSenderToggle}
            className={`
            flex-shrink-0 p-2 rounded-full transition-colors
            ${senderColor} hover:bg-gray-100
          `}
            aria-label={`Enviar como ${activeSender === 'user' ? 'você' : 'contato'}`}
            disabled={disabled}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Input container */}
          <div
            className={`flex-1 bg-white rounded-full shadow-sm border overflow-hidden transition-colors ${
              validationError ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <div className="flex items-end relative">
              {/* Emoji button */}
              <button
                className="flex-shrink-0 p-3 text-wa-text-secondary hover:text-wa-text-primary transition-colors"
                aria-label="Emojis"
                disabled={disabled}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className="
                flex-1 px-3 py-3 text-wa-text-primary placeholder-wa-text-secondary
                resize-none outline-none bg-transparent
                max-h-30 min-h-[24px]
              "
                style={{ lineHeight: '1.5' }}
              />

              {/* Attachment button */}
              <button
                className="flex-shrink-0 p-3 text-wa-text-secondary hover:text-wa-text-primary transition-colors"
                aria-label="Anexar"
                disabled={disabled}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Character counter */}
              {showCharCounter && (
                <div
                  className={`absolute right-3 bottom-0 text-xs ${charCounterColor}`}
                >
                  {value.length}/4096
                </div>
              )}
            </div>
          </div>

          {/* Send button - sempre visível em mobile, oculto em desktop quando vazio */}
          {(isMobile || value.trim()) && (
            <button
              onClick={handleSend}
              disabled={!value.trim() || disabled || !!validationError}
              className={`
              flex-shrink-0 p-3 rounded-full transition-all
              ${
                value.trim() && !disabled && !validationError
                  ? 'bg-wa-accent text-white hover:bg-wa-secondary shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
              aria-label="Enviar mensagem"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          )}
        </div>

        {/* Sender indicator e validation error */}
        <div className="mt-2 flex justify-between items-center px-2">
          <span className={`text-xs ${senderColor} font-medium`}>
            Enviando como: {activeSender === 'user' ? 'Você' : 'Contato'} (Tab
            para alternar)
          </span>
          {validationError && (
            <span className="text-xs text-red-500">{validationError}</span>
          )}
        </div>
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';
