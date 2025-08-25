import { useCallback, useRef, useState } from 'react';

interface UseLongPressOptions {
  threshold?: number; // em ms
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}

interface UseLongPressReturn {
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchMove: () => void;
  isPressed: boolean;
}

/**
 * Hook para detectar long press em elementos
 *
 * @param callback - Função chamada quando long press é ativado
 * @param options - Opções de configuração
 * @returns Handlers para eventos de mouse/touch e estado
 *
 * @example
 * ```tsx
 * const longPressHandlers = useLongPress(() => {
 *   console.log('Long pressed!');
 * }, { threshold: 500 });
 *
 * return <div {...longPressHandlers}>Press and hold</div>
 * ```
 */
export const useLongPress = (
  callback: () => void,
  options: UseLongPressOptions = {}
): UseLongPressReturn => {
  const { threshold = 500, onStart, onFinish, onCancel } = options;

  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const start = useCallback(() => {
    if (timerRef.current) return;

    onStart?.();
    setIsPressed(true);

    timerRef.current = setTimeout(() => {
      callback();
      onFinish?.();
      setIsPressed(false);
      timerRef.current = undefined;
    }, threshold);
  }, [callback, onStart, onFinish, threshold]);

  const clear = useCallback(
    (shouldCancel = true) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      setIsPressed(false);
      if (shouldCancel) {
        onCancel?.();
      }
    },
    [onCancel]
  );

  return {
    onMouseDown: start,
    onMouseUp: () => clear(),
    onMouseLeave: () => clear(),
    onTouchStart: start,
    onTouchEnd: () => clear(),
    onTouchMove: () => clear(),
    isPressed,
  };
};
