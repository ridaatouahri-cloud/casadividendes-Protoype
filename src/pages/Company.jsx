// src/pages/Company.jsx — CasaDividendes (Premium aligned)
// Dépendances: Tailwind + index.css premium (tokens + utilities), framer-motion, react-router-dom, recharts
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart as RLineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft, Info, Play, RotateCcw, TrendingUp,
  ExternalLink, Calendar, Percent, Hash, Award,
} from "lucide-react";

/* =========================
 * Constantes & helpers
 * ========================= */
const DAY_MS = 86400000;
const BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) || "";

function toDayOfYear(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return null;
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / DAY_MS);
}
function dayOfYearToDate(day, year = new Date().getFullYear()) {
  const d = new Date(year, 0);
  d.setDate(day);
  return d;
}
function dayToRoughDate(n, refYear = 2024) {
  if (n == null) return "—";
  const d = dayOfYearToDate(n, refYear);
  const m = d.toLocaleString("fr-FR", { month: "long" });
  const dd = d.getDate();
  const pos = dd <= 10 ? "début" : dd <= 20 ? "mi" : "fin";
  return `${pos} ${m}`;
}
function ratio(b, a) {
  if (a == null || a <= 0 || b == null) return null;
  return (b - a) / a;
}
function norm(s) {
  return (s || "").toString().toLowerCase().trim();
}
function fmtDateISO(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toISOString().split("T")[0];
}

/* =========================
 * Hooks DATA
 * ========================= */
function useCompanyFromRoute() {
  const params = useParams();
  const location = useLocation();
  const usp = new URLSearchParams(location.search || "");
  const routeTicker = params?.ticker || usp.get("ticker") || "";
  const stateCompany = location?.state?.company || usp.get("company") || "";

  return {
    ticker: routeTicker ? routeTicker.toUpperCase() : "",
    company: stateCompany || "",
  };
}

function useDividendsData(targetTicker, fallbackCompanyExact) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    raw: [],
    yearlySeries2020to2025: [],
    last5YearsDates: [],
    latestExDate: null,
    latestPaymentDate: null,
  });

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      const years = [2020, 2021, 2022, 2023, 2024, 2025];

      try {
        const results = await Promise.all(
          years.map(async (y) => {
            const url = `${BASE}data/dividends/${y}.json`;
            try {
              const res = await fetch(url, { signal: ac.signal });
              if (!res.ok) {
                if (y === 2025 && res.status === 404) return [];
                throw new Error(`HTTP ${res.status} @ ${url}`);
              }
              const arr = await res.json();
              const normArr = (Array.isArray(arr) ? arr : []).map((r) => ({ year: r.year ?? y, ...r }));
              return normArr;
            } catch (e) {
              if (y === 2025) return [];
              throw e;
            }
          })
        );

        const flat = results.flat();
        let filtered = flat;
        const tgtTicker = norm(targetTicker);
        const tgtCompany = norm(fallbackCompanyExact);

        if (tgtTicker) {
          filtered = flat.filter((r) => norm(r.ticker) === tgtTicker);
        } else if (tgtCompany) {
          filtered = flat.filter((r) => norm(r.company) === tgtCompany);
        }

        const mapped = filtered.map((r) => ({
          year: Number(r.year),
          exDate: r.exDate || r.exdate || r.detachmentDate || null,
          paymentDate: r.paymentDate || r.pay || r.payment || null,
          amount: Number(r.dividend ?? r.amount ?? 0),
          _company: r.company || null,
          _ticker: r.ticker || null,
        }));

        mapped.sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          const ad = a.exDate ? new Date(a.exDate).getTime() : 0;
          const bd = b.exDate ? new Date(b.exDate).getTime() : 0;
          return ad - bd;
        });

        const totalsByYear = new Map();
        for (const d of mapped) {
          const k = Number(d.year);
          if (!totalsByYear.has(k)) totalsByYear.set(k, 0);
          totalsByYear.set(k, totalsByYear.get(k) + (isFinite(d.amount) ? d.amount : 0));
        }
        const yearlySeries2020to2025 = [];
        for (let y = 2020; y <= 2025; y++) {
          const val = totalsByYear.has(y) ? Number(totalsByYear.get(y).toFixed(2)) : null;
          yearlySeries2020to2025.push({ year: y, total: val });
        }

        const byYearMap = new Map();
        for (const d of mapped) byYearMap.set(d.year, d);
        const yearsAvailable = Array.from(byYearMap.keys()).sort((a, b) => a - b);
        const last5Years = yearsAvailable.slice(-5);
        const last5YearsDates = last5Years.map((y) => {
          const d = byYearMap.get(y);
          return { year: y, exDate: d?.exDate || null, pay: d?.paymentDate || null };
        });

        const latestYear = yearsAvailable.length ? yearsAvailable[yearsAvailable.length - 1] : null;
        const latestExDate = latestYear ? byYearMap.get(latestYear)?.exDate || null : null;
        const latestPaymentDate = latestYear ? byYearMap.get(latestYear)?.paymentDate || null : null;

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            raw: mapped,
            yearlySeries2020to2025,
            last5YearsDates,
            latestExDate,
            latestPaymentDate,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: err?.message || "Erreur de chargement" }));
        }
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [targetTicker, fallbackCompanyExact]);

  return state;
}

