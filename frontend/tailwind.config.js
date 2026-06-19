/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Outfit", "ui-sans-serif"],
      },
      colors: {
        brand: {
          50:  "#eef9ff",
          100: "#d9f1ff",
          200: "#bce8ff",
          300: "#8edaff",
          400: "#59c3ff",
          500: "#33a5fc",
          600: "#1d87f1",
          700: "#166ede",
          800: "#1858b3",
          900: "#1a4d8d",
          950: "#152f56",
        },
        surface: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
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
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(51,165,252,0.4)" },
          "50%": { boxShadow: "0 0 20px 8px rgba(51,165,252,0.1)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
