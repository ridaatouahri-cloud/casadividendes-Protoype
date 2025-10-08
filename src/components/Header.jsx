import React from "react";
import { Pill } from "./StatCard";

const NAV = [
  { key: "home", label: "Accueil", path: "#/" },
  { key: "calendar", label: "Calendrier", path: "#/calendar" },
  { key: "rankings", label: "Palmarès", path: "#/rankings" },
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

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70 bg-zinc-950/90 border-b border-zinc-800/50">
      <div className="mx-auto px-6 py-4 flex items-center justify-between" style={{ maxWidth: '1400px' }}>
        <div className="flex items-center gap-4">
          <a
            href="#/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950 rounded transition-all duration-300"
            aria-label="Retour à l'accueil"
          >
            <img
              src="/logo.png"
              alt="CasaDividendes"
              className="h-14 w-auto hover:drop-shadow-[0_0_12px_rgba(20,244,197,0.4)] transition-all duration-300"
            />
          </a>
          <Pill>Beta</Pill>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm" aria-label="Navigation principale" style={{ fontWeight: 400 }}>
          {NAV.map((n) => (
            <a
              key={n.key}
              href={n.path}
              className={`transition-colors duration-300 focus:outline-none focus:underline ${currentPath === n.path.replace("#", "") ? "text-teal-400" : "text-zinc-300 hover:text-white"}`}
              aria-current={currentPath === n.path.replace("#", "") ? "page" : undefined}
            >
              {n.label}
            </a>
          ))}
          <a
            href="#/premium"
            className="ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 text-black font-medium hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label="Découvrir Premium"
          >
            Premium
          </a>
        </nav>
      </div>
    </header>
  );
}
