export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          600: '#9333ea',
        },
        brown: {
          600: '#A0522D',
          700: '#8B4513',
        }
      },
      fontFamily: {
        'cursive': ['Dancing Script', 'cursive'],
      }
    },
  },
  plugins: [],
}