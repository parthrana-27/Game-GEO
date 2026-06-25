/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "ui-sans-serif"],
        mono: ["Space Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        brand: {
          50:  "#f0fff4",
          100: "#dcffe3",
          200: "#b3ffc2",
          300: "#70ff90",
          400: "#2eff5e",
          500: "#00ff3c", // Tactical Volt Green
          600: "#00d632",
          700: "#00a326",
          800: "#00701a",
          900: "#003d0f",
          950: "#001f07",
        },
        surface: {
          50:  "#f5f6f7",
          100: "#e9ebed",
          200: "#ced2d6",
          300: "#a8b0b8",
          400: "#7b8894",
          500: "#5d6a78",
          600: "#46515c",
          700: "#353e47",
          800: "#22272c", // Carbon Slate
          900: "#131619", // Tactical Obsidian
          950: "#0a0c0e", // Jet Black
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-glow": "pulseGlow 2s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 255, 60, 0.4)" },
          "50%": { boxShadow: "0 0 20px 8px rgba(0, 255, 60, 0.1)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
