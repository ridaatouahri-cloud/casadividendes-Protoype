import React, { useEffect, useRef } from "react";

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
        rootMargin: '0px 0px -100px 0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return ref;
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-black min-h-screen flex items-center">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-500/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 text-sm font-medium">Plateforme numero 1 au Maroc</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-6">
              <span className="text-white">La premiere plateforme</span>
              <br />
              <span className="text-white">dediee aux </span>
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">dividendes</span>
              <br />
              <span className="text-white">de la Bourse de </span>
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Casablanca</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Analysez, suivez et optimisez vos revenus boursiers grace a nos outils exclusifs CasaDividendes
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.hash = "#/calendar"}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
              >
                <span className="relative z-10">Decouvrir la plateforme</span>
              </button>
              
              <button
                onClick={() => window.location.hash = "#/premium"}
                className="px-8 py-4 rounded-2xl bg-transparent border-2 border-zinc-700 text-white font-semibold text-lg transition-all duration-300 hover:border-amber-500/50 hover:bg-amber-500/5"
              >
                Essai gratuit - sans carte bancaire
              </button>
            </div>

            <p className="text-zinc-500 text-sm mt-6">
              Rejoignez plus de 2 000 investisseurs marocains
            </p>
          </div>

          <div className="relative opacity-0 animate-fade-in-up mt-20" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-teal-500/20 blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800/50 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-zinc-900/50 to-zinc-950/50">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-zinc-800/50 to-transparent flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              
              <div className="p-8 pt-16">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="text-zinc-400 text-sm mb-2">Revenus Annuels</div>
                    <div className="text-3xl font-bold text-white mb-1">247,850 MAD</div>
                    <div className="flex items-center gap-2">
                      <div className="text-emerald-400 text-sm">+24.5%</div>
                      <div className="text-zinc-500 text-xs">vs. annee precedente</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="text-zinc-400 text-sm mb-2">Rendement Moyen</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-1">6.8%</div>
                    <div className="flex items-center gap-2">
                      <div className="text-amber-400 text-sm">C-DRS Score</div>
                      <div className="text-zinc-500 text-xs">Premium</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-2xl p-6 border border-zinc-700/50">
                    <div className="text-zinc-400 text-sm mb-2">Prochains Versements</div>
                    <div className="text-3xl font-bold text-white mb-1">18,450 MAD</div>
                    <div className="flex items-center gap-2">
                      <div className="text-teal-400 text-sm">Dans 8 jours</div>
                      <div className="text-zinc-500 text-xs">3 societes</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 rounded-2xl p-6 border border-zinc-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white font-semibold">Portefeuille</div>
                    <div className="text-zinc-400 text-sm">15 positions actives</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { ticker: 'IAM', name: 'Maroc Telecom', yield: '5.2%', color: 'emerald' },
                      { ticker: 'BCP', name: 'Banque Populaire', yield: '4.8%', color: 'amber' },
                      { ticker: 'ATW', name: 'Attijariwafa Bank', yield: '4.3%', color: 'orange' }
                    ].map((stock) => (
                      <div key={stock.ticker} className="flex items-center justify-between py-3 border-t border-zinc-800/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-${stock.color}-500/10 border border-${stock.color}-500/20 flex items-center justify-center text-${stock.color}-400 font-bold text-sm`}>
                            {stock.ticker}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{stock.name}</div>
                            <div className="text-zinc-500 text-xs">Dividende regulier</div>
                          </div>
                        </div>
                        <div className={`text-${stock.color}-400 font-semibold`}>{stock.yield}</div>
                      </div>
                    ))}
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

