/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-light': '#ffffff',
        'primary-dark': '#0d0d0d',
        'secondary-light': '#f7f7f8',
        'secondary-dark': '#1a1a1a',
        'accent-light': '#666666',
        'accent-dark': '#999999',
        'highlight-light': '#000000',
        'highlight-dark': '#ffffff',
        'border-light': 'rgba(0, 0, 0, 0.1)',
        'border-dark': 'rgba(255, 255, 255, 0.1)'
      },
      backgroundColor: theme => ({
        ...theme('colors'),
        'primary-light': '#ffffff',
        'primary-dark': '#0d0d0d',
        'secondary-light': '#f7f7f8',
        'secondary-dark': '#1a1a1a'
      }),
      textColor: theme => ({
        ...theme('colors'),
        'highlight-light': '#000000',
        'highlight-dark': '#ffffff',
        'accent-light': '#666666',
        'accent-dark': '#999999'
      }),
      borderColor: theme => ({
        ...theme('colors'),
        'border-light': 'rgba(0, 0, 0, 0.1)',
        'border-dark': 'rgba(255, 255, 255, 0.1)'
      })
    },
  },
  plugins: [],
}

