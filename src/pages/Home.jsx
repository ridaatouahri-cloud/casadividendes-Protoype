import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { StatCard } from "../components/StatCard";

function useScrollAnimation() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return ref;
}

function HeroHome({ goCalendar, goPremium }) {
  return (
    <section className="hero-gradient relative overflow-hidden min-h-[85vh] flex items-center">
      <div className="absolute inset-0 opacity-30">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
          <path fill="rgba(20, 184, 166, 0.1)" d="M0,320L60,330C120,340,240,360,360,345C480,330,600,280,720,266.7C840,253,960,277,1080,288C1200,299,1320,297,1380,296L1440,295L1440,800L1380,800C1320,800,1200,800,1080,800C960,800,840,800,720,800C600,800,480,800,360,800C240,800,120,800,60,800L0,800Z"></path>
          <path fill="rgba(168, 85, 247, 0.05)" d="M0,480L60,485.3C120,491,240,501,360,480C480,459,600,405,720,394.7C840,384,960,416,1080,437.3C1200,459,1320,469,1380,474.7L1440,480L1440,800L1380,800C1320,800,1200,800,1080,800C960,800,840,800,720,800C600,800,480,800,360,800C240,800,120,800,60,800L0,800Z"></path>
        </svg>
      </div>
      <div className="w-full px-6 py-20 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
        <div className="animate-fade-in-up order-1">
          <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] "font-light" leading-[1.15] tracking-[-0.02em] ">
            <span className="text-white">Les Dividendes </span>
            <br />
            <span className="text-white"> marocains </span>
            <span className="hero-title-gradient-alt"> Simplifiés.</span>
          </h1>
          <p className="text-zinc-300 mt-6 text-lg md:text-xl max-w-[600px] leading-[1.65] opacity-0 animate-fade-in-up delay-200">
            La Première plateforme pour suivre et optimiser vos dividendes à la Bourse de Casablanca
          </p>
          <div className="mt-6 flex flex-wrap gap-3 opacity-0 animate-fade-in-up delay-300">
            <button
              onClick={goCalendar}
              className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00D3A7] focus:ring-offset-2 focus:ring-offset-zinc-950 shadow-lg shadow-teal-500/30 hover:brightness-[1.02] hover:shadow-[0_0_20px_rgba(0,211,167,0.3)] active:scale-[0.98]"
              aria-label="Voir le calendrier des dividendes"
            >
              Voir le calendrier
            </button>
            <button
              onClick={goPremium}
              className="px-4 py-2 rounded-xl bg-transparent border border-[rgba(255,255,255,0.08)] text-white font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00D3A7] focus:ring-offset-2 focus:ring-offset-zinc-950 hover:bg-[#161A1E] active:scale-[0.98]"
              aria-label="Découvrir l'offre Premium"
            >
              Découvrir Premium
            </button>
          </div>
          <p className="text-zinc-400 text-xs mt-3 opacity-0 animate-fade-in-up delay-400">
            Essai gratuit, sans carte de crédit.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 opacity-0 animate-fade-in-up delay-500 order-2 mt-10 md:mt-0" aria-hidden="true">
          <div className="text-zinc-400 text-sm">Illustration</div>
          <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black grid place-items-center">
            <div className="w-2/3 h-2/3 border border-teal-500/50 rounded-xl relative">
              <div className="absolute inset-x-6 bottom-6 h-1 bg-orange-500/60" />
              <div className="absolute left-6 bottom-6 w-1 h-1/2 bg-teal-400/70 animate-grow-up delay-600" />
              <div className="absolute left-1/3 bottom-6 w-1 h-2/3 bg-teal-400/70 animate-grow-up" style={{animationDelay: '0.7s'}} />
              <div className="absolute left-2/3 bottom-6 w-1 h-3/4 bg-teal-400/70 animate-grow-up" style={{animationDelay: '0.8s'}} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Values() {
  const items = [
    { t: "Calendrier intelligent", d: "Accédez à tous les dividendes de la Bourse de Casa, organisés par date. Filtrez, exportez et planifiez vos investissements en quelques clics.", icon: "📅", bg: "#0f0f0f" },
    { t: "Alertes personnalisées", d: "Ne manquez plus aucune date importante. Alertes automatiques avant chaque ex-dividende et paiement, personnalisables selon vos préférences.", icon: "🔔", bg: "#171717" },
    { t: "Outils d'analyse et pilotage", d: "Scores de sécurité, simulateurs, projections DRIP et suivi de performance. Tous les outils pour analyser, décider et piloter vos revenus passifs.", icon: "📊", bg: "#0f0f0f" },
    { t: "Pédagogie investisseur", d: "Guides pratiques, analyses sectorielles et décryptages fiscaux. Apprenez les fondamentaux et affinez votre stratégie avec du contenu accessible.", icon: "💡", bg: "#171717" },
  ];
  return (
    <section className="px-6 py-12" aria-labelledby="values-heading">
      <h2 id="values-heading" className="sr-only">Nos valeurs</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it, idx) => (
          <div
            key={it.t}
            className="rounded-2xl border border-zinc-800 p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/20 hover:border-teal-500/30 opacity-0 animate-fade-in-up cursor-pointer group"
            style={{
              backgroundColor: it.bg,
              animationDelay: `${0.6 + idx * 0.15}s`
            }}
          >
            <div className="text-4xl transition-transform duration-300 group-hover:scale-110" aria-hidden="true">{it.icon}</div>
            <h3 className="text-white font-semibold mt-3 transition-colors duration-300 group-hover:text-teal-400">{it.t}</h3>
            <p className="text-zinc-400 mt-2 text-sm">{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PalmaresPreview({ goRankings }) {
  const sectionRef = useScrollAnimation();
  const rows = [
    { r: 1, t: "IAM", n: "Maroc Telecom", y: "5.2%", pay: "28/06" },
    { r: 2, t: "BCP", n: "Banque Populaire", y: "4.8%", pay: "21/06" },
    { r: 3, t: "ATW", n: "Attijariwafa Bank", y: "4.3%", pay: "05/07" },
  ];
  return (
    <section ref={sectionRef} className="px-6 pb-12 opacity-0" aria-labelledby="palmares-heading">
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
  const sectionRef = useScrollAnimation();
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
        headers: {
          "Content-Type": "application/json",
        },
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
    } catch (error) {
      setStatus("error");
      setMessage("Impossible de se connecter au serveur. Veuillez réessayer.");
    }
  };

  return (
    <section ref={sectionRef} className="px-6 py-10 opacity-0" aria-labelledby="newsletter-heading">
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={status === "loading"}
              className="flex-1 md:w-80 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
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

function ContactSupport() {
  const sectionRef = useScrollAnimation();
  return (
    <section ref={sectionRef} className="px-6 py-10 opacity-0" aria-labelledby="contact-heading">
      <div className="rounded-2xl glassmorphism p-8 shadow-2xl">
        <h2 id="contact-heading" className="text-white text-xl font-semibold mb-6">📞 Contact & Support</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-medium mb-3">Email</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>
                <span className="text-zinc-400">Support :</span>{" "}
                <a href="mailto:support@casadividendes.ma" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">
                  support@casadividendes.ma
                </a>
              </li>
              <li>
                <span className="text-zinc-400">Commercial :</span>{" "}
                <a href="mailto:contact@casadividendes.ma" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">
                  contact@casadividendes.ma
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">Réseaux sociaux</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-zinc-400">🐦 Twitter/X :</span>
                <a href="https://twitter.com/CasaDividendes" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">
                  @CasaDividendes
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-400">💼 LinkedIn :</span>
                <a href="https://linkedin.com/company/casadividendes" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">
                  CasaDividendes
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-400">📘 Facebook :</span>
                <a href="https://facebook.com/casadividendes" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">
                  CasaDividendes
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-400">📸 Instagram :</span>
                <a href="https://instagram.com/casadividendes" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">
                  @casadividendes
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-zinc-700/50">
          <a
            href="mailto:support@casadividendes.ma"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 font-medium hover:bg-teal-500/20 hover:border-teal-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <span>✉️</span>
            Envoyer un message
          </a>
        </div>
      </div>
    </section>
  );
}

function PremiumBand({ goPremium }) {
  const sectionRef = useScrollAnimation();
  return (
    <section ref={sectionRef} className="border-t border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 opacity-0" aria-labelledby="premium-band-heading">
      <div className="px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
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
      <ContactSupport />
      <PremiumBand goPremium={() => window.location.hash = "#/premium"} />
    </>
  );
}
