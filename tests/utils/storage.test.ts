/**
 * Testes para utilitários de localStorage
 */

import {
  isStorageAvailable,
  saveProfiles,
  loadProfiles,
  clearProfiles,
} from '../../src/utils/storage';
import type { ChatProfiles } from '../../src/types/profile';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utils', () => {
  const mockProfiles: ChatProfiles = {
    user: {
      id: 'user',
      name: 'João Silva',
      initials: 'JS',
      avatar: 'data:image/jpeg;base64,test',
      isOnline: true,
    },
    contact: {
      id: 'contact',
      name: 'Maria Santos',
      initials: 'MS',
      isOnline: false,
    },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('isStorageAvailable', () => {
    it('deve detectar disponibilidade do localStorage', () => {
      expect(isStorageAvailable()).toBe(true);
    });
  });

  describe('saveProfiles', () => {
    it('deve salvar perfis no localStorage', () => {
      const result = saveProfiles(mockProfiles);
      expect(result).toBe(true);
      expect(localStorage.getItem('whatsapp-fake-profiles')).toBeTruthy();
    });

    it('deve retornar true em caso de sucesso', () => {
      expect(saveProfiles(mockProfiles)).toBe(true);
    });
  });

  describe('loadProfiles', () => {
    it('deve carregar perfis salvos', () => {
      saveProfiles(mockProfiles);
      const loaded = loadProfiles();

      expect(loaded).toEqual(mockProfiles);
    });

    it('deve retornar null se não houver dados salvos', () => {
      expect(loadProfiles()).toBeNull();
    });

    it('deve retornar null se dados estiverem corrompidos', () => {
      localStorage.setItem('whatsapp-fake-profiles', 'invalid-json');
      expect(loadProfiles()).toBeNull();
    });
  });

  describe('clearProfiles', () => {
    it('deve limpar perfis salvos', () => {
      saveProfiles(mockProfiles);
      expect(loadProfiles()).not.toBeNull();

      const result = clearProfiles();
      expect(result).toBe(true);
      expect(loadProfiles()).toBeNull();
    });

    it('deve retornar true mesmo se não houver dados', () => {
      expect(clearProfiles()).toBe(true);
    });
  });

  describe('error handling', () => {
    it('deve lidar com erro no localStorage', () => {
      // Mock localStorage que falha
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const result = saveProfiles(mockProfiles);
      expect(result).toBe(false);

      // Restaurar mock
      localStorage.setItem = originalSetItem;
    });
  });
});
