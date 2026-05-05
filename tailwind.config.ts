import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        studio: "#0a0a0a",
        maacGold: "#FFD700",
      },
      boxShadow: {
        gold: "0 20px 70px rgba(255, 215, 0, 0.16)",
      },
      backgroundImage: {
        "hero-shimmer":
          "linear-gradient(120deg, transparent 0%, rgba(255, 215, 0, 0.14) 45%, transparent 70%)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "100%": { transform: "translateX(120%) skewX(-12deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        shimmer: "shimmer 4.8s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
