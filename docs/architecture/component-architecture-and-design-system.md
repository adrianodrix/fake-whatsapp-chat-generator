# Component Architecture and Design System

## Tailwind-Only Styling Strategy

### Design Tokens Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wa: {
          primary: '#075E54',
          secondary: '#128C7E', 
          accent: '#25D366',
          bg: {
            chat: '#E5DDD5',
            pattern: '#F0F0F0',
          },
          bubble: {
            sent: '#DCF8C6',
            received: '#FFFFFF',
          },
          text: {
            primary: '#000000',
            secondary: '#667781',
            meta: '#8696A0',
          },
          check: {
            default: '#919191',
            read: '#4FC3F7',
          }
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Component Styling Pattern

```typescript
// MessageBubble component example
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const bubbleStyles = message.sender === 'user' 
    ? 'bg-wa-bubble-sent ml-auto' 
    : 'bg-wa-bubble-received mr-auto';
    
  return (
    <div className={`
      max-w-sm p-2 rounded-lg shadow-sm mb-1
      ${bubbleStyles}
    `}>
      <p className="text-wa-text-primary text-sm">
        {message.text}
      </p>
      <div className="flex items-center justify-end mt-1 space-x-1">
        <span className="text-wa-text-meta text-xs">
          {formatTime(message.timestamp)}
        </span>
        <StatusIndicator status={message.status} />
      </div>
    </div>
  );
};
```

## Core Components

### MessageBubble Component
```typescript
interface MessageBubbleProps {
  message: Message;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
  showActions?: boolean;
}

// Usage: Renderiza mensagem com visual pixel-perfect do WhatsApp
// States: default, hover (desktop), active (editing), long-press (mobile)
// Styling: Pure Tailwind classes with WhatsApp color tokens
```

### ChatHeader Component
```typescript
interface ChatHeaderProps {
  profile: Profile;
  onProfileEdit?: () => void;
  onBack?: () => void;
  showOnlineStatus?: boolean;
}

// Usage: Header do chat com avatar, nome e ações
// States: default, with online indicator
// Responsive: Full width mobile, fixed width desktop
```

### MessageInput Component
```typescript
interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSenderToggle: () => void;
  activeSender: 'user' | 'contact';
  disabled?: boolean;
}

// Usage: Input de nova mensagem com toggle de remetente
// Features: Auto-resize, keyboard shortcuts
// Responsive: Fixed bottom mobile, natural flow desktop
```
