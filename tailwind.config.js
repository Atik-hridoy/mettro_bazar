/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        chaldal: {
          purple: "#6A1B9A",
          "purple-hover": "#571380",
          "purple-light": "#F8F1FC",
          "purple-dark": "#4A116D",
          coral: "#FF5252",
          "coral-hover": "#E04040",
          gold: "#FFC107",
          dark: "#222222",
          gray: "#555555",
          "gray-light": "#F4F4F5",
          "gray-border": "#E4E4E7",
          border: "#E2E8F0",
        },
        primary: {
          DEFAULT: "#6A1B9A",
          hover: "#571380",
          light: "#F8F1FC",
          dark: "#4A116D",
        },
        accent: {
          coral: "#FF5252",
          gold: "#FFC107",
        },
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        '3xl': '4px',
        full: '9999px',
      },
      boxShadow: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        md: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cart: '-2px 0 10px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
