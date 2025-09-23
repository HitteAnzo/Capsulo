import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b0e",
        card: "#111118",
        border: "#23232d",
        text: "#eaeaea",
        sub: "#a3a3a3"
      }
    },
  },
  plugins: [],
};
export default config;
