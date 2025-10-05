import React from "react";
import { Helmet } from "react-helmet-async";
import { StatCard } from "../components/StatCard";
import { companiesData } from "../data/companies";

export default function Company({ ticker }) {
  const company = companiesData[ticker] || companiesData["IAM"];

  const history = [
    { ex: "12/06/2024", pay: "28/06/2024", amt: "4.010 MAD", type: "Ordinaire", src: "Communiqué" },
    { ex: "14/06/2023", pay: "30/06/2023", amt: "3.950 MAD", type: "Ordinaire", src: "Communiqué" },
    { ex: "15/06/2022", pay: "01/07/2022", amt: "3.860 MAD", type: "Ordinaire", src: "AG" },
  ];

  return (
    <>
      <Helmet>
        <title>{company.name} ({ticker}) - Dividendes - CasaDividendes</title>
        <meta name="description" content={`Historique des dividendes de ${company.name}. Ex-dates, montants, rendement et analyse complète sur CasaDividendes.`} />
      </Helmet>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-white text-2xl font-bold">{company.name} ({ticker})</h1>
            <p className="mt-1 text-zinc-400 text-sm">{company.sector} • {company.country} • <a className="underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded" href="#" aria-label={`Visiter le site web de ${company.name}`}>Site web</a></p>
          </div>
          <div className="w-14 h-14 rounded-full bg-teal-500/20 grid place-items-center" aria-hidden="true"><div className="w-5 h-5 border-2 border-teal-400 rotate-45"/></div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Rendement TTM" value={company.yieldTTM} />
          <StatCard title="Années sans baisse" value={company.streak} />
          <StatCard title="Prochain paiement" value={company.nextPay || "—"} />
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6" aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-zinc-300 text-sm mb-3">Historique des dividendes</h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-300">
                <tr>
                  <th scope="col" className="text-left p-3">Ex-date</th>
                  <th scope="col" className="text-left p-3">Paiement</th>
                  <th scope="col" className="text-left p-3">Montant</th>
                  <th scope="col" className="text-left p-3">Type</th>
                  <th scope="col" className="text-left p-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={`${h.ex}-${i}`} className="border-t border-zinc-800">
                    <td className="p-3 text-zinc-300">{h.ex}</td>
                    <td className="p-3 text-zinc-300">{h.pay}</td>
                    <td className="p-3 text-teal-400 font-medium">{h.amt}</td>
                    <td className="p-3 text-zinc-300">{h.type}</td>
                    <td className="p-3 text-zinc-400 underline">{h.src}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Activer alerte J-3</button>
            <button className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Ajouter à mon portefeuille</button>
            <button className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Exporter CSV/PDF</button>
          </div>

          <p className="mt-6 text-xs text-zinc-500">⚡ Ex-date : date à partir de laquelle l&apos;achat de l&apos;action ne donne plus droit au dividende.</p>
        </section>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-white font-semibold">Analyse Premium 🔒</h2>
              <p className="text-zinc-400 text-sm">Score sécurité, payout ratio, projections de revenus…</p>
            </div>
            <button onClick={() => window.location.hash = "#/premium"} className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 whitespace-nowrap">Essayer Premium</button>
          </div>
        </div>
      </main>
    </>
  );
}
