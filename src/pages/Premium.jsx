import React from "react";
import { Helmet } from "react-helmet-async";

export default function Premium() {
  const features = [
    { t: "Alertes J-3", d: "Rappel avant l'ex-date sur vos titres favoris." },
    { t: "Score sécurité", d: "Indicateur 0–100 basé sur payout, régularité, couverture." },
    { t: "Simulations de revenus", d: "Projetez vos flux annuels selon votre capital." },
    { t: "Comparateurs avancés", d: "Rendement, régularité, croissance en un clic." },
    { t: "Exports CSV/PDF", d: "Téléchargez vos calendriers et palmarès filtrés." },
    { t: "Contenus exclusifs", d: "Analyses et rapports dédiés aux abonnés." },
  ];

  return (
    <>
      <Helmet>
        <title>Premium - CasaDividendes</title>
        <meta name="description" content="Passez au Premium et accédez aux alertes J-3, scores de sécurité, simulations de revenus et analyses exclusives pour maximiser vos dividendes." />
      </Helmet>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-white text-3xl font-bold">Passez au Premium et maximisez vos dividendes</h1>
            <p className="text-zinc-400 mt-2">Des alertes personnalisées, des scores de sécurité et des comparateurs avancés pour de meilleures décisions.</p>
            <button className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950">Essayer Premium</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.t} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                <h2 className="text-white font-medium">{f.t}</h2>
                <p className="text-zinc-400 text-sm mt-1">{f.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="text-white font-semibold">Mensuel</h2>
            <p className="text-3xl font-bold text-white mt-1">49 MAD</p>
            <button className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900">Je m&apos;abonne</button>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="text-white font-semibold">Annuel</h2>
            <p className="text-3xl font-bold text-white mt-1">490 MAD <span className="text-teal-400 text-sm">(2 mois offerts)</span></p>
            <button className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900">Je m&apos;abonne</button>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex items-center justify-between flex-wrap gap-4">
          <p className="text-white font-semibold">Rejoignez les investisseurs qui construisent leurs revenus passifs.</p>
          <button className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 whitespace-nowrap">Essayer Premium</button>
        </div>
      </main>
    </>
  );
}
