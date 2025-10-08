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
    <section className="finary-hero-gradient relative overflow-hidden" style={{ minHeight: '90vh' }}>
      <div className="mx-auto max-w-7xl px-6 h-full flex items-center relative z-10" style={{ minHeight: '90vh' }}>
        <div className="grid md:grid-cols-2 gap-16 items-center w-full">
          <div className="max-w-3xl">
            <h1
              className="font-light leading-tight animate-cascade-1"
              style={{
                fontSize: 'clamp(3rem, 6vw, 6rem)',
                lineHeight: '1.1',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              }}
            >
              <span className="text-white font-light">Les dividendes </span>
              <span className="text-gradient font-semibold">marocains simplifiés</span>
            </h1>

            <p
              className="mt-6 text-lg leading-relaxed animate-cascade-2"
              style={{
                color: '#A1A1AA',
                maxWidth: '650px'
              }}
            >
              Première plateforme pour suivre et optimiser vos dividendes à la Bourse de Casablanca
            </p>

            <div className="mt-10 animate-cascade-3">
              <button
                onClick={goCalendar}
                className="px-10 py-5 text-lg font-semibold transition-all duration-400 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent hover:scale-102"
                style={{
                  backgroundColor: '#14F4C5',
                  color: '#0B0B0B',
                  borderRadius: '2rem',
                  boxShadow: '0 0 30px rgba(20, 244, 197, 0.25)',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(20, 244, 197, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(20, 244, 197, 0.25)';
                }}
                aria-label="Démarrer gratuitement"
              >
                Démarrer gratuitement
              </button>
            </div>
          </div>

          <div className="hidden md:block animate-cascade-4">
            <div
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 40px rgba(20, 244, 197, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

              <div className="relative space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                  <div className="space-y-1">
                    <div className="h-2 w-24 rounded bg-teal-400/50" />
                    <div className="h-4 w-32 rounded bg-white/80" />
                  </div>
                  <div className="text-2xl font-bold text-teal-400">+5.2%</div>
                </div>

                <div className="h-48 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-black/50 p-6 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-full px-4 pb-4">
                    <div className="w-12 bg-gradient-to-t from-teal-400 to-teal-500 rounded-t-lg animate-grow-up" style={{ height: '40%', animationDelay: '0.8s' }} />
                    <div className="w-12 bg-gradient-to-t from-teal-400 to-teal-500 rounded-t-lg animate-grow-up" style={{ height: '65%', animationDelay: '0.9s' }} />
                    <div className="w-12 bg-gradient-to-t from-teal-400 to-teal-500 rounded-t-lg animate-grow-up" style={{ height: '55%', animationDelay: '1.0s' }} />
                    <div className="w-12 bg-gradient-to-t from-teal-400 to-teal-500 rounded-t-lg animate-grow-up" style={{ height: '80%', animationDelay: '1.1s' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-zinc-500 mb-1">Rendement</div>
                    <div className="text-lg font-semibold text-white">4.8%</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-zinc-500 mb-1">Paiement</div>
                    <div className="text-lg font-semibold text-white">28/06</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Values() {
  const items = [
    { t: "Des données vérifiées", d: "Dates ex-dividende, paiements et historiques sourcés.", icon: "📊", bg: "#0f0f0f" },
    { t: "Des outils utiles", d: "Palmarès, fiches, projections — l'essentiel, sans superflu.", icon: "⚙️", bg: "#171717" },
    { t: "Pédagogie locale", d: "Articles clairs en FR/Darija pour éviter les pièges.", icon: "📚", bg: "#0f0f0f" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-12" aria-labelledby="values-heading">
      <h2 id="values-heading" className="sr-only">Nos valeurs</h2>
      <div className="grid md:grid-cols-3 gap-6">
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
    <section ref={sectionRef} className="mx-auto max-w-7xl px-6 pb-12 opacity-0" aria-labelledby="palmares-heading">
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
    <section ref={sectionRef} className="mx-auto max-w-7xl px-6 py-10 opacity-0" aria-labelledby="newsletter-heading">
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
    <section ref={sectionRef} className="mx-auto max-w-7xl px-6 py-10 opacity-0" aria-labelledby="contact-heading">
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
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
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
