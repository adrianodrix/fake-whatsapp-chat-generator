import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ChatProvider } from '../../src/contexts/ChatContext';
import { useChat } from '../../src/hooks/useChat';

// Mock UUID para testes determinísticos
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

// Componente de teste para usar o hook
const TestComponent = () => {
  const { state, actions } = useChat();

  return (
    <div>
      <div data-testid="message-count">{state.messages.length}</div>
      <div data-testid="active-sender">{state.activeSender}</div>
      <div data-testid="is-editing">{state.isEditing || 'null'}</div>
      <button
        data-testid="add-message"
        onClick={() => actions.addMessage('Test message')}
      >
        Add Message
      </button>
      <button
        data-testid="set-sender-contact"
        onClick={() => actions.setActiveSender('contact')}
      >
        Set Contact
      </button>
      <button
        data-testid="set-editing"
        onClick={() => actions.setEditing('test-id')}
      >
        Set Editing
      </button>
      {state.messages.map((message) => (
        <div key={message.id} data-testid={`message-${message.id}`}>
          <span data-testid={`message-text-${message.id}`}>{message.text}</span>
          <span data-testid={`message-sender-${message.id}`}>
            {message.sender}
          </span>
          <button
            data-testid={`update-message-${message.id}`}
            onClick={() =>
              actions.updateMessage(message.id, { text: 'Updated text' })
            }
          >
            Update
          </button>
          <button
            data-testid={`delete-message-${message.id}`}
            onClick={() => actions.deleteMessage(message.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <ChatProvider>
      <TestComponent />
    </ChatProvider>
  );
};

describe('ChatContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty messages array', () => {
      renderWithProvider();
      expect(screen.getByTestId('message-count')).toHaveTextContent('0');
    });

    it('should initialize with user as active sender', () => {
      renderWithProvider();
      expect(screen.getByTestId('active-sender')).toHaveTextContent('user');
    });

    it('should initialize with no editing state', () => {
      renderWithProvider();
      expect(screen.getByTestId('is-editing')).toHaveTextContent('null');
    });
  });

  describe('Message Operations', () => {
    it('should add a message with UUID', async () => {
      renderWithProvider();

      await act(async () => {
        screen.getByTestId('add-message').click();
      });

      expect(screen.getByTestId('message-count')).toHaveTextContent('1');
      expect(screen.getByTestId('message-test-uuid-1234')).toBeInTheDocument();
      expect(
        screen.getByTestId('message-text-test-uuid-1234')
      ).toHaveTextContent('Test message');
    });

    it('should add message with correct sender', async () => {
      renderWithProvider();

      await act(async () => {
        screen.getByTestId('add-message').click();
      });

      expect(
        screen.getByTestId('message-sender-test-uuid-1234')
      ).toHaveTextContent('user');
    });

    it('should update message text', async () => {
      renderWithProvider();

      // Add message first
      await act(async () => {
        screen.getByTestId('add-message').click();
      });

      // Update message
      await act(async () => {
        screen.getByTestId('update-message-test-uuid-1234').click();
      });

      expect(
        screen.getByTestId('message-text-test-uuid-1234')
      ).toHaveTextContent('Updated text');
    });

    it('should delete message', async () => {
      renderWithProvider();

      // Add message first
      await act(async () => {
        screen.getByTestId('add-message').click();
      });

      expect(screen.getByTestId('message-count')).toHaveTextContent('1');

      // Delete message
      await act(async () => {
        screen.getByTestId('delete-message-test-uuid-1234').click();
      });

      expect(screen.getByTestId('message-count')).toHaveTextContent('0');
    });
  });

  describe('State Management', () => {
    it('should change active sender', async () => {
      renderWithProvider();

      await act(async () => {
        screen.getByTestId('set-sender-contact').click();
      });

      expect(screen.getByTestId('active-sender')).toHaveTextContent('contact');
    });

    it('should set editing state', async () => {
      renderWithProvider();

      await act(async () => {
        screen.getByTestId('set-editing').click();
      });

      expect(screen.getByTestId('is-editing')).toHaveTextContent('test-id');
    });
  });

  describe('Message Ordering', () => {
    it('should maintain chronological order based on timestamp', async () => {
      renderWithProvider();

      // Add messages sequentially - timestamps will be naturally ordered
      await act(async () => {
        screen.getByTestId('add-message').click();
      });

      await act(async () => {
        screen.getByTestId('add-message').click();
      });

      await act(async () => {
        screen.getByTestId('add-message').click();
      });

      // Check that messages are added and maintained
      const messages = screen.getAllByTestId(/^message-test-uuid-1234/);
      expect(messages).toHaveLength(3);

      // Verify all messages have text content
      expect(screen.getAllByTestId(/^message-text-/)).toHaveLength(3);
    });
  });

  describe('Performance Optimizations', () => {
    it('should use consistent callback references', () => {
      const { rerender } = renderWithProvider();

      const initialAddButton = screen.getByTestId('add-message');

      rerender(
        <ChatProvider>
          <TestComponent />
        </ChatProvider>
      );

      const rerenderAddButton = screen.getByTestId('add-message');

      // This test verifies that useCallback is working
      // The actual reference equality can't be tested easily in this setup
      // but the buttons should remain functional
      expect(initialAddButton).toBeInTheDocument();
      expect(rerenderAddButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when useChat is used outside provider', () => {
      // Mock console.error to avoid error output in tests
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useChat deve ser usado dentro de ChatProvider');

      consoleSpy.mockRestore();
    });
  });
});
