import { renderHook } from '@testing-library/react';
import { useChat } from '../../hooks/useChat';
import { AllProviders } from '../../test-utils/providers';

describe('useChat hook', () => {
  it('should provide chat context when used inside ChatProvider', () => {
    const { result } = renderHook(() => useChat(), { wrapper: AllProviders });

    expect(result.current).toBeDefined();
    expect(result.current.state).toBeDefined();
    expect(result.current.actions).toBeDefined();
  });

  it('should throw error when used outside ChatProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useChat());
    }).toThrow('useChat deve ser usado dentro de ChatProvider');

    consoleSpy.mockRestore();
  });

  it('should provide addMessage action', () => {
    const { result } = renderHook(() => useChat(), { wrapper: AllProviders });

    expect(result.current.actions.addMessage).toBeDefined();
    expect(typeof result.current.actions.addMessage).toBe('function');
  });

  it('should provide updateMessage action', () => {
    const { result } = renderHook(() => useChat(), { wrapper: AllProviders });

    expect(result.current.actions.updateMessage).toBeDefined();
    expect(typeof result.current.actions.updateMessage).toBe('function');
  });

  it('should provide deleteMessage action', () => {
    const { result } = renderHook(() => useChat(), { wrapper: AllProviders });

    expect(result.current.actions.deleteMessage).toBeDefined();
    expect(typeof result.current.actions.deleteMessage).toBe('function');
  });
});
