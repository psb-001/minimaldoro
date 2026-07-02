/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,js}'],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff8e0',
          100: '#ffd900',
          200: '#ffd06a',
          300: '#ffb83e',
          400: '#ff8105',
          500: '#fa520f',
          600: '#cc3a05',
        },
        muted: '#a8a8a8',
        'card-border': '#ededed',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
