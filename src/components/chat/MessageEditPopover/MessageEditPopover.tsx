import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
} from '@floating-ui/react';
import type {
  MessageEditPopoverProps,
  EditingFormData,
  ValidationErrors,
} from './MessageEditPopover.types';
import { formatTime, timeStringToDate } from '@/utils/formatting';
import { validateTime, validateMessage } from '@/utils/validation';
import { useClickOutside } from '@/hooks/useClickOutside';
import { Icon } from '@/components/ui';
import type { MessageStatus } from '@/types/message';

const statusOptions: { value: MessageStatus; label: string }[] = [
  { value: 'sent', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'read', label: 'Lido' },
];

/**
 * Popover para edição inline de mensagens
 */
export const MessageEditPopover: React.FC<MessageEditPopoverProps> = memo(
  ({ message, onSave, onCancel, anchorEl, isVisible }) => {
    const [formData, setFormData] = useState<EditingFormData>({
      text: message.text,
      time: formatTime(message.timestamp),
      status: message.status,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Floating UI setup
    const { refs, floatingStyles } = useFloating({
      placement: 'top',
      middleware: [offset(10), flip(), shift({ padding: 8 })],
      whileElementsMounted: autoUpdate,
    });

    // Click outside handler
    const popoverRef = useClickOutside<HTMLDivElement>(() => {
      if (isVisible && !isSubmitting) {
        onCancel();
      }
    });

    // Combine refs
    const setFloatingRef = useCallback(
      (node: HTMLDivElement | null) => {
        refs.setFloating(node);
        (popoverRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
      },
      [refs, popoverRef]
    );

    // Set anchor element
    useEffect(() => {
      if (anchorEl) {
        refs.setReference(anchorEl);
      }
    }, [anchorEl, refs]);

    // Reset form when message changes
    useEffect(() => {
      setFormData({
        text: message.text,
        time: formatTime(message.timestamp),
        status: message.status,
      });
      setErrors({});
    }, [message]);

    // Handle ESC key
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isVisible && !isSubmitting) {
          onCancel();
        }
      };

      if (isVisible) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [isVisible, onCancel, isSubmitting]);

    const validateForm = (): boolean => {
      const newErrors: ValidationErrors = {};

      // Validate text
      const textValidation = validateMessage(formData.text);
      if (!textValidation.isValid) {
        newErrors.text = textValidation.error;
      }

      // Validate time
      const timeValidation = validateTime(formData.time);
      if (!timeValidation.isValid) {
        newErrors.time = timeValidation.error;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        const newTimestamp = timeStringToDate(formData.time, message.timestamp);

        const updates = {
          text: formData.text.trim(),
          timestamp: newTimestamp,
          status: formData.status,
          updatedAt: new Date(),
        };

        // Check if onSave returns a promise
        const result = onSave(updates);
        if (result && typeof result.then === 'function') {
          await result;
        }
      } catch (error) {
        console.error('Error saving message:', error);
        setErrors({ text: 'Erro ao salvar mensagem' });
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleInputChange = (field: keyof EditingFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleSave();
      }
    };

    if (!isVisible) return null;

    return (
      <div
        ref={setFloatingRef}
        style={floatingStyles}
        className="z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-80 max-w-sm animate-fade-in"
        role="dialog"
        aria-label="Editar mensagem"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Editar mensagem
            </h3>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Fechar"
              disabled={isSubmitting}
            >
              <Icon name="close" size="sm" className="text-gray-500" />
            </button>
          </div>

          {/* Text Field */}
          <div>
            <label
              htmlFor="message-text"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Texto
            </label>
            <textarea
              id="message-text"
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full px-3 py-2 border rounded-md text-sm resize-none focus:ring-2 focus:ring-wa-accent focus:border-transparent ${
                errors.text ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              rows={3}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.text && (
              <p className="mt-1 text-xs text-red-600">{errors.text}</p>
            )}
          </div>

          {/* Time and Status Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Time Field */}
            <div>
              <label
                htmlFor="message-time"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Horário
              </label>
              <input
                id="message-time"
                type="text"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                placeholder="14:30"
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-wa-accent focus:border-transparent ${
                  errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.time && (
                <p className="mt-1 text-xs text-red-600">{errors.time}</p>
              )}
            </div>

            {/* Status Field - Only for user messages */}
            {message.sender === 'user' && (
              <div>
                <label
                  htmlFor="message-status"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="message-status"
                  value={formData.status}
                  onChange={(e) =>
                    handleInputChange('status', e.target.value as MessageStatus)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-wa-accent focus:border-transparent"
                  disabled={isSubmitting}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="px-3 py-1.5 bg-wa-accent text-white text-sm rounded-md hover:bg-wa-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>

          {/* Keyboard shortcut hint */}
          <p className="text-xs text-gray-500 text-center">
            Ctrl+Enter para salvar
          </p>
        </div>
      </div>
    );
  }
);

MessageEditPopover.displayName = 'MessageEditPopover';
