// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./tailwind.preset.js")], // ✅
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Manrope", "Space Grotesk", "ui-sans-serif", "system-ui"],
        display: ["Inter", "Space Grotesk", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: {
          950: "#0B0B0D", // Deep black principal (Hero / body)
          900: "#0F1115", // Noir secondaire (bandes / sections)
        },
        brand: {
          teal: "#34d399",      // Turquoise subtile (icônes, hovers, lignes)
          orange: "#fb923c",    // Orange discret (CTA, micro-accents)
          amber: "#fbbf24",     // Dégradés chauds
        },
      },
      backgroundImage: {
        "grid-dots":
          "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
      boxShadow: {
        glow: "0 8px 30px rgba(255,140,0,0.25)",
        "glow-strong": "0 10px 38px rgba(255,140,0,0.33)",
        "card-soft": "0 6px 30px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        glowpulse: {
          "0%, 100%": { opacity: 0.65, filter: "blur(0px)" },
          "50%": { opacity: 0.9, filter: "blur(1px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        reveal: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        glowpulse: "glowpulse 9s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 12s ease infinite",
        reveal: "reveal .7s ease-out both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
  ],
};
