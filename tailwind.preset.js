// tailwind.preset.js — CasaDividendes Premium Preset
// Unified design system: dark premium, black base + turquoise/orange accents

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Manrope", "Space Grotesk", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: {
          950: "#0B0B0D", // Deep black — principal
          900: "#0F1115", // Noir secondaire (sections)
          800: "#14161B", // Pour hover ou séparations
        },
        brand: {
          teal: "#34d399",   // Accent turquoise (icônes, lignes, focus)
          orange: "#fb923c", // Accent chaud pour CTA
          amber: "#fbbf24",  // Dégradé complémentaire
        },
        surface: {
          glass: "rgba(255,255,255,0.02)",
          border: "rgba(255,255,255,0.08)",
        },
      },
      boxShadow: {
        glow: "0 8px 30px rgba(255,140,0,0.25)",
        "glow-strong": "0 10px 38px rgba(255,140,0,0.33)",
        "card-soft": "0 6px 30px rgba(0,0,0,0.25)",
        "card-light": "0 4px 16px rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        glowpulse: {
          "0%,100%": { opacity: 0.65 },
          "50%": { opacity: 0.95 },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        reveal: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glowpulse: "glowpulse 9s ease-in-out infinite",
        "gradient-shift": "gradient-shift 12s ease infinite",
        shimmer: "shimmer 2s linear infinite",
        reveal: "reveal .7s ease-out both",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
  ],

  // 💡 Optional base styles you can auto-import into every project
  safelist: [
    "bg-ink-950",
    "bg-ink-900",
    "text-brand-teal",
    "text-brand-orange",
    "from-brand-orange",
    "to-brand-amber",
    "border-white/10",
    "backdrop-blur-md",
  ],
};
