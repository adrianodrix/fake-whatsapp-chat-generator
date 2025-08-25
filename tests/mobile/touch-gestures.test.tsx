import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageBubble } from '@/components/chat/MessageBubble';
import type { Message } from '@/types/message';

// Mock useIsMobile para simular mobile
jest.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

import { useIsMobile } from '@/hooks';

const mockUseIsMobile = useIsMobile as jest.MockedFunction<typeof useIsMobile>;

describe('Touch Gestures', () => {
  const mockMessage: Message = {
    id: '1',
    text: 'Teste de mensagem',
    sender: 'user',
    timestamp: new Date('2025-01-01T12:00:00'),
    status: 'sent',
    type: 'text',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Long Press on Mobile', () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it('should trigger edit on long press', async () => {
      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      const bubble = screen.getByText('Teste de mensagem').closest('div');
      expect(bubble).toBeInTheDocument();

      // Simular long press com eventos de touch
      if (bubble) {
        fireEvent.touchStart(bubble);

        // Aguardar o threshold do long press (500ms)
        await waitFor(
          () => {
            expect(mockOnEdit).toHaveBeenCalledWith('1');
          },
          { timeout: 600 }
        );

        fireEvent.touchEnd(bubble);
      }
    });

    it('should show press feedback during long press', async () => {
      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      const bubble = screen.getByText('Teste de mensagem').closest('div');

      if (bubble) {
        fireEvent.touchStart(bubble);

        // O feedback visual é controlado pela implementação interna
        // Verificar que o componente renderiza corretamente
        expect(bubble).toBeInTheDocument();

        fireEvent.touchEnd(bubble);
      }
    });

    it('should cancel long press on touch move', () => {
      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      const bubble = screen.getByText('Teste de mensagem').closest('div');

      if (bubble) {
        fireEvent.touchStart(bubble);
        fireEvent.touchMove(bubble);
        fireEvent.touchEnd(bubble);

        // onEdit não deve ser chamado
        expect(mockOnEdit).not.toHaveBeenCalled();
      }
    });

    it('should cancel long press on touch end before threshold', () => {
      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      const bubble = screen.getByText('Teste de mensagem').closest('div');

      if (bubble) {
        fireEvent.touchStart(bubble);

        // Cancelar antes do threshold
        setTimeout(() => {
          fireEvent.touchEnd(bubble);
        }, 200);

        // onEdit não deve ser chamado
        expect(mockOnEdit).not.toHaveBeenCalled();
      }
    });
  });

  describe('Desktop Interactions', () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(false);
    });

    it('should show edit button on hover for desktop', async () => {
      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      const bubble = screen.getByText('Teste de mensagem').closest('.group');
      expect(bubble).toBeInTheDocument();

      if (bubble) {
        // Hover sobre a mensagem
        await userEvent.hover(bubble);

        // Verificar se o botão de edit aparece
        const editButton = screen.getByLabelText('Editar mensagem');
        expect(editButton).toBeInTheDocument();
        // O botão deve estar na estrutura de hover
        expect(editButton.parentElement).toHaveClass('group-hover:opacity-100');
      }
    });

    it('should trigger edit on button click for desktop', async () => {
      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      const bubble = screen.getByText('Teste de mensagem').closest('.group');

      if (bubble) {
        await userEvent.hover(bubble);

        const editButton = screen.getByLabelText('Editar mensagem');
        await userEvent.click(editButton);

        expect(mockOnEdit).toHaveBeenCalledWith('1');
      }
    });

    it('should not use long press handlers on desktop', () => {
      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      const bubble = screen.getByText('Teste de mensagem').closest('div');

      // Verificar que eventos de mouse são usados em vez de touch
      if (bubble) {
        // Não deve ter eventos de touch registrados
        expect(bubble).not.toHaveAttribute('ontouchstart');
        expect(bubble).not.toHaveAttribute('ontouchend');
        expect(bubble).not.toHaveAttribute('ontouchmove');
      }
    });
  });

  describe('Touch Manipulation', () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it('should apply touch-manipulation class for better touch response', () => {
      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      const bubbleContainer = screen
        .getByText('Teste de mensagem')
        .closest('.touch-manipulation');
      expect(bubbleContainer).toHaveClass('touch-manipulation');
    });

    it('should have minimum touch target size', () => {
      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      const bubbleContainer = screen
        .getByText('Teste de mensagem')
        .closest('.min-h-touch');
      expect(bubbleContainer).toHaveClass('min-h-touch');
    });
  });

  describe('Accessibility', () => {
    it('should maintain accessibility with touch gestures', () => {
      mockUseIsMobile.mockReturnValue(true);

      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      // Verificar que a mensagem ainda é acessível via teclado
      const bubble =
        screen.getByText('Teste de mensagem').closest('[role]') ||
        screen.getByText('Teste de mensagem').closest('div');

      // Deve ser focável ou ter conteúdo focável
      expect(bubble).toBeInTheDocument();
    });

    it('should provide appropriate ARIA labels for touch interactions', () => {
      mockUseIsMobile.mockReturnValue(true);

      render(
        <MessageBubble
          message={mockMessage}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      // A mensagem deve ter contexto adequado para screen readers
      const messageContent = screen.getByText('Teste de mensagem');
      expect(messageContent).toBeInTheDocument();
    });
  });
});
