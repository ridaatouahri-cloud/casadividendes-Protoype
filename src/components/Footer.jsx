import React from "react";
import { Link } from "react-router-dom";

const NAV = [
  { key: "home", label: "Accueil", path: "/" },
  { key: "calendar", label: "Calendrier", path: "/calendar" },
  { key: "rankings", label: "Palmarès", path: "/rankings" },
  { key: "blog", label: "Blog", path: "/blog" },
  { key: "premium", label: "Premium", path: "/premium" },
  { key: "about", label: "À propos & Contact", path: "/about" },
  { key: "legal", label: "Mentions légales", path: "/legal" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <nav className="flex flex-wrap gap-4 text-zinc-400" aria-label="Navigation du pied de page">
          {NAV.map((n) => (
            <Link key={n.key} to={n.path} className="hover:text-white transition-colors focus:outline-none focus:underline">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="text-zinc-500">© {new Date().getFullYear()} CasaDividendes. Tous droits réservés.</div>
      </div>
    </footer>
  );
}
