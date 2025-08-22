import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AllProviders } from './providers';

// Custom render function that includes all providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export { customRender as renderWithProviders };
