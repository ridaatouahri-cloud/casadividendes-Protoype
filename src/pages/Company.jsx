// src/pages/Company.jsx — CasaDividendes (Robuste + Premium aligned)
// Dépendances: Tailwind + index.css premium, react-router-dom, recharts, lucide-react
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  LineChart as RLineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft, Info, RotateCcw, TrendingUp,
  ExternalLink, Calendar, Percent, Hash, Award, Play,
} from "lucide-react";

/* ============ Helpers ============ */
const DAY_MS = 86400000;
const DATA_DIVIDENDS_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

const norm = (s) => (s || "").toString().toLowerCase().trim();
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

const fmtDateISO = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toISOString().split("T")[0];
};
const ratio = (b, a) => (a ? (b - a) / a : null);

function useCompanyFromRoute() {
  const params = useParams();
  const location = useLocation();
  const usp = new URLSearchParams(location.search || "");
  return {
    ticker: (params?.ticker || usp.get("ticker") || "").toUpperCase(),
    company: usp.get("company") || location?.state?.company || "",
  };
}

/* ============ Data Hooks (avec chemins ABSOLUS) ============ */
function useDividendsData(ticker, companyName) {
  const [state, setState] = useState({
    loading: true, error: null, rows: [],
    yearly: [], last5: [], latestEx: null, latestPay: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const results = await Promise.all(
          DATA_DIVIDENDS_YEARS.map(async (y) => {
            try {
              const res = await fetch(`/data/dividends/${y}.json`);
              if (!res.ok) {
                // 2025 peut ne pas exister -> ignorer
                if (y === 2025 && res.status === 404) return [];
                throw new Error(`HTTP ${res.status}`);
              }
              const arr = await res.json();
              return Array.isArray(arr) ? arr.map((r) => ({ year: y, ...r })) : [];
            } catch (e) {
              if (y === 2025) return [];
              throw e;
            }
          })
        );
        const flat = results.flat();

        let filtered = flat;
        const t = norm(ticker);
        const c = norm(companyName);
        if (t) filtered = flat.filter((r) => norm(r.ticker) === t);
        else if (c) filtered = flat.filter((r) => norm(r.company) === c);

        const rows = filtered.map((r) => ({
          year: Number(r.year),
          exDate: r.exDate || r.exdate || r.detachmentDate || null,
          paymentDate: r.paymentDate || r.pay || r.payment || null,
          amount: Number(r.dividend ?? r.amount ?? 0),
          company: r.company || "",
          ticker: r.ticker || "",
        }));

        rows.sort((a, b) => (a.year !== b.year ? a.year - b.year :
          (new Date(a.exDate || 0) - new Date(b.exDate || 0))));

        // yearly totals 2020-2025
        const agg = new Map();
        rows.forEach((r) => agg.set(r.year, (agg.get(r.year) || 0) + (isFinite(r.amount) ? r.amount : 0)));
        const yearly = [];
        for (let y = 2020; y <= 2025; y++) {
          const v = agg.has(y) ? Number(agg.get(y).toFixed(2)) : null;
          yearly.push({ year: y, total: v });
        }

        const byYear = new Map();
        rows.forEach((r) => byYear.set(r.year, r));
        const years = Array.from(byYear.keys()).sort((a, b) => a - b);
        const last5 = years.slice(-5).map((y) => ({ year: y, exDate: byYear.get(y)?.exDate || null, pay: byYear.get(y)?.paymentDate || null }));
        const latest = years.length ? byYear.get(years[years.length - 1]) : null;

        if (!cancelled) {
          setState({
            loading: false, error: null, rows,
            yearly, last5,
            latestEx: latest?.exDate || null,
            latestPay: latest?.paymentDate || null,
          });
        }
      } catch (err) {
        if (!cancelled) setState({ loading: false, error: err?.message || "Erreur de chargement", rows: [], yearly: [], last5: [], latestEx: null, latestPay: null });
      }
    })();
    return () => { cancelled = true; };
  }, [ticker, companyName]);

  return state;
}

