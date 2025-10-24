// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { TrendingUp, CalendarDays, PieChart as PieIcon, Factory } from "lucide-react";
import { getAllDividends, getCompanies } from "../services/dataService";
import { DATA_YEARS } from "../constants/paths";
import CompanyLogo from "../components/CompanyLogo";

/* ----------------- Helpers ----------------- */
const fmt = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(n)
    : "—";

const isExceptional = (type) => {
  const t = String(type || "").toLowerCase();
  return (
    t.includes("exception") ||
    t.includes("extra") ||
    t.includes("spécial") ||
    t.includes("special")
  );
};

const COLORS = ["#14B8A6", "#F59E0B", "#22C55E", "#A78BFA", "#38BDF8", "#F97316", "#E879F9", "#4ADE80", "#FCA5A5", "#67E8F9"];

/* ===================== Dashboard ===================== */
export default function Dashboard() {
  const [year, setYear] = useState("tous"); // "tous" ou 2020..2025
  const [sector, setSector] = useState("Tous"); // Filtre secteur
  const [rows, setRows] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  /* --- Load companies once --- */
  useEffect(() => {
    (async () => {
      try {
        const cs = await getCompanies();
        setCompanies(cs || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  /* --- Load dividends when year changes --- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const ys = year === "tous" ? DATA_YEARS : [Number(year)];
        const data = await getAllDividends(ys);
        setRows(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [year]);

  /* --- Maps & filters --- */
  const sectorByTicker = useMemo(() => {
    const m = new Map();
    (companies || []).forEach((c) =>
      m.set((c.ticker || "").toUpperCase(), c.sector || "Autres")
    );
    return m;
  }, [companies]);

  const sectors = useMemo(() => {
    const s = new Set();
    companies.forEach((c) => c.sector && s.add(c.sector));
    return ["Tous", ...Array.from(s).sort((a, b) => a.localeCompare(b, "fr"))];
  }, [companies]);

  const rowsFiltered = useMemo(() => {
    if (sector === "Tous") return rows;
    return rows.filter(
      (r) =>
        (sectorByTicker.get((r.ticker || "").toUpperCase()) || "Autres") === sector
    );
  }, [rows, sector, sectorByTicker]);

  /* --- KPIs --- */
  const kpis = useMemo(() => {
    let total = 0;
    let exc = 0;
    const payers = new Set();
    const soon = [];
    const now = new Date();
    const in60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    for (const r of rowsFiltered) {
      const amt = typeof r.amount === "number" && r.amount > 0 ? r.amount : 0;
      if (amt) {
        total += amt;
        payers.add((r.ticker || "").toUpperCase());
        if (isExceptional(r.dividendType)) exc += amt;
      }
      if (r.exDate) {
        const d = new Date(r.exDate);
        if (d >= now && d <= in60) soon.push(r);
      }
    }
    return {
      totalDividends: total,
      payersCount: payers.size,
      exceptionalShare: total > 0 ? exc / total : 0,
      upcomingExDates: soon.length,
    };
  }, [rowsFiltered]);

  /* --- Monthly series (line) --- */
  const monthlySeries = useMemo(() => {
    // Toujours 12 mois; si year === "tous" => on agrège toutes années par mois
    const buckets = Array.from({ length: 12 }, (_, i) => ({ month: i, value: 0 }));
    for (const r of rowsFiltered) {
      if (!r.exDate) continue;
      const d = new Date(r.exDate);
      const amt = typeof r.amount === "number" ? r.amount : 0;
      buckets[d.getMonth()].value += amt;
    }
    return buckets.map((b) => ({
      monthLabel: new Date(2000, b.month, 1).toLocaleDateString("fr-FR", {
        month: "short",
      }),
      value: Number(b.value.toFixed(2)),
    }));
  }, [rowsFiltered]);

  /* --- Sector pie --- */
  const sectorPie = useMemo(() => {
    const map = new Map();
    let total = 0;
    for (const r of rowsFiltered) {
      const amt = typeof r.amount === "number" && r.amount > 0 ? r.amount : 0;
      if (!amt) continue;
      const s = sectorByTicker.get((r.ticker || "").toUpperCase()) || "Autres";
      map.set(s, (map.get(s) || 0) + amt);
      total += amt;
    }
    const arr = Array.from(map.entries()).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
      percent: total > 0 ? value / total : 0,
    }));
    // Trier desc
    arr.sort((a, b) => b.value - a.value);
    return arr;
  }, [rowsFiltered, sectorByTicker]);

  /* --- Top 10 payeurs (table) --- */
  const top10 = useMemo(() => {
    const map = new Map();
    for (const r of rowsFiltered) {
      const key = (r.ticker || "").toUpperCase();
      const amt = typeof r.amount === "number" && r.amount > 0 ? r.amount : 0;
      if (!key || !amt) continue;
      const prev = map.get(key) || { ticker: key, company: r.company || key, total: 0, count: 0, next: null };
      prev.total += amt;
      prev.count += 1;
      // prochaine ex-date
      if (r.exDate) {
        const d = new Date(r.exDate);
        if (!prev.next || d < prev.next) prev.next = d;
      }
      map.set(key, prev);
    }
    return Array.from(map.values())
      .sort((a, b) => (b.total || 0) - (a.total || 0))
      .slice(0, 10);
  }, [rowsFiltered]);

  /* --- Ex-dates à venir (J+60) --- */
  const upcoming = useMemo(() => {
    const now = new Date();
    const in60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    return rowsFiltered
      .filter((r) => r.exDate && new Date(r.exDate) >= now && new Date(r.exDate) <= in60)
      .sort((a, b) => new Date(a.exDate) - new Date(b.exDate))
      .slice(0, 10);
  }, [rowsFiltered]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-ink-950 text-white">
        <div className="text-white/60">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      {/* Header de page */}
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard marché</h1>
            <p className="text-white/50 mt-1">Vue d’ensemble des dividendes — BVC</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Année */}
            <label className="text-xs text-white/50">Année</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="appearance-none bg-ink-900 border border-white/10 text-white/90 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
            >
              <option value="tous">Toutes</option>
              {[...DATA_YEARS].sort((a,b)=>b-a).map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>

            {/* Secteur */}
            <label className="text-xs text-white/50 ml-2">Secteur</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="appearance-none bg-ink-900 border border-white/10 text-white/90 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Total dividendes */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Dividendes totaux</span>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <TrendingUp size={18} className="text-black" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold">{fmt(kpis.totalDividends)} MAD</div>
            <div className="text-xs text-white/40 mt-1">Période : {year === "tous" ? "toutes années" : year}</div>
          </div>

          {/* Sociétés payeuses */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Sociétés payeuses</span>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center">
                <Factory size={18} className="text-black" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold">{kpis.payersCount}</div>
            <div className="text-xs text-white/40 mt-1">≥ 1 versement sur la période</div>
          </div>

          {/* Part exceptionnels */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Part “Exceptionnels”</span>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-400 to-purple-400 flex items-center justify-center">
                <PieIcon size={18} className="text-black" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold">
              {(kpis.exceptionalShare * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-white/40 mt-1">du total des dividendes</div>
          </div>

          {/* Ex-dates J+60 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Ex-dates à venir (J+60)</span>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center">
                <CalendarDays size={18} className="text-black" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold">{kpis.upcomingExDates}</div>
            <div className="text-xs text-white/40 mt-1">sur les 60 prochains jours</div>
          </div>
        </div>
      </div>

      {/* Charts + Lists */}
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 pb-12 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Ligne mensuelle (xl: 2 colonnes) */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Dividendes mensuels</h3>
            <span className="text-xs text-white/50">
              {year === "tous" ? "Toutes années (agrégées par mois)" : `Année ${year}`}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySeries}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="monthLabel" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,17,21,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
                formatter={(v) => [`${fmt(v)} MAD`, "Dividendes"]}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="url(#lineGrad)" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie secteurs */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Répartition sectorielle</h3>
            <span className="text-xs text-white/50">{sector === "Tous" ? "Tous secteurs" : sector}</span>
          </div>
          {sectorPie.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sectorPie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {sectorPie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,17,21,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                  formatter={(v, n, p) => [`${fmt(v)} MAD (${Math.round(p.payload.percent * 100)}%)`, p.payload.name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-white/50 text-sm">Aucune donnée</div>
          )}
        </div>

        {/* Top 10 payeurs (xl: 2 colonnes) */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-lg font-semibold mb-4">Top 10 payeurs (période)</h3>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-white/60">
                  <th className="py-2">Société</th>
                  <th className="py-2">Montant total</th>
                  <th className="py-2"># versements</th>
                  <th className="py-2">Prochaine ex-date</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {top10.map((r, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <CompanyLogo ticker={r.ticker} name={r.company} size="sm" />
                        <div>
                          <div className="font-semibold">{r.ticker}</div>
                          <div className="text-xs text-white/60">{r.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-semibold">{fmt(r.total)} MAD</td>
                    <td className="py-3">{r.count}</td>
                    <td className="py-3">
                      {r.next ? r.next.toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="py-3">
                      <a
                        href={`#/company/${r.ticker}`}
                        className="btn-ghost px-3 py-1 text-sm"
                      >
                        Ouvrir
                      </a>
                    </td>
                  </tr>
                ))}
                {!top10.length && (
                  <tr>
                    <td className="py-3 text-white/60 text-sm" colSpan={5}>
                      Aucune donnée pour cette période.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* À venir (J+60) */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-lg font-semibold mb-4">À venir (J+60)</h3>
          <div className="space-y-3">
            {upcoming.map((r, i) => (
              <a
                key={`${r.ticker}-${i}`}
                href={`#/company/${r.ticker}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition"
              >
                <CompanyLogo ticker={r.ticker} name={r.company} size="sm" />
                <div className="flex-1">
                  <div className="font-semibold">{r.ticker}</div>
                  <div className="text-xs text-white/60">{r.company}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{r.exDate ? new Date(r.exDate).toLocaleDateString("fr-FR") : "—"}</div>
                  <div className="text-xs text-white/50">{r.dividendType || "—"}</div>
                </div>
              </a>
            ))}
            {!upcoming.length && (
              <div className="text-white/60 text-sm">Aucune ex-date sur les 60 prochains jours.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
