/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffffff',
          dark: '#0d0d0d', // Pure black background
        },
        secondary: {
          light: '#f3f4f6',
          dark: '#1b1b1b', // Slightly lighter black for cards
        },
        accent: {
          light: '#4b5563',
          dark: '#8b8b8b', // Gray for icons and text
        },
        highlight: {
          light: '#111827',
          dark: '#ffffff', // White for highlights
        },
        border: {
          light: '#e5e7eb',
          dark: '#363636', // Border color
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxHeight: {
        '3/4': '75vh',
      },
      minHeight: {
        'chat': 'calc(100vh - 12rem)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'button-gradient-dark': 'linear-gradient(to top, #292929, #555555, #292929)',
        'button-gradient-light': 'linear-gradient(to top, #e5e7eb, #f9fafb, #e5e7eb)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} 