// src/components/Footer.jsx — minimal, muted, premium
import React from "react";
import { ROUTES } from "../constants/routes";

const NAV = [
  { key: "home", label: "Accueil", path: ROUTES.HOME },
  { key: "calendar", label: "Calendrier", path: ROUTES.CALENDAR },
  { key: "ranking", label: "Palmarès", path: ROUTES.RANKING },
  { key: "blog", label: "Blog", path: ROUTES.BLOG },
  { key: "premium", label: "Premium", path: ROUTES.PREMIUM },
  { key: "about", label: "À propos & Contact", path: ROUTES.ABOUT },
  { key: "legal", label: "Mentions légales", path: ROUTES.LEGAL },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-ink-950">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2 opacity-90">
            <img src="/logo.png" alt="CasaDividendes" className="h-8 w-auto" />
          </div>

          <nav className="flex flex-wrap gap-4 justify-center text-white/60" aria-label="Navigation du pied de page">
            {NAV.map((n) => (
              <a
                key={n.key}
                href={n.path}
                className="hover:text-brand-teal transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-1.5">
            <p className="text-white/70">Made with 📈 in Morocco</p>
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} CasaDividendes — Tous droits réservés.
            </p>
            <p className="text-white/40 text-xs">
              Sources : Bourse de Casablanca & AMMC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
