import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: "#00ffff",
        yellow: "#ffff00",
        magenta: "#ff00ff",
        electric: "#00aaff",
      },
      fontFamily: {
        sans: ["var(--font-display)", "'Fira Code'", "monospace"],
        mono: ["var(--font-display)", "'Fira Code'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 255, 255, 0.4)",
        panel: "0 25px 45px rgba(0,0,0,0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