function useCompanyMeta(tickerMaybe, fallbackCompany) {
  const [meta, setMeta] = useState({
    loading: true,
    error: null,
    data: {
      ticker: tickerMaybe || null,
      isin: null,
      name: fallbackCompany || null,
      sector: null,
      compartment: null,
      shares_outstanding: null,
    },
  });

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    (async () => {
      setMeta((m) => ({ ...m, loading: true, error: null }));
      try {
        const url = `${BASE}data/listing/companies.json`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
        const arr = await res.json();
        const list = Array.isArray(arr) ? arr : [];

        const tnorm = norm(tickerMaybe);
        const cnorm = norm(fallbackCompany);

        let match = null;
        if (tnorm) match = list.find((x) => norm(x.ticker) === tnorm) || null;
        if (!match && cnorm) {
          match =
            list.find((x) => norm(x.name) === cnorm) ||
            list.find((x) => norm(x.name).includes(cnorm)) ||
            null;
        }

        const data = {
          ticker: match?.ticker || (tickerMaybe || null),
          isin: match?.isin || null,
          name: match?.name || (fallbackCompany || null),
          sector: match?.sector || null,
          compartment: match?.compartment || null,
          shares_outstanding: match?.shares_outstanding ?? null,
        };

        if (!cancelled) setMeta({ loading: false, error: null, data });
      } catch (e) {
        if (!cancelled) setMeta((m) => ({ ...m, loading: false, error: e?.message || "Erreur meta" }));
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [tickerMaybe, fallbackCompany]);

  return meta;
}

/* =========================
 * KPIs (inchangé)
 * ========================= */
function computeKpis(divs) {
  const byYear = {};
  for (const d of divs) byYear[d.year] = (byYear[d.year] || 0) + Number(d.amount || 0);

  const weightsYear = { 2020: 1, 2021: 2, 2022: 3, 2023: 4, 2024: 5 };
  const sumW = Object.values(weightsYear).reduce((a, b) => a + b, 0);
  const paidW = Object.entries(weightsYear).reduce((s, [y, w]) => s + (byYear[y] > 0 ? w : 0), 0);
  const regularite = (paidW / sumW) * 25;

  const ups = [
    { from: 2020, to: 2021, w: 2 },
    { from: 2021, to: 2022, w: 3 },
    { from: 2022, to: 2023, w: 4 },
    { from: 2023, to: 2024, w: 5 },
  ].reduce((s, u) => {
    const a = byYear[u.from] || 0; const b = byYear[u.to] || 0;
    return s + (b > a ? u.w : 0);
  }, 0);

  const croissA = (ups / (2 + 3 + 4 + 5)) * 20;

  const consec =
    (byYear[2021] > byYear[2020] ? 1 : 0) +
    (byYear[2022] > byYear[2021] ? 1 : 0) +
    (byYear[2023] > byYear[2022] ? 1 : 0) +
    (byYear[2024] > byYear[2023] ? 1 : 0);

  const bonus = consec >= 4 ? 10 : consec === 3 ? 8 : consec === 2 ? 5 : 0;

  const penMult = { 2021: 1.0, 2022: 1.2, 2023: 1.5, 2024: 2.0 };
  const drops = [
    { y: 2021, a: byYear[2020], b: byYear[2021] },
    { y: 2022, a: byYear[2021], b: byYear[2022] },
    { y: 2023, a: byYear[2022], b: byYear[2023] },
    { y: 2024, a: byYear[2023], b: byYear[2024] },
  ].map((x) => {
    const pct = x.a > 0 ? (x.a - x.b) / x.a : 0;
    let base = 0;
    if (pct > 0.3) base = 3;
    else if (pct > 0.2) base = 2;
    else if (pct > 0.1) base = 1;
    return -(base * (penMult[x.y] || 1));
  });

  const pen = Math.max(-5, drops.reduce((A, B) => A + B, 0));
  const croissance = Math.max(0, Math.min(35, croissA + bonus + pen));

  const series = [2020, 2021, 2022, 2023, 2024]
    .map((y) => byYear[y] || 0)
    .filter((v) => v > 0);
  let stabilite = 0;
  if (series.length >= 2) {
    const mean = series.reduce((a, b) => a + b, 0) / series.length;
    const sd = Math.sqrt(series.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / series.length);
    const cv = mean > 0 ? (sd / mean) * 100 : 100;
    stabilite = Math.max(0, 25 - cv / 2);
  }

  const d0 = byYear[2020] || 0;
  const d4 = byYear[2024] || 0;
  let magnitude = 0;
  if (d0 > 0 && d4 > 0) {
    const tcam = Math.pow(d4 / d0, 1 / 4) - 1;
    magnitude = Math.min(15, ((tcam * 100) / 10) * 15);
  } else if (d0 === 0 && d4 > 0) {
    magnitude = 7;
  }

  const cdrsDetail = { regularite, croissance, stabilite, magnitude };
  const CDRS_total = Math.round(regularite + croissance + stabilite + magnitude);

  const last3 = [...divs].reverse().slice(0, 3);
  const prtDaysArr = last3
    .map((d) => {
      const a = d.exDate ? new Date(d.exDate) : null;
      const b = d.paymentDate ? new Date(d.paymentDate) : null;
      return a && b ? Math.max(1, Math.round((b - a) / DAY_MS)) : 21;
    })
    .reverse();
  const prtAvg = prtDaysArr.length ? prtDaysArr.reduce((a, b) => a + b, 0) / prtDaysArr.length : 21;
  const prtScore = Math.max(0, Math.round(100 - 1.5 * prtAvg));

  const w = { 2021: 2, 2022: 3, 2023: 4, 2024: 5 };
  const grows = [
    { y: 2021, g: ratio(byYear[2021], byYear[2020]) },
    { y: 2022, g: ratio(byYear[2022], byYear[2021]) },
    { y: 2023, g: ratio(byYear[2023], byYear[2022]) },
    { y: 2024, g: ratio(byYear[2024], byYear[2023]) },
  ];
  const num = grows.reduce((s, x) => s + ((x.g ?? 0) * (w[x.y] || 0)), 0);
  const den = Object.values(w).reduce((a, b) => a + b, 0);
  const tcamW = num / den;

  const lastYear = Math.max(0, ...divs.map((d) => d.year));
  const base = byYear[lastYear] || 0;
  const probable = +(base * (1 + (tcamW || 0))).toFixed(2);

  const amounts = divs.map((d) => d.amount || 0).filter((x) => x > 0);
  const mean = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
  const sd = amounts.length
    ? Math.sqrt(amounts.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / amounts.length)
    : 0;
  const vol = Math.min(0.15, mean > 0 ? sd / mean : 0);
  const ndfMin = +(probable * (1 - vol)).toFixed(2);
  const ndfMax = +(probable * (1 + vol)).toFixed(2);

  const known = divs.map((d) => d.exDate).filter(Boolean);
  const dOYs = known.map(toDayOfYear).filter((x) => x != null);
  const exDayOfYear = dOYs.length ? Math.round(dOYs.reduce((a, b) => a + b, 0) / dOYs.length) : null;
  const exDate = dayToRoughDate(exDayOfYear, 2024);

  const paidYears = new Set(divs.map((d) => d.year)).size;
  const reg = Math.min(40, (paidYears / 5) * 40);
  const volPct = mean > 0 ? (sd / mean) * 100 : 100;
  const stab = Math.max(0, Math.min(30, 30 - volPct));
  const upsCount = grows.filter((g) => g.g != null && g.g > 0).length;
  const growCons = Math.min(30, (upsCount / 4) * 30);
  const confidence = Math.min(100, Math.round(reg + stab + growCons));

  const ndf = { probable, min: ndfMin, max: ndfMax, exDate, exDayOfYear, confidence };

  return { cdrsDetail, CDRS_total, prtAvg, prtScore, ndf };
}

/* =========================
 * Composant principal (UI premium)
 * ========================= */
export default function Company() {
  const { ticker: routeTicker, company: routeCompany } = useCompanyFromRoute();
  const meta = useCompanyMeta(routeTicker, routeCompany);
  const divsState = useDividendsData(routeTicker, routeCompany);

  const yearly = useMemo(() => divsState.yearlySeries2020to2025, [divsState.yearlySeries2020to2025]);

  const cagr = useMemo(() => {
    const valid = yearly.filter((y) => y.total && y.total > 0);
    if (valid.length < 2) return null;
    const sorted = [...valid].sort((a, b) => a.year - b.year);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    if (!first?.total || !last?.total) return null;
    const n = sorted.length - 1;
    return Number(((Math.pow(last.total / first.total, 1 / n) - 1) * 100).toFixed(1));
  }, [yearly]);

  const last5Years = useMemo(() => divsState.last5YearsDates, [divsState.last5YearsDates]);

  const kpis = useMemo(() => computeKpis(divsState.raw), [divsState.raw]);

  const [profile, setProfile] = useState("equilibre");
  const weights = {
    passif: { a: 0.6, b: 0.0, c: 0.4 },
    equilibre: { a: 0.4, b: 0.3, c: 0.3 },
    actif: { a: 0.2, b: 0.5, c: 0.3 },
  }[profile];

  const cdScore = Math.round(
    (kpis.CDRS_total || 0) * weights.a +
      (kpis.prtScore || 0) * weights.b +
      (kpis.ndf?.confidence || 0) * weights.c
  );

  const reliabilityBadge =
    (kpis.CDRS_total ?? 0) >= 80 ? "Excellente" : (kpis.CDRS_total ?? 0) >= 65 ? "Solide" : "À surveiller";
  const reliabilityColor =
    (kpis.CDRS_total ?? 0) >= 80 ? "text-emerald-400" : (kpis.CDRS_total ?? 0) >= 65 ? "text-brand-teal" : "text-amber-300";

  // Animation séquentielle
  const [phase, setPhase] = useState("idle");
  const [bannerMsg, setBannerMsg] = useState("");
  const [progReg, setProgReg] = useState(0);
  const [progCroiss, setProgCroiss] = useState(0);
  const [progStab, setProgStab] = useState(0);
  const [progMag, setProgMag] = useState(0);
  const [cdrsRing, setCdrsRing] = useState(0);
  const [prtCounter, setPrtCounter] = useState(0);
  const [prtScoreView, setPrtScoreView] = useState(0);
  const [ndfStep, setNdfStep] = useState(0);
  const [ndfConfView, setNdfConfView] = useState(0);
  const [globalView, setGlobalView] = useState(0);

  const resetSequence = () => {
    setPhase("idle");
    setBannerMsg("");
    setProgReg(0);
    setProgCroiss(0);
    setProgStab(0);
    setProgMag(0);
    setCdrsRing(0);
    setPrtCounter(0);
    setPrtScoreView(0);
    setNdfStep(0);
    setNdfConfView(0);
    setGlobalView(0);
  };

  const startSequence = () => {
    if (divsState.loading || phase !== "idle") return;
    resetSequence();
    setPhase("cdrs");
  };

  const animateTo = (target, ms, onTick) =>
    new Promise((resolve) => {
      const steps = 60;
      const inc = target / steps;
      let i = 0;
      const id = setInterval(() => {
        i++;
        const v = Math.min(Math.round(inc * i), target);
        onTick(v);
        if (i >= steps) {
          clearInterval(id);
          resolve();
        }
      }, ms / steps);
    });

  useEffect(() => {
    if (phase !== "cdrs") return;
    setBannerMsg("C-DRS : Régularité → Croissance → Stabilité → Magnitude...");
    setCdrsRing(0);
    (async () => {
      await animateTo(Math.round(kpis.cdrsDetail?.regularite || 0), 700, setProgReg);
      await animateTo(Math.round(kpis.cdrsDetail?.croissance || 0), 800, setProgCroiss);
      await animateTo(Math.round(kpis.cdrsDetail?.stabilite || 0), 700, setProgStab);
      await animateTo(Math.round(kpis.cdrsDetail?.magnitude || 0), 600, setProgMag);
      await animateTo(Math.max(1, kpis.CDRS_total || 0), 800, setCdrsRing);
      setTimeout(() => setPhase("prt"), 250);
    })();
  }, [phase, kpis]);

  useEffect(() => {
    if (phase !== "prt" || cdrsRing <= 0) return;
    setBannerMsg("PRT : calcul du temps moyen de recovery...");
    let day = 0;
    const target = Math.max(1, Math.round(kpis.prtAvg || 0));
    const id = setInterval(() => {
      day++;
      setPrtCounter(day);
      if (day >= target) {
        clearInterval(id);
        setTimeout(async () => {
          await animateTo(kpis.prtScore || 0, 900, setPrtScoreView);
          setPhase("ndf");
        }, 300);
      }
    }, 22);
    return () => clearInterval(id);
  }, [phase, kpis.prtAvg, kpis.prtScore, cdrsRing]);

  useEffect(() => {
    if (phase !== "ndf") return;
    setBannerMsg("NDF : estimation du montant, fourchette et date...");
    setNdfStep(1);
    const t1 = setTimeout(() => setNdfStep(2), 900);
    const t2 = setTimeout(() => setNdfStep(3), 1700);
    const t3 = setTimeout(async () => {
      setNdfStep(4);
      await animateTo(Math.round(kpis.ndf?.confidence || 0), 900, setNdfConfView);
      setPhase("final");
    }, 2500);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, [phase, kpis]);

  useEffect(() => {
    if (phase !== "final") return;
    setBannerMsg("Calcul du score global (profil) ...");
    (async () => {
      await animateTo(cdScore || 0, 1000, setGlobalView);
      setTimeout(() => setBannerMsg(""), 800);
    })();
  }, [phase, cdScore]);

  const company = {
    ticker: meta.data.ticker || (routeTicker || "—"),
    name: meta.data.name || (routeCompany || "—"),
    sector: meta.data.sector || "—",
    isin: meta.data.isin || "—",
    price: null,
    currency: "MAD",
    logo: "https://via.placeholder.com/48/14b8a6/ffffff?text=" + (meta.data.ticker || "CD"),
    dividendYield: null,
    payoutRatio: null,
    frequency: "Annuel",
  };

  const loadingAny = meta.loading || divsState.loading;
  const hasError = meta.error || divsState.error;
  const fmtMAD = (v) => (v == null ? "—" : `${Number(v).toFixed(2)} ${company.currency}`);

  /* =========================
   * Render
   * ========================= */
  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-amber-400/30 selection:text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* HEADER CARD */}
        <div className="card-premium overflow-hidden">
          <header className="flex items-center gap-3 p-4 md:p-6 border-b border-white/10">
            <button
              className="btn-ghost"
              aria-label="Retour"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="sr-only">Retour</span>
            </button>

            <img
              src={company.logo}
              alt=""
              className="w-10 h-10 rounded-lg border border-white/10 bg-black/40 object-contain"
            />

            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight">{company.name || "—"}</h1>
              <div className="text-xs text-zinc-400">
                {(company.ticker || "—")} • {(company.sector || "—")}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetSequence}
                className="btn-ghost text-brand-amber border-brand-amber/40 hover:bg-brand-amber/10"
                title="Réinitialiser l'animation"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Réinit.</span>
              </button>
            </div>
          </header>

          {/* Bandeau d’état calcul */}
          <AnimatePresence>
            {!!bannerMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 md:px-6 py-3 border-b border-white/10 bg-white/[0.02]"
              >
                <div className="text-xs text-zinc-300">{bannerMsg}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row">
            {/* ASIDE (infos rapides) */}
            <aside className="md:w-60 shrink-0 border-r border-white/10 p-4 space-y-4 bg-white/[0.02]">
              <div className="flex flex-col items-center">
                <CDScoreMiniGauge value={cdScore} progress={globalView} />
                <div className="text-xs text-zinc-400 mt-2">CD-Score™</div>
              </div>

              {/* Profil investisseur */}
              <div className="space-y-2">
                <div className="text-xs text-zinc-500">Profil investisseur :</div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "passif", label: "Passif" },
                    { id: "equilibre", label: "Équilibré" },
                    { id: "actif", label: "Actif" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProfile(p.id)}
                      className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                        profile === p.id
                          ? "bg-brand-teal/10 border-brand-teal text-brand-teal"
                          : "btn-ghost"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Infos clés */}
              <div className="space-y-2 text-xs">
                <InfoRow icon={<Hash className="w-3.5 h-3.5" />} label="Ticker" value={company.ticker || "—"} />
                <InfoRow icon={<Award className="w-3.5 h-3.5" />} label="Secteur" value={company.sector || "—"} />
                <InfoRow icon={<Hash className="w-3.5 h-3.5" />} label="ISIN" value={company.isin || "—"} />
                <div className="divider-soft my-3" />
                <InfoRow icon={<Percent className="w-3.5 h-3.5" />} label="Rendement" value={company.dividendYield ? `${company.dividendYield}%` : "—"} />
                <InfoRow icon={<Percent className="w-3.5 h-3.5" />} label="Payout ratio" value={company.payoutRatio ? `${company.payoutRatio}%` : "—"} />
                <InfoRow icon={<TrendingUp className="w-3.5 h-3.5" />} label="CAGR 5Y" value={cagr ? `${cagr}%` : "—"} />
                <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Fréquence" value={company.frequency || "—"} />
                <div className="divider-soft my-3" />
                <InfoRow label="Ex-date" value={divsState.latestExDate ? fmtDateISO(divsState.latestExDate) : "—"} />
                <InfoRow label="Paiement" value={divsState.latestPaymentDate ? fmtDateISO(divsState.latestPaymentDate) : "—"} />
                <div className="divider-soft my-3" />
                <InfoRow label="Prochain div." value={kpis.ndf?.probable ? fmtMAD(kpis.ndf.probable) : "—"} />
                <InfoRow label="Date estimée" value={kpis.ndf?.exDate || "—"} />
                <div className="divider-soft my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Fiabilité</span>
                  <span className={`font-medium ${reliabilityColor}`}>{reliabilityBadge}</span>
                </div>
              </div>

              {/* Liens rapides */}
              <div className="space-y-2 pt-2">
                <QuickLink icon={<ExternalLink className="w-3 h-3" />} label="Fiche BVC" />
                <QuickLink icon={<Calendar className="w-3 h-3" />} label="Calendrier" />
                <QuickLink icon={<TrendingUp className="w-3 h-3" />} label="DRIP" />
              </div>

              {hasError && (
                <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
                  {meta.error || divsState.error}
                </div>
              )}
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-4 md:p-6 space-y-4">
              {/* KPIs (C-DRS / PRT / NDF) */}
              <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CDRSCard
                  loading={loadingAny}
                  detail={kpis.cdrsDetail || { regularite: 0, croissance: 0, stabilite: 0, magnitude: 0 }}
                  progress={{
                    reg: loadingAny ? 0 : undefined,
                    croiss: loadingAny ? 0 : undefined,
                    stab: loadingAny ? 0 : undefined,
                    mag: loadingAny ? 0 : undefined,
                  }}
                  ringProgress={globalView > 0 ? globalView : 0}
                  onStart={startSequence}
                  running={phase !== "idle"}
                />
                <PRTCard
                  loading={loadingAny}
                  prtAvg={Math.round(kpis.prtAvg || 0)}
                  score={kpis.prtScore || 0}
                  daysProgress={prtCounter}
                  scoreProgress={prtScoreView}
                  active={phase === "prt" || (phase !== "idle" && (cdrsRing || 0) > 0)}
                />
                <NDFCard
                  loading={loadingAny}
                  ndf={kpis.ndf || { probable: 0, min: 0, max: 0, exDate: "—", confidence: 0 }}
                  step={ndfStep}
                  confProgress={ndfConfView}
                  active={phase !== "idle" && prtScoreView > 0}
                />
              </section>

              {/* Historique + Détails paiements */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Chart */}
                <div className="card-premium p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Historique des dividendes</h3>
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> CAGR:&nbsp;
                      <span className="text-zinc-200">{cagr != null ? `${cagr}%` : "—"}</span>
                    </div>
                  </div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <RLineChart data={yearly}>
                        <XAxis dataKey="year" stroke="#71717a" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                        <RTooltip
                          contentStyle={{
                            background: "#0B0B0D",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#e4e4e7",
                            fontSize: "12px",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="#14b8a6" // brand teal
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          connectNulls={false}
                        />
                      </RLineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    Somme annuelle (2020–2025) en {company.currency}
                  </div>
                </div>

                {/* Détails paiements */}
                <div className="card-premium p-4">
                  <h3 className="text-sm font-semibold mb-3">Détails paiements</h3>
                  <DatesTimeline items={last5Years} fmtDate={(d) => fmtDateISO(d)} />
                </div>
              </div>

              {/* Stratégie recommandée */}
              <div className="card-premium p-4">
                <h3 className="text-sm font-semibold mb-3">Stratégie recommandée</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <StrategyCard
                    title="Profil"
                    points={[
                      "Entreprise régulière sur le dividende",
                      "C-DRS élevé → constance attractive",
                      "NDF solide → bonne prévisibilité",
                    ]}
                  />
                  <StrategyCard
                    title="Entrée idéale"
                    points={[
                      "Sur repli vers PRT modéré/bas",
                      "Confirmation par volume & news flow",
                      "Fenêtre avant ex-date pour capter le coupon",
                    ]}
                  />
                  <StrategyCard
                    title="Gestion du risque"
                    points={[
                      "Position taille < 5% du portefeuille",
                      "Surveillance du payout et cash-flow",
                      "Diversification intra-secteur",
                    ]}
                  />
                </div>
                <div className="mt-3 p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs text-zinc-300">
                  <strong>Disclaimer :</strong> Ces informations sont fournies à titre indicatif et ne
                  constituent pas un conseil financier. Faites vos propres recherches.
                </div>
              </div>

              {/* CTA Premium aligné Home */}
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

/* =========================
 * Composants UI
 * ========================= */

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      {icon && <span className="text-zinc-600">{icon}</span>}
      <span className="text-zinc-500 flex-1">{label}</span>
      <span className="text-zinc-200 font-medium text-right">{value}</span>
    </div>
  );
}

function QuickLink({ icon, label }) {
  return (
    <button className="w-full btn-ghost flex items-center gap-2 text-xs">
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* --- CDRS Card --- */
function CDRSCard({ loading, detail, progress = {}, ringProgress = 0, onStart }) {
  const [flipped, setFlipped] = useState(false);
  const total = Math.round(
    (detail.regularite || 0) + (detail.croissance || 0) + (detail.stabilite || 0) + (detail.magnitude || 0)
  );
  const size = 90;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, ringProgress) / 100);

  const steps = [
    { label: "Régularité", vNow: progress.reg ?? 0, vFull: Math.round(detail.regularite || 0), color: "#22d3ee" },
    { label: "Croissance", vNow: progress.croiss ?? 0, vFull: Math.round(detail.croissance || 0), color: "#14b8a6" },
    { label: "Stabilité", vNow: progress.stab ?? 0, vFull: Math.round(detail.stabilite || 0), color: "#f59e0b" },
    { label: "Magnitude", vNow: progress.mag ?? 0, vFull: Math.round(detail.magnitude || 0), color: "#eab308" },
  ];

  return (
    <div className="relative h-full min-h-[280px]" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div className="absolute inset-0 card-premium p-3" style={{ backfaceVisibility: "hidden" }}>
          <div className="mb-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">
              Casa-Dividend Reliability Score
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">C-DRS™</div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500">25/35/25/15</span>
                <FlipButton onClick={() => setFlipped(true)} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-3 bg-white/[0.06] rounded animate-pulse" />
              <div className="h-3 bg-white/[0.06] rounded animate-pulse" />
              <div className="h-3 bg-white/[0.06] rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <svg width={size} height={size}>
                    <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={r}
                      stroke="#eab308"
                      strokeWidth={stroke}
                      fill="none"
                      strokeDasharray={c}
                      strokeDashoffset={off}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset .6s ease-out" }}
                    />
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold text-base">
                      {ringProgress > 0 ? Math.min(100, Math.round(ringProgress)) : total}
                    </text>
                  </svg>
                </div>

                <div className="flex-1 space-y-1.5">
                  {steps.map(({ label, vNow, vFull, color }, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-zinc-400 text-[9px] w-16 shrink-0">{label}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-1 rounded-full"
                          style={{
                            width: `${(Math.min(vNow, vFull) / Math.max(1, vFull)) * 100}%`,
                            background: color,
                            transition: "width .3s ease-out",
                          }}
                        />
                      </div>
                      <span className="w-5 text-right text-zinc-300 text-[9px] shrink-0">
                        {Math.min(vNow, vFull)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={loading}
                onClick={onStart}
                className={`mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all
                  ${loading ? "btn-ghost cursor-not-allowed opacity-60" : "btn-ghost text-brand-teal border-brand-teal/40 hover:bg-brand-teal/10"}`}
              >
                <Play className="w-3.5 h-3.5" /> Lancer le calcul
              </button>
            </>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 card-premium p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-brand-teal">C-DRS™</div>
              <button
                onClick={() => setFlipped(false)}
                className="btn-ghost px-2 py-1 text-xs"
              >
                ←
              </button>
            </div>
            <div className="text-xs text-zinc-400 mb-3">Casa-Dividend Reliability Score</div>
            <ul className="space-y-2 text-[10px] text-zinc-300 leading-relaxed flex-1">
              {[
                "Régularité : paiement constant sur 5 ans",
                "Croissance : augmentation progressive",
                "Stabilité : faible volatilité des montants",
                "Magnitude : niveau et tendance du dividende",
              ].map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-brand-teal shrink-0">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- PRT Card --- */
function PRTCard({ loading, prtAvg, daysProgress, scoreProgress, active }) {
  const [flipped, setFlipped] = useState(false);
  const barColor =
    scoreProgress >= 78 ? "bg-emerald-500/60" :
    scoreProgress >= 55 ? "bg-sky-500/60" :
    scoreProgress >= 33 ? "bg-amber-500/60" :
    scoreProgress >= 10 ? "bg-orange-500/60" : "bg-red-500/60";

  const infoPoints = [
    "Mesure le temps nécessaire pour que le cours retrouve son niveau d'avant détachement",
    "Échantillon : 3 dernières distributions",
    "Lecture : court = rotation plus active, long = buy & hold",
  ];

  return (
    <div className="relative h-full min-h-[280px]" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div className="absolute inset-0 card-premium p-3" style={{ backfaceVisibility: "hidden" }}>
          <div className="mb-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">
              Price Recovery Time
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">PRT™</div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500">Moy. 3 ex-dates</span>
                <FlipButton onClick={() => setFlipped(true)} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-2.5 w-full bg-white/[0.06] rounded animate-pulse" />
              <div className="h-2 w-3/4 bg-white/[0.06] rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="mt-1">
                <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden relative">
                  {active && daysProgress < prtAvg && (
                    <motion.div
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{ x: ["-20%", "100%"] }}
                      transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <div
                    className={`h-2.5 rounded-full transition-[width] duration-200 ${barColor}`}
                    style={{ width: `${Math.min(100, (daysProgress / Math.max(1, prtAvg || 1)) * 100)}%` }}
                  />
                </div>
                <div className="mt-1.5 text-xs text-zinc-400 flex items-center justify-between">
                  <span>Recovery moyen</span>
                  <span className="text-zinc-200">
                    {Math.min(daysProgress || 0, prtAvg || 0)} / {prtAvg || 0} jours
                  </span>
                </div>
              </div>

              <div className="mt-2.5">
                <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <div className={`h-1.5 transition-[width] duration-200 ${barColor}`} style={{ width: `${scoreProgress || 0}%` }} />
                </div>
                <div className="mt-1 text-xs text-zinc-400 flex items-center justify-between">
                  <span>Score PRT</span>
                  <span className="text-zinc-200">{scoreProgress || 0}/100</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 card-premium p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-sky-300">PRT™</div>
              <button onClick={() => setFlipped(false)} className="btn-ghost px-2 py-1 text-xs">←</button>
            </div>
            <div className="text-xs text-zinc-400 mb-3">Price Recovery Time</div>
            <ul className="space-y-2 text-[10px] text-zinc-300 leading-relaxed flex-1">
              {infoPoints.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-sky-400 shrink-0">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- NDF Card --- */
function NDFCard({ loading, ndf, step, confProgress, active }) {
  const [flipped, setFlipped] = useState(false);
  const infoPoints = [
    "Montant probable via croissance pondérée des dernières années",
    "Fourchette basée sur la volatilité historique (capée)",
    "Ex-date estimée par pattern de dates passées",
    "Confiance = régularité + stabilité + tendance de croissance",
  ];

  return (
    <div className="relative h-full min-h-[280px]" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div className="absolute inset-0 card-premium p-3" style={{ backfaceVisibility: "hidden" }}>
          <div className="mb-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Next Dividend Forecast</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">NDF™</div>
              <FlipButton onClick={() => setFlipped(true)} />
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-3 bg-white/[0.06] rounded animate-pulse" />
              <div className="h-3 bg-white/[0.06] rounded animate-pulse" />
              <div className="h-3 bg-white/[0.06] rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px] mb-1">Montant probable</div>
                  <div className="font-medium text-zinc-200">
                    {step >= 1 ? `${(ndf?.probable ?? 0).toFixed(2)} MAD` : "..."}
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px] mb-1">Fourchette</div>
                  <div className="font-medium text-zinc-200">
                    {step >= 2 ? `${(ndf?.min ?? 0).toFixed(2)}—${(ndf?.max ?? 0).toFixed(2)}` : "..."}
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px] mb-1">Ex-date estimée</div>
                  <div className="font-medium text-zinc-200">{step >= 3 ? (ndf?.exDate || "—") : "..."}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden relative">
                  {active && step < 4 && (
                    <motion.div
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{ x: ["-20%", "100%"] }}
                      transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <div
                    className="h-1.5 bg-teal-500/70 rounded-full transition-[width] duration-200"
                    style={{ width: `${confProgress || 0}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-zinc-400 flex items-center justify-between">
                  <span>Confiance</span>
                  <span className="text-zinc-200">{confProgress || 0}/100</span>
                </div>
              </div>

              <div className="mt-3">
                <button
                  className="btn-ghost text-brand-teal border-brand-teal/40 hover:bg-brand-teal/10 w-full text-xs"
                  onClick={() => (window.location.hash = "#/calendar")}
                >
                  Voir dans calendrier
                </button>
              </div>
            </>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 card-premium p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-brand-teal">NDF™</div>
              <button onClick={() => setFlipped(false)} className="btn-ghost px-2 py-1 text-xs">←</button>
            </div>
            <div className="text-xs text-zinc-400 mb-3">Next Dividend Forecast</div>
            <ul className="space-y-2 text-[10px] text-zinc-300 leading-relaxed flex-1">
              {infoPoints.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-brand-teal shrink-0">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Mini Gauge --- */
function CDScoreMiniGauge({ value, progress }) {
  const size = 70;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, progress || 0) / 100);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#14b8a6"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .7s ease-out" }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold text-lg">
          {Math.min(100, Math.round(progress || 0))}
        </text>
      </svg>
    </div>
  );
}

/* --- Timelines --- */
function DatesTimeline({ items = [], fmtDate }) {
  return (
    <div className="space-y-2.5">
      <div>
        <div className="text-[10px] text-zinc-500 mb-1">Ex-dates</div>
        <div className="flex gap-1.5">
          {items.map((item, i) => (
            <div key={`ex-${i}`} className="flex-1 group relative" title={`${item.year} — ${fmtDate(item.exDate)}`}>
              <div className="rounded-md border border-white/10 bg-white/[0.02] p-1.5 text-center hover:border-brand-teal/40 transition-all">
                <div className="text-[10px] font-semibold text-zinc-200">{item.year}</div>
                <div className="text-[9px] text-zinc-400 mt-0.5">
                  {item.exDate ? new Date(item.exDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-zinc-500 mb-1">Paiements</div>
        <div className="flex gap-1.5">
          {items.map((item, i) => (
            <div key={`pay-${i}`} className="flex-1 group relative" title={`${item.year} — ${fmtDate(item.pay)}`}>
              <div className="rounded-md border border-white/10 bg-white/[0.02] p-1.5 text-center hover:border-brand-amber/40 transition-all">
                <div className="text-[10px] font-semibold text-zinc-200">{item.year}</div>
                <div className="text-[9px] text-zinc-400 mt-0.5">
                  {item.pay ? new Date(item.pay).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- Strategy Card --- */
function StrategyCard({ title, points = [] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="font-medium text-sm text-zinc-200 mb-2">{title}</div>
      <ul className="space-y-1">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-400">
            <span className="text-brand-teal mt-0.5 shrink-0">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --- Flip Button --- */
function FlipButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.02] hover:border-brand-teal/50 hover:bg-brand-teal/10 flex items-center justify-center text-zinc-400 hover:text-brand-teal transition-all"
      aria-label="Plus d'informations"
    >
      <span className="text-sm font-semibold">+</span>
    </button>
  );
}
