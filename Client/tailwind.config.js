import formsPlugin from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./src/**/node_modules/**",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: "#16a34a",
        "primary-dark": "#15803d",
        "primary-light": "#dcfce7",
        "background-light": "#f8fafc",
        "background-white": "#ffffff",
        "background-dark": "#102216",
        "surface-light": "#ffffff",
        "surface-border": "#e2e8f0",
        "text-main": "#0f172a",
        "text-secondary": "#475569",
        "text-muted": "#64748b",
      },

      fontFamily: {
        display: ["Spline Sans", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },

      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
    },
  },

  plugins: [formsPlugin],
};