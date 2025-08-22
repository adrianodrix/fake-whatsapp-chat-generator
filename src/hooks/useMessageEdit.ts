import { useState, useCallback } from 'react';
import { useChat } from './useChat';
import type { Message } from '@/types/message';

interface EditingState {
  messageId: string | null;
  position?: { x: number; y: number };
  originalMessage?: Message;
  anchorEl?: HTMLElement | null;
}

interface UseMessageEditReturn {
  editingState: EditingState;
  startEdit: (messageId: string, anchorElement?: HTMLElement) => void;
  cancelEdit: () => void;
  saveEdit: (updates: Partial<Message>) => void;
  isEditing: (messageId: string) => boolean;
}

/**
 * Hook para gerenciar edição de mensagens
 *
 * @example
 * ```tsx
 * const { editingState, startEdit, cancelEdit, saveEdit, isEditing } = useMessageEdit();
 *
 * const handleEditMessage = (id: string, element: HTMLElement) => {
 *   startEdit(id, element);
 * };
 * ```
 */
export const useMessageEdit = (): UseMessageEditReturn => {
  const { state, actions } = useChat();
  const [editingState, setEditingState] = useState<EditingState>({
    messageId: null,
  });

  const startEdit = useCallback(
    (messageId: string, anchorElement?: HTMLElement) => {
      const message = state.messages.find((m) => m.id === messageId);
      if (!message) return;

      let position = undefined;
      if (anchorElement) {
        const rect = anchorElement.getBoundingClientRect();
        position = { x: rect.x, y: rect.y };
      }

      setEditingState({
        messageId,
        position,
        originalMessage: message,
        anchorEl: anchorElement,
      });

      // Update global editing state
      actions.setEditing(messageId);
    },
    [state.messages, actions]
  );

  const cancelEdit = useCallback(() => {
    setEditingState({ messageId: null });
    actions.setEditing(null);
  }, [actions]);

  const saveEdit = useCallback(
    (updates: Partial<Message>) => {
      if (editingState.messageId) {
        actions.updateMessage(editingState.messageId, updates);
        cancelEdit();
      }
    },
    [editingState.messageId, actions, cancelEdit]
  );

  const isEditing = useCallback(
    (messageId: string): boolean => {
      return editingState.messageId === messageId;
    },
    [editingState.messageId]
  );

  return {
    editingState,
    startEdit,
    cancelEdit,
    saveEdit,
    isEditing,
  };
};
