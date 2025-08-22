import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatProvider } from '../../src/contexts/ChatContext';
import { ChatContainer } from '../../src/components/chat/ChatContainer';
import { useChat } from '../../src/hooks/useChat';

// Mock floating-ui
jest.mock('@floating-ui/react', () => ({
  useFloating: () => ({
    refs: {
      setReference: jest.fn(),
      setFloating: jest.fn(),
    },
    floatingStyles: {},
  }),
  autoUpdate: jest.fn(),
  offset: jest.fn(),
  flip: jest.fn(),
  shift: jest.fn(),
}));

// Mock hooks that require DOM measurements
jest.mock('../../src/hooks/useClickOutside', () => ({
  useClickOutside: jest.fn(() => ({ current: null })),
}));

// Test component that adds messages and renders ChatContainer
const TestComponent: React.FC = () => {
  const { state, actions, profiles } = useChat();
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    // Add test messages
    actions.addMessage('Hello, this is a test message');
    actions.addMessage('This is another message', 'contact');
  }, [actions]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      actions.addMessage(inputValue);
      setInputValue('');
    }
  };

  const handleSenderToggle = () => {
    const newSender = state.activeSender === 'user' ? 'contact' : 'user';
    actions.setActiveSender(newSender);
  };

  return (
    <ChatContainer
      messages={state.messages}
      profiles={profiles}
      activeSender={state.activeSender}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSendMessage={handleSendMessage}
      onSenderToggle={handleSenderToggle}
    />
  );
};

describe('Message Editing Integration', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect for floating UI
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 50,
      top: 100,
      left: 100,
      bottom: 150,
      right: 200,
      x: 100,
      y: 100,
      toJSON: jest.fn(),
    }));
  });

  it('should complete full message editing flow', async () => {
    const user = userEvent.setup();

    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    // Wait for messages to be added
    await waitFor(() => {
      expect(
        screen.getByText('Hello, this is a test message')
      ).toBeInTheDocument();
    });

    // Find and click edit button (should appear on hover)
    const messageBubbles = screen.getAllByText(
      /Hello, this is a test message|This is another message/
    );
    const userMessageBubble = messageBubbles[0].closest('[data-message-id]');

    expect(userMessageBubble).toBeInTheDocument();

    // Simulate hover and click edit button
    if (userMessageBubble) {
      const editButton = userMessageBubble.querySelector(
        '[aria-label="Editar mensagem"]'
      );
      if (editButton) {
        await user.click(editButton as Element);

        // Edit popover should appear
        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
          expect(
            screen.getByDisplayValue('Hello, this is a test message')
          ).toBeInTheDocument();
        });

        // Edit the message
        const textArea = screen.getByDisplayValue(
          'Hello, this is a test message'
        );
        await user.clear(textArea);
        await user.type(textArea, 'Edited message text');

        // Change time
        const timeInput = screen.getByDisplayValue(/\d{2}:\d{2}/);
        await user.clear(timeInput);
        await user.type(timeInput, '15:30');

        // Save changes
        await user.click(screen.getByText('Salvar'));

        // Verify changes were applied
        await waitFor(() => {
          expect(screen.getByText('Edited message text')).toBeInTheDocument();
          expect(screen.getByText('15:30')).toBeInTheDocument();
        });

        // Edit dialog should be closed
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      }
    }
  });

  it('should handle message reordering after timestamp change', async () => {
    const user = userEvent.setup();

    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    // Wait for messages to appear
    await waitFor(() => {
      expect(
        screen.getAllByText(
          /Hello, this is a test message|This is another message/
        )
      ).toHaveLength(2);
    });

    // Get initial message order
    const initialMessages = screen.getAllByText(
      /Hello, this is a test message|This is another message/
    );
    expect(initialMessages[0]).toHaveTextContent(
      'Hello, this is a test message'
    );
    expect(initialMessages[1]).toHaveTextContent('This is another message');

    // Edit the first message to have a later timestamp
    const firstMessageBubble = initialMessages[0].closest('[data-message-id]');

    if (firstMessageBubble) {
      const editButton = firstMessageBubble.querySelector(
        '[aria-label="Editar mensagem"]'
      );
      if (editButton) {
        await user.click(editButton as Element);

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Change to a much later time to trigger reordering
        const timeInput = screen.getByDisplayValue(/\d{2}:\d{2}/);
        await user.clear(timeInput);
        await user.type(timeInput, '23:59');

        await user.click(screen.getByText('Salvar'));

        // Verify message was reordered (should now be last due to later timestamp)
        await waitFor(() => {
          const reorderedMessages = screen.getAllByText(
            /Hello, this is a test message|This is another message/
          );
          // The message with 23:59 should be last (index 1)
          expect(reorderedMessages[0]).toHaveTextContent(
            'This is another message'
          );
          expect(reorderedMessages[1]).toHaveTextContent(
            'Hello, this is a test message'
          );
        });
      }
    }
  });

  it('should cancel editing with ESC key', async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Hello, this is a test message')
      ).toBeInTheDocument();
    });

    const messageBubble = screen
      .getByText('Hello, this is a test message')
      .closest('[data-message-id]');

    if (messageBubble) {
      const editButton = messageBubble.querySelector(
        '[aria-label="Editar mensagem"]'
      );
      if (editButton) {
        await userEvent.click(editButton as Element);

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Press ESC
        fireEvent.keyDown(document, { key: 'Escape' });

        // Dialog should close
        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        // Original message should be unchanged
        expect(
          screen.getByText('Hello, this is a test message')
        ).toBeInTheDocument();
      }
    }
  });

  it('should integrate with ChatContext state management', async () => {
    const user = userEvent.setup();

    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Hello, this is a test message')
      ).toBeInTheDocument();
    });

    const messageBubble = screen
      .getByText('Hello, this is a test message')
      .closest('[data-message-id]');

    if (messageBubble) {
      const editButton = messageBubble.querySelector(
        '[aria-label="Editar mensagem"]'
      );
      if (editButton) {
        // Start editing
        await user.click(editButton as Element);

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Verify message bubble shows editing state
        const bubbleElement = messageBubble.querySelector('.max-w-bubble');
        expect(bubbleElement).toHaveClass('ring-2', 'ring-wa-accent');

        // Cancel editing
        await user.click(screen.getByText('Cancelar'));

        // Verify editing state is cleared
        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        const bubbleElementAfterCancel =
          messageBubble.querySelector('.max-w-bubble');
        expect(bubbleElementAfterCancel).not.toHaveClass(
          'ring-2',
          'ring-wa-accent'
        );
      }
    }
  });
});
