import React from "react";
import { Helmet } from "react-helmet-async";
import { StatCard } from "../components/StatCard";

export default function About() {
  return (
    <>
      <Helmet>
        <title>À propos & Contact - CasaDividendes</title>
        <meta name="description" content="Découvrez notre mission et contactez l'équipe CasaDividendes. Nous démocratisons l'investissement en dividendes à la Bourse de Casablanca." />
      </Helmet>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-white text-2xl font-bold">À propos & Contact</h1>
        <p className="text-zinc-400 mt-2">Découvrez notre mission et entrez en contact avec l&apos;équipe CasaDividendes.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Mission" value="Fiabilité • Pédagogie • Accès" sub="Démocratiser l'investissement en dividendes au Maroc." />
          <StatCard title="Vision" value="Référence BVC" sub="Devenir le hub des dividendes à Casablanca." />
          <StatCard title="Transparence" value="Sources officielles" sub="BVC & communiqués émetteurs." />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-white font-semibold">Contactez-nous</h2>
            <form className="mt-4 grid gap-3">
              <label htmlFor="contact-name" className="sr-only">Nom</label>
              <input id="contact-name" type="text" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Nom" required />
              <label htmlFor="contact-email" className="sr-only">Email</label>
              <input id="contact-email" type="email" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Email" required />
              <label htmlFor="contact-subject" className="sr-only">Sujet</label>
              <input id="contact-subject" type="text" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Sujet" required />
              <label htmlFor="contact-message" className="sr-only">Message</label>
              <textarea id="contact-message" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 h-28 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Message" required />
              <button type="submit" className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold w-full focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Envoyer</button>
            </form>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-white font-semibold">Coordonnées</h2>
            <ul className="mt-3 text-zinc-300 text-sm space-y-2">
              <li>✉️ contact@casadividendes.com</li>
              <li>🔗 LinkedIn / Twitter (optionnel)</li>
              <li>📍 Casablanca</li>
            </ul>
            <p className="mt-6 text-xs text-zinc-500">Nous répondons sous 48h ouvrées.</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-white font-semibold">Rejoignez la communauté CasaDividendes</h2>
          <p className="text-zinc-400 text-sm mt-1">Commencez par consulter le calendrier des prochains dividendes.</p>
          <a href="#/calendar" className="mt-3 inline-block px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Voir le calendrier</a>
        </div>
      </main>
    </>
  );
}
