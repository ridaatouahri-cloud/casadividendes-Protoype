import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, CartesianGrid, Legend, BarChart, Bar
} from "recharts";
import {
  ArrowLeft, ExternalLink, TrendingUp, Star, Bookmark, Share2,
  Settings, ChevronRight, Info, X, Sparkles, Link as LinkIcon,
  Play, RotateCcw, SlidersHorizontal
} from "lucide-react";

/* =========================================================================
   Company.jsx — complet (patché)
   - Loader dividendes réels /public/data/dividends/<year>.json
   - KPI animés (C-DRS™ → PRT™ → NDF™ → CD-Score™)
   - DRIP Simulator
   - Tooltips (sans formules)
   - NDF “Voir ce mois dans le calendrier”
   - PATCHS: startSequence bloque si loading, C-DRS anneau min 1, PRT garde cdrsRing
   ========================================================================= */

const DAY_MS = 86400000;

/* ================= Helpers Date ================= */
function toDayOfYear(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return null;
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / DAY_MS);
}
function dayOfYearToDate(day, year = new Date().getFullYear()) {
  const d = new Date(year, 0); d.setDate(day); return d;
}
function monthFromDayOfYear(day, year = new Date().getFullYear()) {
  const d = dayOfYearToDate(day, year);
  return d.getMonth() + 1; // 1..12
}
function dayToRoughDate(n, refYear = 2024) {
  if (n == null) return "—";
  const d = dayOfYearToDate(n, refYear);
  const m = d.toLocaleString("fr-FR", { month: "long" });
  const dd = d.getDate();
  const pos = dd <= 10 ? "début" : dd <= 20 ? "mi" : "fin";
  return `${pos} ${m}`;
}

/* ================= Tooltip riche ================= */
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

