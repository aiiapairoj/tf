import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-prompt)", "system-ui", "sans-serif"],
        fun: ["var(--font-baloo)", "var(--font-prompt)", "sans-serif"],
      },
      colors: {
        primary: { DEFAULT: "#FF6B35", dark: "#E85A24", light: "#FF8B5E" },
        accent: { DEFAULT: "#F7931E", warm: "#FFD23F" },
      },
    },
  },
  plugins: [],
};
export default config;