function useCompanyMeta(tickerMaybe, fallbackCompany) {
  const [meta, setMeta] = useState({
    loading: true, error: null,
    data: { ticker: tickerMaybe || null, name: fallbackCompany || null, sector: null, isin: null, frequency: "Annuel" },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setMeta((m) => ({ ...m, loading: true, error: null }));
      try {
        const res = await fetch(`/data/listing/companies.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = await res.json();
        const list = Array.isArray(arr) ? arr : [];

        const t = norm(tickerMaybe);
        const c = norm(fallbackCompany);
        let match = null;
        if (t) match = list.find((x) => norm(x.ticker) === t) || null;
        if (!match && c) match = list.find((x) => norm(x.name) === c) || null;

        const data = {
          ticker: match?.ticker || tickerMaybe || null,
          name: match?.name || fallbackCompany || null,
          sector: match?.sector || null,
          isin: match?.isin || null,
          frequency: "Annuel",
        };
        if (!cancelled) setMeta({ loading: false, error: null, data });
      } catch (e) {
        if (!cancelled) setMeta({ loading: false, error: e?.message || "Erreur meta", data: { ticker: tickerMaybe || null, name: fallbackCompany || null, sector: null, isin: null, frequency: "Annuel" } });
      }
    })();
    return () => { cancelled = true; };
  }, [tickerMaybe, fallbackCompany]);

  return meta;
}

/* ============ KPIs ============ */
function computeKpis(rows) {
  // agrège par année
  const byYear = rows.reduce((acc, r) => {
    acc[r.year] = (acc[r.year] || 0) + (isFinite(r.amount) ? r.amount : 0);
    return acc;
  }, {});
  const years = [2020, 2021, 2022, 2023, 2024];
  const series = years.map((y) => byYear[y] || 0).filter((v) => v > 0);

  // C-DRS (régularité/croissance/stabilité/magnitude) — borné
  let regularite = clamp((Object.keys(byYear).length / 5) * 25, 0, 25);
  // croissance pondérée
  const w = { 2021: 2, 2022: 3, 2023: 4, 2024: 5 };
  const g = [
    { y: 2021, v: ratio(byYear[2021], byYear[2020]) || 0 },
    { y: 2022, v: ratio(byYear[2022], byYear[2021]) || 0 },
    { y: 2023, v: ratio(byYear[2023], byYear[2022]) || 0 },
    { y: 2024, v: ratio(byYear[2024], byYear[2023]) || 0 },
  ];
  const num = g.reduce((s, x) => s + x.v * (w[x.y] || 0), 0);
  const den = Object.values(w).reduce((a, b) => a + b, 0);
  const growW = den ? num / den : 0;
  let croissance = clamp((growW * 100) / 10 * 20, 0, 20); // échelle simple

  let stabilite = 0;
  if (series.length >= 2) {
    const mean = series.reduce((a, b) => a + b, 0) / series.length;
    const sd = Math.sqrt(series.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / series.length);
    const cv = mean > 0 ? (sd / mean) * 100 : 100;
    stabilite = clamp(25 - cv / 2, 0, 25);
  }
  let magnitude = 0;
  const d0 = byYear[2020] || 0;
  const d4 = byYear[2024] || 0;
  if (d0 > 0 && d4 > 0) {
    const tcam = Math.pow(d4 / d0, 1 / 4) - 1;
    magnitude = clamp(((tcam * 100) / 10) * 15, 0, 15);
  } else if (d0 === 0 && d4 > 0) {
    magnitude = 7;
  }

  const CDRS_total = Math.round(regularite + croissance + stabilite + magnitude);

  // PRT approx (moyenne jours entre exDate & payment sur 3 dernières occurrences)
  const last3 = [...rows].reverse().slice(0, 3);
  const prtDays = last3.map((d) => {
    const a = d.exDate ? new Date(d.exDate) : null;
    const b = d.paymentDate ? new Date(d.paymentDate) : null;
    return a && b ? Math.max(1, Math.round((b - a) / DAY_MS)) : 21;
  });
  const prtAvg = prtDays.length ? Math.round(prtDays.reduce((s, x) => s + x, 0) / prtDays.length) : 21;
  const prtScore = clamp(Math.round(100 - 1.5 * prtAvg), 0, 100);

  // NDF (montant probable simple + confiance basée sur régularité/stabilité/croissance)
  const valid = rows.map((r) => r.amount).filter((x) => isFinite(x) && x > 0);
  const mean = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
  const sd = valid.length ? Math.sqrt(valid.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / valid.length) : 0;
  const vol = Math.min(0.15, mean > 0 ? sd / mean : 0);

  const probable = Number((byYear[2024] || mean).toFixed(2));
  const ndf = {
    probable,
    min: Number((probable * (1 - vol)).toFixed(2)),
    max: Number((probable * (1 + vol)).toFixed(2)),
    exDate: "mi-juin", // signal simple (ex: pattern historique)
    confidence: clamp(Math.round(regularite + stabilite + (croissance / 20) * 10), 0, 100),
  };

  return {
    cdrsDetail: {
      regularite: Math.round(regularite),
      croissance: Math.round(croissance),
      stabilite: Math.round(stabilite),
      magnitude: Math.round(magnitude),
    },
    CDRS_total, prtAvg, prtScore, ndf,
  };
}

/* ============ UI ============ */
export default function Company() {
  const { ticker: routeTicker, company: routeCompany } = useCompanyFromRoute();
  const meta = useCompanyMeta(routeTicker, routeCompany);
  const data = useDividendsData(routeTicker, routeCompany);

  const yearly = useMemo(() => data.yearly, [data.yearly]);
  const cagr = useMemo(() => {
    const valid = yearly.filter((y) => y.total && y.total > 0);
    if (valid.length < 2) return null;
    const first = valid[0], last = valid[valid.length - 1];
    if (!first?.total || !last?.total) return null;
    const n = valid.length - 1;
    return Number(((Math.pow(last.total / first.total, 1 / n) - 1) * 100).toFixed(1));
  }, [yearly]);

  const kpis = useMemo(() => computeKpis(data.rows), [data.rows]);
  const [profile, setProfile] = useState("equilibre");
  const weights = { passif: { a: 0.6, b: 0.0, c: 0.4 }, equilibre: { a: 0.4, b: 0.3, c: 0.3 }, actif: { a: 0.2, b: 0.5, c: 0.3 } }[profile];
  const cdScore = Math.round((kpis.CDRS_total || 0) * weights.a + (kpis.prtScore || 0) * weights.b + (kpis.ndf?.confidence || 0) * weights.c);

  const company = {
    ticker: meta.data.ticker || routeTicker || "—",
    name: meta.data.name || routeCompany || "—",
    sector: meta.data.sector || "—",
    isin: meta.data.isin || "—",
    currency: "MAD",
    frequency: meta.data.frequency || "Annuel",
    logo: `https://via.placeholder.com/48/14b8a6/ffffff?text=${(meta.data.ticker || "CD").slice(0,3)}`,
  };

  const reliabilityBadge = (kpis.CDRS_total ?? 0) >= 80 ? "Excellente" : (kpis.CDRS_total ?? 0) >= 65 ? "Solide" : "À surveiller";
  const reliabilityColor = (kpis.CDRS_total ?? 0) >= 80 ? "text-emerald-400" : (kpis.CDRS_total ?? 0) >= 65 ? "text-brand-teal" : "text-amber-300";

  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-amber-400/30 selection:text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="card-premium overflow-hidden">
          <header className="flex items-center gap-3 p-4 md:p-6 border-b border-white/10">
            <button className="btn-ghost" onClick={() => window.history.back()} aria-label="Retour">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <img src={company.logo} alt="" className="w-10 h-10 rounded-lg border border-white/10 bg-black/40 object-contain" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight">{company.name}</h1>
              <div className="text-xs text-zinc-400">{company.ticker} • {company.sector}</div>
            </div>
            <button onClick={() => window.location.reload()} className="btn-ghost text-brand-amber border-brand-amber/40 hover:bg-brand-amber/10" title="Rafraîchir">
              <RotateCcw className="w-4 h-4" />
            </button>
          </header>

          <div className="flex flex-col md:flex-row">
            {/* ASIDE */}
            <aside className="md:w-60 shrink-0 border-r border-white/10 p-4 space-y-4 bg-white/[0.02]">
              <MiniGauge value={cdScore} />
              <div className="text-xs text-zinc-400">CD-Score™</div>

              {/* Profil */}
              <div className="space-y-2">
                <div className="text-xs text-zinc-500">Profil investisseur :</div>
                <div className="flex gap-2 flex-wrap">
                  {["passif", "equilibre", "actif"].map((id) => (
                    <button
                      key={id}
                      onClick={() => setProfile(id)}
                      className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${profile === id ? "bg-brand-teal/10 border-brand-teal text-brand-teal" : "btn-ghost"}`}
                    >
                      {id === "equilibre" ? "Équilibré" : id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Infos */}
              <div className="space-y-2 text-xs">
                <InfoRow icon={<Hash className="w-3.5 h-3.5" />} label="Ticker" value={company.ticker} />
                <InfoRow icon={<Award className="w-3.5 h-3.5" />} label="Secteur" value={company.sector} />
                <InfoRow icon={<Hash className="w-3.5 h-3.5" />} label="ISIN" value={company.isin} />
                <div className="divider-soft my-3" />
                <InfoRow icon={<Percent className="w-3.5 h-3.5" />} label="CAGR 5Y" value={cagr != null ? `${cagr}%` : "—"} />
                <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Fréquence" value={company.frequency} />
                <div className="divider-soft my-3" />
                <InfoRow label="Dernière ex-date" value={fmtDateISO(data.latestEx)} />
                <InfoRow label="Dernier paiement" value={fmtDateISO(data.latestPay)} />
                <div className="divider-soft my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Fiabilité</span>
                  <span className={`font-medium ${reliabilityColor}`}>{reliabilityBadge}</span>
                </div>
              </div>

              {/* Liens */}
              <div className="space-y-2 pt-2">
                <QuickLink icon={<ExternalLink className="w-3 h-3" />} label="Fiche BVC" />
                <QuickLink icon={<Calendar className="w-3 h-3" />} label="Calendrier" onClick={() => (window.location.hash = "#/calendar")} />
                <QuickLink icon={<TrendingUp className="w-3 h-3" />} label="DRIP" />
              </div>

              {(meta.error || data.error) && (
                <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
                  {(meta.error || data.error)}
                </div>
              )}
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-4 md:p-6 space-y-4">
              {/* KPIs */}
              <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CDRSCard detail={kpis.cdrsDetail} total={kpis.CDRS_total} />
                <PRTCard prtAvg={kpis.prtAvg} prtScore={kpis.prtScore} />
                <NDFCard ndf={kpis.ndf} />
              </section>

              {/* Chart + Détails */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="card-premium p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Historique des dividendes</h3>
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> CAGR:&nbsp;
                      <span className="text-zinc-200">{cagr != null ? `${cagr}%` : "—"}</span>
                    </div>
                  </div>
                  <div className="h-52">
                    {yearly && yearly.some((p) => p.total != null) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RLineChart data={yearly}>
                          <XAxis dataKey="year" stroke="#71717a" tick={{ fontSize: 11 }} />
                          <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                          <RTooltip contentStyle={{ background: "#0B0B0D", border: "1px solid rgba(255,255,255,0.08)", color: "#e4e4e7", fontSize: 12, borderRadius: 8 }} />
                          <Line type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                        </RLineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full grid place-items-center text-zinc-500 text-sm">Aucune donnée disponible</div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">Somme annuelle (2020–2025) en MAD</div>
                </div>

                <div className="card-premium p-4">
                  <h3 className="text-sm font-semibold mb-3">Détails paiements (5 dernières années)</h3>
                  <DatesTimeline items={data.last5} />
                </div>
              </div>

              {/* CTA Premium */}
              <div className="card-premium p-5 bg-gradient-to-r from-ink-950 via-ink-900 to-ink-950 flex flex-col md:flex-row items-center justify-between gap-3">
                <p className="text-white font-semibold">
                  Débloquez les alertes automatiques J-3, les exports et les vues avancées.
                </p>
                <button className="btn-primary" onClick={() => (window.location.hash = "#/premium")}>
                  Essayer Premium
                </button>
              </div>
            </main>
          </div>

          <footer className="text-xs text-zinc-500 px-4 md:px-6 py-4 border-t border-white/10">
            Données CasaDividendes — à titre informatif. © {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </div>
  );
}

/* ============ Petits composants ============ */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      {icon && <span className="text-zinc-600">{icon}</span>}
      <span className="text-zinc-500 flex-1">{label}</span>
      <span className="text-zinc-200 font-medium text-right">{value}</span>
    </div>
  );
}
function QuickLink({ icon, label, onClick }) {
  return (
    <button className="w-full btn-ghost flex items-center gap-2 text-xs" onClick={onClick}>
      {icon}<span>{label}</span>
    </button>
  );
}
function MiniGauge({ value = 0 }) {
  const v = clamp(Number(value) || 0, 0, 100);
  const size = 70, stroke = 6, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const off = c * (1 - v / 100);
  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke="#14b8a6" strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold text-lg">
          {v}
        </text>
      </svg>
    </div>
  );
}
function DatesTimeline({ items = [] }) {
  return (
    <div className="space-y-2.5">
      <div>
        <div className="text-[10px] text-zinc-500 mb-1">Ex-dates</div>
        <div className="flex gap-1.5">
          {items.map((it, i) => (
            <div key={`ex-${i}`} className="flex-1" title={`${it.year} — ${fmtDateISO(it.exDate)}`}>
              <div className="rounded-md border border-white/10 bg-white/[0.02] p-1.5 text-center hover:border-brand-teal/40 transition-all">
                <div className="text-[10px] font-semibold text-zinc-200">{it.year}</div>
                <div className="text-[9px] text-zinc-400 mt-0.5">
                  {it.exDate ? new Date(it.exDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] text-zinc-500 mb-1">Paiements</div>
        <div className="flex gap-1.5">
          {items.map((it, i) => (
            <div key={`pay-${i}`} className="flex-1" title={`${it.year} — ${fmtDateISO(it.pay)}`}>
              <div className="rounded-md border border-white/10 bg-white/[0.02] p-1.5 text-center hover:border-brand-amber/40 transition-all">
                <div className="text-[10px] font-semibold text-zinc-200">{it.year}</div>
                <div className="text-[9px] text-zinc-400 mt-0.5">
                  {it.pay ? new Date(it.pay).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function CDRSCard({ detail = { regularite:0, croissance:0, stabilite:0, magnitude:0 }, total = 0 }) {
  const steps = [
    { label: "Régularité", v: detail.regularite, color: "#22d3ee" },
    { label: "Croissance", v: detail.croissance, color: "#14b8a6" },
    { label: "Stabilité",  v: detail.stabilite,  color: "#f59e0b" },
    { label: "Magnitude",  v: detail.magnitude,  color: "#eab308" },
  ];
  const size = 90, stroke = 7, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const pct = clamp(total, 0, 100);
  const off = c * (1 - pct / 100);

  return (
    <div className="card-premium p-3">
      <div className="mb-2">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Casa-Dividend Reliability Score</div>
        <div className="text-xs text-zinc-400">C-DRS™</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <svg width={size} height={size}>
            <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
            <circle cx={size/2} cy={size/2} r={r} stroke="#eab308" strokeWidth={stroke} fill="none"
              strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold text-base">
              {pct}
            </text>
          </svg>
        </div>

        <div className="flex-1 space-y-1.5">
          {steps.map(({ label, v, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-zinc-400 text-[9px] w-16 shrink-0">{label}</span>
              <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-1 rounded-full" style={{ width: `${clamp(v,0,25) / 25 * 100}%`, background: color }} />
              </div>
              <span className="w-6 text-right text-zinc-300 text-[9px] shrink-0">{clamp(v,0,25)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function PRTCard({ prtAvg = 0, prtScore = 0 }) {
  const barColor =
    prtScore >= 78 ? "bg-emerald-500/60" :
    prtScore >= 55 ? "bg-sky-500/60" :
    prtScore >= 33 ? "bg-amber-500/60" :
    prtScore >= 10 ? "bg-orange-500/60" : "bg-red-500/60";
  return (
    <div className="card-premium p-3">
      <div className="mb-2">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Price Recovery Time</div>
        <div className="text-xs text-zinc-400">PRT™</div>
      </div>

      <div>
        <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div className={`h-2.5 ${barColor}`} style={{ width: `${clamp(prtScore,0,100)}%` }} />
        </div>
        <div className="mt-1.5 text-xs text-zinc-400 flex items-center justify-between">
          <span>Score PRT</span>
          <span className="text-zinc-200">{clamp(prtScore,0,100)}/100</span>
        </div>
      </div>

      <div className="mt-3 text-xs text-zinc-400">
        Recovery moyen observé : <span className="text-zinc-200">{prtAvg}</span> jours
      </div>
    </div>
  );
}
function NDFCard({ ndf = { probable:0, min:0, max:0, exDate:"—", confidence:0 } }) {
  return (
    <div className="card-premium p-3">
      <div className="mb-2">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Next Dividend Forecast</div>
        <div className="text-xs text-zinc-400">NDF™</div>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <div className="text-zinc-500 text-[10px] mb-1">Montant probable</div>
          <div className="font-medium text-zinc-200">{ndf.probable?.toFixed ? `${ndf.probable.toFixed(2)} MAD` : "—"}</div>
        </div>
        <div>
          <div className="text-zinc-500 text-[10px] mb-1">Fourchette</div>
          <div className="font-medium text-zinc-200">
            {ndf.min?.toFixed ? `${ndf.min.toFixed(2)}—${ndf.max.toFixed(2)}` : "—"}
          </div>
        </div>
        <div>
          <div className="text-zinc-500 text-[10px] mb-1">Ex-date estimée</div>
          <div className="font-medium text-zinc-200">{ndf.exDate || "—"}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-1.5 bg-teal-500/70 rounded-full" style={{ width: `${clamp(ndf.confidence || 0, 0, 100)}%` }} />
        </div>
        <div className="mt-1 text-xs text-zinc-400 flex items-center justify-between">
          <span>Confiance</span>
          <span className="text-zinc-200">{clamp(ndf.confidence || 0, 0, 100)}/100</span>
        </div>
      </div>

      <div className="mt-3">
        <button className="btn-ghost text-brand-teal border-brand-teal/40 hover:bg-brand-teal/10 w-full text-xs" onClick={() => (window.location.hash = "#/calendar")}>
          <Play className="w-3.5 h-3.5" /> Voir dans calendrier
        </button>
      </div>
    </div>
  );
}
