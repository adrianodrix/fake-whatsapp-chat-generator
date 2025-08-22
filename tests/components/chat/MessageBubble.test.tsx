/**
 * Testes para MessageBubble - validação de ACs da Story 1.2
 */

import { render, screen } from '@testing-library/react';
import { MessageBubble } from '../../../src/components/chat/MessageBubble';
import type { Message } from '../../../src/types/message';

// Mock message para testes
const createMockMessage = (overrides: Partial<Message> = {}): Message => ({
  id: 'test-message-1',
  text: 'Mensagem de teste',
  sender: 'user',
  timestamp: new Date('2025-01-01T12:00:00'),
  status: 'sent',
  type: 'text',
  createdAt: new Date('2025-01-01T12:00:00'),
  updatedAt: new Date('2025-01-01T12:00:00'),
  ...overrides,
});

describe('MessageBubble', () => {
  describe('AC3: Mensagens exemplo com bolhas verde e branca', () => {
    it('aplica cor verde para mensagens enviadas', () => {
      const message = createMockMessage({ sender: 'user' });
      render(<MessageBubble message={message} />);

      const text = screen.getByText('Mensagem de teste');
      const bubble = text.closest('[class*="bg-wa-bubble"]');
      expect(bubble).toHaveClass('bg-wa-bubble-sent');
    });

    it('aplica cor branca para mensagens recebidas', () => {
      const message = createMockMessage({ sender: 'contact' });
      render(<MessageBubble message={message} />);

      const text = screen.getByText('Mensagem de teste');
      const bubble = text.closest('[class*="bg-wa-bubble"]');
      expect(bubble).toHaveClass('bg-wa-bubble-received');
    });

    it('aplica posicionamento correto para mensagens enviadas', () => {
      const message = createMockMessage({ sender: 'user' });
      render(<MessageBubble message={message} />);

      const text = screen.getByText('Mensagem de teste');
      const wrapper = text.closest('[class*="justify-"]');
      expect(wrapper).toHaveClass('justify-end');
    });

    it('aplica posicionamento correto para mensagens recebidas', () => {
      const message = createMockMessage({ sender: 'contact' });
      render(<MessageBubble message={message} />);

      const text = screen.getByText('Mensagem de teste');
      const wrapper = text.closest('[class*="justify-"]');
      expect(wrapper).toHaveClass('justify-start');
    });
  });

  describe('AC7: Timestamps e checks renderizados', () => {
    it('renderiza timestamp formatado corretamente', () => {
      const message = createMockMessage({
        timestamp: new Date('2025-01-01T14:30:00'),
      });
      render(<MessageBubble message={message} />);

      expect(screen.getByText('14:30')).toBeInTheDocument();
    });

    it('renderiza check para mensagem enviada', () => {
      const message = createMockMessage({
        sender: 'user',
        status: 'sent',
      });
      render(<MessageBubble message={message} />);

      // Verifica se há um SVG (check) presente
      const svgElement = screen
        .getByText('Mensagem de teste')
        .closest('div')
        ?.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    it('não renderiza check para mensagem recebida', () => {
      const message = createMockMessage({
        sender: 'contact',
        status: 'delivered',
      });
      render(<MessageBubble message={message} />);

      // Mensagens recebidas não devem ter checks
      const svgElement = screen
        .getByText('Mensagem de teste')
        .closest('div')
        ?.querySelector('svg');
      expect(svgElement).toBeNull();
    });

    it('aplica cor azul para check de mensagem lida', () => {
      const message = createMockMessage({
        sender: 'user',
        status: 'read',
      });
      render(<MessageBubble message={message} />);

      const svgElement = screen
        .getByText('Mensagem de teste')
        .closest('div')
        ?.querySelector('svg');
      expect(svgElement).toHaveClass('text-wa-check-read');
    });

    it('aplica cor cinza para check de mensagem não lida', () => {
      const message = createMockMessage({
        sender: 'user',
        status: 'sent',
      });
      render(<MessageBubble message={message} />);

      const svgElement = screen
        .getByText('Mensagem de teste')
        .closest('div')
        ?.querySelector('svg');
      expect(svgElement).toHaveClass('text-wa-check-default');
    });
  });

  describe('Acessibilidade e UX', () => {
    it('renderiza texto da mensagem acessível', () => {
      const message = createMockMessage({ text: 'Mensagem acessível' });
      render(<MessageBubble message={message} />);

      expect(screen.getByText('Mensagem acessível')).toBeInTheDocument();
    });

    it('aplica classes de responsividade', () => {
      const message = createMockMessage();
      render(<MessageBubble message={message} />);

      const text = screen.getByText('Mensagem de teste');
      const bubble = text.closest('[class*="max-w-bubble"]');
      expect(bubble).toHaveClass('max-w-bubble');
    });

    it('aplica bordas arredondadas características', () => {
      const message = createMockMessage({ sender: 'user' });
      render(<MessageBubble message={message} />);

      const text = screen.getByText('Mensagem de teste');
      const bubble = text.closest('[class*="rounded-lg"]');
      expect(bubble).toHaveClass('rounded-lg');
      expect(bubble).toHaveClass('rounded-br-sm');
    });
  });

  describe('Performance e qualidade', () => {
    it('renderiza rapidamente mensagens longas', () => {
      const longText = 'A'.repeat(1000);
      const message = createMockMessage({ text: longText });

      const startTime = performance.now();
      render(<MessageBubble message={message} />);
      const endTime = performance.now();

      // Deve renderizar em menos de 10ms
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('quebra texto longo corretamente', () => {
      const longText =
        'Esta é uma mensagem muito longa que deveria quebrar em múltiplas linhas quando renderizada em uma bolha de mensagem do WhatsApp';
      const message = createMockMessage({ text: longText });
      render(<MessageBubble message={message} />);

      const textElement = screen.getByText(longText);
      const wrapper = textElement.closest('[class*="break-words"]');
      expect(wrapper).toHaveClass('break-words');
    });
  });
});
