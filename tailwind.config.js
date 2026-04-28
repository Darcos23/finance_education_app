/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#ffcc2a",
          black: "#010209",
          sky: "#c9e4f9",
          red: "#fe5d4b",
          green: "#32b984",
          blue: "#1e67b8",
        },
      },
      boxShadow: {
        soft: "0 16px 36px rgba(1, 2, 9, 0.14)",
        card: "0 8px 24px rgba(30, 103, 184, 0.12)",
      },
    },
  },
  plugins: [],
};
