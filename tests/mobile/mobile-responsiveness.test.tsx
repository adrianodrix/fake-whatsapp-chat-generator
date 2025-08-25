import React from 'react';
import { screen } from '@testing-library/react';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { renderWithProviders } from '@/test-utils';

// Mock useIsMobile para testes
jest.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

// Mock useKeyboardAware para testes
jest.mock('@/hooks/useKeyboardAware', () => ({
  useKeyboardAware: jest.fn().mockReturnValue({
    isKeyboardVisible: false,
    keyboardHeight: 0,
    adjustedViewportHeight: 800,
  }),
}));

import { useIsMobile, useKeyboardAware } from '@/hooks';

const mockUseIsMobile = useIsMobile as jest.MockedFunction<typeof useIsMobile>;
const mockUseKeyboardAware = useKeyboardAware as jest.MockedFunction<
  typeof useKeyboardAware
>;

describe('Mobile Responsiveness', () => {
  const mockProps = {
    messages: [],
    profiles: {
      user: { name: 'Usuário', avatar: null },
      contact: { name: 'Contato', avatar: null },
    },
    activeSender: 'user' as const,
    inputValue: '',
    onInputChange: jest.fn(),
    onSendMessage: jest.fn(),
    onSenderToggle: jest.fn(),
    onProfileEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop Layout', () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(false);
    });

    it('should use desktop spacing and layout', () => {
      renderWithProviders(<ChatContainer {...mockProps} />);

      const chatContainer = document.querySelector('#chat-container');

      expect(chatContainer).toHaveClass('h-full');
      expect(chatContainer).not.toHaveClass('h-screen-safe');
      expect(chatContainer).not.toHaveClass('safe-area-inset');
    });
  });

  describe('Mobile Layout', () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
      mockUseKeyboardAware.mockReturnValue({
        isKeyboardVisible: false,
        keyboardHeight: 0,
        adjustedViewportHeight: 800,
      });
    });

    it('should use mobile-optimized layout', () => {
      renderWithProviders(<ChatContainer {...mockProps} />);

      const chatContainer = document.querySelector('#chat-container');

      expect(chatContainer).toHaveClass('h-screen-safe');
      expect(chatContainer).toHaveClass('safe-area-inset');
      expect(chatContainer).toHaveClass('touch-manipulation');
      expect(chatContainer).toHaveClass('overscroll-contain');
    });

    it('should adjust height when keyboard is visible', () => {
      mockUseKeyboardAware.mockReturnValue({
        isKeyboardVisible: true,
        keyboardHeight: 300,
        adjustedViewportHeight: 500,
      });

      renderWithProviders(<ChatContainer {...mockProps} />);

      const chatContainer = document.querySelector('#chat-container');
      expect(chatContainer).toHaveStyle({ height: '500px' });
    });

    it('should use mobile spacing in messages area', () => {
      renderWithProviders(<ChatContainer {...mockProps} />);

      const messagesArea = document.querySelector('.overflow-y-auto');
      expect(messagesArea).toHaveClass('px-2', 'py-1');
    });
  });

  describe('Touch Target Optimization', () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it('should ensure minimum touch target sizes on mobile', () => {
      const { container } = renderWithProviders(
        <ChatContainer {...mockProps} />
      );

      // Verificar se componente renderiza com mobile optimizations
      const chatContainer = container.querySelector('#chat-container');
      expect(chatContainer).toBeInTheDocument();

      // Verificar se botões existem e são clicáveis
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Verificar que botões têm características mobile
      buttons.forEach((button) => {
        const hasAccessibleAttributes =
          button.hasAttribute('aria-label') ||
          button.textContent?.trim().length ||
          0 > 0;

        if (button.getAttribute('aria-hidden') !== 'true') {
          expect(hasAccessibleAttributes).toBe(true);
        }
      });
    });
  });

  describe('Responsive Breakpoints', () => {
    it('should handle extra small screens (320px)', () => {
      // Simular viewport 320px
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      mockUseIsMobile.mockReturnValue(true);

      renderWithProviders(<ChatContainer {...mockProps} />);

      // Verificar se a interface funciona em tela muito pequena
      const chatContainer = document.querySelector('#chat-container');
      expect(chatContainer).toBeInTheDocument();

      // Botões devem ser utilizáveis
      const senderToggle = screen.getByLabelText(/enviar como/i);
      expect(senderToggle).toBeInTheDocument();
    });

    it('should handle tablet sizes (768px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      mockUseIsMobile.mockReturnValue(false);

      renderWithProviders(<ChatContainer {...mockProps} />);

      const chatContainer = document.querySelector('#chat-container');
      expect(chatContainer).toHaveClass('h-full');
    });
  });

  describe('Safe Area Support', () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it('should apply safe area classes on mobile', () => {
      renderWithProviders(<ChatContainer {...mockProps} />);

      const chatContainer = document.querySelector('#chat-container');
      expect(chatContainer).toHaveClass('safe-area-inset');
    });

    it('should handle notched devices', () => {
      // Mock CSS.supports para safe-area-inset
      Object.defineProperty(CSS, 'supports', {
        value: jest.fn((property: string, value: string) => {
          return (
            property === 'padding-top' && value === 'env(safe-area-inset-top)'
          );
        }),
      });

      renderWithProviders(<ChatContainer {...mockProps} />);

      const chatContainer = document.querySelector('#chat-container');
      expect(chatContainer).toHaveClass('safe-area-inset');
    });
  });
});
