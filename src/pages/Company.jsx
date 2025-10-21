import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  ArrowLeft, ExternalLink, TrendingUp, Star, Bookmark, Share2,
  Settings, ChevronRight, Info, X, Sparkles, Link as LinkIcon, Play
} from "lucide-react";

/* =========================================================
   COMPANY PAGE PREMIUM (V2.5 + "calcul premium" séquentiel)
   ========================================================= */

export default function CompanyPagePremium({
  company = {
    ticker: "ATW",
    name: "ATTIJARIWAFA BANK",
    sector: "Banques",
    price: 480,
    currency: "MAD",
    logo: "/logos/ATW.svg",
  },
  kpi = { cdrs: 82, prt: 68, ndf: 74, score: 86 },
  dividends = [
    { year: 2020, exDate: "2021-07-05", paymentDate: "2021-08-27", dividend: 11 },
    { year: 2021, exDate: "2022-07-07", paymentDate: "2022-07-21", dividend: 13.5 },
    { year: 2022, exDate: "2023-07-10", paymentDate: "2023-07-23", dividend: 15.5 },
    { year: 2023, exDate: "2024-07-10", paymentDate: "2024-07-23", dividend: 17.0 },
  ],
  sectorPeers = [
    { name: "ATW", cdrs: 82, yield: 3.6, prt: 68, ndf: 74 },
    { name: "BCP", cdrs: 78, yield: 3.8, prt: 65, ndf: 71 },
    { name: "CDM", cdrs: 75, yield: 3.1, prt: 62, ndf: 70 },
    { name: "TQM", cdrs: 80, yield: 4.2, prt: 58, ndf: 72 },
  ],
}) {
  const [showDRIP, setShowDRIP] = useState(false);

  // ======== derived ========
  const currency = company.currency || "MAD";
  const yearSorted = useMemo(
    () =>
      [...dividends].sort((a, b) =>
        a.year === b.year ? new Date(a.exDate) - new Date(b.exDate) : a.year - b.year
      ),
    [dividends]
  );
  const yearly = useMemo(() => {
    const map = new Map();
    for (const d of yearSorted) map.set(d.year, (map.get(d.year) || 0) + Number(d.dividend || 0));
    return Array.from(map.entries()).map(([year, total]) => ({ year, total: Number(total.toFixed(2)) }));
  }, [yearSorted]);

  const cagr = useMemo(() => {
    if (yearly.length < 2) return null;
    const sorted = [...yearly].sort((a, b) => a.year - b.year);
    const y0 = sorted[0].total, yN = sorted[sorted.length - 1].total, n = sorted.length - 1;
    if (y0 <= 0 || n <= 0) return null;
    return Number(((Math.pow(yN / y0, 1 / n) - 1) * 100).toFixed(1));
  }, [yearly]);

  // ======== helpers ========
  const fmtMAD = (v) => (v == null ? "—" : `${Number(v).toFixed(2)} ${currency}`);
  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d) ? "—" : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  };

  /* =========================================================
     STATE MACHINE du "calcul premium"
     phases: idle → cdrs → prt → ndf → final
     ========================================================= */
  const [phase, setPhase] = useState("idle");
  const [cdrsProgress, setCdrsProgress] = useState(0);
  const [prtProgress, setPrtProgress] = useState(0);
  const [ndfProgress, setNdfProgress] = useState(0);
  const [scoreProgress, setScoreProgress] = useState(0);
  const [message, setMessage] = useState("");

  const msgsCdrs = [
    "Nous analysons la régularité du dividende…",
    "Nous vérifions la stabilité des paiements…",
    "Nous mesurons la croissance…",
    "Nous évaluons la fiabilité globale…",
  ];
  const msgsPrt = [
    "Analyse du temps de retour sur investissement…",
    "Calcul du rythme moyen de remboursement…",
  ];
  const msgsNdf = [
    "Mesure du niveau de flux récurrents…",
    "Consolidation des signaux de solidité…",
  ];
  const finalMsg =
    "Nous combinons les 3 indicateurs clés (C-DRS, PRT, NDF) pour évaluer la solidité globale.";

  // Séquence orchestrée
  const runSequence = () => {
    if (phase !== "idle") return;
    setPhase("cdrs");
  };

  // C-DRS
  useEffect(() => {
    if (phase !== "cdrs") return;
    let i = 0;
    setMessage(msgsCdrs[0]);
    const msgTimer = setInterval(() => {
      i = (i + 1) % msgsCdrs.length;
      setMessage(msgsCdrs[i]);
    }, 900);

    const start = performance.now();
    const target = Math.max(0, Math.min(100, kpi.cdrs));
    let raf;
    const animate = (t) => {
      const p = Math.min(1, (t - start) / 1600);
      setCdrsProgress(Math.round(target * p));
      if (p < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        clearInterval(msgTimer);
        setTimeout(() => setPhase("prt"), 300);
      }
    };
    raf = requestAnimationFrame(animate);

    return () => {
      clearInterval(msgTimer);
      cancelAnimationFrame(raf);
    };
  }, [phase, kpi.cdrs]);

  // PRT
  useEffect(() => {
    if (phase !== "prt") return;
    let i = 0;
    setMessage(msgsPrt[0]);
    const msgTimer = setInterval(() => {
      i = (i + 1) % msgsPrt.length;
      setMessage(msgsPrt[i]);
    }, 1000);

    const start = performance.now();
    const target = Math.max(0, Math.min(100, kpi.prt));
    let raf;
    const animate = (t) => {
      const p = Math.min(1, (t - start) / 1600);
      setPrtProgress(Math.round(target * p));
      if (p < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        clearInterval(msgTimer);
        setTimeout(() => setPhase("ndf"), 300);
      }
    };
    raf = requestAnimationFrame(animate);

    return () => {
      clearInterval(msgTimer);
      cancelAnimationFrame(raf);
    };
  }, [phase, kpi.prt]);

  // NDF
  useEffect(() => {
    if (phase !== "ndf") return;
    let i = 0;
    setMessage(msgsNdf[0]);
    const msgTimer = setInterval(() => {
      i = (i + 1) % msgsNdf.length;
      setMessage(msgsNdf[i]);
    }, 1000);

    const start = performance.now();
    const target = Math.max(0, Math.min(100, kpi.ndf));
    let raf;
    const animate = (t) => {
      const p = Math.min(1, (t - start) / 1400);
      setNdfProgress(Math.round(target * p));
      if (p < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        clearInterval(msgTimer);
        setTimeout(() => setPhase("final"), 350);
      }
    };
    raf = requestAnimationFrame(animate);

    return () => {
      clearInterval(msgTimer);
      cancelAnimationFrame(raf);
    };
  }, [phase, kpi.ndf]);

  // Final score
  useEffect(() => {
    if (phase !== "final") return;
    setMessage(finalMsg);
    const start = performance.now();
    const target = Math.max(0, Math.min(100, kpi.score));
    let raf;
    const animate = (t) => {
      const p = Math.min(1, (t - start) / 1300);
      setScoreProgress(Math.round(target * p));
      if (p < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        // fin de séquence → message reste affiché un moment
        setTimeout(() => setMessage(""), 1600);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase, kpi.score]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      {/* Decorative halo */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-400/5 blur-3xl rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40rem] h-[40rem] bg-teal-400/5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-[1200px] xl:max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <header id="profil" className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-teal-500/40">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img src={company.logo} alt="" className="w-12 h-12 rounded-lg border border-zinc-800 bg-zinc-900/70 object-contain" />
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{company.name}</h1>
              <div className="text-sm text-zinc-400">{company.ticker} • {company.sector}</div>
            </div>
          </div>

          <div className="md:ml-auto flex items-center gap-3">
            <button
              onClick={() => setShowDRIP(true)}
              className="rounded-xl px-3 py-2 bg-teal-500/15 border border-teal-500/30 text-teal-300 hover:bg-teal-500/25 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" /> DRIP
            </button>
            <a
              href={`/#/calendar?ticker=${encodeURIComponent(company.ticker)}`}
              className="rounded-xl px-3 py-2 bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/40 text-amber-300 flex items-center gap-2"
            >
              📅 Calendrier
            </a>
            <a
              href="https://www.casablanca-bourse.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl px-3 py-2 bg-zinc-900/60 border border-zinc-800 hover:border-teal-500/40 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Fiche BVC
            </a>
            <button className="rounded-xl p-2 bg-zinc-900/60 border border-zinc-800 hover:border-teal-500/40">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Sticky Anchor Nav */}
        <nav className="sticky top-4 z-20 mb-6">
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
        </nav>

        {/* KPI Section — interactive */}
        <section id="kpi" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* C-DRS: déclenche la séquence */}
          <KPI_CDRS
            title="C-DRS"
            value={kpi.cdrs}
            progress={phase === "idle" ? 0 : cdrsProgress}
            onStart={runSequence}
            running={phase !== "idle"}
            tooltip="Indice de constance du dividende dans le temps. Analyse la régularité, la stabilité et la progression du dividende (explication simplifiée, sans formule)."
          />

          {/* PRT: jauge horizontale */}
          <KPI_PRT
            title="PRT"
            value={kpi.prt}
            progress={phase === "prt" || phase === "ndf" || phase === "final" ? prtProgress : 0}
            active={phase !== "idle"}
            tooltip="Temps de retour sur investissement estimatif. Mesure le rythme auquel le dividende rembourse le prix d’entrée (explication simplifiée)."
          />

          {/* NDF: barre verticale */}
          <KPI_NDF
            title="NDF"
            value={kpi.ndf}
            progress={phase === "ndf" || phase === "final" ? ndfProgress : 0}
            active={phase !== "idle"}
            tooltip="Niveau de flux : indicateur de soutenabilité des distributions et de la récurrence des paiements (explication simplifiée)."
          />

          {/* Score global: anneau + compteur */}
          <KPI_Global
            value={phase === "final" ? scoreProgress : 0}
            target={kpi.score}
            tooltip="Score synthétique pondéré combinant C-DRS, PRT et NDF pour évaluer la solidité globale."
          />
        </section>

        {/* Bandeau message dynamique pendant la séquence */}
        <AnimatePresence>
          {!!message && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History + Chart */}
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
                  <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #27272a", color: "#e4e4e7" }} />
                  <Line type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm text-zinc-400">
              Somme annuelle des dividendes en {currency}. Données issues de CasaDividendes (2020–2024).
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold mb-3">Détails (ex-date / paiement)</h3>
            <ul className="divide-y divide-zinc-800">
              {yearSorted.map((d, i) => (
                <li key={`${d.year}-${i}`} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{d.year}</div>
                    <div className="text-xs text-zinc-400">
                      Ex-date: {fmtDate(d.exDate)} • Paiement: {fmtDate(d.paymentDate)}
                    </div>
                  </div>
                  <div className="text-teal-300 font-semibold">{fmtMAD(Number(d.dividend))}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Strategy */}
        <section id="strategy" className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 mb-10">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              Stratégie recommandée <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <a href="#history" className="text-sm text-amber-300 hover:underline flex items-center gap-1">
              Voir l’historique <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="mt-3 grid md:grid-cols-3 gap-4">
            <StrategyCard title="Profil" points={[
              "Entreprise solide et régulière sur le dividende",
              "C-DRS élevé → constance attractive",
              "NDF soutenu (flux récurrents)",
            ]}/>
            <StrategyCard title="Entrée idéale" points={[
              "Sur repli vers PRT bas",
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

        {/* Compare Sector */}
        <section id="compare" className="grid lg:grid-cols-2 gap-6 mb-16">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold mb-3">Comparatif secteur (Radar)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={sectorPeers}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis
                    dataKey="name"
                    stroke="#a1a1aa"
                    tick={(props) => {
                      const { x, y, payload, textAnchor } = props;
                      const active =
                        String(payload.value).toUpperCase() === String(company.ticker).toUpperCase();
                      return (
                        <text
                          x={x} y={y} textAnchor={textAnchor} fontSize={12}
                          fill={active ? "#14b8a6" : "#a1a1aa"} fontWeight={active ? 700 : 400}
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                  />
                  <PolarRadiusAxis stroke="#52525b" />
                  <Radar name="C-DRS" dataKey="cdrs" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.20} />
                  <Radar name="Yield" dataKey="yield" stroke="#eab308" fill="#eab308" fillOpacity={0.15} />
                  <Radar name="PRT" dataKey="prt" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} />
                  <Radar name="NDF" dataKey="ndf" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.12} />
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

        {/* Footer */}
        <footer className="text-sm text-zinc-500 pb-16 border-t border-zinc-800/60 pt-4">
          Données CasaDividendes — à titre informatif. © {new Date().getFullYear()}
        </footer>
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 xl:hidden">
        <button className="rounded-full w-12 h-12 flex items-center justify-center bg-teal-500 text-zinc-950 shadow-lg shadow-teal-500/20">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* DRIP Modal */}
      <AnimatePresence>
        {showDRIP && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="w-[92vw] max-w-[680px] rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">DRIP — Réinvestissement des dividendes</h3>
                <button onClick={() => setShowDRIP(false)} className="p-2 rounded-lg hover:bg-zinc-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                Simulez l’impact du réinvestissement automatique des dividendes sur votre position.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Montant initial" suffix={currency} defaultValue="10000" />
                <Field label="Horizon (ans)" defaultValue="5" />
                <Field label="Rendement (%)" defaultValue="3.5" />
              </div>
              <div className="mt-4 text-right">
                <button className="rounded-xl px-4 py-2 bg-teal-500/20 border border-teal-500/30 text-teal-300 hover:bg-teal-500/30">
                  Calculer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll doux global */}
      <style>{`
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

/* =========================
   KPI COMPONENTS (interactifs)
   ========================= */

// C-DRS : cercle qui se remplit + tooltip + bouton de lancement
function KPI_CDRS({ title, value, progress, onStart, running, tooltip }) {
  const target = Math.max(0, Math.min(100, value));
  const showing = running ? progress : 0;
  const size = 116, stroke = 10, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const offset = c * (1 - (showing || 0) / 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 group">
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-500/10 via-emerald-500/0 to-transparent blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">{title}</div>
        <TooltipInfo text={tooltip} />
      </div>

      <div className="mt-2 relative flex items-center justify-center">
        {/* halo animé lorsque ça tourne */}
        {running && (
          <div className="absolute w-24 h-24 rounded-full bg-teal-500/10 animate-ping" />
        )}
        <svg width={size} height={size} className="block">
          <circle cx={size/2} cy={size/2} r={r} stroke="#27272a" strokeWidth={stroke} fill="none" />
          <circle
            cx={size/2} cy={size/2} r={r}
            stroke="#14b8a6" strokeWidth={stroke} fill="none"
            strokeDasharray={c} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .5s ease" }}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold">
            {running ? showing : target}
          </text>
        </svg>
      </div>

      <div className="text-xs text-zinc-500 mt-2 text-center">Constance du dividende</div>

      {/* Bouton démarrage */}
      <button
        onClick={onStart}
        disabled={running}
        className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm border transition
          ${running ? "border-zinc-800 text-zinc-500 cursor-not-allowed" : "border-teal-500/30 text-teal-300 hover:bg-teal-500/10"}`}
      >
        <Play className="w-4 h-4" /> Lancer le calcul
      </button>
    </div>
  );
}

// PRT : jauge horizontale + effet va-et-vient pendant le calcul + tooltip
function KPI_PRT({ title, value, progress, active, tooltip }) {
  const target = Math.max(0, Math.min(100, value));
  const p = active ? progress : 0;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-500/10 via-amber-500/0 to-transparent blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">{title}</div>
        <TooltipInfo text={tooltip} />
      </div>

      <div className="mt-3">
        <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden relative">
          {/* va-et-vient shimmer pendant le calcul */}
          {active && p < target && (
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-amber-300/0 via-amber-300/20 to-amber-300/0"
              animate={{ x: ["-20%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div
            className="h-3 bg-amber-500/60 rounded-full transition-[width] duration-300"
            style={{ width: `${p}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-zinc-500">Payout ratio tendanciel</span>
          <span className="text-zinc-300">{active ? p : target}</span>
        </div>
      </div>
    </div>
  );
}

// NDF : barre verticale + tooltip
function KPI_NDF({ title, value, progress, active, tooltip }) {
  const target = Math.max(0, Math.min(100, value));
  const p = active ? progress : 0;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-sky-500/10 via-sky-500/0 to-transparent blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">{title}</div>
        <TooltipInfo text={tooltip} />
      </div>

      <div className="mt-3 h-28 flex items-end justify-center">
        <div className="w-8 h-full bg-zinc-800 rounded-lg overflow-hidden relative">
          {/* animation interne */}
          {active && p < target && (
            <motion.div
              className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,#38bdf8_0%,transparent_60%)]"
              animate={{ backgroundPositionY: ["0%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div
            className="absolute bottom-0 left-0 right-0 bg-sky-400/60 transition-[height] duration-300"
            style={{ height: `${p}%` }}
          />
        </div>
      </div>
      <div className="mt-2 text-xs text-zinc-300 text-center">{active ? p : target}</div>
      <div className="text-xs text-zinc-500 text-center">Niveau de flux</div>
    </div>
  );
}

// Global score : anneau + compteur numérique + tooltip
function KPI_Global({ value, target, tooltip }) {
  const size = 116, stroke = 10, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const offset = c * (1 - v / 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-sm text-zinc-400 flex items-center justify-between">
        <span>Score global</span>
        <TooltipInfo text="Synthèse pondérée des trois indicateurs clés (C-DRS, PRT, NDF). Plus le score est élevé, plus la solidité globale est robuste." />
      </div>
      <div className="mt-2 relative flex items-center justify-center">
        {v > 0 && <div className="absolute w-24 h-24 rounded-full bg-teal-500/10 animate-ping" />}
        <svg width={size} height={size} className="block">
          <circle cx={size/2} cy={size/2} r={r} stroke="#27272a" strokeWidth={stroke} fill="none" />
          <circle
            cx={size/2} cy={size/2} r={r}
            stroke="#14b8a6" strokeWidth={stroke} fill="none"
            strokeDasharray={c} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .5s ease" }}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold">
            {v || 0}
          </text>
        </svg>
      </div>
      <div className="text-xs text-zinc-500 mt-2 text-center">
        Nous combinons les 3 indicateurs clés (C-DRS, PRT, NDF) pour évaluer la solidité globale.
      </div>
      {v === 0 && (
        <div className="text-[11px] text-zinc-500 mt-2 text-center">
          Cliquez d’abord sur C-DRS pour lancer la séquence.
        </div>
      )}
    </div>
  );
}

/* =========================
   Small shared components
   ========================= */

function TooltipInfo({ text }) {
  return (
    <div className="relative">
      <span className="text-zinc-500 text-xs border border-zinc-700 rounded-md px-1.5 py-0.5 cursor-default">i</span>
      <div className="absolute right-0 mt-2 hidden group-hover:block md:group-hover:block z-20 w-64 text-xs leading-relaxed bg-zinc-950 border border-zinc-800 rounded-lg p-3 shadow-lg">
        {text}
      </div>
    </div>
  );
}

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

function Field({ label, suffix, defaultValue }) {
  return (
    <label className="text-sm">
      <div className="text-zinc-400 mb-1">{label}</div>
      <div className="flex">
        <input
          defaultValue={defaultValue}
          className="flex-1 rounded-l-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm focus:border-teal-500 outline-none"
        />
        {suffix && (
          <div className="rounded-r-lg border border-l-0 border-zinc-800 px-3 py-2 text-sm bg-zinc-900/60 text-zinc-300">
            {suffix}
          </div>
        )}
      </div>
    </label>
  );
}
