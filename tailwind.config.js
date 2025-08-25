/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Mobile-first responsive breakpoints
    screens: {
      xs: '320px', // Extra small phones
      sm: '640px', // Small tablets
      md: '768px', // Medium tablets
      lg: '1024px', // Laptops
      xl: '1280px', // Desktop
      '2xl': '1536px', // Large desktop
    },
    extend: {
      colors: {
        wa: {
          primary: '#075E54',
          secondary: '#128C7E',
          accent: '#25D366',
          bg: {
            chat: '#E5DDD5',
            pattern: '#F0F0F0',
          },
          bubble: {
            sent: '#DCF8C6',
            received: '#FFFFFF',
          },
          text: {
            primary: '#000000',
            secondary: '#667781',
            meta: '#8696A0',
          },
          check: {
            default: '#919191',
            read: '#4FC3F7',
          },
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        11: '2.75rem', // 44px - Minimum touch target
        15: '3.75rem', // 60px header height
        18: '4.5rem', // 72px - Larger touch target
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        touch: '44px', // Minimum touch target height
        'screen-safe':
          'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      maxWidth: {
        bubble: '65%', // Max width for message bubbles
        'bubble-mobile': '85%', // Wider bubbles on mobile
        xs: '320px', // Extra small container
      },
      width: {
        touch: '44px', // Minimum touch target width
      },
      height: {
        touch: '44px', // Minimum touch target height
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        'keyboard-slide': 'keyboardSlide 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        keyboardSlide: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    // Plugin para suporte a safe-area
    function ({ addUtilities }) {
      const newUtilities = {
        '.safe-area-inset': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.touch-manipulation': {
          touchAction: 'manipulation',
        },
        '.overscroll-contain': {
          overscrollBehavior: 'contain',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
