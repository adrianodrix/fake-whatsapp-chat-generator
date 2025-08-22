import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
} as Storage;

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Custom matchers for WhatsApp Chat Generator are extended by testing-library/jest-dom
// Additional custom matchers are defined in test-utils/matchers.ts

// Custom matchers are provided by @testing-library/jest-dom
// Additional custom matchers can be added here if needed
import './test-utils/matchers';
