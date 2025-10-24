// src/pages/Home.jsx --- Page d'accueil CasaDividendes (sans Header/Footer)

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ========== ICONS ==========
const LineChart = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const ShieldCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TimerReset = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarDays = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Repeat2 = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const Mail = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// ========== SHARED COMPONENTS ==========

const StatCard = ({ title, value, sub, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-4 transition-all hover:-translate-y-1 hover:border-teal-400/30 ${className}`}
  >
    <div className="text-sm text-white/60">{title}</div>
    <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    {sub ? <div className="text-xs text-white/50 mt-1">{sub}</div> : null}
  </div>
);

// ========== ROUTES ==========
const ROUTES = {
  HOME: "#/",
  CALENDAR: "#/calendar",
  RANKING: "#/rankings",
  BLOG: "#/blog",
  PREMIUM: "#/premium",
  REGISTER: "#/register",
  FAQ: "#/faq",
};

// ========== HELPERS ==========
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut", delay },
  viewport: { once: true, amount: 0.2 },
});

const sectionClass = "relative overflow-hidden";

// ========== PAGE SECTIONS ==========

function HeroHome() {
  const [email, setEmail] = useState("");
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCTA(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    window.location.hash = ROUTES.REGISTER;
  };

  // Données dynamiques pour le dashboard
  const [liveData, setLiveData] = useState([
    { name: "Attijariwafa Bank", ticker: "ATW", value: 485.50, change: 2.3, color: "teal" },
    { name: "Maroc Telecom", ticker: "IAM", value: 145.80, change: -0.8, color: "red" },
    { name: "BCP", ticker: "BCP", value: 268.90, change: 1.5, color: "teal" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => prev.map(stock => ({
        ...stock,
        value: stock.value + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.3,
        color: stock.change >= 0 ? "teal" : "red"
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`min-h-screen ${sectionClass} flex items-center bg-[#0B0B0D]`} aria-label="Hero">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-24 -left-24 w-[50rem] h-[50rem] rounded-full blur-[160px] bg-gradient-to-br from-teal-500/12 to-emerald-400/6 animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-[55rem] h-[55rem] rounded-full blur-[180px] bg-gradient-to-br from-orange-500/15 to-amber-400/10 animate-pulse"
          style={{ animationDuration: "15s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 w-full px-8 lg:px-16 xl:px-24 py-20">
        <div className="max-w-[1800px] mx-auto grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Contenu gauche */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 mb-10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400/70 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400/90" />
              </span>
              <span className="text-[13px] tracking-wide text-zinc-400">
                Plateforme d'expertise dividendes · Maroc
              </span>
            </motion.div>

            <h1
              className="font-semibold leading-[1.08] tracking-[-0.02em] text-white text-5xl lg:text-6xl xl:text-7xl mb-8"
              style={{ fontFamily: "Inter, Manrope, Space Grotesk, ui-sans-serif, system-ui" }}
            >
              {/* Animation ultra-fluide et élégante */}
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Les dividendes marocains,
              </motion.span>
              
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                <span className="text-white">clairs, précis,</span>
              </motion.span>
              
              <motion.span
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.6, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
                className="block bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent"
              >
                maîtrisés.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 2.0 }}
              className="max-w-xl text-[18px] leading-relaxed text-zinc-400 mb-12"
            >
              La première plateforme marocaine dédiée aux dividendes de la Bourse de Casablanca :
              maximisez votre rentabilité, suivez chaque dividende, anticipez les paiements.
            </motion.p>

            {/* CTA fusionné avec fade élégant */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: showCTA ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              onSubmit={handleSubmit}
              className="relative max-w-xl"
            >
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre email"
                  required
                  className="w-full pl-6 pr-56 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-zinc-200 placeholder-zinc-500 text-[16px] focus:outline-none focus:border-teal-400/40 transition-all duration-500 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-black bg-gradient-to-r from-orange-400 to-amber-400 hover:to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Découvrir
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.form>
          </div>

          {/* Dashboard interactif à droite */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glow animé */}
              <motion.div
                animate={{
                  opacity: [0.4, 0.6, 0.4],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 bg-gradient-to-br from-teal-400/25 to-orange-400/25 rounded-3xl blur-3xl"
              />
              
              {/* Dashboard */}
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Portefeuille Dividendes</h3>
                    <p className="text-xs text-zinc-500">Performance en temps réel</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-teal-400/10 border border-teal-400/20">
                    <span className="text-xs font-medium text-teal-300">● LIVE</span>
                  </div>
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">Rendement moyen</p>
                    <p className="text-2xl font-bold text-teal-300">4.8%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">Prochains paiements</p>
                    <p className="text-2xl font-bold text-orange-300">12</p>
                  </div>
                </div>

                {/* Actions en temps réel */}
                <div className="space-y-3">
                  {liveData.map((stock, i) => (
                    <motion.div
                      key={stock.ticker}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.2 }}
                      className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.div
                            animate={{
                              boxShadow: stock.color === "teal"
                                ? ["0 0 0 rgba(20, 184, 166, 0)", "0 0 20px rgba(20, 184, 166, 0.3)", "0 0 0 rgba(20, 184, 166, 0)"]
                                : ["0 0 0 rgba(239, 68, 68, 0)", "0 0 20px rgba(239, 68, 68, 0.3)", "0 0 0 rgba(239, 68, 68, 0)"]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                              stock.color === "teal" ? "from-teal-400/20 to-emerald-400/10" : "from-red-400/20 to-orange-400/10"
                            } flex items-center justify-center`}
                          >
                            <span className="text-sm font-bold text-white">{stock.ticker}</span>
                          </motion.div>
                          <div>
                            <p className="text-sm font-medium text-white">{stock.name}</p>
                            <p className="text-xs text-zinc-500">{stock.ticker}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <motion.p
                            key={stock.value}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            className="text-base font-bold text-white"
                          >
                            {stock.value.toFixed(2)} MAD
                          </motion.p>
                          <motion.p
                            key={stock.change}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            className={`text-sm font-medium ${
                              stock.change >= 0 ? "text-teal-300" : "text-red-400"
                            }`}
                          >
                            {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mini chart indicator */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Mis à jour il y a quelques secondes</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                      Données en temps réel
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TradingViewTicker() {
  // Actions de la Bourse de Casablanca avec données mockées
  const stocks = [
    { ticker: "IAM", name: "Maroc Telecom", price: "145.50", change: "+2.3%" },
    { ticker: "ATW", name: "Attijariwafa Bank", price: "485.00", change: "+1.8%" },
    { ticker: "BCP", name: "Banque Populaire", price: "268.90", change: "-0.5%" },
    { ticker: "CSR", name: "Cosumar", price: "198.50", change: "+3.1%" },
    { ticker: "TQM", name: "Taqa Morocco", price: "876.00", change: "+0.9%" },
    { ticker: "LBV", name: "Label'Vie", price: "3420.00", change: "+1.2%" },
    { ticker: "LHM", name: "LafargeHolcim", price: "1845.00", change: "-0.3%" },
    { ticker: "MNG", name: "Managem", price: "2150.00", change: "+2.7%" },
    { ticker: "CIH", name: "CIH Bank", price: "325.00", change: "+0.6%" },
    { ticker: "CDM", name: "Centrale Danone", price: "1560.00", change: "-1.2%" },
    { ticker: "SMI", name: "SMI", price: "2890.00", change: "+1.5%" },
    { ticker: "SID", name: "Sonasid", price: "542.00", change: "-0.8%" },
  ];

  // Dupliquer pour un défilement infini fluide
  const duplicatedStocks = [...stocks, ...stocks];

  return (
    <section className="relative overflow-hidden bg-[#0B0B0D] border-y border-white/[0.03] py-4">
      <div className="flex animate-scroll">
        {duplicatedStocks.map((stock, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-6 flex items-center gap-3 whitespace-nowrap"
          >
            <span className="text-zinc-400 text-sm font-semibold tracking-wide">
              {stock.ticker}
            </span>
            <span className="text-zinc-500 text-sm">
              {stock.price} MAD
            </span>
            <span 
              className={`text-sm font-medium ${
                stock.change.startsWith('+') 
                  ? 'text-emerald-500' 
                  : 'text-red-500'
              }`}
            >
              {stock.change}
            </span>
          </div>
        ))}
      </div>
      
      {/* Gradient fade aux extrémités */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0B0B0D] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0B0B0D] to-transparent pointer-events-none" />
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function TickerBand() {
  // Entreprises cotées à la Bourse de Casablanca
  const companies = [
    "IAM", "ATTIJARIWAFA BANK", "BCP", "COSUMAR", "TAQA MOROCCO",
    "LABEL'VIE", "LAFARGEHOLCIM MAROC", "MANAGEM", "MAROC TELECOM",
    "CIH BANK", "BMCE BANK", "CDM", "CENTRALE DANONE", "CIMAR",
    "CMT", "COLORADO", "DISWAY", "EQDOM", "HPS", "LESIEUR CRISTAL",
    "MAGHREB OXYGENE", "MARSA MAROC", "MEDIACO", "MICROCRED",
    "MUTANDIS", "OULMES", "RDS", "RISMA", "REBAB", "SALAFIN",
    "SMI", "SNEP", "SODEP", "SONASID", "SOTHEMA", "STOKVIS",
    "STROC INDUSTRIE", "TGCC", "TIMAR", "UNIMER", "WAFA ASSURANCE"
  ];

  // Dupliquer pour un défilement infini fluide
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="relative overflow-hidden bg-[#0B0B0D] border-y border-white/[0.03] py-4">
      <div className="flex animate-scroll">
        {duplicatedCompanies.map((company, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-6 text-zinc-500 text-sm font-medium tracking-wide whitespace-nowrap"
          >
            {company}
          </div>
        ))}
      </div>
      
      {/* Gradient fade aux extrémités */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0B0B0D] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0B0B0D] to-transparent pointer-events-none" />
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function BrandMessage() {
  return (
    <section className="bg-[#0F1115] border-y border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-6">
        <motion.p {...fadeUp(0.05)} className="text-sm md:text-[15px] text-zinc-300 leading-relaxed">
          <span className="relative">
            CasaDividendes est une plateforme gratuite, conçue pour rendre l'analyse des dividendes accessible à tous.
            <span className="mx-2 text-zinc-500">·</span>
            L'accès aux outils d'analyse avancés est réservé aux membres inscrits.
            <span className="block mt-2 h-px w-40 bg-gradient-to-r from-teal-400/40 via-white/10 to-transparent" />
          </span>
        </motion.p>
      </div>
    </section>
  );
}

function ExclusiveTools() {
  const cards = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-teal-300/80" />,
      title: "C-DRS™",
      desc: "Dividend Reliability Score --- mesure la régularité et la résilience du versement.",
      tag: "Score de fiabilité",
    },
    {
      icon: <TimerReset className="h-6 w-6 text-amber-300/80" />,
      title: "PRT™",
      desc: "Payback Rotation Time --- temps estimé pour récupérer l'investissement via dividendes.",
      tag: "Rotation dividendes",
    },
    {
      icon: <CalendarDays className="h-6 w-6 text-teal-300/80" />,
      title: "NDF™",
      desc: "Next Dividend Forecast --- projection de la prochaine date et montant probable.",
      tag: "Prévision prochaine",
    },
    {
      icon: <Repeat2 className="h-6 w-6 text-amber-300/80" />,
      title: "DRIP Simulator",
      desc: "Réinvestissement automatique --- simule la capitalisation des dividendes.",
      tag: "Réinvestissement",
    },
  ];

  return (
    <section className={`${sectionClass} bg-[#0B0B0D]`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 md:py-24">
        <motion.div {...fadeUp(0.05)} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Indicateurs exclusifs,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              décisions éclairées
            </span>
          </h2>
          <p className="mt-3 text-zinc-400">
            Des signaux clairs pour piloter vos revenus passifs avec précision.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              {...fadeUp(0.1 + i * 0.05)}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 hover:border-amber-400/30 transition-all"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-amber-400/10 via-transparent to-teal-400/10" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/40 p-3">
                  {c.icon}
                </div>
                <h3 className="mt-4 text-white font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-[12px] text-zinc-400">
                  <LineChart className="h-4 w-4 text-teal-300/70" />
                  {c.tag}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "12 000+", label: "Dividendes suivis" },
    { value: "80+", label: "Sociétés cotées" },
    { value: "2 000+", label: "Investisseurs" },
  ];

  return (
    <section className="bg-[#0F1115] py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <motion.h2
          {...fadeUp(0.05)}
          className="text-center text-xl md:text-2xl font-medium text-white/90 mb-10"
        >
          Déjà plus de 2 000 investisseurs marocains utilisent CasaDividendes
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(0.1 + i * 0.05)}>
              <StatCard title={s.label} value={s.value} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Values() {
  const items = [
    {
      t: "Calendrier intelligent",
      d: "Accédez à tous les dividendes de la Bourse de Casa, organisés par date. Filtrez, exportez et planifiez vos investissements en quelques clics.",
      icon: <CalendarDays className="h-6 w-6" />,
    },
    {
      t: "Alertes personnalisées",
      d: "Ne manquez plus aucune date importante. Alertes automatiques avant chaque ex-dividende et paiement, personnalisables selon vos préférences.",
      icon: <TimerReset className="h-6 w-6" />,
    },
    {
      t: "Outils d'analyse et pilotage",
      d: "Scores de sécurité, simulateurs, projections DRIP et suivi de performance. Tous les outils pour analyser, décider et piloter vos revenus passifs.",
      icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
      t: "Pédagogie investisseur",
      d: "Guides pratiques, analyses sectorielles et décryptages fiscaux. Apprenez les fondamentaux et affinez votre stratégie avec du contenu accessible.",
      icon: <Repeat2 className="h-6 w-6" />,
    },
  ];

  return (
    <section className="px-6 lg:px-12 py-12 bg-[#0B0B0D]">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {items.map((it, idx) => (
          <motion.div
            key={it.t}
            {...fadeUp(0.05 + idx * 0.05)}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-teal-400/30"
          >
            <div className="text-teal-300/80">{it.icon}</div>
            <h3 className="text-white font-semibold mt-3 group-hover:text-teal-300/90">
              {it.t}
            </h3>
            <p className="text-zinc-400 mt-2 text-sm">{it.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PalmaresPreview() {
  const rows = [
    { r: 1, t: "IAM", n: "Maroc Telecom", y: "5.2%", pay: "28/06" },
    { r: 2, t: "BCP", n: "Banque Populaire", y: "4.8%", pay: "21/06" },
    { r: 3, t: "ATW", n: "Attijariwafa Bank", y: "4.3%", pay: "05/07" },
  ];

  return (
    <section className="px-6 lg:px-12 pb-12 bg-[#0F1115]">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp(0.05)} className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Aperçu Palmarès</h2>
          <a href={ROUTES.RANKING} className="text-teal-300/90 hover:underline text-sm">
            Voir le palmarès complet
          </a>
        </motion.div>
        <motion.div {...fadeUp(0.12)} className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/[0.03] text-zinc-300">
              <tr>
                <th className="text-left p-3">Rang</th>
                <th className="text-left p-3">Ticker</th>
                <th className="text-left p-3">Société</th>
                <th className="text-left p-3">Rendement</th>
                <th className="text-left p-3">Paiement</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.r} className="border-t border-white/8">
                  <td className="p-3 text-zinc-300">{d.r}</td>
                  <td className="p-3 text-white">{d.t}</td>
                  <td className="p-3 text-zinc-200">{d.n}</td>
                  <td className="p-3 text-teal-300 font-medium">{d.y}</td>
                  <td className="p-3 text-zinc-300">{d.pay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [formData, setFormData] = useState({ email: "", hp: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setStatus("error");
      setMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, hp: formData.hp }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setFormData({ email: "", hp: "" });
      } else {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue");
      }
    } catch {
      setStatus("error");
      setMessage("Impossible de se connecter au serveur. Veuillez réessayer.");
    }
  };

  return (
    <section className="px-6 lg:px-12 py-16 bg-[#0B0B0D]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          {...fadeUp(0.05)}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm p-8 md:p-12 overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-teal-400/20 to-orange-400/20 rounded-full blur-3xl" />
          
          <div className="relative text-center">
            <Mail className="h-12 w-12 text-teal-300/80 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Restez informé(e)
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Recevez nos analyses et alertes dividendes avant tout le monde. Prochains versements, tendances sectorielles et conseils exclusifs.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={status === "loading"}
                className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                placeholder="Votre adresse email"
                required
              />
              <input
                type="text"
                name="hp"
                value={formData.hp}
                onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                autoComplete="off"
                tabIndex="-1"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition-all disabled:opacity-60"
              >
                {status === "loading" ? "..." : "S'inscrire"}
              </button>
            </form>

            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-4 text-sm ${
                  status === "success" ? "text-teal-300" : "text-orange-300"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactSupport() {
  return (
    <section className="px-6 lg:px-12 py-16 bg-[#0F1115]">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp(0.05)} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            Contact & Support
          </h2>
          <p className="text-zinc-400">
            Une question ? Besoin d'aide ? Notre équipe est à votre écoute.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center"
          >
            <Mail className="h-8 w-8 text-teal-300/80 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Email Support</h3>
            <a
              href="mailto:support@casadividendes.ma"
              className="text-sm text-teal-300 hover:text-teal-200 underline-offset-4 hover:underline"
            >
              support@casadividendes.ma
            </a>
          </motion.div>

          <motion.div
            {...fadeUp(0.15)}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center"
          >
            <ShieldCheck className="h-8 w-8 text-amber-300/80 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">FAQ & Aide</h3>
            <a
              href={ROUTES.FAQ}
              className="text-sm text-teal-300 hover:text-teal-200 underline-offset-4 hover:underline"
            >
              Consulter la FAQ
            </a>
          </motion.div>

          <motion.div
            {...fadeUp(0.2)}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center"
          >
            <LineChart className="h-8 w-8 text-teal-300/80 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Support Premium</h3>
            <p className="text-sm text-zinc-400">
              Assistance prioritaire pour les membres Premium
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SignupCTA() {
  return (
    <section className="border-y border-white/10 bg-gradient-to-r from-[#0B0B0D] via-[#0F1115] to-[#0B0B0D]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12 text-center">
        <motion.div {...fadeUp(0.05)}>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Créez votre compte gratuit pour accéder à nos outils exclusifs
          </h2>
          <p className="text-zinc-400 mb-6">
            Calendrier intelligent, alertes personnalisées, scores de fiabilité et bien plus.
          </p>
          <a
            href={ROUTES.REGISTER}
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition-all shadow-[0_8px_30px_rgba(255,140,0,0.25)]"
          >
            Créer mon compte gratuitement
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ========== MAIN COMPONENT ==========
export default function Home() {
  useEffect(() => {
    document.title =
      "CasaDividendes — Plateforme Premium des Dividendes | Bourse de Casablanca";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    const content =
      "La plateforme de référence pour analyser, suivre et optimiser vos dividendes sur la Bourse de Casablanca. Calendrier intelligent, scores exclusifs, analyses historiques.";
    
    if (metaDescription) {
      metaDescription.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="bg-[#0B0B0D] text-white selection:bg-amber-400/30 selection:text-white">
      <HeroHome />
      <TickerBand />
      <BrandMessage />
      <TradingViewTicker />
      <ExclusiveTools />
      <StatsSection />
      <Values />
      <PalmaresPreview />
      <Newsletter />
      <ContactSupport />
      <SignupCTA />
    </div>
  );
}