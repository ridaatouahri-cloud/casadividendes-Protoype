// src/pages/Ranking.jsx — CasaDividendes (Premium aligned)
// Dépendances attendues : Tailwind + index.css premium, Helmet configuré, components/StatCard disponibles
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { StatCard, Pill } from "../components/StatCard";
import { getAllDividends } from "../services/dataService";
import { DATA_YEARS } from "../constants/paths";
import { ROUTES } from "../constants/routes";

export default function Rankings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("tous");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const years = year === "tous" ? DATA_YEARS : [Number(year)];
      const data = await getAllDividends(years);
      if (!alive) return;

      const aggregated = new Map();
      data.forEach((row) => {
        const key = row.ticker;
        if (!aggregated.has(key)) {
          aggregated.set(key, {
            ticker: row.ticker,
            company: row.company,
            year: row.year,
            amount: 0,
            dividendType: row.dividendType,
            currency: row.currency,
            exDate: row.exDate,
            paymentDate: row.paymentDate,
            count: 0,
          });
        }
        const agg = aggregated.get(key);
        agg.amount += row.amount || 0;
        agg.count += 1;
        if (!agg.exDate && row.exDate) agg.exDate = row.exDate;
        if (!agg.paymentDate && row.paymentDate) agg.paymentDate = row.paymentDate;
      });

      const sorted = Array.from(aggregated.values()).sort(
        (a, b) => (b.amount || 0) - (a.amount || 0)
      );

      setRows(sorted);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [year]);

  useEffect(() => {
    setPage(1);
  }, [rows]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const totalPages = Math.ceil(rows.length / pageSize);
  const visible = rows.slice(start, end);

  const totalAmount = rows.reduce((sum, r) => sum + (r.amount || 0), 0);
  const avgAmount = rows.length > 0 ? (totalAmount / rows.length).toFixed(2) : "0.00";
  const topCompany = rows.length > 0 ? rows[0]?.company || "—" : "—";

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
        <header className="mb-4">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-brand-orange to-brand-amber bg-clip-text text-transparent">
              Palmarès des dividendes
            </span>
          </h1>
          <p className="text-zinc-400 mt-2">
            Comparez les sociétés selon le montant total des dividendes versés.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap gap-2 text-sm items-center">
          <span className="text-zinc-400">Année:</span>
        <select
    value={year}
    onChange={(e) => setYear(e.target.value)}
    className="appearance-none bg-ink-900 text-white border border-white/20 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 cursor-pointer"
  >
    <option value="tous">Toutes</option>
    {DATA_YEARS.slice().reverse().map((y) => (
      <option key={y} value={String(y)}>{y}</option>
    ))}
  </select>

  {/* Flèche */}
  <svg
    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/70"
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
</div>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Dividende moyen" value={`${avgAmount} MAD`} />
          <StatCard title="Meilleure société" value={topCompany} />
          <StatCard title="Total sociétés" value={`${rows.length}`} />
        </section>

        {loading ? (
          <div className="mt-6 text-center text-zinc-400">Chargement...</div>
        ) : (
          <section className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-white/[0.04] text-zinc-300 sticky top-0 z-10 border-b-2 border-brand-teal/70">
                <tr>
                  <th scope="col" className="text-left p-3 font-semibold">
                    Rang
                  </th>
                  <th scope="col" className="text-left p-3 font-semibold">
                    Ticker
                  </th>
                  <th scope="col" className="text-left p-3 font-semibold">
                    Société
                  </th>
                  <th scope="col" className="text-right p-3 font-semibold">
                    Dividende
                  </th>
                  <th scope="col" className="text-left p-3 font-semibold">
                    Type
                  </th>
                  <th scope="col" className="text-left p-3 font-semibold">
                    Ex-Date
                  </th>
                  <th scope="col" className="text-left p-3 font-semibold">
                    Paiement
                  </th>
                  <th scope="col" className="text-left p-3 font-semibold">
                    Fiche
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-zinc-400">
                      Aucune donnée disponible
                    </td>
                  </tr>
                ) : (
                  visible.map((row, idx) => (
                    <tr
                      key={`${row.ticker}-${idx}`}
                      className="border-t border-white/10 hover:bg-white/[0.04] transition-all"
                      style={{
                        backgroundColor:
                          idx % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent",
                      }}
                    >
                      <td className="p-3 text-zinc-300">{start + idx + 1}</td>
                      <td className="p-3 text-white font-medium">{row.ticker}</td>
                      <td className="p-3 text-zinc-200">{row.company}</td>
                      <td className="p-3 text-brand-teal font-semibold text-right">
                        {typeof row.amount === "number"
                          ? `${row.amount.toFixed(2)} ${row.currency || "MAD"}`
                          : "—"}
                      </td>
                      <td className="p-3 text-zinc-300">{row.dividendType || "—"}</td>
                      <td className="p-3 text-zinc-300">
                        {row.exDate
                          ? new Date(row.exDate).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td className="p-3 text-zinc-300">
                        {row.paymentDate
                          ? new Date(row.paymentDate).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td className="p-3">
                        <a href={ROUTES.COMPANY(row.ticker)} className="btn-ghost">
                          Consulter
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        )}

        {!loading && rows.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-white/70">
            <div>
              Page {page} sur {totalPages || 1}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost disabled:opacity-40"
              >
                ← Précédent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="btn-primary disabled:opacity-40"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}

        <footer className="mt-6 card-premium p-5">
          <p className="text-zinc-300 text-sm">
            ⚡ <span className="font-medium">Dividende total</span> = somme des
            dividendes versés sur la période sélectionnée.
          </p>
        </footer>
      </main>
    </div>
  );
}
