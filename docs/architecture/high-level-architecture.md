# High Level Architecture

## Technical Summary

**Arquitetura:** Single Page Application (SPA) com processamento 100% client-side
**Padrão:** Simple component-based architecture com React Context
**Deployment:** Static site generation com CDN global via Vercel
**Data Strategy:** Local storage com export via Canvas API

## Simplified Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Runtime | Node.js | 18+ | Build e desenvolvimento |
| Framework | React | 18+ | UI framework principal |
| Language | TypeScript | 5+ | Type safety e DX |
| Build Tool | Vite | 4+ | Dev server e bundling |
| Styling | Tailwind CSS | 3+ | Utility-first CSS only |
| State | React Context | Built-in | Simple state management |
| Testing | Jest + RTL | Latest | Unit e integration tests |
| E2E Testing | Playwright | Latest | End-to-end testing |
| Linting | ESLint + Prettier | Latest | Code quality |
| CI/CD | GitHub Actions | - | Automated testing/deploy |
| Deployment | Vercel | - | Static hosting com CDN |
| Monitoring | Sentry | Latest | Error tracking |

## Repository Structure Strategy

**Type:** Simple single-package React application
**Organization:** Feature-based component organization

```text
fake-whatsapp-chat-generator/
├── src/
│   ├── components/          # Todos os componentes
│   │   ├── ui/             # Componentes base (Button, Input, Avatar, etc)
│   │   ├── chat/           # Componentes específicos do WhatsApp
│   │   │   ├── MessageBubble/
│   │   │   ├── ChatHeader/
│   │   │   ├── MessageInput/
│   │   │   └── StatusIndicator/
│   │   └── layout/         # Layout components
│   ├── contexts/           # React Context providers
│   │   ├── ChatContext.tsx # Chat state (messages, profiles)
│   │   └── UIContext.tsx   # UI state (modals, loading)
│   ├── hooks/              # Custom React hooks
│   │   ├── useChat.ts      # Chat operations
│   │   ├── useExport.ts    # Canvas export functionality
│   │   └── useLocalStorage.ts # Persistence
│   ├── types/              # TypeScript interfaces
│   │   ├── message.ts      # Message, Profile, Chat types
│   │   └── export.ts       # Export configuration types
│   ├── utils/              # Utility functions
│   │   ├── validation.ts   # Input validation
│   │   ├── export.ts       # Canvas rendering logic
│   │   └── storage.ts      # Local storage helpers
│   ├── styles/             # Global styles e Tailwind config
│   │   ├── globals.css
│   │   └── tailwind.config.js
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
│   ├── icons/              # WhatsApp icons e favicons
│   └── index.html
├── docs/                   # Documentation
├── tests/                  # Test files
├── .env.example           # Environment variables template
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```
