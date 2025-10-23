// src/pages/Blog.jsx — CasaDividendes (Premium aligned)
import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";

export default function Blog() {
  const posts = [
    { c: "Bases", t: "Comprendre l'ex-dividende en 3 minutes", x: "L'ex-date est la date à partir de laquelle l'achat ne donne plus droit au dividende…" },
    { c: "Stratégies", t: "Rendement vs sécurité : éviter les yield traps", x: "Un rendement élevé peut masquer une situation fragile…" },
    { c: "Marché Maroc", t: "Lire un communiqué de dividende (AG, coupon)", x: "Les éléments clés à vérifier dans l'avis officiel…" },
  ];

  const chips = ["Bases", "Stratégies", "Marché Maroc", "Afrique"];

  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-amber-400/30 selection:text-white">
      <Helmet>
        <title>Blog & Pédagogie - CasaDividendes</title>
        <meta
          name="description"
          content="Apprenez à investir dans les dividendes avec nos guides et articles. Stratégies, analyses et conseils pour la Bourse de Casablanca."
        />
      </Helmet>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-brand-orange to-brand-amber bg-clip-text text-transparent">
                Blog & pédagogie
              </span>
            </h1>
            <p className="text-white/70 mt-2">
              Comprendre les dividendes et investir sereinement à la Bourse de Casablanca.
            </p>
          </div>

          {/* Visual premium (glassy + gradient) */}
          <div className="card-premium p-6">
            <div className="text-white/60 text-sm">Illustration</div>
            <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-ink-900 via-ink-800 to-ink-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_300px_at_20%_-20%,rgba(20,184,166,0.2),transparent_60%)]" />
              <div className="absolute inset-0 animate-gradient-shift" />
            </div>
          </div>
        </section>

        {/* FILTERS + SEARCH */}
        <section className="mt-6 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-white transition"
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <label htmlFor="blog-search" className="sr-only">Rechercher dans le blog</label>
            <input
              id="blog-search"
              type="search"
              placeholder="Rechercher…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/10 bg-ink-900 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/60"
            />
          </div>
        </section>

        {/* FEATURED */}
        <article className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 card-premium p-5">
          <div className="md:col-span-2 rounded-xl bg-ink-900/60 h-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(900px_250px_at_0%_0%,rgba(20,184,166,0.18),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_250px_at_100%_100%,rgba(245,158,11,0.18),transparent_60%)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-brand-teal uppercase tracking-wide">En vedette</span>
            <h2 className="text-xl font-semibold mt-1">
              Rendement vs sécurité : éviter les yield traps
            </h2>
            <p className="text-white/70 text-sm mt-2">
              Un rendement élevé peut masquer une situation fragile : apprenez à lire les
              signaux de risque (payout, couverture, volatilité)…
            </p>
            <a href="#/blog/yield-traps" className="mt-3 btn-ghost inline-flex items-center gap-1 text-brand-teal border-brand-teal/40 hover:bg-brand-teal/10 w-fit">
              Découvrir <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </article>

        {/* LIST */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.article
              key={p.t}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="card-premium p-5"
            >
              <div className="rounded-lg bg-ink-900/60 h-28 mb-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(700px_180px_at_10%_0%,rgba(20,184,166,0.18),transparent_60%)]" />
              </div>
              <span className="text-[11px] text-brand-teal uppercase tracking-wide">{p.c}</span>
              <h3 className="mt-2 font-semibold">{p.t}</h3>
              <p className="text-white/70 text-sm mt-2">{p.x}</p>
              <a href={`#/blog/${slugify(p.t)}`} className="mt-3 inline-flex items-center gap-1 text-sm btn-ghost w-fit">
                Lire la suite <ChevronRight className="w-4 h-4" />
              </a>
            </motion.article>
          ))}
        </section>

        {/* PAGINATION */}
        <section className="mt-6 flex items-center justify-between text-sm text-white/70 flex-wrap gap-3">
          <div>Page 1 sur 6</div>
          <div className="flex gap-2">
            <button className="btn-ghost">Précédent</button>
            <button className="btn-primary">Suivant</button>
          </div>
        </section>

        {/* NEWSLETTER / CTA SOFT */}
        <section className="mt-8 card-premium p-5 bg-gradient-to-r from-ink-950 via-ink-900 to-ink-950">
          <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
            <p className="text-white font-medium">
              Recevez nos nouveaux articles et études de cas (1×/mois, pas de spam).
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full md:w-auto items-center gap-2"
            >
              <label htmlFor="nl" className="sr-only">Email</label>
              <input
                id="nl"
                type="email"
                placeholder="email@exemple.com"
                className="w-full md:w-72 px-3 py-2 rounded-lg border border-white/10 bg-ink-900 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/60"
              />
              <button className="btn-primary">S’inscrire</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

/* utils */
function slugify(s = "") {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
