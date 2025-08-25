// Additional custom matchers for WhatsApp Chat Generator testing
// These extend the jest-dom matchers with app-specific functionality

export const customMatchers = {
  toHaveWhatsAppStyling: (element: HTMLElement) => {
    // Check the element and all child elements for WhatsApp classes
    const allElements = [element, ...element.querySelectorAll('*')];
    const hasWhatsAppColors = allElements.some(
      (el) =>
        el.className &&
        (el.className.includes('bg-wa-') ||
          el.className.includes('text-wa-') ||
          el.className.includes('border-wa-'))
    );

    return {
      message: () =>
        hasWhatsAppColors
          ? 'Element has WhatsApp styling'
          : 'Element does not have WhatsApp styling classes',
      pass: hasWhatsAppColors,
    };
  },

  toBeMessageBubble: (element: HTMLElement) => {
    const hasMessageClass =
      element.className.includes('max-w-bubble') &&
      element.className.includes('rounded-lg');
    const hasCorrectTag = element.tagName.toLowerCase() === 'div';

    return {
      message: () =>
        hasMessageClass && hasCorrectTag
          ? 'Element is a message bubble'
          : 'Element is not a message bubble',
      pass: hasMessageClass && hasCorrectTag,
    };
  },
};

// Extend Jest matchers - using global to avoid module resolution issues
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveWhatsAppStyling(): R;
      toBeMessageBubble(): R;
    }
  }
}

if (typeof expect !== 'undefined') {
  expect.extend(customMatchers);
}
