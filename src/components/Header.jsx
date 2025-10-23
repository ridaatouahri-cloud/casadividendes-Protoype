// src/components/Header.jsx — Compact center header (logo + liens) sans dropdown
import React from "react";

function useHashPath() {
  const [path, setPath] = React.useState(
    (window.location.hash || "#/").replace(/^#/, "").split("?")[0] || "/"
  );
  React.useEffect(() => {
    const onHash = () =>
      setPath((window.location.hash || "#/").replace(/^#/, "").split("?")[0] || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return path;
}

const LINKS = [
  { label: "Accueil", path: "#/" , match: (p) => p === "/" },
  { label: "Calendrier", path: "#/calendar", match: (p) => p.startsWith("/calendar") },
  { label: "Palmarès", path: "#/ranking", match: (p) => p.startsWith("/ranking") },
  { label: "Blog", path: "#/blog", match: (p) => p.startsWith("/blog") },
  { label: "À propos & Contact", path: "#/about", match: (p) => p.startsWith("/about") },
  { label: "Mentions légales", path: "#/legal", match: (p) => p.startsWith("/legal") },
];

export default function Header() {
  const currentPath = useHashPath();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 backdrop-blur-md transition-all",
        isScrolled
          ? "bg-ink-950/85 border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          : "bg-ink-950/70",
      ].join(" ")}
    >
      {/* Largeur généreuse, contenu centré */}
      <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-10">
        {/* grille 3 colonnes: espace | centre (logo+nav) | CTA */}
        <div className="h-14 md:h-16 grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Col gauche: espace (peut accueillir icônes plus tard) */}
          <div className="hidden md:block" />

          {/* Col centrale: logo + nav, centrés */}
          <div className="flex items-center gap-5 md:gap-7 justify-center">
            {/* Logo agrandi et mis en valeur */}
            <a
              href="#/"
              className="flex items-center gap-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-teal/60 focus:ring-offset-2 focus:ring-offset-ink-950"
              aria-label="Accueil"
            >
              <img
                src="/logo.png"
                alt="CasaDividendes"
                className="h-9 md:h-11 w-auto drop-shadow-[0_0_18px_rgba(20,184,166,0.25)]"
              />
            </a>

            {/* Liens simples, sans dropdown */}
            <nav
              className="hidden xl:flex items-center gap-6"
              aria-label="Navigation principale"
            >
              {LINKS.map((l) => {
                const active = l.match(currentPath);
                return (
                  <a
                    key={l.label}
                    href={l.path}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "px-1.5 py-2 rounded-lg text-[14px] font-medium tracking-tight transition-colors",
                      active ? "text-brand-teal" : "text-white/80 hover:text-brand-teal",
                    ].join(" ")}
                  >
                    {l.label}
                  </a>
                );
              })}
            </nav>

            {/* Version compacte (tablettes / mobile landscape) */}
            <nav className="xl:hidden flex items-center gap-4 overflow-x-auto no-scrollbar">
              {LINKS.slice(0,4).map((l) => {
                const active = l.match(currentPath);
                return (
                  <a
                    key={l.label}
                    href={l.path}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "px-1 py-1.5 rounded text-[13px] font-medium whitespace-nowrap",
                      active ? "text-brand-teal" : "text-white/80 hover:text-brand-teal",
                    ].join(" ")}
                  >
                    {l.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Col droite: CTA Premium */}
          <div className="flex justify-end">
            <a href="#/premium" className="btn-primary">Premium</a>
          </div>
        </div>
      </div>
    </header>
  );
}
