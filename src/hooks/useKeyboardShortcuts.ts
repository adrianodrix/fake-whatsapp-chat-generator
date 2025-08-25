import { useEffect, useRef, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: (event: KeyboardEvent) => void;
  description?: string;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  enabled = true
) => {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const activeElement = document.activeElement;
      const isInputActive =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

      for (const shortcut of shortcutsRef.current) {
        // Skip shortcuts when typing in inputs unless explicitly allowed
        if (isInputActive && !shortcut.key.includes('Escape')) continue;

        const matchesKey =
          event.key === shortcut.key ||
          event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl =
          shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey;
        const matchesShift =
          shortcut.shiftKey === undefined ||
          shortcut.shiftKey === event.shiftKey;
        const matchesAlt =
          shortcut.altKey === undefined || shortcut.altKey === event.altKey;
        const matchesMeta =
          shortcut.metaKey === undefined || shortcut.metaKey === event.metaKey;

        if (
          matchesKey &&
          matchesCtrl &&
          matchesShift &&
          matchesAlt &&
          matchesMeta
        ) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler(event);
          break;
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);

  return {
    shortcuts: shortcutsRef.current,
  };
};

// Common keyboard shortcuts registry
export const KEYBOARD_SHORTCUTS = {
  HELP: { key: '?', description: 'Mostrar ajuda' },
  CLEAR: {
    key: 'Delete',
    ctrlKey: true,
    shiftKey: true,
    description: 'Limpar conversa',
  },
  NEW_MESSAGE: { key: 'n', ctrlKey: true, description: 'Nova mensagem' },
  TOGGLE_SENDER: { key: 'Tab', description: 'Alternar remetente' },
  EXPORT: { key: 'e', ctrlKey: true, description: 'Exportar conversa' },
  DEMO: { key: 'd', ctrlKey: true, description: 'Carregar demo' },
  ESCAPE: { key: 'Escape', description: 'Fechar modal' },
};
