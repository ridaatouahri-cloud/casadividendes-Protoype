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
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70 bg-zinc-950/90 border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="#/"
            className="w-8 h-8 rounded-full bg-teal-500/20 grid place-items-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label="Retour à l'accueil"
          >
            <div className="w-3 h-3 border-2 border-teal-400 rotate-45" />
          </a>
          <a
            href="#/"
            className="font-semibold text-white hover:text-teal-400 transition-colors focus:outline-none focus:underline"
          >
            CasaDividendes
          </a>
          <Pill>Beta</Pill>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm" aria-label="Navigation principale">
          {NAV.map((n) => (
            <a
              key={n.key}
              href={n.path}
              className={`transition-colors focus:outline-none focus:underline ${currentPath === n.path.replace("#", "") ? "text-teal-400" : "text-zinc-300 hover:text-white"}`}
              aria-current={currentPath === n.path.replace("#", "") ? "page" : undefined}
            >
              {n.label}
            </a>
          ))}
          <a
            href="#/premium"
            className="ml-2 px-3 py-1.5 rounded-lg bg-orange-500 text-black font-medium hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label="Découvrir Premium"
          >
            Premium
          </a>
        </nav>
      </div>
    </header>
  );
}
