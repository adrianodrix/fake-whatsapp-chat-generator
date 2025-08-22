/**
 * Tipos relacionados a mensagens e chat do WhatsApp
 */

import type { ChatProfiles } from './profile';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export type MessageSender = 'user' | 'contact';

export type MessageType = 'text' | 'system';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  status: MessageStatus;
  type: MessageType;
  createdAt: Date;
  updatedAt: Date;
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
}

export interface ChatContextType {
  state: ChatState;
  actions: ChatActions;
  profiles: ChatProfiles;
  setProfiles: (profiles: ChatProfiles) => void;
}
