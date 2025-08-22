# Testing Strategy

## Simplified Testing Approach

### Component Testing with RTL
```typescript
// tests/components/MessageBubble.test.tsx
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '../src/components/chat/MessageBubble';

describe('MessageBubble', () => {
  const mockMessage: Message = {
    id: '1',
    text: 'Hello world',
    sender: 'user',
    timestamp: new Date(),
    status: 'sent',
    type: 'text',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  it('renders message text correctly', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });
  
  it('applies correct styling for sent messages', () => {
    render(<MessageBubble message={mockMessage} />);
    const bubble = screen.getByRole('article');
    expect(bubble).toHaveClass('bg-wa-bubble-sent');
  });
});
```

### Context Testing
```typescript
// tests/contexts/ChatContext.test.tsx
import { renderHook, act } from '@testing-library/react';
import { ChatProvider } from '../src/contexts/ChatContext';
import { useChat } from '../src/hooks/useChat';

describe('ChatContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ChatProvider>{children}</ChatProvider>
  );
  
  it('adds message correctly', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    
    act(() => {
      result.current.actions.addMessage('Test message');
    });
    
    expect(result.current.state.messages).toHaveLength(1);
    expect(result.current.state.messages[0].text).toBe('Test message');
  });
});
```
