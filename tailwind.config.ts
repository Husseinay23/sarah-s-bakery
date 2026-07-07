import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./admin/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FCF3EA",
        blush: "#F3D6D2",
        rose: "#E8969B",
        espresso: "#3A2318",
        cinnamon: "#C68A4E",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        script: ["var(--font-caveat)", "cursive"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
