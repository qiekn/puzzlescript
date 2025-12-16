/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'puzzlescript-bg': '#1a1a2e',
        'puzzlescript-panel': '#16213e',
        'puzzlescript-accent': '#0f3460',
        'puzzlescript-highlight': '#e94560',
      },
    },
  },
  plugins: [],
}
