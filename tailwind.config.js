/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00694c",
        "primary-dark": "#004d37",
        "primary-container": "#008560",
        "primary-fixed-dim": "#68dbae",
        "primary-fixed": "#86f8c9",
        secondary: "#086b53",
        "secondary-fixed": "#a0f3d4",
        "on-secondary-fixed-variant": "#00513e",
        tertiary: "#4e605b",
        "tertiary-fixed": "#165b4a",
        surface: "#f0f4f2",
        "surface-card": "#ffffff",
        "surface-container": "#e1e8e4",
        "surface-container-low": "#eaf0ed",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#1a1c1b",
        "on-surface-variant": "#3d4943",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "outline-variant": "#cbd6cf",
        outline: "#6d7a73",
        error: "#ba1a1a",
      },
      spacing: {
        'container-max': '1280px',
        'margin-desktop': '64px',
        'margin-mobile': '16px',
        'gutter': '16px',
        'base': '8px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
