import type { Config } from "tailwindcss";

// Brand palette + risk colors -- see frontend/docs/design.md ("Brand system",
// "Risk / band colors"). This is the single source; components reference
// these via class names (bg-risk-low, text-risk-high, etc.), never raw hex.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        navy: "#0B1F2A",
        teal: "#0F5C56",
        jade: "#1E8E7E",
        gold: "#B7791B",
        paper: "#FBFAF7",
        surface: "#FFFFFF",
        surfaceAlt: "#F4F5F5",
        border: "#E2E4E5",
        mist: "#919A9F",
        slate: "#606D75",
        risk: {
          low: "#1E8E7E",
          moderate: "#B7791B",
          high: "#B5533C",
        },
      },
      boxShadow: {
        card: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      },
    },
  },
  safelist: [
    { pattern: /^(text|border|stroke)-risk-(low|moderate|high)$/ },
    { pattern: /^bg-risk-(low|moderate|high)(\/(10|15))?$/ },
  ],
  plugins: [],
};

export default config;
