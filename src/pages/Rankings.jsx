// src/pages/Ranking.jsx — CasaDividendes (Premium aligned)
// Dépendances attendues : Tailwind + index.css premium, Helmet configuré, components/StatCard disponibles
import React from "react";
import { Helmet } from "react-helmet-async";
import { StatCard, Pill } from "../components/StatCard";

export default function Rankings() {
  // Démo: 10 lignes mock — à remplacer par vos données réelles si besoin
  const rows = Array.from({ length: 10 }).map((_, i) => ({
    r: i + 1,
    t: ["IAM", "BCP", "ATW", "ADI", "BCI", "SNEP"][i % 6],
    n: ["Maroc Telecom", "Banque Populaire", "Attijariwafa Bank", "Addoha", "BOA CI", "SNEP"][i % 6],
    d: (3 + Math.random() * 3).toFixed(2) + "%", // Div. TTM (démo)
    c: (100 + Math.random() * 200).toFixed(2),   // Cours (démo)
  }));

  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-amber-400/30 selection:text-white">
      <Helmet>
        <title>Palmarès des Dividendes - CasaDividendes</title>
        <meta
          name="description"
          content="Découvrez le classement des meilleures sociétés à dividendes de la Bourse de Casablanca. Rendements, régularité et performance historique."
        />
      </Helmet>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Titre + sous-titre alignés Home (gradient chaud) */}
        <header className="mb-4">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-brand-orange to-brand-amber bg-clip-text text-transparent">
              Palmarès des dividendes
            </span>
          </h1>
          <p className="text-zinc-400 mt-2">
            Comparez les sociétés selon le rendement, la régularité et la croissance.
          </p>
        </header>

        {/* Filtres / tags (Pill) — cohérence avec Home */}
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Pill>Rendement TTM</Pill>
          <Pill>Régularité</Pill>
          <Pill>Croissance 5 ans</Pill>
          <Pill>Score sécurité 🔒</Pill>
        </div>

        {/* Stat Cards — conserve le composant, ajoute une grille sobre */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Rendement moyen" value="4.1%" />
          <StatCard title="Top secteur" value="Télécom" />
          <StatCard title="Meilleure régularité" value="IAM (10 ans)" />
        </section>

        {/* Tableau — homogénéisé : cartes vitrées, bordures white/10, header sticky + liseré teal */}
        <section className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-white/[0.04] text-zinc-300 sticky top-0 z-10 border-b-2 border-brand-teal/70">
              <tr>
                <th scope="col" className="text-left p-3 font-semibold">Rang</th>
                <th scope="col" className="text-left p-3 font-semibold">Ticker</th>
                <th scope="col" className="text-left p-3 font-semibold">Société</th>
                <th scope="col" className="text-left p-3 font-semibold">Div. TTM</th>
                <th scope="col" className="text-left p-3 font-semibold">Cours</th>
                <th scope="col" className="text-left p-3 font-semibold">Rendement</th>
                <th scope="col" className="text-left p-3 font-semibold">Fiche</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr
                  key={r.r}
                  className="border-t border-white/10 hover:bg-white/[0.04] transition-all"
                  style={{ backgroundColor: idx % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}
                >
                  <td className="p-3 text-zinc-300">{r.r}</td>
                  <td className="p-3 text-white font-medium">{r.t}</td>
                  <td className="p-3 text-zinc-200">{r.n}</td>
                  <td className="p-3 text-zinc-300">{r.d}</td>
                  <td className="p-3 text-zinc-300">{r.c} MAD</td>
                  <td className="p-3 text-brand-teal font-semibold">{r.d}</td>
                  <td className="p-3">
                    <button
                      onClick={() => (window.location.hash = `#/company/${r.t}`)}
                      className="btn-ghost"
                    >
                      Ouvrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Aide / rappel formule — carte premium */}
        <footer className="mt-6 card-premium p-5">
          <p className="text-zinc-300 text-sm">
            ⚡ <span className="font-medium">Rendement TTM</span> = dividende versé sur 12 mois / cours actuel.
          </p>
        </footer>
      </main>
    </div>
  );
}
