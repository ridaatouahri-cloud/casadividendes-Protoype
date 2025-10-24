import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Icons as SVG components
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

const Search = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Mail = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Twitter = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Linkedin = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut", delay },
  viewport: { once: true, amount: 0.2 },
});

const sectionClass = "relative overflow-hidden";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0D]/95 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a
              href="#/"
              className="text-xl font-semibold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent"
            >
              CasaDividendes
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#/calendar" className="text-sm text-zinc-300 hover:text-white transition-colors">
                Calendrier
              </a>
              <a href="#/rankings" className="text-sm text-zinc-300 hover:text-white transition-colors">
                Palmarès
              </a>
              <a href="#/blog" className="text-sm text-zinc-300 hover:text-white transition-colors">
                Blog
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 focus-within:border-teal-400/30 transition-all">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une société, un dividende…"
                className="w-56 bg-transparent text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => (window.location.hash = "#/premium")}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-orange-400 to-amber-400 text-black hover:brightness-110 transition-all"
            >
              Premium
            </button>

            <button
              onClick={() => (window.location.hash = "#/login")}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroHome() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    window.location.hash = "#/register";
  };

  return (
    <section
      className={`min-h-[88vh] ${sectionClass} flex items-center bg-[#0B0B0D]`}
      aria-label="Hero"
    >
      <div className="absolute inset-0">
        <div
          className="absolute -top-24 -left-24 w-[38rem] h-[38rem] rounded-full blur-[140px] bg-gradient-to-br from-teal-500/10 to-emerald-400/5 animate-pulse"
          style={{ animationDuration: "9s" }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-[40rem] h-[40rem] rounded-full blur-[160px] bg-gradient-to-br from-orange-500/12 to-amber-400/8 animate-pulse"
          style={{ animationDuration: "11s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400/70 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400/90" />
              </span>
              <span className="text-[13px] tracking-wide text-zinc-400">
                Plateforme d'expertise dividendes · Maroc
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="font-semibold leading-[1.06] tracking-[-0.02em] text-white text-5xl lg:text-6xl"
              style={{ fontFamily: "Inter, Manrope, Space Grotesk, ui-sans-serif, system-ui" }}
            >
              Les dividendes marocains,<br />
              <span className="text-white">clairs, précis,</span>{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                maîtrisés.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-6 max-w-xl text-[17px] leading-relaxed text-zinc-400"
            >
              La première plateforme marocaine dédiée aux dividendes de la Bourse de Casablanca :
              maximisez votre rentabilité, suivez chaque dividende, anticipez les paiements et
              optimisez vos décisions avec nos outils d'analyse.
            </motion.p>

            <motion.form {...fadeUp(0.32)} onSubmit={handleSubmit} className="mt-10 flex flex-wrap gap-3 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
                className="flex-1 min-w-[200px] px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold text-black transition-all bg-gradient-to-r from-orange-400 to-amber-400 hover:to-orange-500 shadow-[0_8px_30px_rgba(255,140,0,0.25)] hover:shadow-[0_10px_38px_rgba(255,140,0,0.33)]"
              >
                Découvrir la plateforme
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.form>
          </div>

          <motion.div {...fadeUp(0.4)} className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-orange-400/20 rounded-2xl blur-3xl" />
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-sm shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-sm font-medium text-white">Tableau de bord</span>
                    <span className="text-xs text-teal-300">En temps réel</span>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400/20 to-orange-400/20" />
                        <div>
                          <div className="text-sm font-medium text-white">Société {i}</div>
                          <div className="text-xs text-zinc-500">Ticker</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-teal-300">{4 + i}.{i}%</div>
                        <div className="text-xs text-zinc-500">Rendement</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BrandMessage() {
  return (
    <section className="bg-[#0F1115] border-y border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-6">
        <motion.p
          {...fadeUp(0.05)}
          className="text-sm md:text-[15px] text-zinc-300 leading-relaxed"
        >
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
          className="text-center text-xl md:text-2xl font-medium text-white/90"
        >
          Déjà plus de 2 000 investisseurs marocains utilisent CasaDividendes
        </motion.h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp(0.1 + i * 0.05)}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white">{s.value}</div>
              <div className="mt-1 text-zinc-400">{s.label}</div>
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
          <button
            onClick={() => (window.location.hash = "#/rankings")}
            className="text-teal-300/90 hover:underline text-sm"
          >
            Voir le palmarès complet
          </button>
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
              href="#/faq"
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
          <button
            onClick={() => (window.location.hash = "#/register")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition-all shadow-[0_8px_30px_rgba(255,140,0,0.25)]"
          >
            Créer mon compte gratuitement
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0B0B0D] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="text-2xl font-semibold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent mb-3">
              CasaDividendes
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              La plateforme de référence pour les dividendes de la Bourse de Casablanca.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Navigation</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>
                <a href="#/" className="hover:text-amber-300 transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#/calendar" className="hover:text-amber-300 transition-colors">
                  Calendrier
                </a>
              </li>
              <li>
                <a href="#/rankings" className="hover:text-amber-300 transition-colors">
                  Palmarès
                </a>
              </li>
              <li>
                <a href="#/blog" className="hover:text-amber-300 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Entreprise</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>
                <a href="#/about" className="hover:text-amber-300 transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#/contact" className="hover:text-amber-300 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#/premium" className="hover:text-amber-300 transition-colors">
                  Premium
                </a>
              </li>
              <li>
                <a href="#/faq" className="hover:text-amber-300 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Légal</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>
                <a href="#/legal" className="hover:text-amber-300 transition-colors">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#/privacy" className="hover:text-amber-300 transition-colors">
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="#/terms" className="hover:text-amber-300 transition-colors">
                  CGU
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8 pb-8 border-b border-white/5">
          <a
            href="https://twitter.com/CasaDividendes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-teal-300 hover:border-teal-400/30 transition-all"
            aria-label="Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com/company/casadividendes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-teal-300 hover:border-teal-400/30 transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="mailto:contact@casadividendes.ma"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-teal-300 hover:border-teal-400/30 transition-all"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>

        <div className="text-center space-y-3">
          <p className="text-zinc-500 text-xs leading-relaxed max-w-3xl mx-auto">
            Informations fournies à titre indicatif. CasaDividendes n'offre pas de conseil en
            investissement, fiscal ou juridique. Chaque investisseur demeure responsable de ses
            décisions.
          </p>
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} CasaDividendes — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

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
      <Header />
      <HeroHome />
      <BrandMessage />
      <ExclusiveTools />
      <StatsSection />
      <Values />
      <PalmaresPreview />
      <Newsletter />
      <ContactSupport />
      <SignupCTA />
      <Footer />
    </div>
  );
}