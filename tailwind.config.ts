import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0A0A0B", 2: "#111113", 3: "#1A1B1E" },
        paper: { DEFAULT: "#ECECE6", 2: "#DCDCD4" },
        signal: "#FFE100",
        alert: "#FF4A1C",
        steel: "#86898F",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-archivo)", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.015em",
      },
    },
  },
  plugins: [],
};

export default config;
