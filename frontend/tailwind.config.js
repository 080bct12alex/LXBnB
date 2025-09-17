/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#05445E",
        secondary: "#189AB4",
        accent: "#75E6DA",
        background: "#F9FAFB",
        
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
    container: {
      padding: {
        md: "5 rem",
      },
    },
  },
  plugins: [],
};
