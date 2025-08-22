/**
 * Utilitários para localStorage
 */

import type { ChatProfiles } from '../types/profile';

const STORAGE_KEYS = {
  PROFILES: 'whatsapp-fake-profiles',
} as const;

/**
 * Verifica se localStorage está disponível
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Salva perfis no localStorage
 */
export function saveProfiles(profiles: ChatProfiles): boolean {
  if (!isStorageAvailable()) {
    console.warn('localStorage não está disponível');
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    return true;
  } catch (error) {
    console.error('Erro ao salvar perfis:', error);
    return false;
  }
}

/**
 * Carrega perfis do localStorage
 */
export function loadProfiles(): ChatProfiles | null {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!stored) return null;

    return JSON.parse(stored) as ChatProfiles;
  } catch (error) {
    console.error('Erro ao carregar perfis:', error);
    return null;
  }
}

/**
 * Remove perfis do localStorage
 */
export function clearProfiles(): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    return true;
  } catch (error) {
    console.error('Erro ao limpar perfis:', error);
    return false;
  }
}
