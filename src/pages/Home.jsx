// src/pages/Home.jsx — CasaDividendes (Refonte premium demandée)
// Prérequis: Tailwind, framer-motion, lucide-react déjà installés

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  TimerReset,
  CalendarDays,
  Repeat2,
} from "lucide-react";

/* ---------- Helpers ---------- */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
  viewport: { once: true, amount: 0.2 },
});
const sectionClass = "relative overflow-hidden";

/* ---------- Header (logo + nav à gauche, recherche au centre, CTA à droite) ---------- */
function TopNav() {
  const LINKS = [
    { label: "Accueil", href: "#/" },
    { label: "Calendrier", href: "#/calendar" },
    { label: "Palmarès", href: "#/ranking" },
    { label: "Blog", href: "#/blog" },
    { label: "À propos", href: "#/about" },
    { label: "Mentions", href: "#/legal" },
  ];

  const onSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    if (q) window.location.hash = `#/search?q=${encodeURIComponent(q)}`;
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0B0B0D]/70 border-b border-white/10">
      <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-10">
        <div className="h-14 md:h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          {/* Gauche : logo + nav */}
          <div className="flex items-center gap-6">
            <a href="#/" aria-label="Accueil" className="inline-flex items-center">
              <img
                src="/logo.png"
                alt="CasaDividendes"
                className="h-8 md:h-9 w-auto"
              />
            </a>
            <nav className="hidden lg:flex items-center gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[14px] font-medium text-white/80 hover:text-teal-300 transition"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Centre : mini barre de recherche */}
          <form onSubmit={onSearch} className="hidden md:flex justify-center">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <label htmlFor="top-search" className="sr-only">
                Rechercher
              </label>
              <input
                id="top-search"
                name="q"
                type="search"
                placeholder="Rechercher une société, un dividende, un article…"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0F1115] border border-white/10 text-white/90 placeholder-white/40
                           focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
            </div>
          </form>

          {/* Droite : CTA compacts */}
          <div className="flex items-center gap-2">
            <a
              href="#/premium"
              className="btn-primary px-4 py-2 text-sm"
              aria-label="Premium"
            >
              Premium
            </a>
            <a
              href="#/signin"
              className="btn-ghost px-3 py-2 text-sm"
              aria-label="Se connecter"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero (formulaire e-mail + visuel premium à droite) ---------- */
