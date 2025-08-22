import { v4 as uuidv4 } from 'uuid';
import { Message, MessageStatus } from '../types/message';
import { Profile } from '../types/profile';

// Mock data factories for consistent test data
export const createMockMessage = (
  overrides: Partial<Message> = {}
): Message => {
  const defaultMessage: Message = {
    id: uuidv4(),
    text: 'Test message',
    sender: 'user',
    timestamp: new Date('2025-01-01T12:00:00'),
    status: 'sent' as MessageStatus,
    type: 'text',
    createdAt: new Date('2025-01-01T12:00:00'),
    updatedAt: new Date('2025-01-01T12:00:00'),
  };

  return { ...defaultMessage, ...overrides };
};

export const createMockProfile = (
  overrides: Partial<Profile> = {}
): Profile => {
  const defaultProfile: Profile = {
    id: uuidv4(),
    name: 'Test User',
    phone: '+1234567890',
    avatar: '',
    isActive: true,
    lastSeen: new Date('2025-01-01T12:00:00'),
    createdAt: new Date('2025-01-01T12:00:00'),
    updatedAt: new Date('2025-01-01T12:00:00'),
  };

  return { ...defaultProfile, ...overrides };
};

// Mock functions for testing
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
};
