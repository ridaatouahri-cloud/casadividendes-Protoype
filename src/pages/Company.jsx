import React, { useState } from 'react';
import { TrendingUp, Shield, Zap, Sparkles, Bell, Calculator, BarChart3, Download, Share2, Info, ChevronRight, Target, Calendar, Clock, TrendingDown, Award, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';

const CompanyPageRefonte = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showKPIModal, setShowKPIModal] = useState(null);

  // Données IAM
  const company = {
    ticker: 'IAM',
    name: 'Maroc Telecom',
    sector: 'Télécommunications',
    logo: 'IAM',
    currentPrice: 102.50,
    priceChange: 2.4,
    
    // KPIs
    cdrs: {
      score: 88,
      label: 'Excellent',
      color: 'emerald',
      details: {
        regularity: 95,
        growth: 85,
        stability: 90,
        magnitude: 86
      }
    },
    prt: {
      days: 42,
      score: 78,
      label: 'Rapide',
      color: 'blue',
      category: 'Rotation Standard'
    },
    ndf: {
      amount: 4.25,
      date: 'Juin 2025',
      confidence: 92,
      range: { min: 4.10, max: 4.40 }
    },
    
    // Profil
    yield: 5.2,
    noDecreaseYears: 10,
    nextPayment: '28/06/2025',
    badge: 'ARISTOCRATE DIVIDENDE',
    
    // Historique
    history: [
      { year: 2020, dividend: 3.65, growth: null },
      { year: 2021, dividend: 3.75, growth: 2.7 },
      { year: 2022, dividend: 3.86, growth: 2.9 },
      { year: 2023, dividend: 4.01, growth: 3.9 },
      { year: 2024, dividend: 4.10, growth: 2.2 },
      { year: 2025, dividend: 4.25, growth: 3.7, projected: true }
    ]
  };

  // Calcul du score global
  const globalScore = Math.round((company.cdrs.score * 0.4 + company.prt.score * 0.3 + company.ndf.confidence * 0.3));

  // Déterminer la stratégie recommandée
  const recommendedStrategy = company.cdrs.score > 80 && company.prt.days < 50 && company.yield > 4
    ? { type: 'ROTATION STANDARD', icon: '🔄', color: 'blue' }
    : company.cdrs.score > 80 && company.yield > 4
    ? { type: 'BUY & HOLD', icon: '💎', color: 'purple' }
    : { type: 'OPPORTUNISTE', icon: '⚡', color: 'yellow' };

  // Composant Modal KPI
  const KPIModal = ({ kpi, onClose }) => {
    const kpiDetails = {
      cdrs: {
        title: 'C-DRS™ - Casa-Dividend Reliability Score',
        subtitle: 'Score de Fiabilité des Dividendes',
        description: 'Le C-DRS évalue la qualité et la prévisibilité des dividendes sur une échelle de 0 à 100 points.',
        components: [
          { name: 'Régularité', value: company.cdrs.details.regularity, weight: '25%', desc: 'Paiements constants chaque année' },
          { name: 'Croissance', value: company.cdrs.details.growth, weight: '35%', desc: 'Augmentation des dividendes' },
          { name: 'Stabilité', value: company.cdrs.details.stability, weight: '25%', desc: 'Faible volatilité des montants' },
          { name: 'Magnitude', value: company.cdrs.details.magnitude, weight: '15%', desc: 'Taux de croissance annuel' }
        ],
        interpretation: company.cdrs.score >= 80 ? 'Dividende hautement fiable avec historique solide' : 'Dividende correct avec quelques variations'
      },
      prt: {
        title: 'PRT™ - Price Recovery Time',
        subtitle: 'Temps de Récupération du Prix',
        description: 'Le PRT mesure combien de jours il faut pour que le cours revienne à son niveau avant détachement.',
        components: [
          { name: 'Moyenne 3 ans', value: `${company.prt.days} jours`, desc: '2022-2024' },
          { name: 'Catégorie', value: company.prt.category, desc: 'Rotation standard possible' },
          { name: 'vs Secteur', value: '42j vs 55j', desc: 'Meilleur que la moyenne' }
        ],
        interpretation: company.prt.days < 30 ? 'Récupération rapide, idéal pour la rotation' : 'Récupération moyenne, adaptée au hold moyen terme'
      },
      ndf: {
        title: 'NDF™ - Next Dividend Forecast',
        subtitle: 'Prévision du Prochain Dividende',
        description: 'Le NDF prédit le montant et la période du prochain dividende basé sur l\'historique et les tendances.',
        components: [
          { name: 'Montant prévu', value: `${company.ndf.amount} MAD`, desc: `Fourchette: ${company.ndf.range.min}-${company.ndf.range.max}` },
          { name: 'Période estimée', value: company.ndf.date, desc: 'Ex-date probable: 05-08 juin' },
          { name: 'Confiance', value: `${company.ndf.confidence}%`, desc: 'Très haute fiabilité' }
        ],
        interpretation: company.ndf.confidence > 85 ? 'Prévision très fiable, planifiable en toute confiance' : 'Prévision indicative, à confirmer'
      }
    };

    const details = kpiDetails[kpi];
    if (!details) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{details.title}</h3>
                <p className="text-teal-400 text-sm">{details.subtitle}</p>
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-zinc-300 text-sm">{details.description}</p>
          </div>

          <div className="p-6 space-y-4">
            <h4 className="text-white font-semibold mb-3">Composantes :</h4>
            {details.components.map((comp, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-zinc-300 font-medium">{comp.name}</span>
                  <span className="text-teal-400 font-bold text-lg">{comp.value}</span>
                </div>
                {comp.weight && (
                  <div className="text-xs text-zinc-500 mb-2">Poids: {comp.weight}</div>
                )}
                <p className="text-zinc-400 text-sm">{comp.desc}</p>
              </div>
            ))}

            <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-lg p-4 border border-teal-500/20 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-white font-semibold mb-1">Interprétation</h5>
                  <p className="text-zinc-300 text-sm">{details.interpretation}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/10 bg-white/5">
            <a href="#" className="text-teal-400 text-sm hover:text-teal-300 transition flex items-center gap-2">
              <span>Lire la méthodologie complète</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950">
      {/* Modal KPI */}
      {showKPIModal && <KPIModal kpi={showKPIModal} onClose={() => setShowKPIModal(null)} />}

      {/* HERO SECTION - Verdict Dividende */}
      <div className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 border-b border-white/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* En-tête compact */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">{company.logo}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{company.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-teal-300 text-sm">{company.sector}</span>
                  <span className="text-zinc-500">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-semibold">{company.currentPrice} MAD</span>
                    <span className="text-teal-400 text-sm">+{company.priceChange}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Ajouter au Portefeuille
              </button>
            </div>
          </div>

          {/* Verdict Central */}
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur rounded-2xl p-8 border border-teal-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-teal-400" />
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-teal-500/20 text-teal-300 rounded-full text-sm font-semibold border border-teal-500/30">
                    {company.badge}
                  </span>
                  <span className="text-zinc-400 text-sm">{company.noDecreaseYears} ans sans baisse • {company.yield}% yield</span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">Profil Dividende Excellent</h2>
              </div>
            </div>

            {/* Score Global */}
            <div className="mb-6">
              <div className="flex items-end gap-4 mb-2">
                <div className="text-5xl font-bold text-teal-400">{globalScore}</div>
                <div className="text-zinc-400 text-lg mb-2">/100</div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-6 h-6 ${i < Math.floor(globalScore/20) ? 'text-teal-400' : 'text-zinc-700'}`}>⭐</div>
                  ))}
                </div>
              </div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${globalScore}%` }}
                />
              </div>
            </div>

            {/* KPIs Compacts */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-teal-500/50 transition cursor-pointer group" onClick={() => setShowKPIModal('cdrs')}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-zinc-400 text-sm">Fiabilité</span>
                  <Info className="w-4 h-4 text-zinc-600 group-hover:text-teal-400 transition ml-auto" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{company.cdrs.score}/100</div>
                <div className="text-emerald-400 text-sm font-semibold">{company.cdrs.label}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition cursor-pointer group" onClick={() => setShowKPIModal('prt')}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-zinc-400 text-sm">Récupération</span>
                  <Info className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition ml-auto" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{company.prt.days}j</div>
                <div className="text-blue-400 text-sm font-semibold">{company.prt.label}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition cursor-pointer group" onClick={() => setShowKPIModal('ndf')}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-zinc-400 text-sm">Prochain</span>
                  <Info className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition ml-auto" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{company.ndf.amount}</div>
                <div className="text-purple-400 text-sm font-semibold">{company.ndf.date}</div>
              </div>
            </div>

            {/* CTA Secondaires */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                Alerter J-3 avant Ex-Date
              </button>
              <button className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Simuler
              </button>
              <button className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLONNE PRINCIPALE */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TIMELINE DIVIDENDE */}
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-teal-400" />
                  <h3 className="text-xl font-bold text-white">Historique Dividendes</h3>
                </div>
                <span className="text-zinc-400 text-sm">2020-2025</span>
              </div>

              {/* Graphique Timeline */}
              <div className="relative h-48 mb-6">
                <div className="absolute inset-0 flex items-end justify-between gap-2">
                  {company.history.map((year, idx) => {
                    const maxDiv = Math.max(...company.history.map(h => h.dividend));
                    const height = (year.dividend / maxDiv) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs text-zinc-400 mb-1">
                          {year.projected ? '🔮' : ''} {year.dividend.toFixed(2)}
                        </div>
                        <div 
                          className={`w-full rounded-t-lg transition-all hover:scale-105 cursor-pointer ${
                            year.projected 
                              ? 'bg-gradient-to-t from-purple-500/70 to-purple-400/70 border-2 border-purple-400 border-dashed' 
                              : 'bg-gradient-to-t from-teal-600 to-teal-400'
                          }`}
                          style={{ height: `${height}%` }}
                          title={`${year.year}: ${year.dividend} MAD${year.growth ? ` (${year.growth > 0 ? '+' : ''}${year.growth}%)` : ''}`}
                        />
                        <div className="text-sm text-zinc-400 font-medium">{year.year}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats Résumé */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-teal-500/10 rounded-lg p-4 border border-teal-500/20">
                  <div className="text-teal-400 text-sm mb-1">Croissance</div>
                  <div className="text-white text-lg font-bold">+3.2%/an</div>
                  <div className="text-zinc-500 text-xs">TCAM 2020-2024</div>
                </div>
                <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                  <div className="text-emerald-400 text-sm mb-1">Stabilité</div>
                  <div className="text-white text-lg font-bold">Excellente</div>
                  <div className="text-zinc-500 text-xs">CV = 9.4%</div>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <div className="text-blue-400 text-sm mb-1">Constance</div>
                  <div className="text-white text-lg font-bold">5/5 ans</div>
                  <div className="text-zinc-500 text-xs">Zéro baisse</div>
                </div>
              </div>
            </div>

            {/* STRATÉGIE RECOMMANDÉE */}
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-teal-400" />
                <h3 className="text-xl font-bold text-white">Stratégie Recommandée</h3>
              </div>

              {/* Badge Profil */}
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-4 border border-blue-500/30 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{recommendedStrategy.icon}</div>
                  <div>
                    <div className="text-blue-400 text-sm mb-1">Profil détecté</div>
                    <div className="text-white text-xl font-bold">{recommendedStrategy.type}</div>
                  </div>
                </div>
              </div>

              {/* Analyse */}
              <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                <p className="text-zinc-300 leading-relaxed">
                  Avec <span className="text-teal-400 font-semibold">C-DRS {company.cdrs.score}</span> + 
                  <span className="text-blue-400 font-semibold"> PRT {company.prt.days}j</span> + 
                  <span className="text-purple-400 font-semibold"> Yield {company.yield}%</span>, 
                  {company.name} est idéale pour une stratégie de rotation standard ou de hold moyen terme.
                </p>
              </div>

              {/* Stratégies */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-xl p-5 border border-teal-500/30">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">Stratégie #1 : HOLD MOYEN TERME</h4>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        <li className="flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4 text-teal-400" />
                          Acheter maintenant ou avant mai 2025
                        </li>
                        <li className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-400" />
                          Encaisser dividende ~08 juin 2025 ({company.ndf.amount} MAD)
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-400" />
                          Revendre après recovery (~{company.prt.days} jours = mi-juillet)
                        </li>
                        <li className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-teal-400" />
                          Gain estimé : Dividende + stabilité du prix
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/30">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">Stratégie #2 : BUY & HOLD</h4>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        <li className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-400" />
                          Pour investisseurs passifs préférant la simplicité
                        </li>
                        <li className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-400" />
                          Dividende fiable année après année (C-DRS {company.cdrs.score})
                        </li>
                        <li className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-400" />
                          Croissance régulière +3.2%/an
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Optimale */}
              <div className="mt-6 bg-black/20 rounded-lg p-4 border border-white/5">
                <div className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  Timeline Optimale 2025
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-32 text-zinc-400 text-sm">Maintenant → Mai</div>
                    <div className="flex-1 h-2 bg-teal-500/20 rounded-full">
                      <div className="h-full w-3/4 bg-teal-500 rounded-full"></div>
                    </div>
                    <div className="text-zinc-300 text-sm">Accumulation</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 text-zinc-400 text-sm">05-08 Juin</div>
                    <div className="flex-1 h-2 bg-orange-500/20 rounded-full">
                      <div className="h-full w-1/4 bg-orange-500 rounded-full"></div>
                    </div>
                    <div className="text-orange-400 text-sm font-semibold">⚠️ Ex-date (ne pas vendre)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 text-zinc-400 text-sm">Mi-Juillet</div>
                    <div className="flex-1 h-2 bg-emerald-500/20 rounded-full">
                      <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="text-emerald-400 text-sm font-semibold">✅ Recovery complété</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SIDEBAR DROITE */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Actions Rapides */}
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6 lg:sticky lg:top-6">
              <h3 className="text-lg font-bold text-white mb-4">Actions Rapides</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2">
                  <Bell className="w-5 h-5" />
                  Créer une Alerte
                </button>
                
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition border border-white/10 flex items-center justify-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Simulateur DRIP
                </button>
                
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition border border-white/10 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Télécharger Rapport
                </button>
                
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition border border-white/10 flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Partager l'Analyse
                </button>
              </div>
            </div>

            {/* Comparaison Sectorielle */}
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                vs Secteur Télécom
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                  <span className="text-zinc-400">Métrique</span>
                  <span className="text-teal-400 font-semibold">{company.ticker}</span>
                  <span className="text-zinc-500">Secteur</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <span className="text-zinc-300 text-sm">C-DRS™</span>
                  <span className="text-sm font-bold text-teal-400">{company.cdrs.score}</span>
                  <span className="text-sm text-zinc-500">72</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <span className="text-zinc-300 text-sm">Rendement</span>
                  <span className="text-sm font-bold text-teal-400">{company.yield}%</span>
                  <span className="text-sm text-zinc-500">4.8%</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <span className="text-zinc-300 text-sm">PRT™</span>
                  <span className="text-sm font-bold text-teal-400">{company.prt.days}j</span>
                  <span className="text-sm text-zinc-500">55j</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <span className="text-zinc-300 text-sm">Stabilité</span>
                  <span className="text-sm font-bold text-zinc-300">Haute</span>
                  <span className="text-sm text-zinc-500">Moyenne</span>
                </div>
              </div>

              <div className="mt-4 bg-teal-500/10 rounded-lg p-3 border border-teal-500/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-400 text-sm font-semibold">Performance supérieure au secteur</span>
                </div>
              </div>
            </div>

            {/* Actualités */}
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                Actualités Récentes
              </h3>
              
              <div className="space-y-4">
                <div className="group cursor-pointer">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/20">Résultats</span>
                    <span className="text-xs text-zinc-500">20 Nov 2024</span>
                  </div>
                  <h4 className="text-sm text-zinc-200 group-hover:text-teal-400 transition mb-1 line-clamp-2">
                    Résultats solides au T3 2024
                  </h4>
                  <p className="text-xs text-zinc-500">Le Matin</p>
                  <div className="h-px bg-white/5 mt-4"></div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">Analyse</span>
                    <span className="text-xs text-zinc-500">18 Nov 2024</span>
                  </div>
                  <h4 className="text-sm text-zinc-200 group-hover:text-teal-400 transition mb-1 line-clamp-2">
                    Analyse de la durabilité des dividendes
                  </h4>
                  <p className="text-xs text-zinc-500">L'Economiste</p>
                  <div className="h-px bg-white/5 mt-4"></div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">Stratégie</span>
                    <span className="text-xs text-zinc-500">15 Nov 2024</span>
                  </div>
                  <h4 className="text-sm text-zinc-200 group-hover:text-teal-400 transition mb-1 line-clamp-2">
                    Expansion stratégique en cours
                  </h4>
                  <p className="text-xs text-zinc-500">Boursenews</p>
                </div>
              </div>
              
              <button className="w-full mt-4 text-teal-400 text-sm font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all py-2">
                Voir toutes les actualités
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Prochaines Ex-Dates Secteur */}
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-400" />
                Prochaines Ex-Dates
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-semibold">IAM</span>
                    <span className="text-teal-400 text-sm">05-08 juin</span>
                  </div>
                  <div className="text-xs text-zinc-400">~4.25 MAD • Confiance: 92%</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-semibold">ATW</span>
                    <span className="text-blue-400 text-sm">12-15 juin</span>
                  </div>
                  <div className="text-xs text-zinc-400">~16.60 MAD • Confiance: 88%</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-semibold">BCP</span>
                    <span className="text-purple-400 text-sm">20-23 juin</span>
                  </div>
                  <div className="text-xs text-zinc-400">~7.40 MAD • Confiance: 85%</div>
                </div>
              </div>

              <div className="mt-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-semibold mb-1">Opportunité de Rotation</div>
                    <p className="text-zinc-400 text-xs">
                      3 dividendes potentiels en juin avec des ex-dates espacées.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION DÉTAILS APPROFONDIS */}
        <div className="mt-8 space-y-6">
          
          {/* Tableau Historique Complet */}
          <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h3 className="text-xl font-bold text-white">Historique Complet des Dividendes</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Activer alerte J-3
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exporter CSV/PDF
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Année</th>
                    <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Ex-date</th>
                    <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Paiement</th>
                    <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Montant</th>
                    <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Variation</th>
                    <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-zinc-300 text-sm font-semibold">2025</td>
                    <td className="px-6 py-4 text-purple-400 text-sm">~05-08/06/2025</td>
                    <td className="px-6 py-4 text-purple-400 text-sm">~23/06/2025</td>
                    <td className="px-6 py-4 text-purple-400 font-semibold">~4.25 MAD</td>
                    <td className="px-6 py-4 text-teal-400 text-sm">+3.7% 🔮</td>
                    <td className="px-6 py-4 text-purple-400 text-sm">Prévision NDF™</td>
                  </tr>
                  <tr className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-zinc-300 text-sm font-semibold">2024</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">12/06/2024</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">28/06/2024</td>
                    <td className="px-6 py-4 text-teal-400 font-semibold">4.10 MAD</td>
                    <td className="px-6 py-4 text-teal-400 text-sm">+2.2%</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">Ordinaire</td>
                  </tr>
                  <tr className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-zinc-300 text-sm font-semibold">2023</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">14/06/2023</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">30/06/2023</td>
                    <td className="px-6 py-4 text-teal-400 font-semibold">4.01 MAD</td>
                    <td className="px-6 py-4 text-teal-400 text-sm">+3.9%</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">Ordinaire</td>
                  </tr>
                  <tr className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-zinc-300 text-sm font-semibold">2022</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">15/06/2022</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">01/07/2022</td>
                    <td className="px-6 py-4 text-teal-400 font-semibold">3.86 MAD</td>
                    <td className="px-6 py-4 text-teal-400 text-sm">+2.9%</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">Ordinaire</td>
                  </tr>
                  <tr className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-zinc-300 text-sm font-semibold">2021</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">16/06/2021</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">02/07/2021</td>
                    <td className="px-6 py-4 text-teal-400 font-semibold">3.75 MAD</td>
                    <td className="px-6 py-4 text-teal-400 text-sm">+2.7%</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">Ordinaire</td>
                  </tr>
                  <tr className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-zinc-300 text-sm font-semibold">2020</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">17/06/2020</td>
                    <td className="px-6 py-4 text-zinc-300 text-sm">03/07/2020</td>
                    <td className="px-6 py-4 text-teal-400 font-semibold">3.65 MAD</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">-</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">Ordinaire</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-500 text-xs mt-4 flex items-center gap-2">
              <Info className="w-3 h-3" />
              Ex-date : date à partir de laquelle l'achat de l'action ne donne plus droit au dividende.
            </p>
          </div>

          {/* Informations Complémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Fondamentaux */}
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Fondamentaux</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-zinc-400 text-xs mb-1">Cap. Boursière</p>
                  <p className="text-white font-semibold">120B MAD</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-zinc-400 text-xs mb-1">ROE</p>
                  <p className="text-white font-semibold">25%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-zinc-400 text-xs mb-1">PER</p>
                  <p className="text-white font-semibold">15.2</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-zinc-400 text-xs mb-1">Payout Ratio</p>
                  <p className="text-white font-semibold">75%</p>
                </div>
              </div>
            </div>

            {/* Tags & Classification */}
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Classification</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-teal-500/10 text-teal-400 text-sm rounded-full border border-teal-500/20 font-medium">
                  Télécommunications
                </span>
                <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20 font-medium">
                  Blue Chip
                </span>
                <span className="px-3 py-1.5 bg-purple-500/10 text-purple-400 text-sm rounded-full border border-purple-500/20 font-medium">
                  Dividende Aristocrate
                </span>
                <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm rounded-full border border-emerald-500/20 font-medium">
                  MASI20
                </span>
                <span className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 text-sm rounded-full border border-yellow-500/20 font-medium">
                  High Yield
                </span>
                <span className="px-3 py-1.5 bg-orange-500/10 text-orange-400 text-sm rounded-full border border-orange-500/20 font-medium">
                  Rotation Friendly
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyPageRefonte;