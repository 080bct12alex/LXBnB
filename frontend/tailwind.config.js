/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B2B40",
        secondary: "#D4AF37",
        accent: "#F0F0F0",
        background: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
    container: {
      padding: {
        md: "10rem",
      },
    },
  },
  plugins: [],
};
