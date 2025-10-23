// src/components/Header.jsx — premium, dark, glassy
import React from "react";
import { Pill } from "./StatCard";

const NAV = [
  { key: "home", label: "Accueil", path: "#/" },
  { key: "calendar", label: "Calendrier", path: "#/calendar" },
  { key: "ranking", label: "Palmarès", path: "#/rankings" }, // <- route unifiée
  { key: "blog", label: "Blog", path: "#/blog" },
  { key: "premium", label: "Premium", path: "#/premium" },
  { key: "about", label: "À propos & Contact", path: "#/about" },
  { key: "legal", label: "Mentions légales", path: "#/legal" },
];

function getHashPath() {
  const h = window.location.hash || "#/";
  return h.replace(/^#/, "").split("?")[0] || "/";
}

export default function Header() {
  const currentPath = getHashPath();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 backdrop-blur-md transition-all",
        isScrolled ? "bg-ink-950/80 border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.35)]" : "bg-ink-950/60",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="h-16 md:h-18 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="flex items-center gap-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-teal/60 focus:ring-offset-2 focus:ring-offset-ink-950"
              aria-label="Retour à l'accueil"
            >
              <img
                src="/logo.png"
                alt="CasaDividendes"
                className="h-12 md:h-11 w-auto transition-transform hover:scale-[1.02]"
              />
            </a>
            <Pill>Beta</Pill>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Navigation principale">
            {NAV.map((n) => {
              const isActive = currentPath === n.path.replace("#", "");
              return (
                <a
                  key={n.key}
                  href={n.path}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "text-[14px] font-medium tracking-tight transition-colors",
                    isActive ? "text-brand-teal" : "text-white/80 hover:text-brand-teal",
                  ].join(" ")}
                >
                  {n.label}
                  {isActive && (
                    <span className="block h-[2px] mt-1 rounded-full bg-brand-teal/80" />
                  )}
                </a>
              );
            })}
            <a
              href="#/premium"
              className="btn-primary ml-2"
              aria-label="Découvrir Premium"
            >
              Premium
            </a>
          </nav>

          {/* Mobile CTA simple */}
          <a href="#/premium" className="md:hidden btn-primary px-3 py-1.5 text-sm">Premium</a>
        </div>
      </div>
    </header>
  );
}
