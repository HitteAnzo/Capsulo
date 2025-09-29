/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      textShadow: {
        DEFAULT: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        "press-start": ["var(--font-press-start)"],
        "bebas-neue": ["var(--font-bebas-neue)"],
        "dm-serif": ["var(--font-dm-serif)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        // ...existing color extensions
      },
    },
  },
  plugins: [],
};