function FeaturesSection() {
  const sectionRef = useScrollAnimation();
  
  const features = [
    {
      icon: '📊',
      title: 'Calendrier des Dividendes',
      description: 'Toutes les dates cles de la BVC : ex-dividende, detachement, et paiement. Mises a jour en temps reel et synchronisees avec vos alertes.'
    },
    {
      icon: '💎',
      title: 'Scores et Indicateurs',
      description: 'C-DRS, PRT, NDF : vos KPIs exclusifs pour identifier les meilleures opportunites de dividendes.'
    },
    {
      icon: '📈',
      title: 'Analyse Historique',
      description: 'Visualisez la croissance et la regularite des dividendes sur 5 ans. Graphiques interactifs et projections avancees.'
    },
    {
      icon: '🧭',
      title: 'Strategie Personnalisee',
      description: 'Recommandations adaptees a votre profil : rendement, croissance ou equilibre. Pilotez vos revenus passifs.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-gradient-to-b from-zinc-950 to-black relative overflow-hidden opacity-0">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Une plateforme pensee pour <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">excellence</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Des outils professionnels pour maitriser vos investissements en dividendes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group relative bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-3xl p-8 border border-zinc-800/50 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardShowcase() {
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-black relative overflow-hidden opacity-0">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-500/10 to-teal-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Un <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">cockpit clair</span> pour piloter
            <br />
            vos revenus passifs
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Interface intuitive, donnees en temps reel, analyses approfondies
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-teal-500/20 rounded-3xl blur-2xl opacity-50" />
          
          <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 rounded-3xl border border-zinc-800/50 p-8 backdrop-blur-xl">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop" 
              alt="Dashboard CasaDividendes"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { label: 'Temps reel', value: 'Donnees actualisees' },
            { label: 'Multi-device', value: 'Web & Mobile' },
            { label: 'Securise', value: 'Cryptage total' }
          ].map((item, idx) => (
            <div 
              key={item.label}
              className="text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
            >
              <div className="text-amber-400 font-semibold mb-1">{item.label}</div>
              <div className="text-zinc-400 text-sm">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const sectionRef = useScrollAnimation();

  const testimonials = [
    {
      name: 'Youssef A.',
      role: 'Investisseur depuis 2016',
      avatar: '👨‍💼',
      text: 'CasaDividendes m\'a permis de comprendre mes dividendes et d\'optimiser mes placements. Les scores C-DRS sont un vrai game-changer.'
    },
    {
      name: 'Amina K.',
      role: 'Portefeuille diversifie',
      avatar: '👩‍💻',
      text: 'Grace aux alertes personnalisees, je ne manque plus aucune date importante. L\'interface est claire et professionnelle.'
    },
    {
      name: 'Mehdi R.',
      role: 'Trader actif',
      avatar: '👨‍💼',
      text: 'Les analyses historiques sur 5 ans m\'aident a prendre des decisions eclairees. C\'est l\'outil qu\'il manquait au Maroc.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden opacity-0">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ils nous font <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">confiance</span>
          </h2>
          <p className="text-xl text-zinc-400">
            Rejoignez une communaute d'investisseurs avertis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.name}
              className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-3xl p-8 border border-zinc-800/50 hover:border-amber-500/30 transition-all duration-300 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-3xl border border-amber-500/30">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-zinc-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-zinc-300 leading-relaxed italic">
                {testimonial.text}
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  const sectionRef = useScrollAnimation();

  const articles = [
    {
      title: 'C\'est quoi un dividende ?',
      excerpt: 'Comprendre les bases des dividendes et leur importance dans une strategie d\'investissement.',
      category: 'Debutant',
      readTime: '5 min'
    },
    {
      title: 'Les 5 actions les plus regulieres du Maroc',
      excerpt: 'Analyse des societes marocaines avec les historiques de dividendes les plus constants.',
      category: 'Analyse',
      readTime: '8 min'
    },
    {
      title: 'Optimiser sa fiscalite sur les dividendes',
      excerpt: 'Guide complet sur la taxation des dividendes au Maroc et strategies d\'optimisation legales.',
      category: 'Fiscalite',
      readTime: '12 min'
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-zinc-950 relative overflow-hidden opacity-0">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Apprenez</span> et progressez
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Ressources educatives pour devenir un investisseur averti
          </p>
          <button
            onClick={() => window.location.hash = "#/blog"}
            className="px-6 py-3 rounded-xl bg-transparent border border-amber-500/30 text-amber-400 font-medium hover:bg-amber-500/10 transition-all duration-300"
          >
            Acceder au Blog educatif
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <div
              key={article.title}
              className="group bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-amber-500/30 transition-all duration-300 cursor-pointer opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="h-48 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-6xl">
                📚
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                    {article.category}
                  </span>
                  <span className="text-zinc-500 text-xs">{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-gradient-to-br from-black via-zinc-950 to-black relative overflow-hidden opacity-0">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-[200px]" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 rounded-3xl p-12 md:p-20 border border-zinc-800/50 backdrop-blur-xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Rejoignez la communaute
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              CasaDividendes
            </span>
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Maitrisez vos revenus boursiers et prenez des decisions eclairees avec les meilleurs outils d'analyse du marche marocain
          </p>
          
          <button
            onClick={() => window.location.hash = "#/signup"}
            className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 mb-4"
          >
            <span className="relative z-10">Creer mon compte gratuitement</span>
          </button>
          
          <p className="text-zinc-500 text-sm">
            Essai gratuit 14 jours • Sans carte bancaire • Resiliation a tout moment
          </p>

          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-zinc-800/50">
            <div>
              <div className="text-3xl font-bold text-white mb-2">2 000+</div>
              <div className="text-zinc-400 text-sm">Investisseurs actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">80+</div>
              <div className="text-zinc-400 text-sm">Societes suivies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">12K+</div>
              <div className="text-zinc-400 text-sm">Dividendes analyses</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
              CasaDividendes
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              La plateforme de reference pour les dividendes de la Bourse de Casablanca
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#/" className="hover:text-amber-400 transition-colors">Accueil</a></li>
              <li><a href="#/calendar" className="hover:text-amber-400 transition-colors">Calendrier</a></li>
              <li><a href="#/rankings" className="hover:text-amber-400 transition-colors">Palmares</a></li>
              <li><a href="#/blog" className="hover:text-amber-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#/about" className="hover:text-amber-400 transition-colors">A propos</a></li>
              <li><a href="#/contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
              <li><a href="#/premium" className="hover:text-amber-400 transition-colors">Premium</a></li>
              <li><a href="#/faq" className="hover:text-amber-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#/legal" className="hover:text-amber-400 transition-colors">Mentions legales</a></li>
              <li><a href="#/privacy" className="hover:text-amber-400 transition-colors">Confidentialite</a></li>
              <li><a href="#/terms" className="hover:text-amber-400 transition-colors">CGU</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-zinc-500 text-sm text-center md:text-left">
              <p className="mb-2">
                Disclaimer: CasaDividendes est un outil d'analyse et d'information. Il ne constitue pas un conseil financier, fiscal ou juridique.
              </p>
              <p>
                Copyright {new Date().getFullYear()} CasaDividendes - Tous droits reserves
              </p>
            </div>

            <div className="flex gap-4">
              <a 
                href="https://twitter.com/CasaDividendes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/casadividendes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/casadividendes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/casadividendes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = "CasaDividendes - Plateforme Premium de Dividendes | Bourse de Casablanca";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'La plateforme de reference pour analyser, suivre et optimiser vos dividendes sur la Bourse de Casablanca. Calendrier intelligent, scores exclusifs, analyses historiques.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'La plateforme de reference pour analyser, suivre et optimiser vos dividendes sur la Bourse de Casablanca. Calendrier intelligent, scores exclusifs, analyses historiques.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        ::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>

      <div className="bg-black min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <DashboardShowcase />
        <TestimonialsSection />
        <BlogSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}