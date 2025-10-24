// src/components/Header.jsx --- premium, dark, glassy

import React, { useEffect, useState } from "react";

// Pill Component
export const Pill = ({ children }) => (
  <span className="px-2 py-1 rounded-full text-[11px] bg-white/[0.06] border border-white/10 text-white/80">
    {children}
  </span>
);

// Search Icon
const Search = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// ROUTES
const ROUTES = {
  HOME: "#/",
  DASHBOARD: "#/dashboard",
  CALENDAR: "#/calendar",
  RANKING: "#/rankings",
  BLOG: "#/blog",
  PREMIUM: "#/premium",
  ABOUT: "#/about",
  LEGAL: "#/legal",
  LOGIN: "#/login",
  CONTACT: "#/contact",
  FAQ: "#/faq",
};

const NAV = [
  { key: "home", label: "Accueil", path: ROUTES.HOME },
  { key: "dashboard", label: "Dashboard", path: ROUTES.DASHBOARD },
  { key: "calendar", label: "Calendrier", path: ROUTES.CALENDAR },
  { key: "ranking", label: "Palmarès", path: ROUTES.RANKING },
  { key: "blog", label: "Blog", path: ROUTES.BLOG },
];

function getHashPath() {
  const h = window.location.hash || "#/";
  return h.replace(/^#/, "").split("?")[0] || "/";
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const currentPath = getHashPath();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 backdrop-blur-xl transition-all",
        isScrolled
          ? "bg-[#0B0B0D]/95 border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          : "bg-[#0B0B0D]/80",
      ].join(" ")}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Navigation à gauche */}
          <div className="flex items-center gap-8">
            <a
              href={ROUTES.HOME}
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-400/60 focus:ring-offset-2 focus:ring-offset-[#0B0B0D] rounded group"
              aria-label="Retour à l'accueil"
            >
              {/* Logo style Stripe - minimaliste premium */}
              <span
                className="text-[21px] font-semibold tracking-[-0.04em] bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90"
                style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui" }}
              >
                CasaDividendes
              </span>
              <Pill>Beta</Pill>
            </a>

            <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
              {NAV.map((n) => {
                const isActive = currentPath === n.path.replace("#", "");
                return (
                  <a
                    key={n.key}
                    href={n.path}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "text-[14px] font-medium tracking-tight transition-colors",
                      isActive ? "text-teal-300" : "text-white/80 hover:text-teal-300",
                    ].join(" ")}
                  >
                    {n.label}
                    {isActive && <span className="block h-[2px] mt-1 rounded-full bg-teal-300/80" />}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Barre de recherche + Boutons à droite */}
          <div className="flex items-center gap-3">
            {/* Mini barre de recherche */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 focus-within:border-teal-400/30 transition-all">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une société, un dividende..."
                className="w-56 bg-transparent text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none"
              />
            </div>

            {/* Bouton Premium */}
            <a
              href={ROUTES.PREMIUM}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-orange-400 to-amber-400 text-black hover:brightness-110 transition-all"
              aria-label="Découvrir Premium"
            >
              Premium
            </a>

            {/* Bouton Se connecter */}
            <a
              href={ROUTES.LOGIN}
              className="hidden md:inline-flex px-3 py-1.5 text-sm font-semibold rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}