function HeroHome() {
  const [email, setEmail] = React.useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Préparer la future redirection d'inscription (à implémenter plus tard)
    window.location.hash = "#/signup?email=" + encodeURIComponent(email.trim());
  };

  return (
    <section className={`min-h-[88vh] ${sectionClass} flex items-center bg-[#0B0B0D]`}>
      {/* Glow background subtil */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full blur-[140px] bg-gradient-to-br from-teal-500/10 to-emerald-400/5" />
        <div className="absolute -bottom-24 -right-24 w-[40rem] h-[40rem] rounded-full blur-[160px] bg-gradient-to-br from-orange-500/12 to-amber-400/8" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Col gauche : texte + formulaire */}
          <div>
            <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 mb-6">
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
              className="font-semibold leading-[1.06] tracking-[-0.02em] text-white text-5xl md:text-6xl lg:text-[4.5rem]"
              style={{ fontFamily: "Inter, Manrope, Space Grotesk, ui-sans-serif, system-ui" }}
            >
              Les dividendes marocains,
              <br className="hidden md:block" />
              <span className="text-white">clairs, précis,</span>{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                maîtrisés.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-6 max-w-2xl text-[18px] leading-relaxed text-zinc-400"
            >
              La plateforme marocaine dédiée aux dividendes de la Bourse de Casablanca :
              suivez chaque dividende, anticipez les paiements et décidez avec nos outils d’analyse.
            </motion.p>

            {/* Formulaire compact (remplace le CTA simple) */}
            <motion.form
              {...fadeUp(0.32)}
              onSubmit={onSubmit}
              className="mt-8 flex w-full max-w-xl items-center gap-2"
            >
              <label htmlFor="hero-email" className="sr-only">Adresse e-mail</label>
              <input
                id="hero-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse e-mail"
                className="flex-1 px-3 py-3 rounded-lg bg-[#0F1115] border border-white/10 text-white/90 placeholder-white/40
                           focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-lg px-4 py-3 text-[15px] font-semibold text-black transition
                           bg-gradient-to-r from-orange-400 to-amber-400 hover:to-orange-500
                           shadow-[0_8px_30px_rgba(255,140,0,0.25)] hover:shadow-[0_10px_38px_rgba(255,140,0,0.33)]"
              >
                Découvrir la plateforme
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.form>

            {/* Indicateur de scroll discret */}
            <motion.div {...fadeUp(0.5)} className="mt-12 hidden md:flex items-center gap-2 text-xs text-zinc-500">
              <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-zinc-600/50 to-transparent" />
              Faites défiler
            </motion.div>
          </div>

          {/* Col droite : visuel premium flottant (remplace mini-graph) */}
          <motion.div
            {...fadeUp(0.15)}
            className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-teal-400/10" />
            <img
              src="/hero-dashboard.png"
              alt="Aperçu du tableau de bord CasaDividendes"
              className="relative w-full h-auto object-cover"
            />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full blur-3xl bg-teal-400/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Brand message / Accessibilité (inchangé) ---------- */
function BrandMessage() {
  return (
    <section className="bg-[#0F1115] border-y border-white/[0.06]">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <motion.p {...fadeUp(0.05)} className="text-sm md:text-[15px] text-zinc-300 leading-relaxed">
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

/* ---------- Section "Indicateurs exclusifs" (contenu conservé) ---------- */
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
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24">
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
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-300/70 inline-block" />
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

/* ---------- Newsletter (refonte premium + message clair) ---------- */
function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle");
  const [message, setMessage] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      // Point d'entrée à brancher plus tard côté serveur / API
      // On simule un succès UX
      await new Promise((r) => setTimeout(r, 700));
      setStatus("success");
      setMessage("Merci ! Vous recevrez nos prochaines analyses.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-12 bg-[#0B0B0D]">
      <div className="max-w-[120rem] mx-auto">
        <motion.div
          {...fadeUp(0.05)}
          className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0B0B0D] via-[#0F1115] to-[#0B0B0D] p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 justify-between"
        >
          <div className="max-w-2xl">
            <h2 className="text-white text-xl font-semibold">Recevez nos analyses et alertes dividendes avant tout le monde</h2>
            <p className="text-zinc-400 text-sm mt-1">
              Calendrier, prévisions NDF™, alertes J-3 et études sectorielles — 1 à 2 emails par mois, pas de spam.
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex w-full md:w-auto gap-2">
            <label htmlFor="nl-email" className="sr-only">Adresse e-mail</label>
            <input
              id="nl-email"
              type="email"
              required
              disabled={status === "loading"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              className="w-full md:w-80 px-3 py-2 rounded-lg bg-[#0F1115] border border-white/10 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition disabled:opacity-60"
            >
              {status === "loading" ? "…" : "S’inscrire"}
            </button>
          </form>
          {message && (
            <div className={`text-sm ${status === "success" ? "text-teal-300" : "text-orange-300"}`}>
              {message}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Contact & Support (fusion) ---------- */
function ContactSupport() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 py-12 bg-[#0F1115]">
      <div className="max-w-[120rem] mx-auto rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <h2 className="text-white text-xl font-semibold mb-6">Contact & Support</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-medium mb-2">Email</h3>
            <p className="text-zinc-300 text-sm">
              <a href="mailto:support@casadividendes.ma" className="text-teal-300 hover:text-teal-200 underline-offset-4 hover:underline">
                support@casadividendes.ma
              </a>
              {" · "}
              <a href="mailto:contact@casadividendes.ma" className="text-teal-300 hover:text-teal-200 underline-offset-4 hover:underline">
                contact@casadividendes.ma
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">FAQ & Aide</h3>
            <a href="#/faq" className="text-teal-300 hover:text-teal-200 underline-offset-4 hover:underline text-sm">
              Consulter la FAQ
            </a>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Support Premium</h3>
            <p className="text-zinc-300 text-sm">
              Accès prioritaire, assistance dédiée, accompagnement stratégie dividendes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Rappel inscription (remplace “Passez au Premium”) ---------- */
function SignUpReminder() {
  return (
    <section className="border-t border-white/10 bg-gradient-to-r from-[#0B0B0D] via-[#0F1115] to-[#0B0B0D]">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-white text-lg font-semibold">
          Créez votre compte gratuit pour accéder à nos outils exclusifs.
        </h2>
        <div className="flex items-center gap-2">
          <a href="#/signup" className="btn-primary px-4 py-2">Créer mon compte</a>
          <a href="#/premium" className="btn-ghost px-3 py-2">Découvrir Premium</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer unique (fusion) ---------- */
function Footer() {
  return (
    <footer className="bg-[#0B0B0D] border-t border-white/5">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex flex-col items-center text-center gap-4">
          <img src="/logo.png" alt="CasaDividendes" className="h-8 w-auto opacity-90" />
          <nav className="flex flex-wrap gap-4 justify-center text-white/70 text-sm">
            <a href="#/legal" className="hover:text-amber-300">Mentions légales</a>
            <a href="#/terms" className="hover:text-amber-300">CGU</a>
            <a href="#/privacy" className="hover:text-amber-300">Confidentialité</a>
            <a href="#/about" className="hover:text-amber-300">À propos</a>
          </nav>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <a href="https://twitter.com/CasaDividendes" target="_blank" rel="noreferrer" className="hover:text-white">X</a>
            <a href="https://linkedin.com/company/casadividendes" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
          </div>
          <p className="text-xs text-white/50 mt-2">
            © {new Date().getFullYear()} CasaDividendes — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
export default function Home() {
  useEffect(() => {
    document.title = "CasaDividendes — Plateforme Premium des Dividendes | Bourse de Casablanca";
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
      <TopNav />
      <HeroHome />
      <BrandMessage />
      <ExclusiveTools />
      <Newsletter />
      <ContactSupport />
      <SignUpReminder />
      <Footer />
    </div>
  );
}
