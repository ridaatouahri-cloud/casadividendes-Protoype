// src/components/Footer.jsx --- minimal, muted, premium

import React from "react";

// Icons
const Mail = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Twitter = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Linkedin = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Passion Icon
const PassionIcon = ({ className = "h-6 w-auto" }) => (
  <svg className={className} viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="passionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
    </defs>
    
    {/* Étoiles décoratives */}
    <circle cx="15" cy="20" r="2" fill="url(#passionGradient)" opacity="0.8" />
    <circle cx="185" cy="35" r="2" fill="url(#passionGradient)" opacity="0.8" />
    
    {/* Texte "Passion" stylisé en cursive */}
   <text 
  x="100" 
  y="40" 
  fontFamily="cursive, 'Brush Script MT', 'Segoe Script', serif" 
  fontSize="48" 
  fontWeight="100"
  fill="url(#passionGradient)"
  textAnchor="middle"
  transform="rotate(-25 100 50)"
  style={{ fontStyle: 'italic' }}
>
      Passion
    </text>
  </svg>
);

// ROUTES
const ROUTES = {
  HOME: "#/",
  CALENDAR: "#/calendar",
  RANKING: "#/rankings",
  BLOG: "#/blog",
  PREMIUM: "#/premium",
  ABOUT: "#/about",
  LEGAL: "#/legal",
  CONTACT: "#/contact",
  FAQ: "#/faq",
  PRIVACY: "#/privacy",
  TERMS: "#/terms",
};

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
    <footer className="mt-16 border-t border-white/10 bg-[#0B0B0D]">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          {/* Logo */}
          <div className="flex items-center gap-2 opacity-90">
            <div className="text-2xl font-semibold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              CasaDividendes
            </div>
          </div>

          {/* Navigation */}
          <nav
            className="flex flex-wrap gap-4 justify-center text-white/60"
            aria-label="Navigation du pied de page"
          >
            {NAV.map((n) => (
              <a
                key={n.key}
                href={n.path}
                className="hover:text-teal-300 transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* Réseaux sociaux */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://twitter.com/CasaDividendes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-teal-300 hover:border-teal-400/30 transition-all"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/company/casadividendes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-teal-300 hover:border-teal-400/30 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:contact@casadividendes.ma"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-teal-300 hover:border-teal-400/30 transition-all"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>

          {/* Informations */}
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-white/70 flex items-center justify-center gap-2">
              Made with 
              <PassionIcon className="h-6 w-auto" />
              in Morocco
            </p>
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} CasaDividendes — Tous droits réservés.
            </p>
            <p className="text-white/40 text-xs">
              Sources : Bourse de Casablanca & AMMC
            </p>
          </div>

          {/* Disclaimer */}
          <p className="text-zinc-500 text-xs leading-relaxed max-w-3xl mx-auto mt-4">
            Informations fournies à titre indicatif. CasaDividendes n'offre pas de conseil en
            investissement, fiscal ou juridique. Chaque investisseur demeure responsable de ses
            décisions.
          </p>
        </div>
      </div>
    </footer>
  );
}