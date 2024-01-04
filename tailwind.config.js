/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js, jsx, ts, tsx}',
    './src/*.{js, jsx, ts, tsx}',
    './src/components/PokeCard.jsx',
    './src/App.jsx',
    './index.html',
    './src/styles/main.css'
  ],
  theme: {
    extend: {
      colors: {
        grass: '#7AC74C'
      }
    },
  },
  plugins: [],
}

