/**
 * Hook para gerenciar perfis de usuário
 */

import { useContext, useCallback } from 'react';
import { ChatContext } from '../contexts/ChatContextDefinition';
import type { Profile, ChatProfiles } from '../types/profile';

export function useProfiles() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useProfiles deve ser usado dentro de ChatProvider');
  }

  const { profiles, setProfiles } = context;

  const updateUserProfile = useCallback(
    (updates: Partial<Profile>) => {
      const newProfiles: ChatProfiles = {
        ...profiles,
        user: { ...profiles.user, ...updates },
      };
      setProfiles(newProfiles);
    },
    [profiles, setProfiles]
  );

  const updateContactProfile = useCallback(
    (updates: Partial<Profile>) => {
      const newProfiles: ChatProfiles = {
        ...profiles,
        contact: { ...profiles.contact, ...updates },
      };
      setProfiles(newProfiles);
    },
    [profiles, setProfiles]
  );

  return {
    profiles,
    updateUserProfile,
    updateContactProfile,
    setProfiles,
  };
}
