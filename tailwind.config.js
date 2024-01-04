/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx}',
    './src/*.{js,jsx}',
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

