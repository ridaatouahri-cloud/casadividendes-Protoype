import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";
import { ArrowLeft, TrendingUp, Info, Play, RotateCcw } from "lucide-react";

const DAY_MS = 86400000;

/* ================= Helpers ================= */
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

function monthFromDayOfYear(day, year = new Date().getFullYear()) {
  const d = dayOfYearToDate(day, year);
  return d.getMonth() + 1;
}

function dayToRoughDate(n, refYear = 2024) {
  if (n == null) return "---";
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

/* ================= Tooltip ================= */
function Tip({ title, points = [] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-zinc-400 hover:text-zinc-200 w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center"
        aria-label="Informations"
      >
        i
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-30 w-80 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm shadow-xl">
          <div className="font-medium text-zinc-100 mb-2">{title}</div>
          <ul className="space-y-1 text-zinc-300">
            {points.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-teal-400">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ================= Data Hooks ================= */
function useCompanyFromRoute() {
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const ticker = params.get("ticker") || "ATW";
  const companyName = params.get("company") || "ATTIJARIWAFA BANK";
  return {
    ticker: ticker.toUpperCase(),
    name: companyName,
    sector: "Banques",
    price: 480,
    currency: "MAD",
    logo: `/logos/${ticker.toUpperCase()}.svg`,
  };
}

function useDividendsData(ticker) {
  const [loading, setLoading] = useState(true);
  const [divs, setDivs] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const YEARS = [2020, 2021, 2022, 2023, 2024];
        const all = [];

        for (const y of YEARS) {
          try {
            const res = await fetch(`/data/dividends/${y}.json`);
            if (!res.ok) continue;
            const arr = await res.json();

            const matching = arr.filter(
              (r) =>
                String(r.ticker).toUpperCase() === ticker.toUpperCase() ||
                String(r.company).toUpperCase() === ticker.toUpperCase()
            );

            for (const row of matching) {
              all.push({
                year: row.year || y,
                amount: Number(row.dividend || 0),
                exDate: row.exDate || null,
                pay: row.paymentDate || null,
              });
            }
          } catch (e) {
            console.warn(`Error loading ${y}:`, e);
          }
        }

        all.sort((a, b) => a.year - b.year || (new Date(a.exDate) - new Date(b.exDate)));
        if (alive) setDivs(all);
      } catch (e) {
        console.error("Dividends load error", e);
        if (alive) setDivs([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [ticker]);

  return { loading, divs };
}

/* ================= KPI Computations ================= */
function computeKpis(divs) {
  const byYear = {};
  for (const d of divs) {
    byYear[d.year] = (byYear[d.year] || 0) + Number(d.amount || 0);
  }

  const weightsYear = { 2020: 1, 2021: 2, 2022: 3, 2023: 4, 2024: 5 };

  // C-DRS
  const sumW = Object.values(weightsYear).reduce((a, b) => a + b, 0);
  const paidW = Object.entries(weightsYear).reduce(
    (s, [y, w]) => s + (byYear[y] > 0 ? w : 0),
    0
  );
  const regularite = (paidW / sumW) * 25;

  const ups = [
    { from: 2020, to: 2021, w: 2 },
    { from: 2021, to: 2022, w: 3 },
    { from: 2022, to: 2023, w: 4 },
    { from: 2023, to: 2024, w: 5 },
  ].reduce((s, u) => {
    const a = byYear[u.from] || 0,
      b = byYear[u.to] || 0;
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
    const { a, b } = x;
    const pct = a > 0 ? (a - b) / a : 0;
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
    const sd = Math.sqrt(
      series.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / series.length
    );
    const cv = mean > 0 ? (sd / mean) * 100 : 100;
    stabilite = Math.max(0, 25 - cv / 2);
  }

  const d0 = byYear[2020] || 0,
    d4 = byYear[2024] || 0;
  let magnitude = 0;
  if (d0 > 0 && d4 > 0) {
    const tcam = Math.pow(d4 / d0, 1 / 4) - 1;
    magnitude = Math.min(15, (tcam * 100) / 10 * 15);
  } else if (d0 === 0 && d4 > 0) {
    magnitude = 7;
  }

  const cdrsDetail = { regularite, croissance, stabilite, magnitude };
  const CDRS_total = Math.round(regularite + croissance + stabilite + magnitude);

  // PRT
  const last3 = [...divs].reverse().slice(0, 3);
  const prtDaysArr = last3
    .map((d) => {
      const a = d.exDate ? new Date(d.exDate) : null;
      const b = d.pay ? new Date(d.pay) : null;
      return a && b ? Math.max(1, Math.round((b - a) / DAY_MS)) : 21;
    })
    .reverse();
  const prtAvg = prtDaysArr.length
    ? prtDaysArr.reduce((a, b) => a + b, 0) / prtDaysArr.length
    : 21;
  const prtScore = Math.max(0, Math.round(100 - 1.5 * prtAvg));

  // NDF
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
  const exDayOfYear = dOYs.length
    ? Math.round(dOYs.reduce((a, b) => a + b, 0) / dOYs.length)
    : null;
  const exDate = dayToRoughDate(exDayOfYear, 2024);

  const paidYears = new Set(divs.map((d) => d.year)).size;
  const reg = Math.min(40, (paidYears / 5) * 40);
  const volPct = mean > 0 ? (sd / mean) * 100 : 100;
  const stab = Math.max(0, Math.min(30, 30 - volPct));
  const upsCount = grows.filter((g) => g.g != null && g.g > 0).length;
  const growCons = Math.min(30, (upsCount / 4) * 30);
  const confidence = Math.min(100, Math.round(reg + stab + growCons));

  const ndf = {
    probable,
    min: ndfMin,
    max: ndfMax,
    exDate,
    exDayOfYear,
    confidence,
  };

  return { cdrsDetail, CDRS_total, prtAvg, prtScore, ndf };
}

/* ================= Main Component ================= */
export default function Company() {
  const company = useCompanyFromRoute();
  const { loading, divs } = useDividendsData(company.ticker);

  const yearly = useMemo(() => {
    const map = new Map();
    for (const d of divs) {
      map.set(d.year, (map.get(d.year) || 0) + Number(d.amount || 0));
    }
    const result = [];
    for (let y = 2020; y <= 2025; y++) {
      result.push({ year: y, total: map.get(y) ? Number(map.get(y).toFixed(2)) : null });
    }
    return result;
  }, [divs]);

  const cagr = useMemo(() => {
    const valid = yearly.filter((y) => y.total && y.total > 0);
    if (valid.length < 2) return null;
    const sorted = [...valid].sort((a, b) => a.year - b.year);
    const first = sorted[0],
      last = sorted[sorted.length - 1];
    if (!first?.total || !last?.total) return null;
    const n = sorted.length - 1;
    return Number(((Math.pow(last.total / first.total, 1 / n) - 1) * 100).toFixed(1));
  }, [yearly]);

  const last5Years = useMemo(() => {
    const sorted = [...divs].sort((a, b) => b.year - a.year);
    const years = [];
    for (const d of sorted) {
      if (!years.find((y) => y.year === d.year)) {
        years.push(d);
        if (years.length === 5) break;
      }
    }
    return years.reverse();
  }, [divs]);

  const kpis = useMemo(() => computeKpis(divs), [divs]);

  const [profile, setProfile] = useState("equilibre");
  const weights = {
    passif: { a: 0.6, b: 0.0, c: 0.4 },
    equilibre: { a: 0.4, b: 0.3, c: 0.3 },
    actif: { a: 0.2, b: 0.5, c: 0.3 },
  }[profile];

  const cdScore = Math.round(
    kpis.CDRS_total * weights.a +
      kpis.prtScore * weights.b +
      (kpis.ndf?.confidence || 0) * weights.c
  );

  // Animation states
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
    if (loading || phase !== "idle") return;
    resetSequence();
    setPhase("cdrs");
  };

  const animateTo = (target, ms, onTick) =>
    new Promise((resolve) => {
      const steps = 60,
        inc = target / steps;
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
      await animateTo(Math.round(kpis.cdrsDetail.regularite), 700, setProgReg);
      await animateTo(Math.round(kpis.cdrsDetail.croissance), 800, setProgCroiss);
      await animateTo(Math.round(kpis.cdrsDetail.stabilite), 700, setProgStab);
      await animateTo(Math.round(kpis.cdrsDetail.magnitude), 600, setProgMag);
      await animateTo(Math.max(1, kpis.CDRS_total), 800, setCdrsRing);
      setTimeout(() => setPhase("prt"), 250);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "prt" || cdrsRing <= 0) return;
    setBannerMsg("PRT : calcul du temps moyen de recovery...");
    let day = 0;
    const target = Math.max(1, Math.round(kpis.prtAvg));
    const id = setInterval(() => {
      day++;
      setPrtCounter(day);
      if (day >= target) {
        clearInterval(id);
        setTimeout(async () => {
          await animateTo(kpis.prtScore, 900, setPrtScoreView);
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
      await animateTo(Math.round(kpis.ndf.confidence || 0), 900, setNdfConfView);
      setPhase("final");
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "final") return;
    setBannerMsg("Calcul du score global (profil) ...");
    (async () => {
      await animateTo(cdScore, 1000, setGlobalView);
      setTimeout(() => setBannerMsg(""), 800);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, cdScore]);

  function goToCalendarMonth() {
    const doy = kpis.ndf?.exDayOfYear ?? null;
    let targetYear = new Date().getFullYear();
    const lastEx = [...divs].reverse().find((d) => d.exDate)?.exDate;
    if (lastEx) targetYear = new Date(lastEx).getFullYear() + 1;
    const month = doy ? monthFromDayOfYear(doy, targetYear) : null;
    const url = month
      ? `/#/calendar?year=${targetYear}&month=${month}&ticker=${encodeURIComponent(
          company.ticker
        )}`
      : `/#/calendar?ticker=${encodeURIComponent(company.ticker)}`;
    window.location.href = url;
  }

  const fmtMAD = (v) =>
    v == null ? "---" : `${Number(v).toFixed(2)} ${company.currency}`;
  const fmtDate = (iso) => {
    if (!iso) return "---";
    const d = new Date(iso);
    return isNaN(d)
      ? "---"
      : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-400/5 blur-3xl rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40rem] h-[40rem] bg-teal-400/5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => (window.location.href = "/#/palmares")}
            className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-teal-500/40"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img
            src={company.logo}
            alt=""
            className="w-12 h-12 rounded-lg border border-zinc-800 bg-zinc-900/70 object-contain"
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
            <div className="text-sm text-zinc-400">
              {company.ticker} • {company.sector}
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={resetSequence}
              className="rounded-xl px-3 py-2 bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/40 text-amber-300 flex items-center gap-2"
              title="Réinitialiser l'animation"
            >
              <RotateCcw className="w-4 h-4" /> Réinitialiser
            </button>
          </div>
        </header>

        {/* Profile selector */}
        <div className="mb-6 flex items-center justify-end gap-2 text-sm">
          <span className="text-zinc-400">Profil :</span>
          {[
            { id: "passif", label: "Revenus passifs" },
            { id: "equilibre", label: "Équilibré" },
            { id: "actif", label: "Rotation active" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setProfile(p.id)}
              className={`px-2.5 py-1 rounded-lg border ${
                profile === p.id
                  ? "border-teal-500/50 text-teal-300 bg-teal-500/10"
                  : "border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {!!bannerMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300"
            >
              {bannerMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-4 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="text-sm text-zinc-400 mb-2">CD-Score™</div>
                <CDScoreMiniGauge value={cdScore} progress={globalView} />
                <div className="text-xs text-zinc-500 mt-2 text-center">
                  Score global selon profil
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3 text-sm">
                <div>
                  <div className="text-zinc-400">Dernier dividende</div>
                  <div className="font-semibold">
                    {divs.length > 0
                      ? fmtMAD(divs[divs.length - 1].amount)
                      : "---"}
                  </div>
                </div>
                {cagr !== null && (
                  <div>
                    <div className="text-zinc-400">CAGR</div>
                    <div className="font-semibold">{cagr}%</div>
                  </div>
                )}
                {last5Years.length > 0 && (
                  <div>
                    <div className="text-zinc-400">Dernière ex-date</div>
                    <div className="font-semibold">
                      {fmtDate(last5Years[last5Years.length - 1].exDate)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* KPI Cards */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <CDRSCard
                loading={loading}
                detail={kpis.cdrsDetail}
                progress={{
                  reg: progReg,
                  croiss: progCroiss,
                  stab: progStab,
                  mag: progMag,
                }}
                ringProgress={cdrsRing}
                onStart={startSequence}
                running={phase !== "idle"}
              />
              <PRTCard
                loading={loading}
                prtAvg={Math.round(kpis.prtAvg)}
                score={kpis.prtScore}
                daysProgress={prtCounter}
                scoreProgress={prtScoreView}
                active={phase === "prt" || (phase !== "idle" && cdrsRing > 0)}
              />
              <NDFCard
                loading={loading}
                ndf={kpis.ndf}
                step={ndfStep}
                confProgress={ndfConfView}
                active={phase !== "idle" && prtScoreView > 0}
                onGoCalendar={goToCalendarMonth}
              />
            </section>

            {/* Charts */}
            <section className="space-y-6 mb-10">
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Historique des dividendes (2020-2025)</h3>
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Info className="w-4 h-4" /> CAGR:{" "}
                    <span className="text-zinc-200">
                      {cagr != null ? `${cagr}%` : "---"}
                    </span>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearly}>
                      <XAxis dataKey="year" stroke="#a1a1aa" />
                      <YAxis stroke="#a1a1aa" />
                      <RTooltip
                        contentStyle={{
                          background: "#0a0a0a",
                          border: "1px solid #27272a",
                          color: "#e4e4e7",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-sm text-zinc-400">
                  Somme annuelle des dividendes en {company.currency}.
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <h3 className="font-semibold mb-4">Détails (ex-date / paiement)</h3>
                <DatesTimeline items={last5Years} fmtDate={fmtDate} />
              </div>
            </section>

            {/* Stratégie */}
            <section className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 mb-10">
              <h3 className="font-semibold mb-3">Stratégie recommandée</h3>
              <div className="grid md:grid-cols-3 gap-4">
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
              <div className="mt-4 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-sm text-zinc-300">
                <strong>Disclaimer :</strong> Ces informations sont fournies à titre
                indicatif et ne constituent pas un conseil financier. Faites vos propres
                recherches.
              </div>
            </section>
          </main>
        </div>

        <footer className="text-sm text-zinc-500 pb-8 border-t border-zinc-800/60 pt-4 mt-8">
          Données CasaDividendes — à titre informatif. © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}

/* ================= KPI Cards ================= */
function CDRSCard({ loading, detail, progress, ringProgress, onStart, running }) {
  const total = Math.round(
    detail.regularite + detail.croissance + detail.stabilite + detail.magnitude
  );
  const size = 100,
    stroke = 8,
    r = (size - stroke) / 2,
    c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, ringProgress) / 100);

  const steps = [
    {
      label: "Régularité",
      vNow: progress.reg,
      vFull: Math.round(detail.regularite),
      color: "#22d3ee",
    },
    {
      label: "Croissance",
      vNow: progress.croiss,
      vFull: Math.round(detail.croissance),
      color: "#14b8a6",
    },
    {
      label: "Stabilité",
      vNow: progress.stab,
      vFull: Math.round(detail.stabilite),
      color: "#f59e0b",
    },
    {
      label: "Magnitude",
      vNow: progress.mag,
      vFull: Math.round(detail.magnitude),
      color: "#eab308",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-zinc-400">C-DRS™</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">25/35/25/15</span>
          <Tip
            title="Casa-Dividend Reliability Score"
            points={[
              "Régularité : paiement constant sur 5 ans",
              "Croissance : augmentation progressive",
              "Stabilité : faible volatilité des montants",
              "Magnitude : niveau et tendance du dividende",
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg width={size} height={size}>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke="#27272a"
                  strokeWidth={stroke}
                  fill="none"
                />
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
                  style={{ transition: "stroke-dashoffset .45s ease" }}
                />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="fill-zinc-100 font-semibold text-lg"
                >
                  {ringProgress > 0 ? Math.min(100, Math.round(ringProgress)) : total}
                </text>
              </svg>
            </div>

            <div className="text-xs flex-1 space-y-1">
              {steps.map(({ label, vNow, vFull, color }, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-zinc-300">{label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${(vNow / Math.max(1, vFull)) * 100}%`,
                          background: color,
                          transition: "width .25s",
                        }}
                      />
                    </div>
                    <span className="w-6 text-right text-zinc-200">
                      {Math.min(vNow, vFull)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            onClick={onStart}
            className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm border ${
              loading
                ? "border-zinc-800 text-zinc-500 cursor-not-allowed"
                : "border-teal-500/30 text-teal-300 hover:bg-teal-500/10"
            }`}
          >
            <Play className="w-4 h-4" /> Lancer le calcul
          </button>
        </>
      )}
    </div>
  );
}

function PRTCard({ loading, prtAvg, score, daysProgress, scoreProgress, active }) {
  const barColor =
    scoreProgress >= 78
      ? "bg-emerald-500/60"
      : scoreProgress >= 55
      ? "bg-sky-500/60"
      : scoreProgress >= 33
      ? "bg-yellow-500/60"
      : scoreProgress >= 10
      ? "bg-orange-500/60"
      : "bg-red-500/60";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-zinc-400">PRT™</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Moyenne 3 ex-dates</span>
          <Tip
            title="Price Recovery Time"
            points={[
              "Mesure le temps nécessaire pour que le cours retrouve son niveau d'avant détachement",
              "Échantillon : 3 dernières distributions",
              "Lecture : court = rotation plus active, long = buy & hold",
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-3 w-full bg-zinc-800 rounded animate-pulse" />
          <div className="h-2 w-3/4 bg-zinc-800 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="mt-1">
            <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden relative">
              {active && daysProgress < prtAvg && (
                <motion.div
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-zinc-300/0 via-zinc-300/20 to-zinc-300/0"
                  animate={{ x: ["-20%", "100%"] }}
                  transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <div
                className={`h-3 rounded-full transition-[width] duration-200 ${barColor}`}
                style={{
                  width: `${Math.min(100, (daysProgress / Math.max(1, prtAvg)) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-2 text-xs text-zinc-300 flex items-center justify-between">
              <span>Recovery moyen</span>
              <span>
                {Math.min(daysProgress, prtAvg)} / {prtAvg} jours
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-2 transition-[width] duration-200 ${barColor}`}
                style={{ width: `${scoreProgress}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-zinc-400 flex items-center justify-between">
              <span>Score PRT</span>
              <span className="text-zinc-200">{scoreProgress || 0}/100</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NDFCard({ loading, ndf, step, confProgress, active, onGoCalendar }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-zinc-400">NDF™</div>
        <Tip
          title="Next Dividend Forecast"
          points={[
            "Montant probable via croissance pondérée des dernières années",
            "Fourchette basée sur la volatilité historique (capée)",
            "Ex-date estimée par pattern de dates passées",
            "Confiance = régularité + stabilité + tendance de croissance",
          ]}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Montant probable</span>
              <span className="font-semibold">
                {step >= 1 ? `${(ndf?.probable ?? 0).toFixed(2)} MAD` : "..."}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Fourchette</span>
              <span className="font-semibold">
                {step >= 2
                  ? `${(ndf?.min ?? 0).toFixed(2)} — ${(ndf?.max ?? 0).toFixed(2)} MAD`
                  : "..."}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Ex-date estimée</span>
              <span className="font-semibold">{step >= 3 ? ndf?.exDate || "---" : "..."}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden relative">
              {active && step < 4 && (
                <motion.div
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-emerald-300/0 via-emerald-300/20 to-emerald-300/0"
                  animate={{ x: ["-20%", "100%"] }}
                  transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <div
                className="h-2 bg-teal-500/70 rounded-full transition-[width] duration-200"
                style={{ width: `${confProgress}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-zinc-400 flex items-center justify-between">
              <span>Confiance</span>
              <span className="text-zinc-200">{confProgress || 0}/100</span>
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={onGoCalendar}
              className="w-full rounded-lg border border-teal-500/30 text-teal-300 hover:bg-teal-500/10 px-3 py-2 text-sm"
            >
              Voir ce mois dans le calendrier
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CDScoreMiniGauge({ value, progress }) {
  const size = 80,
    stroke = 7,
    r = (size - stroke) / 2,
    c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, progress) / 100);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#27272a"
          strokeWidth={stroke}
          fill="none"
        />
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
          style={{ transition: "stroke-dashoffset .45s ease" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-zinc-100 font-semibold text-xl"
        >
          {Math.min(100, Math.round(progress || 0))}
        </text>
      </svg>
    </div>
  );
}

/* ================= Timeline ================= */
function DatesTimeline({ items, fmtDate }) {
  return (
    <div className="space-y-4">
      {/* Ex-dates row */}
      <div>
        <div className="text-xs text-zinc-400 mb-2">Ex-dates</div>
        <div className="flex gap-2">
          {items.map((item, i) => (
            <div
              key={`ex-${i}`}
              className="flex-1 group relative"
              title={`${item.year} — ${fmtDate(item.exDate)}`}
            >
              <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-2 text-center hover:border-teal-500/40 transition-colors">
                <div className="text-xs font-semibold text-zinc-200">{item.year}</div>
                <div className="text-xs text-zinc-400 mt-1">
                  {item.exDate
                    ? new Date(item.exDate).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                      })
                    : "---"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment dates row */}
      <div>
        <div className="text-xs text-zinc-400 mb-2">Paiements</div>
        <div className="flex gap-2">
          {items.map((item, i) => (
            <div
              key={`pay-${i}`}
              className="flex-1 group relative"
              title={`${item.year} — ${fmtDate(item.pay)}`}
            >
              <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-2 text-center hover:border-amber-500/40 transition-colors">
                <div className="text-xs font-semibold text-zinc-200">{item.year}</div>
                <div className="text-xs text-zinc-400 mt-1">
                  {item.pay
                    ? new Date(item.pay).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                      })
                    : "---"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= UI Components ================= */
function StrategyCard({ title, points = [] }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="font-medium">{title}</div>
      <ul className="mt-2 text-sm text-zinc-300 space-y-1">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-teal-300 mt-0.5">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}