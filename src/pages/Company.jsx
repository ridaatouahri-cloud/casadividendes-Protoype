import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  ArrowLeft, ExternalLink, TrendingUp, Star, Bookmark, Share2,
  Settings, ChevronRight, Info, X, Sparkles, Link as LinkIcon, Play
} from "lucide-react";

/* =========================================================
   COMPANY PAGE V2.5 — Design d'origine + animations séquentielles
   - On garde le style et la structure validés
   - On ajoute la logique d'animation inspirée du fichier RTF
     (séquence C-DRS -> PRT -> NDF -> Score global)
   ========================================================= */

export default function CompanyPage() {
  // --- Données de démonstration (branche sur tes vraies props/store si besoin)
  const company = {
    ticker: "ATW",
    name: "ATTIJARIWAFA BANK",
    sector: "Banques",
    price: 480,
    currency: "MAD",
    logo: "/logos/ATW.svg",
  };
  const kpi = { cdrs: 82, prt: 68, ndf: 74, score: 86 };
  const dividends = [
    { year: 2020, exDate: "2021-07-05", paymentDate: "2021-08-27", dividend: 11 },
    { year: 2021, exDate: "2022-07-07", paymentDate: "2022-07-21", dividend: 13.5 },
    { year: 2022, exDate: "2023-07-10", paymentDate: "2023-07-23", dividend: 15.5 },
    { year: 2023, exDate: "2024-07-10", paymentDate: "2024-07-23", dividend: 17.0 },
  ];
  const sectorPeers = [
    { name: "ATW", cdrs: 82, yield: 3.6, prt: 68, ndf: 74 },
    { name: "BCP", cdrs: 78, yield: 3.8, prt: 65, ndf: 71 },
    { name: "CDM", cdrs: 75, yield: 3.1, prt: 62, ndf: 70 },
    { name: "TQM", cdrs: 80, yield: 4.2, prt: 58, ndf: 72 },
  ];

  // ======== dérivées (design V2.5 conservé) ========
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

  const fmtMAD = (v) => (v == null ? "—" : `${Number(v).toFixed(2)} ${currency}`);
  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d) ? "—" : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  };

  /* =========================================================
     LOGIQUE D'ANIMATION (séquentielle)
     idle -> cdrs -> prt -> ndf -> final
     Incrément en pas réguliers, textes dynamiques, tooltips
     ========================================================= */
  const [phase, setPhase] = useState("idle");
  const [hasAnimated, setHasAnimated] = useState(false);

  const [cdrsProgress, setCdrsProgress] = useState(0);
  const [prtProgress, setPrtProgress] = useState(0);
  const [ndfProgress, setNdfProgress] = useState(0);
  const [scoreProgress, setScoreProgress] = useState(0);

  const [calculationStep, setCalculationStep] = useState(0);
  const [showCDRSCalc, setShowCDRSCalc] = useState(false);
  const [prtStep, setPRTStep] = useState(0);
  const [showPRTCalc, setShowPRTCalc] = useState(false);
  const [ndfStep, setNDFStep] = useState(0);
  const [showNDFCalc, setShowNDFCalc] = useState(false);
  const [scoreStep, setScoreStep] = useState(0);
  const [showScoreCalc, setShowScoreCalc] = useState(false);

  const [bannerMsg, setBannerMsg] = useState("");

  const msgsCDRS = [
    "Nous analysons la régularité du dividende…",
    "Nous vérifions la stabilité des paiements…",
    "Nous mesurons la croissance…",
    "Nous évaluons la fiabilité globale…",
  ];
  const msgsPRT = [
    "Analyse du temps de retour sur investissement…",
    "Calcul du rythme moyen de remboursement…",
  ];
  const msgsNDF = [
    "Mesure du niveau de flux récurrents…",
    "Consolidation des signaux de solidité…",
  ];
  const finalMsg = "Nous combinons les 3 indicateurs clés (C-DRS, PRT, NDF) pour évaluer la solidité globale.";

  const startSequence = () => {
    if (phase !== "idle") return;
    setHasAnimated(true);
    // reset
    setCdrsProgress(0); setPRTStep(0); setNDFStep(0); setScoreStep(0);
    setPrtProgress(0); setNdfProgress(0); setScoreProgress(0);
    setPhase("cdrs"); setShowCDRSCalc(true); setCalculationStep(0);
  };

  // Helpers d’animation en pas réguliers
  const animateTo = (target, durationMs, onTick, onDone) => {
    const steps = 60;
    const inc = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      const val = Math.min(Math.round(inc * current), target);
      onTick(val);
      if (current >= steps) {
        clearInterval(timer);
        onDone && onDone();
      }
    }, durationMs / steps);
    return () => clearInterval(timer);
  };

  // C-DRS
  useEffect(() => {
    if (phase !== "cdrs") return;
    let i = 0;
    setBannerMsg(msgsCDRS[0]);
    const rot = setInterval(() => { i = (i + 1) % msgsCDRS.length; setBannerMsg(msgsCDRS[i]); }, 900);

    // étapes intermédiaires (visuel de "décomposition")
    const t1 = setTimeout(() => setCalculationStep(1), 100);
    const t2 = setTimeout(() => setCalculationStep(2), 1200);
    const t3 = setTimeout(() => setCalculationStep(3), 2400);
    const t4 = setTimeout(() => setCalculationStep(4), 3600);

    const tEnd = setTimeout(() => {
      setShowCDRSCalc(false);
      setCalculationStep(0);
      animateTo(Math.max(0, Math.min(100, kpi.cdrs)), 1500, setCdrsProgress, () => {
        clearInterval(rot);
        setTimeout(() => { setPhase("prt"); setShowPRTCalc(true); setPRTStep(0); }, 250);
      });
    }, 4600);

    return () => { clearInterval(rot); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(tEnd); };
  }, [phase, kpi.cdrs]);

  // PRT
  useEffect(() => {
    if (phase !== "prt") return;
    let i = 0;
    setBannerMsg(msgsPRT[0]);
    const rot = setInterval(() => { i = (i + 1) % msgsPRT.length; setBannerMsg(msgsPRT[i]); }, 1000);

    const p1 = setTimeout(() => setPRTStep(1), 120);
    const p2 = setTimeout(() => setPRTStep(2), 1000);
    const p3 = setTimeout(() => setPRTStep(3), 2000);
    const p4 = setTimeout(() => setPRTStep(4), 3000);

    const pEnd = setTimeout(() => {
      setShowPRTCalc(false); setPRTStep(0);
      animateTo(Math.max(0, Math.min(100, kpi.prt)), 1500, setPrtProgress, () => {
        clearInterval(rot);
        setTimeout(() => { setPhase("ndf"); setShowNDFCalc(true); setNDFStep(0); }, 250);
      });
    }, 3800);

    return () => { clearInterval(rot); clearTimeout(p1); clearTimeout(p2); clearTimeout(p3); clearTimeout(p4); clearTimeout(pEnd); };
  }, [phase, kpi.prt]);

  // NDF
  useEffect(() => {
    if (phase !== "ndf") return;
    let i = 0;
    setBannerMsg(msgsNDF[0]);
    const rot = setInterval(() => { i = (i + 1) % msgsNDF.length; setBannerMsg(msgsNDF[i]); }, 1000);

    const n1 = setTimeout(() => setNDFStep(1), 120);
    const n2 = setTimeout(() => setNDFStep(2), 1000);
    const n3 = setTimeout(() => setNDFStep(3), 2000);
    const n4 = setTimeout(() => setNDFStep(4), 3000);

    const nEnd = setTimeout(() => {
      setShowNDFCalc(false); setNDFStep(0);
      animateTo(Math.max(0, Math.min(100, kpi.ndf)), 1400, setNdfProgress, () => {
        clearInterval(rot);
        setTimeout(() => { setPhase("final"); setShowScoreCalc(true); setScoreStep(0); setBannerMsg(finalMsg); }, 300);
      });
    }, 3600);

    return () => { clearInterval(rot); clearTimeout(n1); clearTimeout(n2); clearTimeout(n3); clearTimeout(n4); clearTimeout(nEnd); };
  }, [phase, kpi.ndf]);

  // SCORE GLOBAL
  useEffect(() => {
    if (phase !== "final") return;
    const end = setTimeout(() => {
      animateTo(Math.max(0, Math.min(100, kpi.score)), 1300, setScoreProgress, () => {
        setTimeout(() => { setShowScoreCalc(false); setScoreStep(0); setBannerMsg(""); }, 1200);
      });
    }, 800);
    return () => clearTimeout(end);
  }, [phase, kpi.score]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      {/* halo décoratif */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-400/5 blur-3xl rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40rem] h-[40rem] bg-teal-400/5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-[1200px] xl:max-w-[1400px] mx-auto px-6 py-8">
        {/* Header (inchangé) */}
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
            <button className="rounded-xl px-3 py-2 bg-teal-500/15 border border-teal-500/30 text-teal-300 hover:bg-teal-500/25 flex items-center gap-2">
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

        {/* Nav sticky */}
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

        {/* Bandeau messages dynamiques */}
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

        {/* KPI Section (design gardé, animations ajoutées) */}
        <section id="kpi" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* C-DRS */}
          <CDRSCard
            value={kpi.cdrs}
            running={phase !== "idle"}
            showCalc={showCDRSCalc}
            step={calculationStep}
            progress={cdrsProgress}
            onStart={startSequence}
            tooltip="Indice de constance du dividende (régularité, stabilité, progression). Explication simplifiée, sans formule."
          />

          {/* PRT */}
          <PRTCard
            value={kpi.prt}
            active={phase !== "idle"}
            showCalc={showPRTCalc}
            step={prtStep}
            progress={prtProgress}
            tooltip="Temps de retour estimatif via le dividende. Mesure le rythme moyen de remboursement de l'investissement (explication simplifiée)."
          />

          {/* NDF */}
          <NDFCard
            value={kpi.ndf}
            active={phase !== "idle"}
            showCalc={showNDFCalc}
            step={ndfStep}
            progress={ndfProgress}
            tooltip="Niveau de flux : récurrence et soutenabilité des distributions."
          />

          {/* Score global */}
          <GlobalScoreCard
            value={kpi.score}
            showCalc={showScoreCalc}
            step={scoreStep}
            progress={scoreProgress}
            tooltip="Synthèse pondérée des KPI (C-DRS, PRT, NDF) évaluant la solidité globale."
          />
        </section>

        {/* Historique + Détails */}
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
                  <RTooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #27272a", color: "#e4e4e7" }} />
                  <Line type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm text-zinc-400">
              Somme annuelle des dividendes en {currency}. Données CasaDividendes (2020–2024).
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

        {/* Stratégie (inchangée) */}
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

        {/* Comparatif secteur (inchangé) */}
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
                      const active = String(payload.value).toUpperCase() === String(company.ticker).toUpperCase();
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

      {/* FAB mobile (inchangé) */}
      <div className="fixed bottom-6 right-6 xl:hidden">
        <button className="rounded-full w-12 h-12 flex items-center justify-center bg-teal-500 text-zinc-950 shadow-lg shadow-teal-500/20">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Scroll doux global */}
      <style>{`html { scroll-behavior: smooth; }`}</style>
    </div>
  );
}

