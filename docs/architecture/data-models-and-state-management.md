# Data Models and State Management

## React Context Architecture

### Chat Context (Primary State)
```typescript
interface ChatState {
  messages: Message[];           // All messages in chronological order
  profiles: ChatProfiles;        // User and contact profiles
  activeSender: 'user' | 'contact'; // Current sender
  isEditing: string | null;      // ID of message being edited
  lastActivity: Date;            // Last user interaction
}

interface ChatContextType {
  state: ChatState;
  actions: {
    addMessage: (text: string) => void;
    updateMessage: (id: string, updates: Partial<Message>) => void;
    deleteMessage: (id: string) => void;
    toggleSender: () => void;
    updateProfile: (type: 'user' | 'contact', profile: Partial<Profile>) => void;
    clearChat: () => void;
  };
}
```

### UI Context (Interface State)
```typescript
interface UIState {
  modals: {
    profilePanel: boolean;
    exportModal: boolean;
    helpModal: boolean;
  };
  loading: {
    exporting: boolean;
    uploadingImage: boolean;
  };
}

interface UIContextType {
  state: UIState;
  actions: {
    toggleModal: (modal: keyof UIState['modals']) => void;
    setLoading: (key: keyof UIState['loading'], value: boolean) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  };
}
```

## Core Data Interfaces

### Message Interface
```typescript
interface Message {
  id: string;                    // UUID v4
  text: string;                  // Message content
  sender: 'user' | 'contact';    // Who sent the message
  timestamp: Date;               // When message was sent
  status: MessageStatus;         // Read/delivery status
  type: 'text' | 'system';      // Message type
  createdAt: Date;               // When created in editor
  updatedAt: Date;               // Last modified
}

type MessageStatus = 'sent' | 'delivered' | 'read';
```

### Profile Interface
```typescript
interface Profile {
  name: string;                  // Display name (max 25 chars)
  avatar?: string;               // Base64 image or null
  avatarColor: string;           // Background color for initials
  initials: string;              // Generated from name
  phone?: string;                // Optional phone number
}

interface ChatProfiles {
  user: Profile;                 // "Você" profile
  contact: Profile;              // Contact profile
}
```

## Data Persistence Strategy

**Local Storage:** Persistir estado do chat durante a sessão
**Session Strategy:** Auto-save a cada mudança com debounce de 500ms
**Export Only:** Não há backend - dados nunca saem do browser
