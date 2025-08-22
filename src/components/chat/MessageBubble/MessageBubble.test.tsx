import { screen } from '@testing-library/react';
import { renderWithProviders, createMockMessage } from '../../../test-utils';
import { MessageBubble } from './MessageBubble';

describe('MessageBubble', () => {
  const mockMessage = createMockMessage({
    text: 'Hello world',
    sender: 'user',
  });

  it('renderiza o texto da mensagem', () => {
    renderWithProviders(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('aplica estilo correto para mensagem enviada', () => {
    const userMessage = createMockMessage({
      sender: 'user',
      text: 'User message',
    });
    renderWithProviders(<MessageBubble message={userMessage} />);

    // Buscar pela bolha através do texto e navegar para o elemento pai
    const messageElement = screen.getByText('User message');
    const bubble = messageElement.closest('div[class*="bg-wa-bubble-sent"]');
    expect(bubble).toBeInTheDocument();
    expect(bubble).toHaveClass('bg-wa-bubble-sent');

    // Verifica container de alinhamento
    const wrapper = bubble?.parentElement;
    expect(wrapper).toHaveClass('justify-end');
  });

  it('aplica estilo correto para mensagem recebida', () => {
    const contactMessage = createMockMessage({
      sender: 'contact',
      text: 'Contact message',
    });
    renderWithProviders(<MessageBubble message={contactMessage} />);

    const messageElement = screen.getByText('Contact message');
    const bubble = messageElement.closest(
      'div[class*="bg-wa-bubble-received"]'
    );
    expect(bubble).toBeInTheDocument();
    expect(bubble).toHaveClass('bg-wa-bubble-received');

    // Verifica container de alinhamento
    const wrapper = bubble?.parentElement;
    expect(wrapper).toHaveClass('justify-start');
  });

  it('exibe timestamp formatado', () => {
    const messageWithTime = createMockMessage({
      timestamp: new Date('2025-01-01T15:30:00'),
    });
    renderWithProviders(<MessageBubble message={messageWithTime} />);

    // Should display formatted time
    expect(screen.getByText('15:30')).toBeInTheDocument();
  });

  it('usa custom matcher para validar styling WhatsApp', () => {
    renderWithProviders(<MessageBubble message={mockMessage} />);
    const messageElement = screen.getByText('Hello world');
    const bubble = messageElement.closest('div');
    expect(bubble).toHaveWhatsAppStyling();
  });

  it('usa custom matcher para validar message bubble', () => {
    renderWithProviders(<MessageBubble message={mockMessage} />);
    const messageElement = screen.getByText('Hello world');
    const bubble = messageElement.closest('div[class*="max-w-bubble"]');
    expect(bubble).toBeMessageBubble();
  });

  it('renderiza status icon para mensagens do usuário', () => {
    const userMessage = createMockMessage({
      sender: 'user',
      status: 'sent',
      text: 'User with icon',
    });
    renderWithProviders(<MessageBubble message={userMessage} />);

    // Verificar se o SVG está presente
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass('w-4', 'h-4');
  });
});
