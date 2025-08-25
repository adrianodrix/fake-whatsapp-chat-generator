import type { Profile } from '../../../types/profile';

/**
 * Props para componente ChatHeader
 */
export interface ChatHeaderProps {
  /** Perfil do contato */
  profile: Profile;
  /** Handler para editar perfil */
  onProfileEdit?: () => void;
  /** Handler para voltar */
  onBack?: () => void;
  /** Handler para exportar conversa */
  onExport?: () => void;
  /** Se deve mostrar status online */
  showOnlineStatus?: boolean;
}
