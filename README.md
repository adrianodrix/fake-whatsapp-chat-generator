# Fake WhatsApp Chat Generator

Um gerador de chat falso do WhatsApp que permite criar conversas realistas para fins educacionais, demonstrações e testes de UX.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm

### Instalação e Desenvolvimento

```bash
# Clone o repositório
git clone <repository-url>
cd fake-whatsapp-chat-generator

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em http://localhost:5173

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção

# Qualidade de Código
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas do ESLint automaticamente
npm run format       # Formata código com Prettier
npm run type-check   # Verifica tipos TypeScript
```

## 🛠 Stack Tecnológica

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3 com design tokens do WhatsApp
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **CI/CD:** GitHub Actions
- **Deploy:** Vercel

## 🎨 Design System

O projeto utiliza design tokens baseados no WhatsApp oficial:

- **Cores:** Sistema de cores completo do WhatsApp (primárias, secundárias, bolhas, texto)
- **Typography:** Font stack nativa do sistema
- **Spacing:** Sistema de espaçamento consistente
- **Animations:** Animações sutis para melhor UX

## 🧪 Qualidade e Testes

### Pre-commit Hooks

Automaticamente executados antes de cada commit:

- ESLint validation
- Prettier formatting
- TypeScript type checking

### CI/CD Pipeline

- **Pull Requests:** Validação completa + deploy preview
- **Main Branch:** Deploy automático para produção
- **Validações:** TypeScript, ESLint, Prettier, Build

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base reutilizáveis
│   ├── chat/           # Componentes específicos do WhatsApp
│   └── layout/         # Componentes de layout
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── types/              # TypeScript interfaces
├── utils/              # Funções utilitárias
└── styles/             # Estilos globais
```

## 🌐 Deploy

### Vercel (Automático)

- **Produção:** Pushes para `main` branch
- **Preview:** Pull requests automaticamente
- **Health Check:** `/api/health` endpoint disponível

### Variáveis de Ambiente

```bash
VITE_APP_NAME="Fake WhatsApp Chat Generator"
VITE_APP_VERSION="1.0.0"
VITE_BUILD_TIME="auto-generated"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código

- **ESLint:** Configuração rigorosa para qualidade
- **Prettier:** Formatação automática
- **TypeScript:** Tipagem estrita obrigatória
- **Commits:** Mensagens descritivas em português

## 📄 Licença

Este projeto é apenas para fins educacionais e demonstrações.

## 🔗 Links Úteis

- [Documentação Técnica](./docs/)
- [Stories de Usuário](./docs/stories/)
- [Arquitetura](./docs/architecture/)

---

**Stack:** React + TypeScript + Tailwind CSS + Vite  
**Versão:** 1.0.0  
**Status:** ✅ Configuração Completa
