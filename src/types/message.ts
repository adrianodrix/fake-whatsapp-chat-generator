/**
 * Tipos relacionados a mensagens e chat do WhatsApp
 */

import type { ChatProfiles } from './profile';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export type MessageSender = 'user' | 'contact';

export type MessageType = 'text' | 'system';

export interface MessageGrouping {
  isGroupStart: boolean;
  isGroupEnd: boolean;
  isGrouped: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  status: MessageStatus;
  type: MessageType;
  createdAt: Date;
  updatedAt: Date;
  version?: number; // Version for optimistic locking
  _grouping?: MessageGrouping; // Metadados opcionais para renderização
}

export interface ChatState {
  messages: Message[];
  activeSender: MessageSender;
  isEditing: string | null;
}

export interface ChatActions {
  addMessage: (text: string, sender?: MessageSender) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  setActiveSender: (sender: MessageSender) => void;
  setEditing: (messageId: string | null) => void;
  toggleSender: () => void;
}

export interface ChatContextType {
  state: ChatState;
  actions: ChatActions;
  profiles: ChatProfiles;
  setProfiles: (profiles: ChatProfiles) => void;
}
