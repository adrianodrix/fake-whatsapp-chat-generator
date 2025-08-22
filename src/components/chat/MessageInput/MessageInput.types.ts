import type { MessageSender } from '../../../types/message';

/**
 * Props para componente MessageInput
 */
export interface MessageInputProps {
  /** Valor atual do input */
  value: string;
  /** Handler para mudança de valor */
  onChange: (value: string) => void;
  /** Handler para enviar mensagem */
  onSend: () => void;
  /** Handler para alternar remetente */
  onSenderToggle: () => void;
  /** Remetente ativo */
  activeSender: MessageSender;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Placeholder personalizado */
  placeholder?: string;
}
