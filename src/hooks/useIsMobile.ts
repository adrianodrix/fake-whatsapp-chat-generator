import { useState, useEffect } from 'react';

/**
 * Hook para detectar dispositivo mobile
 * Usado para otimizar UI entre desktop e mobile
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check inicial
    checkIsMobile();

    // Listener para mudanças de tamanho
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
};
