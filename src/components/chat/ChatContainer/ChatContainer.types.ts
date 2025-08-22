import type { Message, MessageSender } from '../../../types/message';
import type { ChatProfiles } from '../../../types/profile';

/**
 * Props para componente ChatContainer
 */
export interface ChatContainerProps {
  /** Array de mensagens */
  messages: Message[];
  /** Perfis do chat */
  profiles: ChatProfiles;
  /** Remetente ativo */
  activeSender: MessageSender;
  /** Texto do input atual */
  inputValue: string;
  /** Handler para mudança no input */
  onInputChange: (value: string) => void;
  /** Handler para enviar mensagem */
  onSendMessage: () => void;
  /** Handler para alternar remetente */
  onSenderToggle: () => void;
  /** Handler para editar perfil */
  onProfileEdit?: () => void;
  /** Se está carregando */
  loading?: boolean;
}
