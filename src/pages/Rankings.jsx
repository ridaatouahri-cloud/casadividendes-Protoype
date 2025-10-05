import React from "react";
import { Helmet } from "react-helmet-async";
import { StatCard, Pill } from "../components/StatCard";

export default function Rankings() {
  const rows = Array.from({ length: 10 }).map((_, i) => ({
    r: i + 1,
    t: ["IAM", "BCP", "ATW", "ADI", "BCI", "SNEP"][i % 6],
    n: ["Maroc Telecom", "Banque Populaire", "Attijariwafa Bank", "Addoha", "BOA CI", "SNEP"][i % 6],
    d: (3 + Math.random() * 3).toFixed(2) + "%",
    c: (100 + Math.random() * 200).toFixed(2),
  }));

  return (
    <>
      <Helmet>
        <title>Palmarès des Dividendes - CasaDividendes</title>
        <meta name="description" content="Découvrez le classement des meilleures sociétés à dividendes de la Bourse de Casablanca. Rendements, régularité et performance historique." />
      </Helmet>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-white text-2xl font-bold">Palmarès des dividendes</h1>
        <p className="text-zinc-400 mt-2">Comparez les sociétés selon le rendement, la régularité et la croissance.</p>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Pill>Rendement TTM</Pill>
          <Pill>Régularité</Pill>
          <Pill>Croissance 5 ans</Pill>
          <Pill>Score sécurité 🔒</Pill>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Rendement moyen" value="4.1%" />
          <StatCard title="Top secteur" value="Télécom" />
          <StatCard title="Meilleure régularité" value="IAM (10 ans)" />
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th scope="col" className="text-left p-3">Rang</th>
                <th scope="col" className="text-left p-3">Ticker</th>
                <th scope="col" className="text-left p-3">Société</th>
                <th scope="col" className="text-left p-3">Div. TTM</th>
                <th scope="col" className="text-left p-3">Cours</th>
                <th scope="col" className="text-left p-3">Rendement</th>
                <th scope="col" className="text-left p-3">Fiche</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.r} className="border-t border-zinc-800">
                  <td className="p-3 text-zinc-300">{r.r}</td>
                  <td className="p-3 text-white">{r.t}</td>
                  <td className="p-3 text-zinc-200">{r.n}</td>
                  <td className="p-3 text-zinc-300">{r.d}</td>
                  <td className="p-3 text-zinc-300">{r.c} MAD</td>
                  <td className="p-3 text-teal-400 font-medium">{r.d}</td>
                  <td className="p-3"><button onClick={() => window.location.hash = `#/company/${r.t}`} className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400">Ouvrir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <p className="text-zinc-300 text-sm">⚡ Rendement TTM = dividende versé sur 12 mois / cours actuel.</p>
        </div>
      </main>
    </>
  );
}
