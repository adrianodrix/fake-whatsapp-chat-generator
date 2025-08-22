# Requirements

## Functional

- **FR1:** O sistema deve permitir configuração completa de perfis "Você" e "Contato" com nome e upload de foto avatar
- **FR2:** O sistema deve permitir adicionar mensagens de texto com conteúdo editável inline via hover (desktop) ou long press (mobile)
- **FR3:** O sistema deve permitir customização de timestamp em formato 24h para qualquer data/hora
- **FR4:** O sistema deve permitir alternância instantânea entre remetentes "Você" e "Contato" via botão flutuante ou atalho de teclado
- **FR5:** O sistema deve permitir configuração de status de leitura (check simples, duplo, azul) para cada mensagem
- **FR6:** O sistema deve exportar a conversa como imagem PNG de alta qualidade (mínimo 1080px largura)
- **FR7:** O sistema deve replicar exatamente cores, fontes, espaçamentos e elementos visuais do WhatsApp atual
- **FR8:** O sistema deve permitir edição de qualquer elemento da mensagem (texto, hora, status) sem recriar a mensagem
- **FR9:** O sistema deve manter ordem cronológica visual das mensagens independente da ordem de criação
- **FR10:** O sistema deve processar todo conteúdo client-side sem envio de dados para servidor

## Non Functional

- **NFR1:** A interface deve ser 100% responsiva funcionando perfeitamente em desktop (1024px+) e mobile (320px+)
- **NFR2:** O First Contentful Paint deve ocorrer em menos de 1.5 segundos
- **NFR3:** O Time to Interactive deve ser menor que 3 segundos
- **NFR4:** A aplicação deve manter 60fps durante todas as interações e animações
- **NFR5:** A aplicação deve funcionar offline após carregamento inicial (PWA)
- **NFR6:** A aplicação deve suportar Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **NFR7:** O visual exportado deve ser pixel-perfect indistinguível de screenshot real do WhatsApp
- **NFR8:** A aplicação deve funcionar adequadamente em conexões 3G
- **NFR9:** Nenhum dado pessoal deve ser coletado ou transmitido para servidores externos
- **NFR10:** Todo processamento de imagem deve ocorrer client-side mantendo privacidade total
