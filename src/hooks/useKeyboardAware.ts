import { useState, useEffect, type RefObject } from 'react';

interface KeyboardAwareOptions {
  /**
   * Elemento a ser ajustado quando o teclado aparecer
   */
  targetRef?: RefObject<HTMLElement>;
  /**
   * Offset adicional em pixels
   */
  offset?: number;
  /**
   * Habilitar/desabilitar o comportamento
   */
  enabled?: boolean;
}

interface KeyboardAwareState {
  /**
   * Se o teclado virtual está visível
   */
  isKeyboardVisible: boolean;
  /**
   * Altura estimada do teclado
   */
  keyboardHeight: number;
  /**
   * Altura da viewport ajustada
   */
  adjustedViewportHeight: number;
}

/**
 * Hook para lidar com o teclado virtual em dispositivos móveis
 *
 * Detecta quando o teclado virtual aparece/some e ajusta elementos
 * para evitar que sejam cobertos pelo teclado.
 *
 * @example
 * ```tsx
 * const messageInputRef = useRef<HTMLDivElement>(null);
 * const { isKeyboardVisible, adjustedViewportHeight } = useKeyboardAware({
 *   targetRef: messageInputRef,
 *   offset: 16
 * });
 * ```
 */
export const useKeyboardAware = (
  options: KeyboardAwareOptions = {}
): KeyboardAwareState => {
  const { targetRef, offset = 0, enabled = true } = options;

  const [keyboardState, setKeyboardState] = useState<KeyboardAwareState>({
    isKeyboardVisible: false,
    keyboardHeight: 0,
    adjustedViewportHeight: window.innerHeight,
  });

  useEffect(() => {
    if (!enabled) return;

    const initialViewportHeight = window.innerHeight;

    const handleResize = () => {
      const newViewportHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - newViewportHeight;

      // Considera que o teclado está visível se a diferença de altura for > 150px
      const keyboardThreshold = 150;
      const isKeyboardVisible = heightDifference > keyboardThreshold;
      const keyboardHeight = isKeyboardVisible ? heightDifference : 0;

      setKeyboardState({
        isKeyboardVisible,
        keyboardHeight,
        adjustedViewportHeight: newViewportHeight,
      });

      // Ajustar o elemento target se fornecido
      if (targetRef?.current && isKeyboardVisible) {
        const element = targetRef.current;
        const rect = element.getBoundingClientRect();
        const elementBottom = rect.bottom;
        const availableSpace = newViewportHeight;

        // Se o elemento está sendo coberto pelo teclado
        if (elementBottom > availableSpace) {
          const adjustmentNeeded = elementBottom - availableSpace + offset;

          // Scroll suave para mostrar o elemento
          window.scrollBy({
            top: adjustmentNeeded,
            behavior: 'smooth',
          });
        }
      }
    };

    // Listener para mudanças na viewport (inclui teclado virtual)
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // Delay para aguardar a mudança de orientação
      setTimeout(handleResize, 300);
    });

    // Listener para focus/blur em inputs (melhor detecção do teclado)
    const handleFocusIn = () => {
      // Aguarda um momento para o teclado aparecer
      setTimeout(handleResize, 300);
    };

    const handleFocusOut = () => {
      // Aguarda um momento para o teclado desaparecer
      setTimeout(handleResize, 300);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [targetRef, offset, enabled]);

  return keyboardState;
};
