/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#FFF7EF",
          100: "#FFEDDA",
          200: "#FFD9B5",
          300: "#FFC08A",
          400: "#FFB86B",
          500: "#FF9A40",
          600: "#FF8A3D",
          700: "#E06A1A",
          800: "#B85210",
          900: "#8A3B0A",
        },
        brand: {
          bg: "#FFF7EF",
          card: "#FFFFFF",
          primary: "#FFB86B",
          accent: "#FF8A3D",
          text: "#111827",
          muted: "#6B7280",
          border: "#F0E6D9",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 24px rgba(255, 138, 61, 0.08)",
        "card-hover": "0 8px 40px rgba(255, 138, 61, 0.16)",
        glow: "0 0 32px rgba(255, 138, 61, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