/* =================== Page =================== */
export default function CompanyPage() {
  // ---- Identité entreprise (remplace par tes props/store au besoin)
  const company = {
    ticker: "ATW",
    name: "ATTIJARIWAFA BANK",
    sector: "Banques",
    price: 480,
    currency: "MAD",
    logo: "/logos/ATW.svg",
  };
  const currency = company.currency || "MAD";

  /* ===== Loader dividendes réels ===== */
  const [loading, setLoading] = useState(true);
  const [divs, setDivs] = useState([]); // [{year, amount, exDate, pay}]

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const YEARS = [2020, 2021, 2022, 2023, 2024];
        const all = [];

        for (const y of YEARS) {
          const res = await fetch(`/data/dividends/${y}.json`);
          if (!res.ok) continue;
          const arr = await res.json();
          // Structure: [{ ticker, sector, payments: [{ exDate, paymentDate, amount }] }, ...]
          const row = arr.find(
            (r) => String(r.ticker).toUpperCase() === String(company.ticker).toUpperCase()
          );
          if (!row || !row.payments) continue;

          for (const p of row.payments) {
            all.push({
              year: y,
              amount: Number(p.amount || 0),
              exDate: p.exDate || null,
              pay: p.paymentDate || null,
            });
          }
        }

        all.sort((a, b) => (a.year - b.year) || (new Date(a.exDate) - new Date(b.exDate)));
        if (alive) setDivs(all);
      } catch (e) {
        console.error("Dividends load error", e);
        if (alive) setDivs([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [company.ticker]);

  /* ===== Dérivés & formats ===== */
  const yearly = useMemo(() => {
    const map = new Map();
    for (const d of divs) map.set(d.year, (map.get(d.year) || 0) + Number(d.amount || 0));
    return Array.from(map.entries()).map(([year, total]) => ({ year, total: Number(total.toFixed(2)) }));
  }, [divs]);

  const cagr = useMemo(() => {
    if (yearly.length < 2) return null;
    const sorted = [...yearly].sort((a, b) => a.year - b.year);
    const first = sorted[0], last = sorted[sorted.length - 1];
    if (!first?.total || !last?.total) return null;
    const n = sorted.length - 1;
    return Number(((Math.pow(last.total / first.total, 1 / n) - 1) * 100).toFixed(1));
  }, [yearly]);

  const fmtMAD = (v) => (v == null ? "—" : `${Number(v).toFixed(2)} ${currency}`);
  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d) ? "—" : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  };

  /* ================= Calculs KPI ================= */
  const cdrsDetail = useMemo(() => computeCDRS(divs), [divs]);
  const CDRS_total = Math.round(
    cdrsDetail.regularite + cdrsDetail.croissance + cdrsDetail.stabilite + cdrsDetail.magnitude
  );

  // PRT proxy: (paiement - ex-date) sur 3 dernières lignes connues (fallback 21j)
  const prtDaysArr = useMemo(() => {
    const last3 = [...divs].reverse().slice(0, 3);
    const days = last3.map((d) => {
      const a = d.exDate ? new Date(d.exDate) : null;
      const b = d.pay ? new Date(d.pay) : null;
      return a && b ? Math.max(1, Math.round((b - a) / DAY_MS)) : 21;
    });
    return days.reverse();
  }, [divs]);

  const prtAvg = useMemo(() => {
    if (!prtDaysArr.length) return 21;
    return prtDaysArr.reduce((a, b) => a + b, 0) / prtDaysArr.length;
  }, [prtDaysArr]);

  const prtScore = useMemo(() => Math.max(0, Math.round(100 - 1.5 * prtAvg)), [prtAvg]);

  // NDF
  const ndf = useMemo(() => computeNDF(divs), [divs]);

  // CD-Score (profil)
  const [profile, setProfile] = useState("equilibre"); // "passif" | "equilibre" | "actif"
  const weights = {
    passif: { a: 0.60, b: 0.00, c: 0.40 },
    equilibre: { a: 0.40, b: 0.30, c: 0.30 },
    actif: { a: 0.20, b: 0.50, c: 0.30 },
  }[profile];
  const cdScore = Math.round(CDRS_total * weights.a + prtScore * weights.b + (ndf?.confidence || 0) * weights.c);

  /* ================= Animations séquentielles ================= */
  const [phase, setPhase] = useState("idle");
  const [bannerMsg, setBannerMsg] = useState("");

  // C-DRS: critères + anneau final
  const [progReg, setProgReg] = useState(0);
  const [progCroiss, setProgCroiss] = useState(0);
  const [progStab, setProgStab] = useState(0);
  const [progMag, setProgMag] = useState(0);
  const [cdrsRing, setCdrsRing] = useState(0);

  // PRT: compteur jours + score
  const [prtCounter, setPrtCounter] = useState(0);
  const [prtScoreView, setPrtScoreView] = useState(0);

  // NDF
  const [ndfStep, setNdfStep] = useState(0);
  const [ndfConfView, setNdfConfView] = useState(0);

  // Global
  const [globalView, setGlobalView] = useState(0);

  const resetSequence = () => {
    setPhase("idle"); setBannerMsg("");
    setProgReg(0); setProgCroiss(0); setProgStab(0); setProgMag(0); setCdrsRing(0);
    setPrtCounter(0); setPrtScoreView(0);
    setNdfStep(0); setNdfConfView(0);
    setGlobalView(0);
  };

  // PATCH ①: empêcher le lancement pendant le chargement
  const startSequence = () => {
    if (loading) return;                 // <<< NEW
    if (phase !== "idle") return;
    resetSequence();
    setPhase("cdrs");
  };

  // helper animation
  const animateTo = (target, ms, onTick) =>
    new Promise((resolve) => {
      const steps = 60, inc = target / steps;
      let i = 0;
      const id = setInterval(() => {
        i++;
        const v = Math.min(Math.round(inc * i), target);
        onTick(v);
        if (i >= steps) { clearInterval(id); resolve(); }
      }, ms / steps);
    });

  // ===== C-DRS : Régularité → Croissance → Stabilité → Magnitude → anneau global
  useEffect(() => {
    if (phase !== "cdrs") return;
    setBannerMsg("C-DRS : Régularité → Croissance → Stabilité → Magnitude…");
    setCdrsRing(0);
    (async () => {
      await animateTo(Math.round(cdrsDetail.regularite), 700, setProgReg);
      await animateTo(Math.round(cdrsDetail.croissance), 800, setProgCroiss);
      await animateTo(Math.round(cdrsDetail.stabilite), 700, setProgStab);
      await animateTo(Math.round(cdrsDetail.magnitude), 600, setProgMag);
      // PATCH ②: anneau global min 1 pour assurer l'enchaînement
      await animateTo(Math.max(1, CDRS_total), 800, setCdrsRing);  // <<< NEW
      setTimeout(() => setPhase("prt"), 250);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ===== PRT : compteur jours → barre score
  useEffect(() => {
    if (phase !== "prt") return;
    if (cdrsRing <= 0) return; // PATCH ③: s'assurer que C-DRS a fini   <<< NEW
    setBannerMsg("PRT : calcul du temps moyen de recovery…");
    let day = 0;
    const target = Math.max(1, Math.round(prtAvg));
    const id = setInterval(() => {
      day++;
      setPrtCounter(day);
      if (day >= target) {
        clearInterval(id);
        setTimeout(async () => {
          await animateTo(prtScore, 900, setPrtScoreView);
          setPhase("ndf");
        }, 300);
      }
    }, 22);
    return () => clearInterval(id);
    // dépend aussi de cdrsRing (PATCH ③)
  }, [phase, prtAvg, prtScore, cdrsRing]); // <<< NEW dep

  // ===== NDF : Montant → Fourchette → Ex-date → Confiance
  useEffect(() => {
    if (phase !== "ndf") return;
    setBannerMsg("NDF : estimation du montant, fourchette et date…");
    setNdfStep(1);
    const t1 = setTimeout(() => setNdfStep(2), 900);
    const t2 = setTimeout(() => setNdfStep(3), 1700);
    const t3 = setTimeout(async () => {
      setNdfStep(4);
      await animateTo(Math.round(ndf.confidence || 0), 900, setNdfConfView);
      setPhase("final");
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ndf.confidence]);

  // ===== Score global
  useEffect(() => {
    if (phase !== "final") return;
    setBannerMsg("Calcul du score global (profil) …");
    (async () => {
      await animateTo(cdScore, 1000, setGlobalView);
      setTimeout(() => setBannerMsg(""), 800);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, cdScore]);

  /* ================= Actions ================= */
  function goToCalendarMonth() {
    const doy = ndf?.exDayOfYear ?? null;
    let targetYear = new Date().getFullYear();
    const lastEx = [...divs].reverse().find((d) => d.exDate)?.exDate;
    if (lastEx) targetYear = new Date(lastEx).getFullYear() + 1;
    const month = doy ? monthFromDayOfYear(doy, targetYear) : null;
    const url = month
      ? `/#/calendar?year=${targetYear}&month=${month}&ticker=${encodeURIComponent(company.ticker)}`
      : `/#/calendar?ticker=${encodeURIComponent(company.ticker)}`;
    window.location.href = url;
  }

  /* ================= DRIP Simulator ================= */
  const [showDRIP, setShowDRIP] = useState(false);
  const defaultDrip = useMemo(() => {
    try { const raw = localStorage.getItem("dripSettings"); if (raw) return JSON.parse(raw); } catch {}
    return { initial: 10000, monthly: 500, yieldPct: 3.5, growthPct: 6, years: 5, feePct: 0.3, price: 480 };
  }, []);
  const [drip, setDrip] = useState(defaultDrip);
  useEffect(() => { try { localStorage.setItem("dripSettings", JSON.stringify(drip)); } catch {} }, [drip]);

  const monthlySeries = useMemo(() => simulateDRIP({
    initial: +drip.initial||0, monthly: +drip.monthly||0, yieldPct:+drip.yieldPct||0, growthPct:+drip.growthPct||0,
    years: Math.max(1,+drip.years||1), feePct: Math.max(0,+drip.feePct||0), price: Math.max(0,+drip.price||0),
  }), [drip]);
  const dripSummary = useMemo(() => {
    if (!monthlySeries.length) return null;
    const last = monthlySeries[monthlySeries.length - 1];
    const invested = last.totalContrib, value = last.portfolioValue, dividends = last.dividendsCum, shares = last.shares;
    const yrs = (drip.years||1); const irr = invested>0 ? Math.pow(value/invested,1/yrs)-1 : 0;
    return { invested, value, dividends, shares, irr: irr*100 };
  }, [monthlySeries, drip.years]);
  const applyPreset = (t) => {
    if (t==="conservative") setDrip(d=>({...d, yieldPct:3, growthPct:3, monthly:Math.max(250,d.monthly)}));
    if (t==="base") setDrip(d=>({...d, yieldPct:3.5, growthPct:6}));
    if (t==="ambitious") setDrip(d=>({...d, yieldPct:4.2, growthPct:9, monthly:Math.max(600,d.monthly)}));
  };

  /* ================= Render ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      {/* halo décoratif */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-400/5 blur-3xl rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40rem] h-[40rem] bg-teal-400/5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-[1200px] xl:max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <header id="profil" className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-teal-500/40" aria-label="Retour">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img src={company.logo} alt="" className="w-12 h-12 rounded-lg border border-zinc-800 bg-zinc-900/70 object-contain" />
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{company.name}</h1>
              <div className="text-sm text-zinc-400">{company.ticker} • {company.sector}</div>
            </div>
          </div>

          <div className="md:ml-auto flex items-center gap-3">
            <button onClick={() => setShowDRIP(true)} className="rounded-xl px-3 py-2 bg-teal-500/15 border border-teal-500/30 text-teal-300 hover:bg-teal-500/25 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> DRIP
            </button>
            <button onClick={resetSequence} className="rounded-xl px-3 py-2 bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/40 text-amber-300 flex items-center gap-2" title="Réinitialiser l'animation">
              <RotateCcw className="w-4 h-4" /> Réinitialiser
            </button>
            <a href={`/#/calendar?ticker=${encodeURIComponent(company.ticker)}`} className="rounded-xl px-3 py-2 bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/40 text-amber-300 flex items-center gap-2">📅 Calendrier</a>
            <a href="https://www.casablanca-bourse.com" target="_blank" rel="noreferrer" className="rounded-xl px-3 py-2 bg-zinc-900/60 border border-zinc-800 hover:border-teal-500/40 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Fiche BVC
            </a>
            <button className="rounded-xl p-2 bg-zinc-900/60 border border-zinc-800 hover:border-teal-500/40" aria-label="Partager"><Share2 className="w-4 h-4" /></button>
          </div>
        </header>

        {/* Nav + profil */}
        <nav className="sticky top-4 z-20 mb-6 flex items-center justify-between">
          <div className="inline-flex rounded-2xl border border-zinc-800 bg-zinc-900/60 p-1 backdrop-blur">
            {[
              { id: "profil", label: "Profil" },
              { id: "kpi", label: "KPI" },
              { id: "history", label: "Historique" },
              { id: "strategy", label: "Stratégie" },
              { id: "compare", label: "Comparatif" },
            ].map((s) => (
              <a key={s.id} href={`#${s.id}`} className="px-3 py-1.5 rounded-xl text-sm text-zinc-300 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30">
                {s.label}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-zinc-400">Profil :</span>
            {[
              { id:"passif", label:"Revenus passifs" },
              { id:"equilibre", label:"Équilibré" },
              { id:"actif", label:"Rotation active" },
            ].map(p=>(
              <button key={p.id}
                onClick={()=>setProfile(p.id)}
                className={`px-2.5 py-1 rounded-lg border ${profile===p.id ? "border-teal-500/50 text-teal-300 bg-teal-500/10":"border-zinc-800 text-zinc-300 hover:border-zinc-700"}`}
              >{p.label}</button>
            ))}
          </div>
        </nav>

        {/* Bandeau messages dynamiques */}
        <AnimatePresence>
          {!!bannerMsg && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300">
              {bannerMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= KPI ================= */}
        <section id="kpi" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <CDRSCard
            loading={loading}
            detail={cdrsDetail}
            progress={{ reg:progReg, croiss:progCroiss, stab:progStab, mag:progMag }}
            ringProgress={cdrsRing}
            onStart={startSequence}
            running={phase !== "idle"}
          />
          <PRTCard
            loading={loading}
            prtAvg={Math.round(prtAvg)}
            score={prtScore}
            daysProgress={prtCounter}
            scoreProgress={prtScoreView}
            active={phase === "prt" || (phase !== "idle" && cdrsRing > 0)} /* option visuelle */
          />
          <NDFCard
            loading={loading}
            ndf={ndf}
            step={ndfStep}
            confProgress={ndfConfView}
            active={phase !== "idle" && (prtScoreView>0)}
            onGoCalendar={goToCalendarMonth}
          />
          <GlobalScoreCard loading={loading} value={cdScore} progress={globalView} />
        </section>

        {/* ================= Historique & Détails ================= */}
        <section id="history" className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Historique des dividendes</h3>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Info className="w-4 h-4" /> CAGR: <span className="text-zinc-200">{cagr != null ? `${cagr}%` : "—"}</span>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearly}>
                  <XAxis dataKey="year" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                 <RTooltip
  contentStyle={{ background: "#0a0a0a", border: "1px solid #27272a", color: "#e4e4e7" }}
/>
                  <Line type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm text-zinc-400">Somme annuelle des dividendes en {currency}.</div>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold mb-3">Détails (ex-date / paiement)</h3>
            <ul className="divide-y divide-zinc-800">
              {[...divs].sort((a,b)=>a.year-b.year).map((d, i) => (
                <li key={`${d.year}-${i}`} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{d.year}</div>
                    <div className="text-xs text-zinc-400">Ex-date: {fmtDate(d.exDate)} • Paiement: {fmtDate(d.pay)}</div>
                  </div>
                  <div className="text-teal-300 font-semibold">{fmtMAD(d.amount)}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= Stratégie ================= */}
        <section id="strategy" className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 mb-10">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">Stratégie recommandée <Sparkles className="w-4 h-4 text-amber-400" /></h3>
            <a href="#history" className="text-sm text-amber-300 hover:underline flex items-center gap-1">Voir l’historique <ChevronRight className="w-4 h-4" /></a>
          </div>
          <div className="mt-3 grid md:grid-cols-3 gap-4">
            <StrategyCard title="Profil" points={[
              "Entreprise régulière sur le dividende",
              "C-DRS élevé → constance attractive",
              "NDF solide → bonne prévisibilité",
            ]}/>
            <StrategyCard title="Entrée idéale" points={[
              "Sur repli vers PRT modéré/bas",
              "Confirmation par volume & news flow",
              "Fenêtre avant ex-date pour capter le coupon",
            ]}/>
            <StrategyCard title="Gestion du risque" points={[
              "Position taille < 5% du portefeuille",
              "Surveillance du payout et cash-flow",
              "Diversification intra-secteur",
            ]}/>
          </div>
        </section>

        {/* ================= Comparatif ================= */}
        <section id="compare" className="grid lg:grid-cols-2 gap-6 mb-16">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold mb-3">Comparatif secteur (Radar)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { name:"ATW", cdrs:CDRS_total, yield:3.6, prt:prtScore, ndf:ndf.confidence||0 },
                  { name:"BCP", cdrs:78, yield:3.8, prt:65, ndf:71 },
                  { name:"CDM", cdrs:75, yield:3.1, prt:62, ndf:70 },
                  { name:"TQM", cdrs:80, yield:4.2, prt:58, ndf:72 },
                ]}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis dataKey="name" stroke="#a1a1aa" />
                  <PolarRadiusAxis stroke="#52525b" />
                  <Radar name="C-DRS" dataKey="cdrs" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.20} />
                  <Radar name="NDF" dataKey="ndf" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.12} />
                  <Radar name="PRT" dataKey="prt" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-zinc-400 mt-2">Lecture relative par rapport aux pairs du secteur.</p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold mb-3">Actions rapides</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <QuickAction icon={<Star className="w-4 h-4" />} label="Suivre" />
              <QuickAction icon={<Bookmark className="w-4 h-4" />} label="Bookmark" />
              <QuickAction icon={<Settings className="w-4 h-4" />} label="Alertes" />
            </div>
            <div className="mt-4 text-sm text-zinc-400 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Lier au calendrier des dividendes pour affichage prioritaire.
            </div>
          </div>
        </section>

        <footer className="text-sm text-zinc-500 pb-16 border-t border-zinc-800/60 pt-4">
          Données CasaDividendes — à titre informatif. © {new Date().getFullYear()}
        </footer>
      </div>

      {/* FAB mobile */}
      <div className="fixed bottom-6 right-6 xl:hidden">
        <button className="rounded-full w-12 h-12 flex items-center justify-center bg-teal-500 text-zinc-950 shadow-lg shadow-teal-500/20" aria-label="Paramètres rapides">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* ================= DRIP MODAL ================= */}
      <AnimatePresence>
        {showDRIP && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="w-[92vw] max-w-[860px] max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-teal-300" /><h3 className="font-semibold">DRIP — Simulation</h3></div>
                <button onClick={() => setShowDRIP(false)} className="p-2 rounded-lg hover:bg-zinc-900" aria-label="Fermer"><X className="w-4 h-4" /></button>
              </div>

              {/* Paramètres */}
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Montant initial" suffix={currency} value={drip.initial} onChange={(v)=>setDrip(s=>({...s, initial:+v||0}))} />
                <Field label="Versement mensuel" suffix={currency} value={drip.monthly} onChange={(v)=>setDrip(s=>({...s, monthly:+v||0}))} />
                <Field label="Horizon (années)" value={drip.years} onChange={(v)=>setDrip(s=>({...s, years:+v||1}))} />

                <Field label="Rendement net (%)" value={drip.yieldPct} onChange={(v)=>setDrip(s=>({...s, yieldPct:+v||0}))} />
                <Field label="Croissance dividende (%/an)" value={drip.growthPct} onChange={(v)=>setDrip(s=>({...s, growthPct:+v||0}))} />
                <Field label="Frais (%/an)" value={drip.feePct} onChange={(v)=>setDrip(s=>({...s, feePct:+v||0}))} />

                <Field label="Prix / action (optionnel)" suffix={currency} value={drip.price} onChange={(v)=>setDrip(s=>({...s, price:+v||0}))} />
                <div className="md:col-span-2 flex items-center gap-2">
                  <span className="text-sm text-zinc-400">Scénarios :</span>
                  <button onClick={()=>applyPreset("conservative")} className="text-xs rounded-lg px-2 py-1 border border-zinc-800 hover:border-teal-500/40">Conservateur</button>
                  <button onClick={()=>applyPreset("base")} className="text-xs rounded-lg px-2 py-1 border border-zinc-800 hover:border-teal-500/40">Central</button>
                  <button onClick={()=>applyPreset("ambitious")} className="text-xs rounded-lg px-2 py-1 border border-zinc-800 hover:border-teal-500/40">Ambitieux</button>
                </div>
              </div>

              {/* Résumé */}
              {dripSummary && (
                <div className="mt-4 grid md:grid-cols-4 gap-3">
                  <SummaryCard title="Valeur finale" value={fmtMAD(dripSummary.value)} />
                  <SummaryCard title="Dividendes cumulés" value={fmtMAD(dripSummary.dividends)} />
                  <SummaryCard title="Parts accumulées" value={`${dripSummary.shares.toFixed(3)} u.`} />
                  <SummaryCard title="Rendement annualisé (approx.)" value={`${dripSummary.irr.toFixed(2)} %`} />
                </div>
              )}

              {/* Graphiques */}
              <div className="mt-4 grid lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                  <div className="text-sm text-zinc-300 mb-2">Valeur du portefeuille</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlySeries}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                        <XAxis dataKey="label" hide /><YAxis stroke="#a1a1aa" />
                        <RTooltip
  contentStyle={{ background: "#0a0a0a", border: "1px solid #27272a", color: "#e4e4e7" }}
/>
                        <Area type="monotone" dataKey="portfolioValue" stroke="#14b8a6" fill="url(#g1)" strokeWidth={2}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                  <div className="text-sm text-zinc-300 mb-2">Dividendes (cumul)</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlySeries}>
                        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                        <XAxis dataKey="label" hide /><YAxis stroke="#a1a1aa" />
                        <Legend />
                        <RTooltip
  <RTooltip
  contentStyle={{ background: "#0a0a0a", border: "1px solid #27272a", color: "#e4e4e7" }}
/>
                        <Bar dataKey="dividendsCum" name="Dividendes cumulés" fill="#eab308" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 lg:col-span-2">
                  <div className="text-sm text-zinc-300 mb-2">Parts accumulées</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlySeries}>
                        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                        <XAxis dataKey="label" hide /><YAxis stroke="#a1a1aa" />
                        <RTooltip
  contentStyle={{ background: "#0a0a0a", border: "1px solid #27272a", color: "#e4e4e7" }}
/>
                        <Line type="monotone" dataKey="shares" stroke="#22d3ee" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                Hypothèses : rendement net/croissance lissés, réinvestissement mensuel, frais annuels pro-rata. Modèle simplifié — non constitutif d’un conseil.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`html { scroll-behavior: smooth; }`}</style>
    </div>
  );
}

/* ================= KPI Cards ================= */

function CDRSCard({ loading, detail, progress, ringProgress, onStart, running }) {
  const total = Math.round(detail.regularite + detail.croissance + detail.stabilite + detail.magnitude);
  const size = 120, stroke = 9, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const off = c * (1 - (Math.min(100, ringProgress) / 100));

  const steps = [
    { label: "Régularité", vNow: progress.reg, vFull: Math.round(detail.regularite), color: "#22d3ee" },
    { label: "Croissance", vNow: progress.croiss, vFull: Math.round(detail.croissance), color: "#14b8a6" },
    { label: "Stabilité",  vNow: progress.stab,   vFull: Math.round(detail.stabilite),  color: "#f59e0b" },
    { label: "Magnitude",  vNow: progress.mag,    vFull: Math.round(detail.magnitude),  color: "#eab308" },
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
            {/* Anneau global (ne se remplit qu’à la fin) */}
            <div className="relative">
              <svg width={size} height={size}>
                <circle cx={size/2} cy={size/2} r={r} stroke="#27272a" strokeWidth={stroke} fill="none" />
                <circle
                  cx={size/2} cy={size/2} r={r}
                  stroke="#eab308" strokeWidth={stroke} fill="none"
                  strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset .45s ease" }}
                />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold">
                  {ringProgress > 0 ? Math.min(100, Math.round(ringProgress)) : total}
                </text>
              </svg>
            </div>

            {/* Critères */}
            <div className="text-xs flex-1 space-y-1">
              {steps.map(({ label, vNow, vFull, color }, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-zinc-300">{label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${(vNow / Math.max(1, vFull)) * 100}%`, background: color, transition: "width .25s" }}
                      />
                    </div>
                    <span className="w-8 text-right text-zinc-200">{Math.min(vNow, vFull)}</span>
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
  const barColor = scoreProgress >= 78 ? "bg-emerald-500/60"
    : scoreProgress >= 55 ? "bg-sky-500/60"
    : scoreProgress >= 33 ? "bg-yellow-500/60"
    : scoreProgress >= 10 ? "bg-orange-500/60"
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
              "Mesure le temps nécessaire pour que le cours retrouve son niveau d’avant détachement",
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
          {/* Compteur jours */}
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
                style={{ width: `${Math.min(100, (daysProgress / Math.max(1, prtAvg)) * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-zinc-300 flex items-center justify-between">
              <span>Recovery moyen</span>
              <span>{Math.min(daysProgress, prtAvg)} / {prtAvg} jours</span>
            </div>
          </div>

          {/* Score PRT */}
          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div className={`h-2 transition-[width] duration-200 ${barColor}`} style={{ width: `${scoreProgress}%` }} />
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
              <span className="font-semibold">{step >= 1 ? `${(ndf?.probable ?? 0).toFixed(2)} MAD` : "…"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Fourchette</span>
              <span className="font-semibold">{step >= 2 ? `${(ndf?.min ?? 0).toFixed(2)} – ${(ndf?.max ?? 0).toFixed(2)} MAD` : "…"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Ex-date estimée</span>
              <span className="font-semibold">{step >= 3 ? (ndf?.exDate || "—") : "…"}</span>
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
              <div className="h-2 bg-teal-500/70 rounded-full transition-[width] duration-200" style={{ width: `${confProgress}%` }} />
            </div>
            <div className="mt-1 text-xs text-zinc-400 flex items-center justify-between">
              <span>Confiance</span><span className="text-zinc-200">{confProgress || 0}/100</span>
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

function GlobalScoreCard({ loading, value, progress }) {
  const size = 116, stroke = 10, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const off = c * (1 - (Math.min(100, progress) / 100));
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-sm text-zinc-400 flex items-center justify-between">
        <span>CD-Score™</span><span className="text-zinc-300">{loading ? "…" : `${value}/100`}</span>
      </div>
      {loading ? (
        <div className="mt-3 h-[116px] bg-zinc-800 rounded animate-pulse" />
      ) : (
        <>
          <div className="mt-2 relative flex items-center justify-center">
            <svg width={size} height={size}>
              <circle cx={size/2} cy={size/2} r={r} stroke="#27272a" strokeWidth={stroke} fill="none" />
              <circle
                cx={size/2} cy={size/2} r={r}
                stroke="#14b8a6" strokeWidth={stroke} fill="none"
                strokeDasharray={c} strokeDashoffset={off}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset .45s ease" }}
              />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold">
                {Math.min(100, Math.round(progress || 0))}
              </text>
            </svg>
          </div>
          <div className="text-xs text-zinc-500 mt-2 text-center">Synthèse pondérée C-DRS / PRT / NDF selon le profil choisi.</div>
        </>
      )}
    </div>
  );
}

/* ================= Stratégie & UI utils ================= */
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
function QuickAction({ icon, label }) {
  return (
    <button className="rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-teal-500/40 px-3 py-2 flex items-center gap-2">
      {icon} <span>{label}</span>
    </button>
  );
}
function Field({ label, suffix, value, onChange }) {
  return (
    <label className="text-sm">
      <div className="text-zinc-400 mb-1">{label}</div>
      <div className="flex">
        <input value={value} onChange={(e)=>onChange(e.target.value)}
          className="flex-1 rounded-l-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm focus:border-teal-500 outline-none" inputMode="decimal"/>
        {suffix && <div className="rounded-r-lg border border-l-0 border-zinc-800 px-3 py-2 text-sm bg-zinc-900/60 text-zinc-300">{suffix}</div>}
      </div>
    </label>
  );
}
function SummaryCard({ title, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
      <div className="text-xs text-zinc-400">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

/* ================= Calculs KPI & DRIP ================= */
function computeCDRS(divs) {
  const byYear = Object.fromEntries(divs.map(d=>[d.year,d.amount||0]));
  const weightsYear = { 2020:1, 2021:2, 2022:3, 2023:4, 2024:5 }; // somme = 15

  // 1) Régularité (25)
  const sumW = Object.values(weightsYear).reduce((a,b)=>a+b,0);
  const paidW = Object.entries(weightsYear).reduce((s,[y,w])=> s + (byYear[y]>0 ? w : 0), 0);
  const regularite = (paidW / sumW) * 25;

  // 2) Croissance (35)
  const ups = [
    {from:2020,to:2021,w:2}, {from:2021,to:2022,w:3}, {from:2022,to:2023,w:4}, {from:2023,to:2024,w:5}
  ].reduce((s,u)=>{
    const a = byYear[u.from]||0, b = byYear[u.to]||0;
    return s + (b>a ? u.w : 0);
  },0);
  const croissA = (ups / (2+3+4+5)) * 20;

  const consec =
    (byYear[2021]>byYear[2020]?1:0) +
    (byYear[2022]>byYear[2021]?1:0) +
    (byYear[2023]>byYear[2022]?1:0) +
    (byYear[2024]>byYear[2023]?1:0);
  const bonus = consec>=4?10: consec===3?8: consec===2?5:0;

  const penMult = { 2021:1.0, 2022:1.2, 2023:1.5, 2024:2.0 };
  const drops = [
    {y:2021, a:byYear[2020], b:byYear[2021]},
    {y:2022, a:byYear[2021], b:byYear[2022]},
    {y:2023, a:byYear[2022], b:byYear[2023]},
    {y:2024, a:byYear[2023], b:byYear[2024]},
  ].map(x=>{
    const {a,b} = x; const pct = a>0? (a-b)/a : 0;
    let base = 0; if (pct>0.30) base=3; else if (pct>0.20) base=2; else if (pct>0.10) base=1;
    return -(base * (penMult[x.y]||1));
  });
  const pen = Math.max(-5, drops.reduce((A,B)=>A+B,0));
  const croissance = Math.max(0, Math.min(35, croissA + bonus + pen));

  // 3) Stabilité (25)
  const series = [2020,2021,2022,2023,2024].map(y=>byYear[y]||0).filter(v=>v>0);
  let stabilite = 0;
  if (series.length>=2) {
    const mean = series.reduce((a,b)=>a+b,0)/series.length;
    const sd = Math.sqrt(series.reduce((s,x)=>s + Math.pow(x-mean,2),0)/series.length);
    const cv = mean>0 ? (sd/mean)*100 : 100;
    stabilite = Math.max(0, 25 - (cv/2));
  }

  // 4) Magnitude (15)
  const d0 = byYear[2020]||0, d4 = byYear[2024]||0;
  let magnitude = 0;
  if (d0>0 && d4>0) {
    const tcam = Math.pow(d4/d0, 1/4) - 1;
    magnitude = Math.min(15, (tcam*100/10)*15);
  } else if (d0===0 && d4>0) {
    magnitude = 7;
  }

  return { regularite, croissance, stabilite, magnitude };
}

function computeNDF(divs) {
  const w = { 2021:2, 2022:3, 2023:4, 2024:5 };
  const byYear = Object.fromEntries(divs.map(d=>[d.year, d.amount||0]));
  const grows = [
    {y:2021, g: ratio(byYear[2021],byYear[2020])},
    {y:2022, g: ratio(byYear[2022],byYear[2021])},
    {y:2023, g: ratio(byYear[2023],byYear[2022])},
    {y:2024, g: ratio(byYear[2024],byYear[2023])},
  ];
  const num = grows.reduce((s,x)=> s + ((x.g ?? 0) * (w[x.y]||0)), 0);
  const den = Object.values(w).reduce((a,b)=>a+b,0);
  const tcamW = num / den;

  const lastYear = Math.max(0, ...divs.map(d=>d.year));
  const base = byYear[lastYear] || 0;
  const probable = +(base * (1 + (tcamW||0))).toFixed(2);

  const series = divs.map(d=>d.amount||0).filter(x=>x>0);
  const mean = series.length ? series.reduce((a,b)=>a+b,0)/series.length : 0;
  const sd = series.length ? Math.sqrt(series.reduce((s,x)=>s + Math.pow(x-mean,2),0)/series.length) : 0;
  const vol = Math.min(0.15, mean>0 ? sd/mean : 0);
  const min = +(probable * (1 - vol)).toFixed(2);
  const max = +(probable * (1 + vol)).toFixed(2);

  const known = divs.map(d=>d.exDate).filter(Boolean);
  const dOYs = known.map(toDayOfYear).filter(x=>x!=null);
  const exDayOfYear = dOYs.length ? Math.round(dOYs.reduce((a,b)=>a+b,0) / dOYs.length) : null;
  const exDate = dayToRoughDate(exDayOfYear, 2024);

  const paidYears = new Set(divs.map(d=>d.year)).size;
  const reg = Math.min(40, (paidYears/5)*40);
  const volPct = mean>0 ? (sd/mean)*100 : 100;
  const stab = Math.max(0, Math.min(30, 30 - volPct));
  const ups = grows.filter(g=>g.g!=null && g.g>0).length;
  const growCons = Math.min(30, (ups/4)*30);
  const confidence = Math.min(100, Math.round(reg + stab + growCons));

  return { probable, min, max, exDate, exDayOfYear, confidence };
}
function ratio(b,a){ if(a==null||a<=0||b==null) return null; return (b-a)/a; }

/* ===== DRIP simulation ===== */
function simulateDRIP({ initial, monthly, yieldPct, growthPct, years, feePct, price }) {
  const months = Math.max(1, Math.round(years*12));
  const rDivYear = Math.max(0, yieldPct)/100;
  const gYear = Math.max(0, growthPct)/100;
  const feeYear = Math.max(0, feePct)/100;

  const rDivMonth0 = rDivYear/12;
  const gMonth = Math.pow(1+gYear, 1/12) - 1;
  const feeMonth = Math.pow(1 - feeYear, 1/12) - 1;

  let shares = 0, cash = 0, p = Math.max(0, price||0);
  let portfolioValue = initial;
  if (p>0){ shares = initial/p; portfolioValue = shares*p; } else { shares = initial>0? initial/100 : 0; p=100; portfolioValue = shares*p; }

  let divPerShareMonth = (rDivMonth0)*p;
  let dividendsCum = 0, totalContrib = initial;
  const data = [];
  for(let m=1;m<=months;m++){
    cash += monthly; totalContrib += monthly;
    const monthDividend = shares * divPerShareMonth; dividendsCum += monthDividend; cash += monthDividend;
    const gross = shares*p + cash; const afterFee = gross*(1+feeMonth); const feeAmount = gross - afterFee; cash -= feeAmount;
    if (p>0 && cash>0){ const buy = cash/p; shares += buy; cash = 0; }
    divPerShareMonth *= (1+gMonth);
    portfolioValue = shares*p + cash;
    data.push({ m, label:`M${m}`, portfolioValue:+portfolioValue.toFixed(2), dividendsCum:+dividendsCum.toFixed(2), shares:+shares.toFixed(6), totalContrib:+totalContrib.toFixed(2) });
  }
  return data;
}
