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
        risk: {
          low: "#1E8E7E", // jade -- LOW RISK
          moderate: "#B7791B", // songket gold -- MODERATE RISK
          high: "#B5533C", // clay red (new) -- HIGH RISK
        },
      },
    },
  },
  plugins: [],
};

export default config;
