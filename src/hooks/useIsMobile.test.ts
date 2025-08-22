import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './useIsMobile';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    // Restaura o valor original
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it('retorna true quando a largura é menor que o breakpoint padrão', () => {
    setWindowWidth(767);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('retorna false quando a largura é maior que o breakpoint padrão', () => {
    setWindowWidth(769);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('usa breakpoint customizado quando fornecido', () => {
    setWindowWidth(1000);
    const { result } = renderHook(() => useIsMobile(1024));
    expect(result.current).toBe(true);

    setWindowWidth(1025);
    const { result: result2 } = renderHook(() => useIsMobile(1024));
    expect(result2.current).toBe(false);
  });

  it('atualiza quando a janela é redimensionada', () => {
    setWindowWidth(800);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simula redimensionamento
    act(() => {
      setWindowWidth(600);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(true);

    // Redimensiona novamente
    act(() => {
      setWindowWidth(900);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(false);
  });

  it('remove o event listener ao desmontar', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it('adiciona event listener ao montar', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useIsMobile());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });

  it('breakpoint de 768px é o padrão correto', () => {
    setWindowWidth(768);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    setWindowWidth(767);
    const { result: result2 } = renderHook(() => useIsMobile());
    expect(result2.current).toBe(true);
  });
});
