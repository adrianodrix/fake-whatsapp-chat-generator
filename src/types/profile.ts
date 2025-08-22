/**
 * Tipos relacionados a perfis de usuário
 */

export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  isOnline?: boolean;
}

export interface ChatProfiles {
  user: Profile;
  contact: Profile;
}

export interface ProfileFormData {
  name: string;
  avatar?: File | null;
}
