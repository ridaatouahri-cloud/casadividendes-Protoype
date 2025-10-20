import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Bell, Share2, Plus, Info, ChevronRight, Calculator, Download, AlertCircle, Check } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { companiesData } from '../data/companies';

export default function Company({ ticker }) {
  const company = companiesData[ticker] || companiesData["IAM"];
  
  // États interactifs
  const [activeFilter, setActiveFilter] = useState('1A');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showDripCalc, setShowDripCalc] = useState(false);
  
  // DRIP Calculator State
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [years, setYears] = useState(10);
  const [dripEnabled, setDripEnabled] = useState(true);

  // Données historiques
  const history = [
    { ex: "12/06/2024", pay: "28/06/2024", amt: "4.010", type: "Ordinaire", src: "Communiqué" },
    { ex: "14/06/2023", pay: "30/06/2023", amt: "3.950", type: "Ordinaire", src: "Communiqué" },
    { ex: "15/06/2022", pay: "01/07/2022", amt: "3.860", type: "Ordinaire", src: "AG" },
  ];

  // Actualités
  const news = [
    { source: "Le Matin", date: "20 Nov 2023", title: "Résultats solides au T3 2024", badge: "Résultats" },
    { source: "L'Economiste", date: "18 Nov 2023", title: "Analyse de la durabilité des dividendes", badge: "Analyse" },
    { source: "Boursenews", date: "15 Nov 2023", title: "Expansion stratégique en cours", badge: "Stratégie" }
  ];

  const handleAddToPortfolio = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Calcul DRIP
  const calculateDRIP = () => {
    const sharePrice = 102.50;
    const annualYield = parseFloat(company.yieldTTM?.replace('%', '')) / 100 || 0.065;
    const quarters = years * 4;
    const quarterlyYield = annualYield / 4;
    
    let totalValue = initialInvestment;
    let shares = initialInvestment / sharePrice;
    let totalDividends = 0;
    
    for (let i = 0; i < quarters; i++) {
      if (i % 3 === 0) {
        totalValue += monthlyContribution * 3;
        shares += (monthlyContribution * 3) / sharePrice;
      }
      
      const dividendPayout = shares * sharePrice * quarterlyYield;
      totalDividends += dividendPayout;
      
      if (dripEnabled) {
        shares += dividendPayout / sharePrice;
        totalValue += dividendPayout;
      }
    }
    
    totalValue = shares * sharePrice;
    const totalInvested = initialInvestment + (monthlyContribution * 12 * years);
    const gain = totalValue - totalInvested;
    
    return {
      finalValue: totalValue,
      totalInvested,
      gain,
      totalDividends,
      shares: shares.toFixed(2)
    };
  };

  const dripResults = calculateDRIP();

  return (
    <>
      <Helmet>
        <title>{company.name} ({ticker}) - Dividendes - CasaDividendes</title>
        <meta name="description" content={`Historique des dividendes de ${company.name}. Ex-dates, montants, rendement et analyse complète sur CasaDividendes.`} />
      </Helmet>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-pulse-slow { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950">
        {/* Success Notification */}
        {showNotification && (
          <div className="fixed top-6 right-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-in flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Succès!</p>
              <p className="text-sm text-teal-100">Ajouté au portefeuille</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 border-b border-white/10 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl animate-fade-in">
                  <span className="text-white font-bold text-2xl">{ticker}</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">{company.name}</h1>
                  <p className="text-teal-300 mb-3 animate-fade-in">
                    {company.sector} • {company.country} • <a href="#" className="underline hover:text-teal-200">Site web</a>
                  </p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-4 py-2 rounded-lg font-medium transition transform hover:scale-105 ${
                        isFollowing 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white'
                      }`}>
                      {isFollowing ? '✓ Suivi' : '+ Suivre'}
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
                      <Bell className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleAddToPortfolio}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ajouter au Portefeuille
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Prix Actuel', value: '102.50', unit: 'MAD', trend: '+2.4%', positive: true },
              { label: 'Rendement TTM', value: company.yieldTTM || '5.2%', sublabel: 'Yield', highlight: true },
              { label: 'Années sans baisse', value: company.streak || '10', sublabel: 'Stabilité' },
              { label: 'Prochain Paiement', value: company.nextPay || '28/06/2024', sublabel: '4.010 MAD' }
            ].map((metric, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${metric.highlight ? 'from-teal-900/40 to-emerald-900/40 border-teal-500/30' : 'from-zinc-900/40 to-zinc-800/40 border-white/10'} backdrop-blur border rounded-xl p-6 card-hover animate-fade-in`} style={{animationDelay: `${idx * 0.1}s`}}>
                <p className="text-zinc-400 text-sm mb-2">{metric.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className={`text-3xl font-bold ${metric.highlight ? 'text-teal-400' : 'text-white'}`}>{metric.value}</p>
                  {metric.unit && <span className="text-zinc-400">{metric.unit}</span>}
                  {metric.trend && (
                    <span className={`text-sm px-2 py-0.5 rounded-full ${metric.positive ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
                      {metric.trend}
                    </span>
                  )}
                </div>
                {metric.sublabel && <p className="text-zinc-500 text-xs mt-1">{metric.sublabel}</p>}
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column - Journey Path */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: Understanding the Company */}
              <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-8 card-hover animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold border border-teal-500/30">1</div>
                  <h2 className="text-2xl font-bold text-white">Comprendre l'Entreprise</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-teal-400 font-semibold mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                      À propos
                    </h3>
                    <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                      {company.name} est un acteur majeur dans le secteur {company.sector} au {company.country}, reconnu pour sa solidité financière et sa politique de dividendes attractive.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs rounded-full border border-teal-500/20">{company.sector}</span>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">Blue Chip</span>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">Dividende Roi</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-teal-400 font-semibold mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                      Fondamentaux
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Cap. Boursière', value: '120B MAD' },
                        { label: 'ROE', value: '25%' },
                        { label: 'PER', value: '15.2' },
                        { label: 'Payout Ratio', value: '75%' }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-zinc-400 text-xs mb-1">{item.label}</p>
                          <p className="text-white font-semibold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Dividend Performance */}
              <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-8 card-hover animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold border border-teal-500/30">2</div>
                  <h2 className="text-2xl font-bold text-white">Performance des Dividendes</h2>
                </div>

                {/* Chart */}
                <div className="bg-black/40 rounded-xl p-6 mb-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-teal-500 rounded-sm"></div>
                        <span className="text-zinc-400">Dividendes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                        <span className="text-zinc-400">Prix Action</span>
                      </div>
                    </div>
                    <div className="flex bg-white/5 rounded-lg p-1">
                      {['1A', '3A', '5A', '10A'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setActiveFilter(period)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                            activeFilter === period
                              ? 'bg-teal-600 text-white'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-64 relative">
                    <svg className="w-full h-full" viewBox="0 0 600 250">
                      {[0, 500, 1000, 1500, 2000, 2500].map((val, idx) => (
                        <g key={idx}>
                          <text x="10" y={240 - idx * 40} fill="#71717a" fontSize="11">{val}</text>
                          <line x1="50" y1={240 - idx * 40} x2="580" y2={240 - idx * 40} stroke="#27272a" strokeWidth="1" />
                        </g>
                      ))}
                      
                      {[100, 120, 105, 140, 165, 180, 195, 210].map((height, idx) => (
                        <rect 
                          key={idx}
                          x={80 + idx * 60}
                          y={240 - height}
                          width="35"
                          height={height}
                          fill="url(#gradient-bar)"
                          opacity="0.8"
                          rx="4"
                          className="transition-all hover:opacity-100 cursor-pointer"
                        />
                      ))}
                      
                      <polyline
                        points="100,200 160,180 220,190 280,160 340,120 400,100 460,85 520,75"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="3"
                      />
                      
                      <defs>
                        <linearGradient id="gradient-bar" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#0d9488" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Dividend Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-xl p-4 border border-teal-500/20">
                    <p className="text-zinc-400 text-xs mb-1">Total Dividendes 5Y</p>
                    <p className="text-2xl font-bold text-teal-400">12,450 MAD</p>
                    <p className="text-teal-500 text-xs mt-1">+8.5% vs 2019</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20">
                    <p className="text-zinc-400 text-xs mb-1">Rendement Moyen</p>
                    <p className="text-2xl font-bold text-blue-400">6.8%</p>
                    <p className="text-blue-500 text-xs mt-1">Au-dessus du secteur</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-zinc-400 text-xs mb-1">Croissance Annuelle</p>
                    <p className="text-2xl font-bold text-purple-400">+3.2%</p>
                    <p className="text-purple-500 text-xs mt-1">TCAM sur 10 ans</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Dividend History */}
              <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-8 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold border border-teal-500/30">3</div>
                    <h2 className="text-2xl font-bold text-white">Historique des Dividendes</h2>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
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
                        <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Ex-date</th>
                        <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Paiement</th>
                        <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Montant</th>
                        <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Type</th>
                        <th className="text-left text-zinc-400 text-xs font-semibold px-6 py-4">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((row, idx) => (
                        <tr key={idx} className="border-t border-white/5 hover:bg-white/5 transition">
                          <td className="px-6 py-4 text-zinc-300 text-sm">{row.ex}</td>
                          <td className="px-6 py-4 text-zinc-300 text-sm">{row.pay}</td>
                          <td className="px-6 py-4 text-teal-400 font-semibold">{row.amt} MAD</td>
                          <td className="px-6 py-4 text-zinc-400 text-sm">{row.type}</td>
                          <td className="px-6 py-4">
                            <a href="#" className="text-blue-400 text-sm hover:underline">{row.src}</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <p className="text-zinc-500 text-xs mt-4 flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  Ex-date : date à partir de laquelle l'achat de l'action ne donne plus droit au dividende.
                </p>
              </div>

              {/* Step 4: DRIP Simulator */}
              <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-8 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold border border-teal-500/30">4</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Simulateur DRIP</h2>
                      <p className="text-zinc-400 text-sm">Dividend Reinvestment Plan</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDripCalc(!showDripCalc)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    {showDripCalc ? 'Masquer' : 'Calculer'}
                  </button>
                </div>

                {showDripCalc && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                          Investissement Initial (MAD)
                        </label>
                        <input 
                          type="number" 
                          value={initialInvestment}
                          onChange={(e) => setInitialInvestment(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                          Apport Mensuel (MAD)
                        </label>
                        <input 
                          type="number" 
                          value={monthlyContribution}
                          onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                          Période (années)
                        </label>
                        <input 
                          type="range" 
                          min="1" 
                          max="30" 
                          value={years}
                          onChange={(e) => setYears(Number(e.target.value))}
                          className="w-full accent-teal-500"
                        />
                        <div className="flex justify-between text-zinc-400 text-xs mt-1">
                          <span>1 an</span>
                          <span className="text-teal-400 font-bold">{years} ans</span>
                          <span>30 ans</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                          Réinvestissement des dividendes
                        </label>
                        <button 
                          onClick={() => setDripEnabled(!dripEnabled)}
                          className={`w-full py-3 rounded-lg font-medium transition ${
                            dripEnabled 
                              ? 'bg-teal-600 text-white' 
                              : 'bg-white/10 text-zinc-400 border border-white/10'
                          }`}>
                          {dripEnabled ? '✓ Activé (DRIP)' : 'Désactivé'}
                        </button>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-xl p-6 border border-teal-500/30">
                      <h3 className="text-teal-400 font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Résultats après {years} ans
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-black/20 rounded-lg p-4">
                          <p className="text-zinc-400 text-xs mb-1">Valeur Finale</p>
                          <p className="text-3xl font-bold text-white">{dripResults.finalValue.toLocaleString('fr-MA', {maximumFractionDigits: 0})}</p>
                          <p className="text-teal-400 text-xs mt-1">MAD</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-4">
                          <p className="text-zinc-400 text-xs mb-1">Gain Total</p>
                          <p className="text-3xl font-bold text-teal-400">+{dripResults.gain.toLocaleString('fr-MA', {maximumFractionDigits: 0})}</p>
                          <p className="text-teal-400 text-xs mt-1">MAD (+{((dripResults.gain/dripResults.totalInvested)*100).toFixed(1)}%)</p>
                        </div>
                        </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <p className="text-zinc-400 text-xs mb-1">Investi</p>
                          <p className="text-white font-bold">{dripResults.totalInvested.toLocaleString('fr-MA', {maximumFractionDigits: 0})} MAD</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <p className="text-zinc-400 text-xs mb-1">Dividendes</p>
                          <p className="text-teal-400 font-bold">{dripResults.totalDividends.toLocaleString('fr-MA', {maximumFractionDigits: 0})} MAD</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <p className="text-zinc-400 text-xs mb-1">Actions</p>
                          <p className="text-blue-400 font-bold">{dripResults.shares}</p>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-xs mt-4 flex items-center gap-2">
                        <Info className="w-3 h-3" />
                        Simulation basée sur un rendement de {company.yieldTTM || '6.5%'} et le prix actuel de 102.50 MAD
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Quick Analysis */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Reliability Score */}
              <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6 card-hover animate-fade-in lg:sticky lg:top-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse-slow"></div>
                  Score de Fiabilité
                </h3>
                
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#27272a" strokeWidth="3" />
                      <circle 
                        cx="18" cy="18" r="16" fill="none" 
                        stroke="url(#gradient-cdrs)" strokeWidth="3"
                        strokeDasharray="88, 100"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient-cdrs" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#0d9488" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-teal-400">88</span>
                      <span className="text-zinc-500 text-xs">/100</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-teal-400 font-bold mb-1">C-DRS : Excellent</p>
                    <p className="text-zinc-400 text-xs">Casa Dividend Reliability Score</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Stabilité', value: 95, color: 'teal' },
                    { label: 'Croissance', value: 85, color: 'blue' },
                    { label: 'Pérennité', value: 90, color: 'purple' }
                  ].map((metric, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-300">{metric.label}</span>
                        <span className={`text-${metric.color}-400 font-semibold`}>{metric.value}/100</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-400 rounded-full transition-all duration-1000`}
                          style={{width: `${metric.value}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Dividend Forecast */}
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20 mb-6">
                  <p className="text-zinc-400 text-xs mb-2 flex items-center gap-1">
                    NDF™ Prévision
                    <div className="group relative">
                      <Info className="w-3 h-3 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-zinc-800 text-white text-xs rounded-lg shadow-xl z-10">
                        Next Dividend Forecast - Prévision du prochain dividende basée sur l'IA
                      </div>
                    </div>
                  </p>
                  <p className="text-3xl font-bold text-white mb-1">2.45 <span className="text-lg text-zinc-400">MAD</span></p>
                  <p className="text-blue-400 text-sm">Mai-Juin 2025</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-teal-400 bg-teal-500/10 px-2 py-1 rounded-full w-fit">
                    <TrendingUp className="w-3 h-3" />
                    Confiance: 92%
                  </div>
                </div>

                {/* PRT Gauge */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                  <h4 className="text-zinc-300 text-sm font-semibold mb-3">Price Recovery Timeline</h4>
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-16 mb-2">
                      <svg viewBox="0 0 100 50" className="w-full h-full">
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#27272a" strokeWidth="6" />
                        <path d="M 10 50 A 40 40 0 0 1 50 15" fill="none" stroke="#ef4444" strokeWidth="6" />
                        <path d="M 50 15 A 40 40 0 0 1 70 22" fill="none" stroke="#f59e0b" strokeWidth="6" />
                        <path d="M 70 22 A 40 40 0 0 1 90 50" fill="none" stroke="#14b8a6" strokeWidth="6" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center pt-4">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-teal-400">42</p>
                          <p className="text-xs text-zinc-400">jours</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-center text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                      Récupération Rapide
                    </p>
                    <p className="text-zinc-500 text-xs mt-2 text-center">vs Secteur: 55 jours</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6 card-hover animate-fade-in" style={{animationDelay: '0.1s'}}>
                <h3 className="text-lg font-bold text-white mb-4">Actions Rapides</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Créer une Alerte
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

              {/* Peer Comparison */}
              <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h3 className="text-lg font-bold text-white mb-4">Comparaison Sectorielle</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                    <span className="text-zinc-400">Métrique</span>
                    <span className="text-teal-400 font-semibold">{ticker}</span>
                    <span className="text-zinc-500">Secteur</span>
                  </div>
                  {[
                    { label: 'C-DRS', iam: '88', sector: '72', better: true },
                    { label: 'Rendement', iam: company.yieldTTM || '6.5%', sector: '5.8%', better: true },
                    { label: 'PRT', iam: '42j', sector: '55j', better: true },
                    { label: 'Payout', iam: '75%', sector: '68%', better: false }
                  ].map((row, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                      <span className="text-zinc-300 text-sm">{row.label}</span>
                      <span className={`text-sm font-bold ${row.better ? 'text-teal-400' : 'text-zinc-300'}`}>{row.iam}</span>
                      <span className="text-sm text-zinc-500">{row.sector}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* News Feed */}
              <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  Actualités
                </h3>
                <div className="space-y-4">
                  {news.map((item, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex items-start gap-2 mb-1">
                        <span className="text-xs px-2 py-1 bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/20">{item.badge}</span>
                        <span className="text-xs text-zinc-500">{item.date}</span>
                      </div>
                      <h4 className="text-sm text-zinc-200 group-hover:text-teal-400 transition mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-500">{item.source}</p>
                      {idx < news.length - 1 && <div className="h-px bg-white/5 mt-4"></div>}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-teal-400 text-sm font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all py-2">
                  Voir toutes les actualités <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}