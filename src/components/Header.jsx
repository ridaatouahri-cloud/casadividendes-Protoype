// src/components/Header.jsx — style "Supabase-like" (largeur, rubriques, CTA)
import React from "react";
import { ChevronDown } from "lucide-react";

// Utilitaire pour savoir quelle page est active (hash router)
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
      {/* largeur plein écran, mais contenu centré large */}
      <div className="mx-auto max-w-[120rem] px-5 md:px-8">
        <div className="h-14 md:h-16 flex items-center justify-between">
          {/* Logo + marque */}
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="flex items-center gap-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-teal/60 focus:ring-offset-2 focus:ring-offset-ink-950"
              aria-label="Accueil"
            >
              <img src="/logo.png" alt="CasaDividendes" className="h-7 md:h-8 w-auto" />
            </a>
          </div>

          {/* Nav principale : Product / Developers / Solutions / Pricing / Docs / Blog */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Navigation principale">
            {/* Product (menu) */}
            <NavGroup label="Product" active={/^\/(calendar|ranking|company)/.test(currentPath)}>
              <NavItem href="#/calendar" label="Calendrier des dividendes" />
              <NavItem href="#/ranking" label="Palmarès (classements)" />
              <NavItem href="#/company/IAM" label="Fiche entreprise (exemple)" />
              <Divider />
              <NavItem href="#/premium" label="Premium" accent />
            </NavGroup>

            {/* Developers (menu) */}
            <NavGroup label="Developers">
              <NavItem href="#/docs/api" label="API (bientôt)" />
              <NavItem href="#/docs/formats" label="Formats de données" />
              <NavItem href="#/docs/changelog" label="Changelog" />
            </NavGroup>

            {/* Solutions (menu) */}
            <NavGroup label="Solutions">
              <NavItem href="#/solutions/indicateurs" label="Indicateurs exclusifs (C-DRS, PRT, NDF)" />
              <NavItem href="#/solutions/drip" label="Simulateur DRIP" />
              <NavItem href="#/solutions/alertes" label="Alertes J-3" />
            </NavGroup>

            {/* liens simples */}
            <SimpleLink href="#/pricing" label="Pricing" active={currentPath === "/pricing"} />
            <SimpleLink href="#/docs" label="Docs" active={currentPath.startsWith("/docs")} />
            <SimpleLink href="#/blog" label="Blog" active={currentPath.startsWith("/blog")} />
          </nav>

          {/* Zone droite : GitHub (placeholder) + Sign in + CTA */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
              aria-label="GitHub"
              title="GitHub"
            >
              {/* simple placeholder GitHub logo (emoji) */}
              <span className="text-base">🐙</span>
              <span className="text-xs">GitHub</span>
            </a>

            <a href="#/signin" className="btn-ghost hidden md:inline-flex">Se connecter</a>
            <a href="#/premium" className="btn-primary">Premium</a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ----------------- sous-composants ----------------- */

function SimpleLink({ href, label, active }) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "px-3 py-2 rounded-lg text-[14px] font-medium tracking-tight transition-colors",
        active ? "text-brand-teal" : "text-white/80 hover:text-brand-teal",
      ].join(" ")}
    >
      {label}
    </a>
  );
}

function NavGroup({ label, children, active }) {
  return (
    <div className="relative group">
      <button
        className={[
          "px-3 py-2 rounded-lg text-[14px] font-medium tracking-tight flex items-center gap-1",
          active ? "text-brand-teal" : "text-white/80 group-hover:text-brand-teal",
        ].join(" ")}
        aria-haspopup="true"
        aria-expanded="false"
      >
        {label}
        <ChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {/* Dropdown */}
      <div
        className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition
                   absolute left-0 top-[calc(100%+8px)] min-w-[320px] p-1
                   bg-ink-950/95 border border-white/10 rounded-xl shadow-glow backdrop-blur-md"
      >
        {children}
      </div>
    </div>
  );
}

function NavItem({ href, label, accent = false }) {
  return (
    <a
      href={href}
      className={[
        "flex items-center justify-between gap-2 px-3 py-2 rounded-lg",
        "text-sm text-white/80 hover:text-white hover:bg-white/[0.06] transition",
        accent ? "border border-brand-teal/30 bg-brand-teal/5 mt-1" : "border border-transparent",
      ].join(" ")}
    >
      <span>{label}</span>
      <span className="text-white/40">→</span>
    </a>
  );
}

function Divider() {
  return <div className="my-1 mx-2 h-px bg-white/10" />;
}
