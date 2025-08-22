# Source Tree and Module Organization

## Core Application Structure

```text
src/
├── App.tsx                 # Main application component
├── main.tsx               # Entry point with providers
├── components/            # All React components
│   ├── ui/               # Reusable base components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Avatar/
│   │   ├── Icon/
│   │   └── Modal/
│   ├── chat/             # WhatsApp-specific components
│   │   ├── ChatContainer/
│   │   ├── MessageBubble/
│   │   ├── ChatHeader/
│   │   ├── MessageInput/
│   │   ├── StatusIndicator/
│   │   └── ProfilePanel/
│   └── layout/           # Layout components
│       ├── Header/
│       ├── Footer/
│       └── Container/
├── contexts/             # React Context providers
│   ├── ChatContext.tsx   # Chat state management
│   └── UIContext.tsx     # UI state management
└── hooks/                # Custom React hooks
    ├── useChat.ts        # Chat operations
    ├── useExport.ts      # Canvas export
    └── useLocalStorage.ts # Persistence
```

## Component Organization Strategy

### Base Components (`src/components/ui/`)

**Purpose:** Componentes reutilizáveis sem conhecimento do domínio WhatsApp

```text
ui/
├── Button/
│   ├── Button.tsx        # Component implementation
│   ├── Button.types.ts   # TypeScript interfaces
│   └── index.ts          # Export
├── Input/
│   ├── Input.tsx
│   ├── Input.types.ts
│   └── index.ts
└── Avatar/
    ├── Avatar.tsx
    ├── Avatar.types.ts
    └── index.ts
```

### WhatsApp Components (`src/components/chat/`)

**Purpose:** Componentes específicos para replicar interface do WhatsApp

```text
chat/
├── MessageBubble/
│   ├── MessageBubble.tsx   # Bolha de mensagem
│   ├── MessageBubble.types.ts
│   └── index.ts
├── ChatHeader/
│   ├── ChatHeader.tsx      # Header com avatar e nome
│   ├── ChatHeader.types.ts
│   └── index.ts
└── MessageInput/
    ├── MessageInput.tsx    # Input de nova mensagem
    ├── MessageInput.types.ts
    └── index.ts
```
