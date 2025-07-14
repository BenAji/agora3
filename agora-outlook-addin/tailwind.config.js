/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Bloomberg-style dark theme colors
        'bloomberg-dark': {
          50: '#f7f8fa',
          100: '#ebeef3',
          200: '#d3dae4',
          300: '#adb9cc',
          400: '#8194af',
          500: '#617795',
          600: '#4e617c',
          700: '#404f65',
          800: '#394356',
          900: '#333a4a',
          950: '#101113',
        },
        'primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        }
      },
      backgroundColor: {
        'dark': '#101113',
        'dark-secondary': '#1a1d21',
        'dark-tertiary': '#252a30',
      },
      textColor: {
        'dark-primary': '#ffffff',
        'dark-secondary': '#b0b8c4',
        'dark-tertiary': '#8a93a0',
      },
      borderColor: {
        'dark': '#2d3748',
        'dark-light': '#4a5568',
      }
    },
  },
  plugins: [],
}