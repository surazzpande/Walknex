/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FA',
          100: '#CCE0F5',
          200: '#99C2EB',
          300: '#66A3E0',
          400: '#3385D6',
          500: '#0066CC', // Primary blue
          600: '#0052A3',
          700: '#003D7A',
          800: '#002952',
          900: '#001429',
        },
        secondary: {
          50: '#F8F8F8',
          100: '#F1F1F1',
          200: '#E1E1E1',
          300: '#CECECE',
          400: '#ACACAC',
          500: '#8E8E93', // Secondary gray
          600: '#6E6E73',
          700: '#54545A',
          800: '#3A3A3C',
          900: '#1C1C1E',
        },
        accent: {
          50: '#FFEBEB',
          100: '#FFD6D6',
          200: '#FFADAD',
          300: '#FF8585',
          400: '#FF5C5C',
          500: '#FF3B30', // Accent red
          600: '#E60000',
          700: '#B30000',
          800: '#800000',
          900: '#4D0000',
        },
        success: {
          500: '#34C759', // Success green
        },
        warning: {
          500: '#FF9500', // Warning orange
        },
        error: {
          500: '#FF3B30', // Error red (same as accent)
        },
      },
      fontFamily: {
        sans: ['SF Pro Display', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['SF Mono', 'monospace'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
}