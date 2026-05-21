import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        "neon-green": "#39FF14",
        "neon-pink": "#FF007F",
        "neon-cyan": "#00E5FF",
        "neon-yellow": "#FFD700",
        "card-bg": "rgba(255, 255, 255, 0.05)",
        "card-border": "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "sans-serif"],
      },
      boxShadow: {
        "neon-green": "0 0 20px rgba(57, 255, 20, 0.3), 0 0 60px rgba(57, 255, 20, 0.1)",
        "neon-pink": "0 0 20px rgba(255, 0, 127, 0.3), 0 0 60px rgba(255, 0, 127, 0.1)",
        "neon-cyan": "0 0 20px rgba(0, 229, 255, 0.3), 0 0 60px rgba(0, 229, 255, 0.1)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(57, 255, 20, 0.2)" },
          "100%": { boxShadow: "0 0 30px rgba(57, 255, 20, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "cyber-grid": "50px 50px",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;
