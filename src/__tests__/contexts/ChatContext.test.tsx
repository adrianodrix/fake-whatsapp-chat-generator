import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ChatProvider } from '../../contexts/ChatContext';
import { useChat } from '../../hooks/useChat';

// Test component to interact with context
const TestComponent = () => {
  const { state, actions } = useChat();

  return (
    <div>
      <div data-testid="message-count">{state.messages.length}</div>
      <div data-testid="current-contact">
        {state.currentContact?.name || 'None'}
      </div>
      <button
        data-testid="add-message"
        onClick={() => actions.addMessage('Test message')}
      >
        Add Message
      </button>
      {state.messages.map((message) => (
        <div key={message.id} data-testid="message">
          {message.text}
        </div>
      ))}
    </div>
  );
};

describe('ChatContext', () => {
  const renderWithProvider = () => {
    return render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );
  };

  it('should provide initial state', () => {
    renderWithProvider();

    expect(screen.getByTestId('message-count')).toHaveTextContent('0');
    expect(screen.getByTestId('current-contact')).toHaveTextContent('None');
  });

  it('should allow adding messages', () => {
    renderWithProvider();

    const addButton = screen.getByTestId('add-message');

    act(() => {
      fireEvent.click(addButton);
    });

    expect(screen.getByTestId('message-count')).toHaveTextContent('1');
    expect(screen.getByTestId('message')).toHaveTextContent('Test message');
  });

  it('should handle multiple messages', () => {
    renderWithProvider();

    const addButton = screen.getByTestId('add-message');

    act(() => {
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);
    });

    expect(screen.getByTestId('message-count')).toHaveTextContent('3');
    expect(screen.getAllByTestId('message')).toHaveLength(3);
  });

  it('should maintain referential stability for actions', () => {
    const actionRefs: unknown[] = [];

    const TestStabilityComponent = () => {
      const { actions } = useChat();
      actionRefs.push(actions);
      return <div data-testid="stability-test">Test</div>;
    };

    const { rerender } = render(
      <ChatProvider>
        <TestStabilityComponent />
      </ChatProvider>
    );

    rerender(
      <ChatProvider>
        <TestStabilityComponent />
      </ChatProvider>
    );

    // Actions should maintain referential stability
    expect(actionRefs.length).toBeGreaterThan(1);
    expect(actionRefs[0]).toBe(actionRefs[1]);
  });
});
