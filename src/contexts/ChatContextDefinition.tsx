import { createContext } from 'react';
import type { ChatContextType } from '../types/message';

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
