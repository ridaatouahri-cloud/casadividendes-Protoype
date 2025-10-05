import React from "react";
import { Helmet } from "react-helmet-async";
import { StatCard } from "../components/StatCard";

function HeroHome({ goCalendar, goPremium }) {
  return (
    <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            CasaDividendes : la première plateforme dédiée aux dividendes de la Bourse de Casablanca
          </h1>
          <p className="text-zinc-300 mt-4 md:text-lg">
            Un calendrier clair, des fiches sociétés fiables et des outils concrets pour investir avec sérénité.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={goCalendar}
              className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              aria-label="Voir le calendrier des dividendes"
            >
              Voir le calendrier
            </button>
            <button
              onClick={goPremium}
              className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
              aria-label="Découvrir l'offre Premium"
            >
              Découvrir Premium
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6" aria-hidden="true">
          <div className="text-zinc-400 text-sm">Illustration</div>
          <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black grid place-items-center">
            <div className="w-2/3 h-2/3 border border-teal-500/50 rounded-xl relative">
              <div className="absolute inset-x-6 bottom-6 h-1 bg-orange-500/60" />
              <div className="absolute left-6 bottom-6 w-1 h-1/2 bg-teal-400/70" />
              <div className="absolute left-1/3 bottom-6 w-1 h-2/3 bg-teal-400/70" />
              <div className="absolute left-2/3 bottom-6 w-1 h-3/4 bg-teal-400/70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Values() {
  const items = [
    { t: "Des données vérifiées", d: "Dates ex-dividende, paiements et historiques sourcés.", icon: "🧭" },
    { t: "Des outils utiles", d: "Palmarès, fiches, projections — l'essentiel, sans superflu.", icon: "🛠️" },
    { t: "Pédagogie locale", d: "Articles clairs en FR/Darija pour éviter les pièges.", icon: "📚" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-12" aria-labelledby="values-heading">
      <h2 id="values-heading" className="sr-only">Nos valeurs</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.t} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="text-3xl" aria-hidden="true">{it.icon}</div>
            <h3 className="text-white font-semibold mt-3">{it.t}</h3>
            <p className="text-zinc-400 mt-2 text-sm">{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PalmaresPreview({ goRankings }) {
  const rows = [
    { r: 1, t: "IAM", n: "Maroc Telecom", y: "5.2%", pay: "28/06" },
    { r: 2, t: "BCP", n: "Banque Populaire", y: "4.8%", pay: "21/06" },
    { r: 3, t: "ATW", n: "Attijariwafa Bank", y: "4.3%", pay: "05/07" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12" aria-labelledby="palmares-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="palmares-heading" className="text-white text-xl font-semibold">Aperçu Palmarès</h2>
        <button
          onClick={goRankings}
          className="text-teal-400 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950 rounded px-2"
          aria-label="Voir le palmarès complet des dividendes"
        >
          Voir le palmarès complet
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th scope="col" className="text-left p-3">Rang</th>
              <th scope="col" className="text-left p-3">Ticker</th>
              <th scope="col" className="text-left p-3">Société</th>
              <th scope="col" className="text-left p-3">Rendement</th>
              <th scope="col" className="text-left p-3">Paiement</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.r} className="border-t border-zinc-800">
                <td className="p-3 text-zinc-300">{d.r}</td>
                <td className="p-3 text-white">{d.t}</td>
                <td className="p-3 text-zinc-200">{d.n}</td>
                <td className="p-3 text-teal-400 font-medium">{d.y}</td>
                <td className="p-3 text-zinc-300">{d.pay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Impossible de se connecter au serveur. Veuillez réessayer.");
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-10" aria-labelledby="newsletter-heading">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div>
          <h2 id="newsletter-heading" className="text-white font-semibold">Restez informé(e)</h2>
          <p className="text-zinc-400 text-sm">Prochains dividendes, tendances & mises à jour.</p>
        </div>
        <div className="w-full md:w-auto">
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
            <label htmlFor="newsletter-email" className="sr-only">Adresse email</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="flex-1 md:w-80 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Entrez votre email"
              required
              aria-required="true"
              aria-describedby="newsletter-status"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 rounded-lg bg-teal-400 text-black font-semibold hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className={`mt-2 text-sm ${status === "success" ? "text-teal-400" : "text-orange-400"}`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PremiumBand({ goPremium }) {
  return (
    <section className="border-t border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950" aria-labelledby="premium-band-heading">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 id="premium-band-heading" className="text-white text-lg font-semibold">
          Passez au Premium : alertes J-3, scores de sécurité, comparateurs.
        </h2>
        <button
          onClick={goPremium}
          className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 whitespace-nowrap"
          aria-label="Essayer l'offre Premium"
        >
          Essayer Premium
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Helmet>
        <title>CasaDividendes - Calendrier des Dividendes de la Bourse de Casablanca</title>
        <meta name="description" content="La première plateforme dédiée aux dividendes de la Bourse de Casablanca. Calendrier des ex-dates, palmarès des rendements, fiches sociétés et outils d'analyse pour investir sereinement au Maroc." />
      </Helmet>

      <HeroHome goCalendar={() => window.location.hash = "#/calendar"} goPremium={() => window.location.hash = "#/premium"} />
      <Values />
      <PalmaresPreview goRankings={() => window.location.hash = "#/rankings"} />
      <Newsletter />
      <PremiumBand goPremium={() => window.location.hash = "#/premium"} />
    </>
  );
}
