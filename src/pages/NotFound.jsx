import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page non trouvée - CasaDividendes</title>
        <meta name="description" content="La page que vous recherchez n'existe pas." />
      </Helmet>

      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-teal-500/20 grid place-items-center">
            <div className="text-4xl">404</div>
          </div>
        </div>
        <h1 className="text-white text-3xl font-bold">Page non trouvée</h1>
        <p className="text-zinc-400 mt-4 text-lg">Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            to="/calendar"
            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold hover:bg-zinc-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Voir le calendrier
          </Link>
        </div>
      </main>
    </>
  );
}
