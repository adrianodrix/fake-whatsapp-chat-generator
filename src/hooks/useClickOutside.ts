import { useEffect, useRef } from 'react';

/**
 * Hook para detectar cliques fora de um elemento
 *
 * @param callback - Função chamada quando clique fora é detectado
 * @returns Ref para ser anexado ao elemento
 *
 * @example
 * ```tsx
 * const ref = useClickOutside(() => {
 *   console.log('Clicked outside');
 * });
 *
 * return <div ref={ref}>Content</div>
 * ```
 */
export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
  callback: () => void
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback]);

  return ref;
};
