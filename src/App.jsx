import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Rankings from "./pages/Rankings";
import Company from "./pages/Company";
import Premium from "./pages/Premium";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import { Pill } from "./components/StatCard";

const NAV = [
  { key: "home", label: "Accueil", path: "/" },
  { key: "calendar", label: "Calendrier", path: "/calendar" },
  { key: "rankings", label: "Palmarès", path: "/rankings" },
  { key: "blog", label: "Blog", path: "/blog" },
  { key: "premium", label: "Premium", path: "/premium" },
  { key: "about", label: "À propos & Contact", path: "/about" },
  { key: "legal", label: "Mentions légales", path: "/legal" },
];

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70 bg-zinc-950/90 border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-8 h-8 rounded-full bg-teal-500/20 grid place-items-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label="Retour à l'accueil"
          >
            <div className="w-3 h-3 border-2 border-teal-400 rotate-45" />
          </Link>
          <Link
            to="/"
            className="font-semibold text-white hover:text-teal-400 transition-colors focus:outline-none focus:underline"
          >
            CasaDividendes
          </Link>
          <Pill>Beta</Pill>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm" aria-label="Navigation principale">
          {NAV.map((n) => (
            <Link
              key={n.key}
              to={n.path}
              className={`transition-colors focus:outline-none focus:underline ${currentPath === n.path ? "text-teal-400" : "text-zinc-300 hover:text-white"}`}
              aria-current={currentPath === n.path ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/premium"
            className="ml-2 px-3 py-1.5 rounded-lg bg-orange-500 text-black font-medium hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label="Découvrir Premium"
          >
            Premium
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
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

export default function App() {
  const [viewport, setViewport] = useState("desktop");

  const Frame = ({ children }) => (
    <div className={viewport === "mobile" ? "mx-auto border border-zinc-800 rounded-[22px] overflow-hidden max-w-[420px] shadow-2xl" : ""}>{children}</div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />

      <div className="mx-auto max-w-6xl px-6 mt-4 flex items-center justify-end gap-2 text-sm" role="toolbar" aria-label="Sélecteur d'aperçu">
        <span className="text-zinc-500 hidden md:inline">Aperçu :</span>
        <button onClick={() => setViewport("desktop")} className={`px-3 py-1 rounded-lg border ${viewport === "desktop" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-400`} aria-pressed={viewport === "desktop"}>Desktop</button>
        <button onClick={() => setViewport("mobile")} className={`px-3 py-1 rounded-lg border ${viewport === "mobile" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-400`} aria-pressed={viewport === "mobile"}>Mobile</button>
      </div>

      <Frame>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/company/:ticker" element={<Company />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </Frame>
    </div>
  );
}
