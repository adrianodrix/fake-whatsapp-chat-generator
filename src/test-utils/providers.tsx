import React from 'react';
import { ChatProvider } from '../contexts/ChatContext';

// Test wrapper component that includes all providers
export const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <ChatProvider>{children}</ChatProvider>;
};