/* =========================
   CARTES KPI — animations intégrées
   ========================= */

function TooltipInfo({ text }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <span
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        className="text-zinc-500 text-xs border border-zinc-700 rounded-md px-1.5 py-0.5 cursor-default"
      >
        i
      </span>
      {show && (
        <div className="absolute right-0 mt-2 z-20 w-64 text-xs leading-relaxed bg-zinc-950 border border-zinc-800 rounded-lg p-3 shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
}

/* C-DRS: cercle qui se remplit + textes dynamiques + bouton démarrage */
function CDRSCard({ value, running, showCalc, step, progress, onStart, tooltip }) {
  const target = Math.max(0, Math.min(100, value));
  const showing = running ? progress : target;
  const size = 116, stroke = 10, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const offset = c * (1 - (showing || 0) / 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 group">
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-500/10 via-emerald-500/0 to-transparent blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">C-DRS</div>
        <TooltipInfo text={tooltip} />
      </div>

      <div className="mt-2 relative flex items-center justify-center">
        {running && showCalc && <div className="absolute w-24 h-24 rounded-full bg-teal-500/10 animate-ping" />}
        <svg width={size} height={size} className="block">
          <circle cx={size/2} cy={size/2} r={r} stroke="#27272a" strokeWidth={stroke} fill="none" />
          <circle
            cx={size/2} cy={size/2} r={r}
            stroke="#14b8a6" strokeWidth={stroke} fill="none"
            strokeDasharray={c} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .45s ease" }}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold">
            {showing}
          </text>
        </svg>
      </div>

      {/* textes dynamiques durant le “calcul” */}
      {running && showCalc ? (
        <div className="mt-2 text-center text-xs text-zinc-400 min-h-[38px]">
          {step === 0 && "Initialisation…"}
          {step === 1 && "Nous analysons la régularité du dividende…"}
          {step === 2 && "Nous vérifions la stabilité des paiements…"}
          {step === 3 && "Nous mesurons la croissance…"}
          {step === 4 && "Nous évaluons la fiabilité globale…"}
        </div>
      ) : (
        <div className="text-xs text-zinc-500 mt-2 text-center">Constance du dividende</div>
      )}

      {/* Bouton déclencheur (uniquement au repos) */}
      {!running && (
        <button
          onClick={onStart}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm border border-teal-500/30 text-teal-300 hover:bg-teal-500/10"
        >
          <Play className="w-4 h-4" /> Lancer le calcul
        </button>
      )}
    </div>
  );
}

/* PRT: jauge horizontale avec shimmer pendant calcul */
function PRTCard({ value, active, showCalc, step, progress, tooltip }) {
  const target = Math.max(0, Math.min(100, value));
  const p = active ? progress : target;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-500/10 via-amber-500/0 to-transparent blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">PRT</div>
        <TooltipInfo text={tooltip} />
      </div>

      <div className="mt-3">
        <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden relative">
          {/* effet va-et-vient pendant le calcul */}
          {active && showCalc && (
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-amber-300/0 via-amber-300/20 to-amber-300/0"
              animate={{ x: ["-20%", "100%"] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div
            className="h-3 bg-amber-500/60 rounded-full transition-[width] duration-300"
            style={{ width: `${p}%` }}
          />
        </div>

        {/* textes courts durant le calcul */}
        {active && showCalc ? (
          <div className="mt-2 text-xs text-zinc-400 min-h-[30px]">
            {step === 0 && "Analyse…"}
            {step === 1 && "Analyse du temps de retour sur investissement…"}
            {step === 2 && "Calcul du rythme moyen de remboursement…"}
            {step === 3 && "Consolidation du profil de remboursement…"}
            {step === 4 && "Validation du PRT…"}
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Payout ratio tendanciel</span>
            <span className="text-zinc-300">{p}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* NDF: barre verticale avec motif animé */
function NDFCard({ value, active, showCalc, step, progress, tooltip }) {
  const target = Math.max(0, Math.min(100, value));
  const p = active ? progress : target;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-sky-500/10 via-sky-500/0 to-transparent blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">NDF</div>
        <TooltipInfo text={tooltip} />
      </div>

      <div className="mt-3 h-28 flex items-end justify-center">
        <div className="w-8 h-full bg-zinc-800 rounded-lg overflow-hidden relative">
          {active && showCalc && (
            <motion.div
              className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,#38bdf8_0%,transparent_60%)]"
              animate={{ backgroundPositionY: ["0%", "100%"] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div
            className="absolute bottom-0 left-0 right-0 bg-sky-400/60 transition-[height] duration-300"
            style={{ height: `${p}%` }}
          />
        </div>
      </div>

      {active && showCalc ? (
        <div className="mt-2 text-xs text-zinc-400 min-h-[30px] text-center">
          {step === 0 && "Calcul…"}
          {step === 1 && "Mesure du niveau de flux récurrents…"}
          {step === 2 && "Estimation de la tendance…"}
          {step === 3 && "Détermination de la fourchette…"}
          {step === 4 && "Validation du signal…"}
        </div>
      ) : (
        <div className="mt-2 text-xs text-zinc-500 text-center">Niveau de flux</div>
      )}
    </div>
  );
}

/* Global Score: anneau + compteur numérique */
function GlobalScoreCard({ value, showCalc, step, progress, tooltip }) {
  const size = 116, stroke = 10, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const v = progress || 0;
  const offset = c * (1 - v / 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-sm text-zinc-400 flex items-center justify-between">
        <span>Score global</span>
        <TooltipInfo text={tooltip} />
      </div>
      <div className="mt-2 relative flex items-center justify-center">
        {v > 0 && <div className="absolute w-24 h-24 rounded-full bg-teal-500/10 animate-ping" />}
        <svg width={size} height={size} className="block">
          <circle cx={size/2} cy={size/2} r={r} stroke="#27272a" strokeWidth={stroke} fill="none" />
          <circle
            cx={size/2} cy={size/2} r={r}
            stroke="#14b8a6" strokeWidth={stroke} fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .45s ease" }}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-100 font-semibold">
            {v}
          </text>
        </svg>
      </div>
      <div className="text-xs text-zinc-500 mt-2 text-center">
        Nous combinons les 3 indicateurs clés (C-DRS, PRT, NDF) pour évaluer la solidité globale.
      </div>
      {!showCalc && v === 0 && (
        <div className="text-[11px] text-zinc-500 mt-2 text-center">Cliquez d’abord sur C-DRS pour lancer la séquence.</div>
      )}
    </div>
  );
}

/* =========================
   Autres composants (identiques V2.5)
   ========================= */
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
