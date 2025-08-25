export interface DemoMessage {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'system';
}

export interface DemoProfiles {
  user: {
    name: string;
    avatar?: string;
  };
  contact: {
    name: string;
    avatar?: string;
  };
}

const now = new Date();
const getTimestamp = (minutesAgo: number) => {
  const date = new Date(now);
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date;
};

export const demoMessages: DemoMessage[] = [
  {
    id: 'demo-1',
    text: 'Oi! 👋 Você viu o novo gerador de conversas do WhatsApp?',
    sender: 'contact',
    timestamp: getTimestamp(10),
    status: 'read',
    type: 'text',
  },
  {
    id: 'demo-2',
    text: 'Ainda não! Do que se trata?',
    sender: 'user',
    timestamp: getTimestamp(9),
    status: 'read',
    type: 'text',
  },
  {
    id: 'demo-3',
    text: 'É uma ferramenta incrível para criar mockups de conversas do WhatsApp',
    sender: 'contact',
    timestamp: getTimestamp(8),
    status: 'read',
    type: 'text',
  },
  {
    id: 'demo-4',
    text: 'Você pode personalizar tudo: mensagens, horários, status de leitura, fotos de perfil...',
    sender: 'contact',
    timestamp: getTimestamp(8),
    status: 'read',
    type: 'text',
  },
  {
    id: 'demo-5',
    text: 'Parece muito útil! 🤩',
    sender: 'user',
    timestamp: getTimestamp(7),
    status: 'read',
    type: 'text',
  },
  {
    id: 'demo-6',
    text: 'Para que você usaria?',
    sender: 'user',
    timestamp: getTimestamp(7),
    status: 'read',
    type: 'text',
  },
  {
    id: 'demo-7',
    text: 'Perfeito para:\n• Apresentações\n• Tutoriais\n• Storyboards\n• Memes\n• Demonstrações de produtos',
    sender: 'contact',
    timestamp: getTimestamp(6),
    status: 'read',
    type: 'text',
  },
  {
    id: 'demo-8',
    text: 'E o melhor: é totalmente privado! Tudo funciona no seu navegador 🔒',
    sender: 'contact',
    timestamp: getTimestamp(5),
    status: 'read',
    type: 'text',
  },
  {
    id: 'demo-9',
    text: 'Vou testar agora mesmo!',
    sender: 'user',
    timestamp: getTimestamp(4),
    status: 'delivered',
    type: 'text',
  },
  {
    id: 'demo-10',
    text: 'Dica: Pressione ? para ver todos os atalhos de teclado 😉',
    sender: 'contact',
    timestamp: getTimestamp(3),
    status: 'sent',
    type: 'text',
  },
];

export const demoProfiles: DemoProfiles = {
  user: {
    name: 'Você',
    avatar: undefined,
  },
  contact: {
    name: 'Assistente',
    avatar: undefined,
  },
};

export const loadDemoConversation = () => {
  return {
    messages: demoMessages,
    profiles: demoProfiles,
  };
};
