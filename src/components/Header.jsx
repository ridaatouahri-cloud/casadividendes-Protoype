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
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-20 backdrop-blur transition-all duration-400 ease-in-out ${
      isScrolled
        ? 'shadow-[0_2px_12px_rgba(0,0,0,0.3)] py-4'
        : 'py-5'
    }`}>
      <div className="px-8 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="#/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950 rounded transition-all duration-300"
            aria-label="Retour à l'accueil"
          >
            <img
              src="/logo.png"
              alt="CasaDividendes"
              className="h-20 w-auto hover:drop-shadow-[0_0_12px_rgba(20,184,166,0.5)] transition-all duration-300"
            />
          </a>
          <Pill>Beta</Pill>
        </div>
        <nav className={`hidden md:flex items-center transition-all duration-300 ease-in-out ${
          isScrolled ? 'gap-8' : 'gap-10'
        }`} aria-label="Navigation principale">
          {NAV.map((n) => (
            <a
              key={n.key}
              href={n.path}
              className={`text-[15px] font-thin tracking-[-0.01em] transition-colors duration-[250ms] focus:outline-none focus:underline ${currentPath === n.path.replace("#", "") ? "text-[#00D3A7]" : "text-[#A1A1AA] hover:text-[#00D3A7]"}`}
              aria-current={currentPath === n.path.replace("#", "") ? "page" : undefined}
            >
              {n.label}
            </a>
          ))}
          <a
            href="#/premium"
            className="ml-4 px-4 py-2 rounded-lg bg-orange-500 text-black font-medium hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label="Découvrir Premium"
          >
            Premium
          </a>
        </nav>
      </div>
    </header>
  );
}
