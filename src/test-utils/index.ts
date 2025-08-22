// Testing utilities for WhatsApp Chat Generator
export { renderWithProviders } from './render';
export { createMockMessage, createMockProfile } from './mocks';
export * from './matchers';

// Re-export React Testing Library utilities for convenience
export { screen, fireEvent, waitFor, act } from '@testing-library/react';
export type { RenderResult } from '@testing-library/react';
