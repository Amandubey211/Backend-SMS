/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-to-r-pink-purple': 'linear-gradient(to right, #fce7f3, #e9d5ff)',
      },
    },
  },
  plugins: [],
}