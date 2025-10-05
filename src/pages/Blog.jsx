import React from "react";
import { Helmet } from "react-helmet-async";

export default function Blog() {
  const posts = [
    { c: "Bases", t: "Comprendre l'ex-dividende en 3 minutes", x: "L'ex-date est la date à partir de laquelle l'achat ne donne plus droit au dividende…" },
    { c: "Stratégies", t: "Rendement vs sécurité : éviter les yield traps", x: "Un rendement élevé peut masquer une situation fragile…" },
    { c: "Marché Maroc", t: "Lire un communiqué de dividende (AG, coupon)", x: "Les éléments clés à vérifier dans l'avis officiel…" },
  ];

  return (
    <>
      <Helmet>
        <title>Blog & Pédagogie - CasaDividendes</title>
        <meta name="description" content="Apprenez à investir dans les dividendes avec nos guides et articles. Stratégies, analyses et conseils pour la Bourse de Casablanca." />
      </Helmet>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-white text-3xl font-bold">Blog & pédagogie</h1>
            <p className="text-zinc-400 mt-2">Comprendre les dividendes et investir sereinement à la Bourse de Casablanca.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6" aria-hidden="true">
            <div className="text-zinc-400 text-sm">Illustration</div>
            <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-400">Bases</button>
            <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-400">Stratégies</button>
            <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-400">Marché Maroc</button>
            <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-400">Afrique</button>
          </div>
          <label htmlFor="blog-search" className="sr-only">Rechercher dans le blog</label>
          <input id="blog-search" type="search" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 w-64 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Rechercher…" />
        </div>

        <article className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 rounded-xl bg-zinc-950/60 h-48" aria-hidden="true" />
          <div>
            <span className="text-xs text-teal-400">En vedette</span>
            <h2 className="text-white text-xl font-semibold mt-1">Rendement vs sécurité : éviter les yield traps</h2>
            <p className="text-zinc-400 text-sm mt-2">Un rendement élevé peut masquer une situation fragile : apprenez à lire les signaux de risque (payout, couverture, volatilité)…</p>
            <button className="mt-3 text-teal-400 underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">Découvrir</button>
          </div>
        </article>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article key={p.t} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="rounded-lg bg-zinc-950/60 h-28 mb-3" aria-hidden="true" />
              <span className="text-xs text-teal-400">{p.c}</span>
              <h2 className="mt-2 text-white font-semibold">{p.t}</h2>
              <p className="text-zinc-400 text-sm mt-2">{p.x}</p>
              <button className="mt-3 text-teal-400 text-sm underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">Lire la suite</button>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-zinc-400 flex-wrap gap-2">
          <div>Page 1 sur 6</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400">Précédent</button>
            <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400">Suivant</button>
          </div>
        </div>
      </main>
    </>
  );
}
