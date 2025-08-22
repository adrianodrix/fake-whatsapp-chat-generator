import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '../../../src/components/chat/MessageBubble';
import type { Message } from '../../../src/types/message';

const mockMessageWithLineBreaks: Message = {
  id: '1',
  text: 'Primeira linha\nSegunda linha\nTerceira linha',
  sender: 'user',
  timestamp: new Date('2023-01-01T12:00:00'),
  status: 'sent',
  type: 'text',
  createdAt: new Date('2023-01-01T12:00:00'),
  updatedAt: new Date('2023-01-01T12:00:00'),
};

describe('MessageBubble - Line Breaks', () => {
  it('should preserve line breaks in message text', () => {
    render(
      <MessageBubble message={mockMessageWithLineBreaks} showActions={false} />
    );

    // Find the paragraph element with the message text
    const messageText = screen.getByText(
      /Primeira linha.*Segunda linha.*Terceira linha/s
    );

    // Check that the element has the correct CSS class for preserving whitespace
    expect(messageText).toHaveClass('whitespace-pre-wrap');

    // Verify the actual text content includes the line breaks
    expect(messageText.textContent).toBe(
      'Primeira linha\nSegunda linha\nTerceira linha'
    );
  });

  it('should handle single line messages correctly', () => {
    const singleLineMessage: Message = {
      ...mockMessageWithLineBreaks,
      text: 'Mensagem simples sem quebras',
    };

    render(<MessageBubble message={singleLineMessage} showActions={false} />);

    const messageText = screen.getByText('Mensagem simples sem quebras');
    expect(messageText).toHaveClass('whitespace-pre-wrap');
    expect(messageText.textContent).toBe('Mensagem simples sem quebras');
  });

  it('should handle messages with only line breaks', () => {
    const lineBreakOnlyMessage: Message = {
      ...mockMessageWithLineBreaks,
      text: '\n\n\n',
    };

    render(
      <MessageBubble message={lineBreakOnlyMessage} showActions={false} />
    );

    // Find the paragraph element by class since content is just whitespace
    const messageElement = document.querySelector('.whitespace-pre-wrap');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('whitespace-pre-wrap');
    expect(messageElement?.textContent).toBe('\n\n\n');
  });

  it('should handle mixed content with spaces and line breaks', () => {
    const mixedContentMessage: Message = {
      ...mockMessageWithLineBreaks,
      text: '  Texto com espaços  \n\n  E quebras de linha  \n  Final  ',
    };

    render(<MessageBubble message={mixedContentMessage} showActions={false} />);

    const messageText = screen.getByText(
      /Texto com espaços.*E quebras de linha.*Final/s
    );
    expect(messageText).toHaveClass('whitespace-pre-wrap');
    expect(messageText.textContent).toBe(
      '  Texto com espaços  \n\n  E quebras de linha  \n  Final  '
    );
  });
});
