import type { Message, MessageStatus } from '@/types/message';

export interface MessageEditPopoverProps {
  message: Message;
  onSave: (updates: Partial<Message>) => void;
  onCancel: () => void;
  anchorEl?: HTMLElement | null;
  isVisible: boolean;
}

export interface EditingFormData {
  text: string;
  date: string;
  time: string;
  status: MessageStatus;
}

export interface ValidationErrors {
  text?: string;
  date?: string;
  time?: string;
  status?: string;
}
