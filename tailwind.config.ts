import type { Config } from "tailwindcss";

const config = {
  // Enable dark mode based on a class
  darkMode: ["class"],
  // Specify the paths to all of the template files
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "", // No prefix by default
  theme: {
    // Container configuration
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // Extend default theme
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        primary: {
          black: "#010101",
          green: "#ffe000", // updated to match button green
          grey: {
            100: "#848484",
            200: "#a6a6a6", // updated to match grey-700 in the previous style
            300: "#ffffff", // updated to match grey-200 in the previous style
          },
          blue: "#60a5fa", // updated to match button blue
          purple: "#a78bfa", // added to match button purple
          pink: "#f472b6", // added to match button pink
          orange: "#fb923c", // added to match button orange
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // Include the Tailwind CSS animate plugin
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
