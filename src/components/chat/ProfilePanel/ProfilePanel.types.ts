/**
 * Types para componente ProfilePanel
 */

import type { Profile } from '../../../types/profile';

export interface ProfilePanelProps {
  /** Perfil a ser editado */
  profile: Profile;
  /** Label do perfil (ex: "Usuário", "Contato") */
  label: string;
  /** Callback quando perfil é atualizado */
  onProfileUpdate: (profile: Profile) => void;
  /** Classe CSS adicional */
  className?: string;
}

export interface ProfileFormState {
  name: string;
  avatar?: string;
  isUploading: boolean;
  errors: {
    name?: string;
    upload?: string;
  };
}
