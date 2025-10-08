import React from "react";

const NAV = [
  { key: "home", label: "Accueil", path: "#/" },
  { key: "calendar", label: "Calendrier", path: "#/calendar" },
  { key: "rankings", label: "Palmarès", path: "#/rankings" },
  { key: "blog", label: "Blog", path: "#/blog" },
  { key: "premium", label: "Premium", path: "#/premium" },
  { key: "about", label: "À propos & Contact", path: "#/about" },
  { key: "legal", label: "Mentions légales", path: "#/legal" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-800 bg-[#121212]">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CasaDividendes" className="h-22 w-auto opacity-80" />
          </div>

          <nav className="flex flex-wrap gap-4 justify-center text-zinc-400" aria-label="Navigation du pied de page">
            {NAV.map((n) => (
              <a key={n.key} href={n.path} className="hover:text-teal-400 transition-colors duration-300 focus:outline-none focus:underline">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-2">
            <p className="text-zinc-400">
              Made with 📈 in Morocco
            </p>
            <p className="text-zinc-500 text-xs">
              © {new Date().getFullYear()} CasaDividendes. Tous droits réservés.
            </p>
            <p className="text-zinc-600 text-xs">
              Source des données : Bourse de Casablanca
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
