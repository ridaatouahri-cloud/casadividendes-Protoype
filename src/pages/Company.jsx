import React, { useState } from 'react';
import { TrendingUp, Shield, Zap, Sparkles, Bell, Calculator, BarChart3, Download, Share2, Info, ChevronRight, Target, Calendar, Clock, Award, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';

const CompanyPageRefonte = () => {
  const [showKPIModal, setShowKPIModal] = useState(null);
  const [showDRIPSimulator, setShowDRIPSimulator] = useState(false);
  const [showPriceChart, setShowPriceChart] = useState(false);
  
  const [dripInputs, setDripInputs] = useState({
    initialInvestment: 50000,
    duration: 5,
    reinvest: true
  });

  const company = {
    ticker: 'IAM',
    name: 'Maroc Telecom',
    sector: 'Télécommunications',
    logo: 'IAM',
    currentPrice: 102.50,
    priceChange: 2.4,
    
    priceHistory: [
      { date: '2024-01', open: 95, high: 97, low: 94, close: 96, volume: 1200000 },
      { date: '2024-02', open: 96, high: 99, low: 95, close: 98, volume: 1500000 },
      { date: '2024-03', open: 98, high: 100, low: 97, close: 99, volume: 1300000 },
      { date: '2024-04', open: 99, high: 102, low: 98, close: 101, volume: 1400000 },
      { date: '2024-05', open: 101, high: 104, low: 100, close: 103, volume: 1600000 },
      { date: '2024-06', open: 103, high: 105, low: 102, close: 104, volume: 1800000, exDate: true },
      { date: '2024-06b', open: 100, high: 101, low: 98, close: 99, volume: 2000000 },
      { date: '2024-07', open: 99, high: 102, low: 99, close: 101, volume: 1300000 },
      { date: '2024-07b', open: 101, high: 105, low: 101, close: 104, volume: 1200000, recovery: true },
      { date: '2024-08', open: 104, high: 106, low: 103, close: 105, volume: 1100000 },
      { date: '2024-09', open: 105, high: 107, low: 104, close: 106, volume: 1400000 },
      { date: '2024-10', open: 106, high: 108, low: 105, close: 107, volume: 1500000 },
      { date: '2024-11', open: 107, high: 109, low: 106, close: 108, volume: 1300000 },
      { date: '2024-12', open: 108, high: 110, low: 107, close: 109, volume: 1200000 },
      { date: '2025-01', open: 109, high: 111, low: 108, close: 102.5, volume: 1600000 }
    ],
    
    cdrs: {
      score: 88,
      label: 'Excellent',
      color: 'emerald',
      details: { regularity: 95, growth: 85, stability: 90, magnitude: 86 }
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
    
    yield: 5.2,
    noDecreaseYears: 10,
    nextPayment: '28/06/2025',
    badge: 'ARISTOCRATE DIVIDENDE',
    
    history: [
      { year: 2020, dividend: 3.65, growth: null },
      { year: 2021, dividend: 3.75, growth: 2.7 },
      { year: 2022, dividend: 3.86, growth: 2.9 },
      { year: 2023, dividend: 4.01, growth: 3.9 },
      { year: 2024, dividend: 4.10, growth: 2.2 },
      { year: 2025, dividend: 4.25, growth: 3.7, projected: true }
    ]
  };

  const calculateDRIP = () => {
    const { initialInvestment, duration, reinvest } = dripInputs;
    const currentPrice = company.currentPrice;
    const annualDividend = company.ndf.amount;
    const growthRate = 0.032;
    
    let shares = initialInvestment / currentPrice;
    let totalDividends = 0;
    let yearlyData = [];
    
    for (let year = 1; year <= duration; year++) {
      const dividendThisYear = annualDividend * Math.pow(1 + growthRate, year - 1);
      const dividendReceived = shares * dividendThisYear;
      totalDividends += dividendReceived;
      
      if (reinvest) {
        const newShares = dividendReceived / currentPrice;
        shares += newShares;
      }
      
      const portfolioValue = shares * currentPrice;
      
      yearlyData.push({
        year,
        shares: Math.round(shares * 100) / 100,
        dividendReceived: Math.round(dividendReceived * 100) / 100,
        portfolioValue: Math.round(portfolioValue * 100) / 100,
        totalDividends: Math.round(totalDividends * 100) / 100
      });
    }
    
    const finalValue = shares * currentPrice;
    const totalGain = finalValue - initialInvestment;
    const totalReturn = (totalGain / initialInvestment) * 100;
    
    return {
      initialShares: Math.round((initialInvestment / currentPrice) * 100) / 100,
      finalShares: Math.round(shares * 100) / 100,
      finalValue: Math.round(finalValue * 100) / 100,
      totalGain: Math.round(totalGain * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
      totalDividends: Math.round(totalDividends * 100) / 100,
      yearlyData
    };
  };

  const dripResults = calculateDRIP();
  const globalScore = Math.round((company.cdrs.score * 0.4 + company.prt.score * 0.3 + company.ndf.confidence * 0.3));
  const recommendedStrategy = company.cdrs.score > 80 && company.prt.days < 50 && company.yield > 4
    ? { type: 'ROTATION STANDARD', icon: '🔄', color: 'blue' }
    : company.cdrs.score > 80 && company.yield > 4
    ? { type: 'BUY & HOLD', icon: '💎', color: 'purple' }
    : { type: 'OPPORTUNISTE', icon: '⚡', color: 'yellow' };

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
                {comp.weight && <div className="text-xs text-zinc-500 mb-2">Poids: {comp.weight}</div>}
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
        </div>
      </div>
    );
  };

  const DRIPSimulator = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDRIPSimulator(false)}>
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl max-w-4xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <Calculator className="w-7 h-7 text-teal-400" />
                Simulateur DRIP
              </h3>
              <p className="text-teal-400 text-sm">Dividend Reinvestment Plan - {company.name}</p>
            </div>
            <button onClick={() => setShowDRIPSimulator(false)} className="text-zinc-400 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-white font-semibold mb-2 block">Investissement initial (MAD)</label>
                <input
                  type="number"
                  value={dripInputs.initialInvestment}
                  onChange={(e) => setDripInputs({...dripInputs, initialInvestment: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                  step="1000"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Durée (années)</label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={dripInputs.duration}
                    onChange={(e) => setDripInputs({...dripInputs, duration: Number(e.target.value)})}
                    className="w-full accent-teal-500"
                  />
                  <div className="flex justify-between text-zinc-400 text-sm mt-1">
                    <span>1 an</span>
                    <span className="text-teal-400 font-bold">{dripInputs.duration} ans</span>
                    <span>20 ans</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dripInputs.reinvest}
                    onChange={(e) => setDripInputs({...dripInputs, reinvest: e.target.checked})}
                    className="w-5 h-5 accent-teal-500"
                  />
                  <div>
                    <div className="text-white font-semibold">Réinvestir les dividendes</div>
                    <div className="text-zinc-400 text-xs">Acheter automatiquement de nouvelles actions</div>
                  </div>
                </label>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-zinc-300">
                    <div className="font-semibold text-white mb-1">Hypothèses du simulateur</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Prix stable: {company.currentPrice} MAD</li>
                      <li>• Croissance dividende: +3.2%/an</li>
                      <li>• Pas de frais de courtage</li>
                      <li>• Fiscalité non incluse</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-xl p-6 border border-teal-500/30">
                <div className="text-teal-400 text-sm mb-2">Capital Final</div>
                <div className="text-4xl font-bold text-white mb-1">{dripResults.finalValue.toLocaleString()} MAD</div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-400 font-semibold">+{dripResults.totalGain.toLocaleString()} MAD ({dripResults.totalReturn}%)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-zinc-400 text-xs mb-1">Actions détenues</div>
                  <div className="text-white text-xl font-bold">{dripResults.finalShares}</div>
                  <div className="text-teal-400 text-xs">vs {dripResults.initialShares} initialement</div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-zinc-400 text-xs mb-1">Dividendes totaux</div>
                  <div className="text-white text-xl font-bold">{dripResults.totalDividends.toLocaleString()}</div>
                  <div className="text-zinc-500 text-xs">MAD perçus</div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-zinc-400 text-xs mb-1">Dividendes annuels</div>
                  <div className="text-white text-xl font-bold">{Math.round(dripResults.finalShares * company.ndf.amount)}</div>
                  <div className="text-zinc-500 text-xs">MAD/an finaux</div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-zinc-400 text-xs mb-1">Rendement annuel</div>
                  <div className="text-white text-xl font-bold">{(dripResults.totalReturn / dripInputs.duration).toFixed(1)}%</div>
                  <div className="text-zinc-500 text-xs">par an</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              Évolution du Portefeuille
            </h4>
            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <g key={i}>
                    <line x1="50" y1={240 - i * 40} x2="580" y2={240 - i * 40} stroke="#27272a" strokeWidth="1" />
                    <text x="10" y={245 - i * 40} fill="#71717a" fontSize="11">
                      {Math.round((dripResults.finalValue / 5) * i / 1000)}k
                    </text>
                  </g>
                ))}

                <polyline
                  points={dripResults.yearlyData.map((d, i) => {
                    const x = 50 + (i / (dripResults.yearlyData.length - 1)) * 530;
                    const y = 240 - (d.portfolioValue / dripResults.finalValue) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#gradientLine)"
                  strokeWidth="3"
                />

                {dripResults.yearlyData.map((d, i) => {
                  const x = 50 + (i / (dripResults.yearlyData.length - 1)) * 530;
                  const y = 240 - (d.portfolioValue / dripResults.finalValue) * 200;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="#14b8a6" className="cursor-pointer" />
                      <text x={x} y={260} fill="#71717a" fontSize="11" textAnchor="middle">An {d.year}</text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PriceChart = () => {
    const [chartPeriod, setChartPeriod] = useState('1Y');
    const [showVolume, setShowVolume] = useState(true);
    const [showAnnotations, setShowAnnotations] = useState(true);

    const filteredData = company.priceHistory;
    const maxPrice = Math.max(...filteredData.map(d => d.high));
    const minPrice = Math.min(...filteredData.map(d => d.low));
    const priceRange = maxPrice - minPrice;
    const maxVolume = Math.max(...filteredData.map(d => d.volume));

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPriceChart(false)}>
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl max-w-7xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-white/10 sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <TrendingUp className="w-7 h-7 text-teal-400" />
                  Graphique de Prix - {company.name}
                </h3>
                <p className="text-teal-400 text-sm">Prix actuel: {company.currentPrice} MAD (+{company.priceChange}%)</p>
              </div>
              <button onClick={() => setShowPriceChart(false)} className="text-zinc-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex bg-white/5 rounded-lg p-1">
                {['1M', '3M', '6M', '1Y', 'MAX'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setChartPeriod(period)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      chartPeriod === period ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showVolume} onChange={(e) => setShowVolume(e.target.checked)} className="w-4 h-4 accent-teal-500" />
                  <span className="text-zinc-300 text-sm">Volume</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showAnnotations} onChange={(e) => setShowAnnotations(e.target.checked)} className="w-4 h-4 accent-teal-500" />
                  <span className="text-zinc-300 text-sm">Annotations</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-black/20 rounded-xl p-6 border border-white/10 mb-6">
              <div className="relative" style={{ height: '400px' }}>
                <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const price = minPrice + (priceRange / 5) * i;
                    const y = 350 - (i / 5) * 300;
                    return (
                      <g key={i}>
                        <line x1="60" y1={y} x2="950" y2={y} stroke="#27272a" strokeWidth="1" />
                        <text x="10" y={y + 5} fill="#71717a" fontSize="12">{price.toFixed(0)}</text>
                      </g>
                    );
                  })}

                  {filteredData.map((candle, i) => {
                    const x = 60 + (i / (filteredData.length - 1)) * 890;
                    const openY = 350 - ((candle.open - minPrice) / priceRange) * 300;
                    const closeY = 350 - ((candle.close - minPrice) / priceRange) * 300;
                    const highY = 350 - ((candle.high - minPrice) / priceRange) * 300;
                    const lowY = 350 - ((candle.low - minPrice) / priceRange) * 300;
                    const isGreen = candle.close >= candle.open;

                    return (
                      <g key={i} className="cursor-pointer hover:opacity-80 transition">
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={isGreen ? '#10b981' : '#ef4444'} strokeWidth="1" />
                        <rect x={x - 3} y={Math.min(openY, closeY)} width="6" height={Math.abs(closeY - openY) || 1} fill={isGreen ? '#10b981' : '#ef4444'} />

                        {showAnnotations && candle.exDate && (
                          <g>
                            <circle cx={x} cy={highY - 20} r="8" fill="#f59e0b" />
                            <text x={x} y={highY - 16} fill="#000" fontSize="10" textAnchor="middle" fontWeight="bold">!</text>
                            <text x={x} y={highY - 35} fill="#f59e0b" fontSize="11" textAnchor="middle" fontWeight="bold">Ex-Date</text>
                          </g>
                        )}
                        {showAnnotations && candle.recovery && (
                          <g>
                            <circle cx={x} cy={highY - 20} r="8" fill="#14b8a6" />
                            <text x={x} y={highY - 16} fill="#fff" fontSize="12" textAnchor="middle">✓</text>
                            <text x={x} y={highY - 35} fill="#14b8a6" fontSize="11" textAnchor="middle" fontWeight="bold">Recovery</text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {showVolume && (
                <div className="relative mt-6" style={{ height: '100px' }}>
                  <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="xMidYMid meet">
                    {filteredData.map((candle, i) => {
                      const x = 60 + (i / (filteredData.length - 1)) * 890;
                      const height = (candle.volume / maxVolume) * 80;
                      const isGreen = candle.close >= candle.open;
                      return (
                        <rect key={i} x={x - 3} y={90 - height} width="6" height={height} fill={isGreen ? '#10b981' : '#ef4444'} opacity="0.5" />
                      );
                    })}
                    <text x="10" y="15" fill="#71717a" fontSize="11">Volume</text>
                  </svg>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-lg p-4 border border-teal-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                  <span className="text-white font-semibold text-sm">Recovery Point</span>
                </div>
                <p className="text-zinc-400 text-xs">Le cours revient à son niveau pré-dividende après {company.prt.days} jours en moyenne</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-lg p-4 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-white font-semibold text-sm">Ex-Date</span>
                </div>
                <p className="text-zinc-400 text-xs">Date de détachement du dividende. Le cours chute mécaniquement du montant du dividende</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-6 bg-emerald-500"></div>
                    <div className="w-2 h-6 bg-red-500"></div>
                  </div>
                  <span className="text-white font-semibold text-sm">Chandelier</span>
                </div>
                <p className="text-zinc-400 text-xs">Vert = hausse • Rouge = baisse</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950">
      {showKPIModal && <KPIModal kpi={showKPIModal} onClose={() => setShowKPIModal(null)} />}
      {showDRIPSimulator && <DRIPSimulator />}
      {showPriceChart && <PriceChart />}

      <div className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 border-b border-white/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
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
            
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Ajouter au Portefeuille
            </button>
          </div>

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
                <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${globalScore}%` }} />
              </div>
            </div>

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

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                Alerter J-3 avant Ex-Date
              </button>
              <button onClick={() => setShowDRIPSimulator(true)} className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-2">
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-teal-400" />
                  <h3 className="text-xl font-bold text-white">Historique Dividendes</h3>
                </div>
                <span className="text-zinc-400 text-sm">2020-2025</span>
              </div>

              <div className="relative h-48 mb-6 cursor-pointer hover:opacity-80 transition" onClick={() => setShowPriceChart(true)}>
                <div className="absolute top-2 right-2 bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-xs font-semibold border border-teal-500/30 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Cliquer pour graphique détaillé
                </div>
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
                          title={`${year.year}: ${year.dividend} MAD${year.growth ? ` (+${year.growth}%)` : ''}`}
                        />
                        <div className="text-sm text-zinc-400 font-medium">{year.year}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

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

            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-teal-400" />
                  <h3 className="text-xl font-bold text-white">Stratégie Recommandée</h3>
                </div>
                <button 
                  onClick={() => setShowDRIPSimulator(true)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Simuler DRIP
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-4 border border-blue-500/30 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{recommendedStrategy.icon}</div>
                  <div>
                    <div className="text-blue-400 text-sm mb-1">Profil détecté</div>
                    <div className="text-white text-xl font-bold">{recommendedStrategy.type}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                <p className="text-zinc-300 leading-relaxed">
                  Avec <span className="text-teal-400 font-semibold">C-DRS {company.cdrs.score}</span> + 
                  <span className="text-blue-400 font-semibold"> PRT {company.prt.days}j</span> + 
                  <span className="text-purple-400 font-semibold"> Yield {company.yield}%</span>, 
                  {company.name} est idéale pour une stratégie de rotation standard ou de hold moyen terme.
                </p>
              </div>

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
                          Encaisser dividende environ 08 juin 2025 ({company.ndf.amount} MAD)
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-400" />
                          Revendre après recovery (environ {company.prt.days} jours = mi-juillet)
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
                      <h4 className="text-white font-semibold mb-2">Stratégie #2 : BUY AND HOLD</h4>
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
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 backdrop-blur border border-white/10 rounded-2xl p-6 lg:sticky lg:top-6">
              <h3 className="text-lg font-bold text-white mb-4">Actions Rapides</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2">
                  <Bell className="w-5 h-5" />
                  Créer une Alerte
                </button>
                
                <button onClick={() => setShowDRIPSimulator(true)} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition border border-white/10 flex items-center justify-center gap-2">
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
              </div>

              <div className="mt-4 bg-teal-500/10 rounded-lg p-3 border border-teal-500/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-400 text-sm font-semibold">Performance supérieure au secteur</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPageRefonte;