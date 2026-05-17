import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          main: "#0B2911",
          panel: "#0A3414",
          "card-fiat": "#FFFFFF",
        },
        "badge-odds": "#1E293B",
        accents: {
          lime: "#8CC63F",
          gold: "#D4AF37",
          "neon-support": "#00FF66",
        },
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
