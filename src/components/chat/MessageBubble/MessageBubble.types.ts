import type { Message } from '../../../types/message';

/**
 * Props para componente MessageBubble
 */
export interface MessageBubbleProps {
  /** Dados da mensagem */
  message: Message;
  /** Handler para editar mensagem */
  onEdit?: (id: string) => void;
  /** Handler para deletar mensagem */
  onDelete?: (id: string) => void;
  /** Se está em modo de edição */
  isEditing?: boolean;
  /** Se deve mostrar ações de hover */
  showActions?: boolean;
}
