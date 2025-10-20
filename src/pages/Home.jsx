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
    <section className="hero-gradient relative overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 opacity-30">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
          <path fill="rgba(20, 184, 166, 0.1)" d="M0,320L60,330C120,340,240,360,360,345C480,330,600,280,720,266.7C840,253,960,277,1080,288C1200,299,1320,297,1380,296L1440,295L1440,800L1380,800C1320,800,1200,800,1080,800C960,800,840,800,720,800C600,800,480,800,360,800C240,800,120,800,60,800L0,800Z"></path>
          <path fill="rgba(168, 85, 247, 0.05)" d="M0,480L60,485.3C120,491,240,501,360,480C480,459,600,405,720,394.7C840,384,960,416,1080,437.3C1200,459,1320,469,1380,474.7L1440,480L1440,800L1380,800C1320,800,1200,800,1080,800C960,800,840,800,720,800C600,800,480,800,360,800C240,800,120,800,60,800L0,800Z"></path>
        </svg>
      </div>
      <div className="w-full px-6 py-20 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
        <div className="animate-fade-in-up order-1">
          <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-semibold leading-[1.1] tracking-[-0.02em]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
            <span className="text-white">Les Dividendes </span>
            <br />
            <span className="text-white">Marocains </span>
            <span className="hero-title-gradient-alt">Simplifiés.</span>
          </h1>
          <p className="text-[#A1A1AA] mt-6 text-[18.8px] max-w-[60%] leading-[1.6] font-normal opacity-0 animate-fade-in-up delay-200" style={{ fontFamily: 'Inter, sans-serif' }}>
            La première plateforme marocaine dédiée aux dividendes de la bourse de Casablanca :
            Maximisez votre rentabilité, suivez chaque dividende, anticipez les paiements et optimisez vos décisions avec nos outils d'analyse.
          </p>
          <div className="flex flex-wrap gap-3 opacity-0 animate-fade-in-up delay-300 mt-10">
            <button
              onClick={goCalendar}
              className="px-4 py-2 rounded-xl bg-teal-400 text-black font-Normal transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00D3A7] focus:ring-offset-2 focus:ring-offset-zinc-950 shadow-lg shadow-teal-500/30 hover:brightness-[1.02] hover:shadow-[0_0_20px_rgba(0,211,167,0.3)] active:scale-[0.98]"
              aria-label="Voir le calendrier des dividendes"
            >
              Voir le calendrier
            </button>
            <button
              onClick={goPremium}
              className="px-4 py-2 rounded-xl bg-transparent border border-[rgba(255,255,255,0.08)] text-white font-Normal transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00D3A7] focus:ring-offset-2 focus:ring-offset-zinc-950 hover:bg-[#161A1E] active:scale-[0.98]"
              aria-label="Découvrir l'offre Premium"
            >
              Découvrir Premium
            </button>
          </div>
          <p className="text-zinc-400 text-xs mt-3 opacity-0 animate-fade-in-up delay-400">
            Essai gratuit, sans carte de crédit.
          </p>
        </div>
        <div className="relative opacity-0 animate-fade-in-up delay-500 order-2 mt-10 md:mt-0 group" aria-hidden="true">
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/20 rounded-3xl z-10 pointer-events-none" />
          <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden transition-transform duration-500 hover:scale-[1.02] shadow-[0_20px_60px_rgba(15,118,110,0.25)]">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />

            {/* Gradient glow effects */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#10B981] opacity-20 rounded-full blur-[100px] group-hover:opacity-25 transition-opacity duration-500" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#F97316] opacity-15 rounded-full blur-[100px] group-hover:opacity-20 transition-opacity duration-500" />
            <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-[#7E22CE] opacity-10 rounded-full blur-[80px]" />

            {/* Outer glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#10B981]/15 via-[#F97316]/10 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Main dashboard card */}
            <div className="absolute top-[15%] left-[8%] w-[45%] h-[70%] bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-xl rounded-2xl border border-zinc-800/50 shadow-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-zinc-400 text-xs font-medium">Portefeuille</div>
                <div className="w-16 h-6 bg-gradient-to-r from-[#10B981] to-[#14B8A6] rounded-full opacity-60" />
              </div>

              {/* Revenue stat */}
              <div className="mb-6">
                <div className="text-2xl font-bold text-white mb-1">124,850 MAD</div>
                <div className="flex items-center gap-2">
                  <div className="text-[#10B981] text-sm font-medium">+12.4%</div>
                  <div className="text-xs text-zinc-500">vs mois dernier</div>
                </div>
              </div>

              {/* Chart bars */}
              <div className="flex items-end gap-2 h-24 mb-4">
                <div className="flex-1 bg-gradient-to-t from-[#10B981] to-[#10B981]/40 rounded-t" style={{height: '45%'}} />
                <div className="flex-1 bg-gradient-to-t from-[#10B981] to-[#10B981]/40 rounded-t" style={{height: '65%'}} />
                <div className="flex-1 bg-gradient-to-t from-[#10B981] to-[#10B981]/40 rounded-t" style={{height: '55%'}} />
                <div className="flex-1 bg-gradient-to-t from-[#10B981] to-[#10B981]/40 rounded-t" style={{height: '80%'}} />
                <div className="flex-1 bg-gradient-to-t from-[#10B981] to-[#10B981]/40 rounded-t" style={{height: '70%'}} />
                <div className="flex-1 bg-gradient-to-t from-[#F97316] to-[#F97316]/40 rounded-t" style={{height: '95%'}} />
              </div>

              {/* Stock items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-t border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#10B981]/20 flex items-center justify-center text-[10px] text-[#10B981]">IAM</div>
                    <div className="text-xs text-zinc-400">Maroc Telecom</div>
                  </div>
                  <div className="text-xs text-white font-medium">5.2%</div>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#F97316]/20 flex items-center justify-center text-[10px] text-[#F97316]">BCP</div>
                    <div className="text-xs text-zinc-400">Banque Populaire</div>
                  </div>
                  <div className="text-xs text-white font-medium">4.8%</div>
                </div>
              </div>
            </div>

            {/* Floating curved card */}
            <div className="absolute top-[20%] right-[5%] w-[42%] h-[60%] bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-3xl border border-zinc-700/50 shadow-2xl p-5 transform rotate-2">
              <div className="mb-4">
                <div className="text-zinc-400 text-xs mb-3">Prochains dividendes</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-white">8,450</div>
                  <div className="text-sm text-zinc-500">MAD</div>
                </div>
              </div>

              {/* Mini chart */}
              <div className="relative h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 60 Q 30 40, 50 45 T 100 30 T 150 20 T 200 15"
                    fill="url(#chartGradient)"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0 60 Q 30 40, 50 45 T 100 30 T 150 20 T 200 15 L 200 80 L 0 80 Z"
                    fill="url(#chartGradient)"
                  />
                </svg>
                <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/50">
                  <div className="text-[10px] text-zinc-500 mb-1">Rendement</div>
                  <div className="text-sm font-bold text-[#10B981]">+18.2%</div>
                </div>
                <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/50">
                  <div className="text-[10px] text-zinc-500 mb-1">Positions</div>
                  <div className="text-sm font-bold text-white">12</div>
                </div>
              </div>
            </div>

            {/* Glassmorphism overlay elements */}
            <div className="absolute bottom-[10%] left-[10%] w-32 h-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg" />
            <div className="absolute top-[10%] right-[45%] w-24 h-16 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "12 000+", label: "Dividendes suivis", icon: "📊" },
    { value: "80+", label: "Sociétés cotées", icon: "🏢" },
    { value: "450+", label: "Alertes activées", icon: "🔔" }
  ];

  return (
    <section className="bg-[#F8FAFC] py-20" aria-labelledby="stats-heading">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 id="stats-heading" className="text-2xl md:text-3xl font-semibold text-[#0F172A] mb-12" style={{ fontFamily: 'Inter, sans-serif' }}>
          Déjà plus de 2 000 investisseurs marocains utilisent CasaDividendes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="flex flex-col items-center opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
            >
              <div className="text-4xl mb-3 opacity-60">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-base text-[#64748B] font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Values() {
  const items = [
    { t: "Calendrier intelligent", d: "Accédez à tous les dividendes de la Bourse de Casa, organisés par date. Filtrez, exportez et planifiez vos investissements en quelques clics.", icon: "📅", bg: "#0f0f0f" },
    { t: "Alertes personnalisées", d: "Ne manquez plus aucune date importante. Alertes automatiques avant chaque ex-dividende et paiement, personnalisables selon vos préférences.", icon: "🔔", bg: "#171717" },
    { t: "Outils d'analyse et pilotage", d: "Scores de sécurité, simulateurs, projections DRIP et suivi de performance. Tous les outils pour analyser, décider et piloter vos revenus passifs.", icon: "📈", bg: "#0f0f0f" },
    { t: "Pédagogie investisseur", d: "Guides pratiques, analyses sectorielles et décryptages fiscaux. Apprenez les fondamentaux et affinez votre stratégie avec du contenu accessible.", icon: "🎓", bg: "#171717" },
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
      <StatsSection />
      <Values />
      <PalmaresPreview goRankings={() => window.location.hash = "#/rankings"} />
      <Newsletter />
      <ContactSupport />
      <PremiumBand goPremium={() => window.location.hash = "#/premium"} />
    </>
  );
}
