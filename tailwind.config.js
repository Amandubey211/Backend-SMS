/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-to-r-pink-purple":
          "linear-gradient(to right, #fce7f3, #e9d5ff)",
        'gradient-text': 'linear-gradient(180deg, #C83B62 0%, #46138A 100%)'
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-5px)" },
          "40%, 80%": { transform: "translateX(5px)" },
        },
      },
    },
  },
  plugins: [],
};
