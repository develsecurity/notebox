import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#020617",       // slate-950
          surface: "#0f172a",  // slate-900
          card: "#1e293b",     // slate-800
          border: "#334155",   // slate-700
          text: "#f1f5f9",     // slate-100
          muted: "#94a3b8",    // slate-400
          accent: "#22d3ee",   // cyan-400
          "accent-hover": "#06b6d4", // cyan-500
          danger: "#f87171",   // red-400
          success: "#4ade80",  // green-400
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
