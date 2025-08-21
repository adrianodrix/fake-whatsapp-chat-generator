# User Interface Design Goals

## Overall UX Vision

Interface minimalista que replica fielmente o WhatsApp, priorizando velocidade de criação sobre quantidade de features. O usuário deve conseguir criar uma conversa completa sem tutoriais ou instruções, com todas as ações principais acessíveis em no máximo 2 cliques. A experiência deve ser tão intuitiva que pareça estar usando o WhatsApp real, mas com superpoderes de edição.

## Key Interaction Paradigms

- **Direct Manipulation:** Clicar/tocar diretamente nos elementos para editar (sem modais ou formulários separados)
- **Contextual Actions:** Ações aparecem no hover/long press exatamente onde necessário
- **Keyboard First:** Atalhos de teclado para ações frequentes (Tab para alternar remetente, Enter para nova mensagem)
- **Progressive Disclosure:** Features avançadas reveladas conforme necessidade, não sobrecarregando interface inicial
- **Instant Feedback:** Toda ação tem resposta visual imediata sem delays perceptíveis

## Core Screens and Views

- **Main Chat View:** Tela principal replicando conversa do WhatsApp com header, área de mensagens e input
- **Profile Setup Panel:** Painel lateral/modal para configurar nome e foto dos participantes
- **Message Editor Popover:** Popover inline para editar texto, hora e status da mensagem
- **Export Preview:** Preview da imagem antes do download com opções de qualidade

## Accessibility: WCAG AA

A aplicação deve atender padrões WCAG AA com navegação completa por teclado, suporte a screen readers, contraste adequado (4.5:1 mínimo) e áreas de toque de no mínimo 44x44px em mobile.

## Branding

Replicação exata do visual do WhatsApp incluindo:
- Cor de fundo do chat (#E5DDD5 com pattern)
- Cores das bolhas de mensagem (enviadas: #DCF8C6, recebidas: #FFFFFF)
- Tipografia (Helvetica Neue ou fallback para system fonts)
- Ícones e elementos visuais (checks, relógio, câmera)
- Sombras e bordas arredondadas idênticas

## Target Device and Platforms: Web Responsive

Aplicação web responsiva funcionando em:
- Desktop: Windows, macOS, Linux (todos browsers modernos)
- Mobile: iOS Safari, Chrome Android, Samsung Internet
- Tablet: iPad Safari, Android tablets
- Progressive Web App para instalação em dispositivos
