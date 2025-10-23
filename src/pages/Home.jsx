// Home.jsx — CasaDividendes (Premium Restyle)
// Requirements: TailwindCSS enabled, framer-motion & lucide-react available in project
// Theme: Deep black base (#0B0B0D/#0F1115), turquoise/orange accents (subtle), Inter/Space Grotesk/Manrope

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  ShieldCheck,
  TimerReset,
  CalendarDays,
  Repeat2,
  ArrowRight,
} from "lucide-react";

/* ---------- Helpers ---------- */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut", delay },
  viewport: { once: true, amount: 0.2 },
});

const sectionClass = "relative overflow-hidden";

/* ---------- Hero ---------- */
function HeroHome() {
  return (
    <section
      className={`min-h-[92vh] ${sectionClass} flex items-center bg-[#0B0B0D]`}
      aria-label="Hero"
    >
      {/* Background motion glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[38rem] h-[38rem] rounded-full blur-[140px] bg-gradient-to-br from-teal-500/10 to-emerald-400/5 animate-pulse" style={{ animationDuration: "9s" }} />
        <div className="absolute -bottom-24 -right-24 w-[40rem] h-[40rem] rounded-full blur-[160px] bg-gradient-to-br from-orange-500/12 to-amber-400/8 animate-pulse" style={{ animationDuration: "11s" }} />
        {/* ultra subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400/70 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400/90" />
          </span>
          <span className="text-[13px] tracking-wide text-zinc-400">
            Plateforme d’expertise dividendes · Maroc
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="font-semibold leading-[1.06] tracking-[-0.02em] text-white text-5xl md:text-6xl lg:text-[5rem]"
          style={{ fontFamily: "Inter, Manrope, Space Grotesk, ui-sans-serif, system-ui" }}
        >
          Les dividendes marocains,<br className="hidden md:block" />
          <span className="text-white">clairs, précis,</span>{" "}
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
            maîtrisés.
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 max-w-2xl text-[18px] leading-relaxed text-zinc-400"
        >
          La première plateforme marocaine dédiée aux dividendes de la Bourse de Casablanca :
          maximisez votre rentabilité, suivez chaque dividende, anticipez les paiements et optimisez
          vos décisions avec nos outils d’analyse.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.32)} className="mt-10 flex flex-wrap gap-3">
          <button
            onClick={() => (window.location.hash = "#/calendar")}
            className="group relative inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[15px] font-semibold text-black transition-all
              bg-gradient-to-r from-orange-400 to-amber-400 hover:to-orange-500
              shadow-[0_8px_30px_rgba(255,140,0,0.25)] hover:shadow-[0_10px_38px_rgba(255,140,0,0.33)]"
            aria-label="Découvrir la plateforme"
          >
            Découvrir la plateforme
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => (window.location.hash = "#/premium")}
            className="relative inline-flex items-center justify-center rounded-2xl px-5 py-3 text-[15px] font-semibold
              text-white transition-all border border-white/10
              hover:bg-white/5 focus:outline-none"
            aria-label="Essai gratuit – sans carte bancaire"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400/0 via-teal-400/15 to-orange-400/15 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">Essai gratuit – sans carte bancaire</span>
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          {...fadeUp(0.5)}
          className="mt-16 hidden md:flex items-center gap-2 text-xs text-zinc-500"
        >
          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-zinc-600/50 to-transparent" />
          Faites défiler
        </motion.div>

        {/* Mini data motif (animated line & bars) */}
        <motion.div
          {...fadeUp(0.55)}
          className="pointer-events-none mt-10"
          aria-hidden="true"
        >
          <div className="relative w-full max-w-3xl h-28 rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-sm">
            <svg viewBox="0 0 600 120" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="gd" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,80 C80,70 120,60 180,64 C240,68 280,52 330,48 C380,44 440,38 600,30"
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                className="animate-[dash_5s_ease-in-out_infinite]"
                style={{ strokeDasharray: 6, strokeLinecap: "round" }}
              />
              <style>{`@keyframes dash{0%{stroke-dashoffset:60}100%{stroke-dashoffset:0}}`}</style>
              {/* subtle bars */}
              {[40, 90, 150, 210, 270, 330, 390, 450, 510].map((x, i) => (
                <rect
                  key={i}
                  x={x}
                  y={40 - (i % 3) * 4}
                  width="8"
                  height={40 + (i % 4) * 10}
                  rx="2"
                  className="fill-orange-400/25"
                />
              ))}
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Accessibility / Brand Message Banner ---------- */
function BrandMessage() {
  return (
    <section className="bg-[#0F1115] border-y border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.p
          {...fadeUp(0.05)}
          className="text-sm md:text-[15px] text-zinc-300 leading-relaxed"
        >
          <span className="relative">
            CasaDividendes est une plateforme gratuite, conçue pour rendre l’analyse des dividendes accessible à tous.
            <span className="mx-2 text-zinc-500">·</span>
            L’accès aux outils d’analyse avancés est réservé aux membres inscrits.
            <span className="block mt-2 h-px w-40 bg-gradient-to-r from-teal-400/40 via-white/10 to-transparent" />
          </span>
        </motion.p>
      </div>
    </section>
  );
}

/* ---------- Exclusive Tools (C-DRS / PRT / NDF / DRIP) ---------- */
function ExclusiveTools() {
  const cards = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-teal-300/80" />,
      title: "C-DRS™",
      desc: "Dividend Reliability Score — mesure la régularité et la résilience du versement.",
      tag: "Score de fiabilité",
    },
    {
      icon: <TimerReset className="h-6 w-6 text-amber-300/80" />,
      title: "PRT™",
      desc: "Payback Rotation Time — temps estimé pour récupérer l’investissement via dividendes.",
      tag: "Rotation dividendes",
    },
    {
      icon: <CalendarDays className="h-6 w-6 text-teal-300/80" />,
      title: "NDF™",
      desc: "Next Dividend Forecast — projection de la prochaine date et montant probable.",
      tag: "Prévision prochaine",
    },
    {
      icon: <Repeat2 className="h-6 w-6 text-amber-300/80" />,
      title: "DRIP Simulator",
      desc: "Réinvestissement automatique — simule la capitalisation des dividendes.",
      tag: "Réinvestissement",
    },
  ];

  return (
    <section className={`${sectionClass} bg-[#0B0B0D]`}>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
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
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5
                         hover:border-amber-400/30 transition-all"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity
                              bg-gradient-to-br from-amber-400/10 via-transparent to-teal-400/10" />
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

/* ---------- Stats (kept content, premium skin) ---------- */
function StatsSection() {
  const stats = [
    { value: "12 000+", label: "Dividendes suivis" },
    { value: "80+", label: "Sociétés cotées" },
    { value: "2 000+", label: "Investisseurs" },
  ];
  return (
    <section className="bg-[#0F1115] py-16">
      <div className="max-w-6xl mx-auto px-6">
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

/* ---------- Values (content preserved) ---------- */
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
      t: "Outils d’analyse et pilotage",
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
    <section className="px-6 py-12 bg-[#0B0B0D]">
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

/* ---------- Palmarès Preview (content preserved) ---------- */
function PalmaresPreview() {
  const rows = [
    { r: 1, t: "IAM", n: "Maroc Telecom", y: "5.2%", pay: "28/06" },
    { r: 2, t: "BCP", n: "Banque Populaire", y: "4.8%", pay: "21/06" },
    { r: 3, t: "ATW", n: "Attijariwafa Bank", y: "4.3%", pay: "05/07" },
  ];
  return (
    <section className="px-6 pb-12 bg-[#0F1115]">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp(0.05)} className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Aperçu Palmarès</h2>
          <button
            onClick={() => (window.location.hash = "#/rankings")}
            className="text-teal-300/90 hover:underline"
            aria-label="Voir le palmarès complet des dividendes"
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

/* ---------- Newsletter (content preserved, skin refined) ---------- */
function Newsletter() {
  const [formData, setFormData] = React.useState({ email: "", hp: "" });
  const [status, setStatus] = React.useState("idle");
  const [message, setMessage] = React.useState("");

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
    <section className="px-6 py-12 bg-[#0B0B0D]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          {...fadeUp(0.05)}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 justify-between"
        >
          <div>
            <h2 className="text-white font-semibold">Restez informé(e)</h2>
            <p className="text-zinc-400 text-sm">
              Prochains dividendes, tendances & mises à jour.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Adresse email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={status === "loading"}
                className="flex-1 md:w-80 px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                placeholder="Entrez votre email"
                required
                aria-required="true"
                aria-describedby="newsletter-status"
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
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition-all disabled:opacity-60"
                aria-label="S'inscrire à la newsletter"
              >
                {status === "loading" ? "..." : "Je m'inscris"}
              </button>
            </form>
            {message && (
              <div
                id="newsletter-status"
                role="status"
                aria-live="polite"
                className={`mt-2 text-sm ${
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

/* ---------- Contact + Premium Band (content preserved) ---------- */
function ContactSupport() {
  return (
    <section className="px-6 py-12 bg-[#0F1115]">
      <div className="max-w-6xl mx-auto rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <h2 className="text-white text-xl font-semibold mb-6">📞 Contact & Support</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-medium mb-3">Email</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>
                <span className="text-zinc-400">Support :</span>{" "}
                <a
                  href="mailto:support@casadividendes.ma"
                  className="text-teal-300 hover:text-teal-200 underline-offset-4 hover:underline"
                >
                  support@casadividendes.ma
                </a>
              </li>
              <li>
                <span className="text-zinc-400">Commercial :</span>{" "}
                <a
                  href="mailto:contact@casadividendes.ma"
                  className="text-teal-300 hover:text-teal-200 underline-offset-4 hover:underline"
                >
                  contact@casadividendes.ma
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">Réseaux sociaux</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-zinc-400">X / Twitter :</span>
                <a
                  href="https://twitter.com/CasaDividendes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 hover:text-teal-200 underline-offset-4 hover:underline"
                >
                  @CasaDividendes
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-400">LinkedIn :</span>
                <a
                  href="https://linkedin.com/company/casadividendes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 hover:text-teal-200 underline-offset-4 hover:underline"
                >
                  CasaDividendes
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10">
          <a
            href="mailto:support@casadividendes.ma"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-400/10 border border-teal-400/30 text-teal-300 font-medium hover:bg-teal-400/15 transition-all"
          >
            ✉️ Envoyer un message
          </a>
        </div>
      </div>
    </section>
  );
}

function PremiumBand() {
  return (
    <section className="border-t border-white/10 bg-gradient-to-r from-[#0B0B0D] via-[#0F1115] to-[#0B0B0D]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-white text-lg font-semibold">
          Passez au Premium : alertes J-3, scores de sécurité, comparateurs.
        </h2>
        <button
          onClick={() => (window.location.hash = "#/premium")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition-all"
          aria-label="Essayer l'offre Premium"
        >
          Essayer Premium
        </button>
      </div>
    </section>
  );
}

/* ---------- Footer (muted disclaimer) ---------- */
function Footer() {
  return (
    <footer className="bg-[#0B0B0D] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-semibold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              CasaDividendes
            </div>
            <p className="mt-2 text-zinc-500 text-sm">
              La plateforme de référence pour les dividendes de la Bourse de Casablanca.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#/" className="hover:text-amber-300">Accueil</a></li>
              <li><a href="#/calendar" className="hover:text-amber-300">Calendrier</a></li>
              <li><a href="#/rankings" className="hover:text-amber-300">Palmarès</a></li>
              <li><a href="#/blog" className="hover:text-amber-300">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Entreprise</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#/about" className="hover:text-amber-300">À propos</a></li>
              <li><a href="#/contact" className="hover:text-amber-300">Contact</a></li>
              <li><a href="#/premium" className="hover:text-amber-300">Premium</a></li>
              <li><a href="#/faq" className="hover:text-amber-300">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Légal</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#/legal" className="hover:text-amber-300">Mentions légales</a></li>
              <li><a href="#/privacy" className="hover:text-amber-300">Confidentialité</a></li>
              <li><a href="#/terms" className="hover:text-amber-300">CGU</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-zinc-500 text-xs leading-relaxed">
          <p className="opacity-80">
            Informations fournies à titre indicatif. CasaDividendes n’offre pas de conseil en investissement,
            fiscal ou juridique. Chaque investisseur demeure responsable de ses décisions.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} CasaDividendes — Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
export default function Home() {
  useEffect(() => {
    document.title =
      "CasaDividendes — Plateforme Premium des Dividendes | Bourse de Casablanca";
    const metaDescription = document.querySelector('meta[name="description"]');
    const content =
      "La plateforme de référence pour analyser, suivre et optimiser vos dividendes sur la Bourse de Casablanca. Calendrier intelligent, scores exclusifs, analyses historiques.";
    if (metaDescription) metaDescription.setAttribute("content", content);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="bg-[#0B0B0D] text-white selection:bg-amber-400/30 selection:text-white">
      <HeroHome />
      <BrandMessage />
      <ExclusiveTools />
      <StatsSection />
      <Values />
      <PalmaresPreview />
      <Newsletter />
      <ContactSupport />
      <PremiumBand />
      <Footer />
    </div>
  );
}
