import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",      // Ensure this points to src/app
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        // Your Custom Palette
        primary: "#5c4033",      // Deep Brown
        secondary: "#d4a373",    // Tan/Beige
        accent: "#d4a373",       // Same as secondary (as requested)
        btn: "#ff7f00",          // Orange Button
        background: "#fafafa",   // Off-white
      },
      fontFamily: {
        // We link the CSS variables we made in layout.tsx here
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;