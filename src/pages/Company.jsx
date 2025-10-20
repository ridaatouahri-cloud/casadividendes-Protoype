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
        title: 'C-DRS™',
        subtitle: 'Casa-Dividend Reliability Score',
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
        title: 'PRT™',
        subtitle: 'Price Recovery Time',
        description: 'Le PRT mesure combien de jours il faut pour que le cours revienne à son niveau avant détachement.',
        components: [
          { name: 'Moyenne 3 ans', value: `${company.prt.days} jours`, desc: '2022-2024' },
          { name: 'Catégorie', value: company.prt.category, desc: 'Rotation standard possible' },
          { name: 'vs Secteur', value: '42j vs 55j', desc: 'Meilleur que la moyenne' }
        ],
        interpretation: company.prt.days < 30 ? 'Récupération rapide, idéal pour la rotation' : 'Récupération moyenne, adaptée au hold moyen terme'
      },
      ndf: {
        title: 'NDF™',
        subtitle: 'Next Dividend Forecast',
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-1">{details.title}</h3>
                <p className="text-slate-600 text-sm font-medium">{details.subtitle}</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{details.description}</p>
          </div>

          <div className="p-8 space-y-3">
            {details.components.map((comp, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-700 font-medium text-sm">{comp.name}</span>
                  <span className="text-slate-900 font-semibold text-lg">{comp.value}</span>
                </div>
                {comp.weight && <div className="text-xs text-slate-500 mb-2">Poids: {comp.weight}</div>}
                <p className="text-slate-600 text-xs">{comp.desc}</p>
              </div>
            ))}

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-slate-900 font-semibold mb-1 text-sm">Interprétation</h5>
                  <p className="text-slate-700 text-sm leading-relaxed">{details.interpretation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DRIPSimulator = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowDRIPSimulator(false)}>
      <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-8 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-1 flex items-center gap-3">
                <Calculator className="w-7 h-7 text-slate-700" />
                Simulateur DRIP
              </h3>
              <p className="text-slate-600 text-sm">Dividend Reinvestment Plan · {company.name}</p>
            </div>
            <button onClick={() => setShowDRIPSimulator(false)} className="text-slate-400 hover:text-slate-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-5">
              <div>
                <label className="text-slate-900 font-medium mb-2 block text-sm">Investissement initial (MAD)</label>
                <input
                  type="number"
                  value={dripInputs.initialInvestment}
                  onChange={(e) => setDripInputs({...dripInputs, initialInvestment: Number(e.target.value)})}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  step="1000"
                />
              </div>

              <div>
                <label className="text-slate-900 font-medium mb-2 block text-sm">Durée (années)</label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={dripInputs.duration}
                    onChange={(e) => setDripInputs({...dripInputs, duration: Number(e.target.value)})}
                    className="w-full accent-slate-700"
                  />
                  <div className="flex justify-between text-slate-500 text-sm mt-2">
                    <span>1 an</span>
                    <span className="text-slate-900 font-semibold">{dripInputs.duration} ans</span>
                    <span>20 ans</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dripInputs.reinvest}
                    onChange={(e) => setDripInputs({...dripInputs, reinvest: e.target.checked})}
                    className="w-5 h-5 accent-slate-700"
                  />
                  <div>
                    <div className="text-slate-900 font-medium text-sm">Réinvestir les dividendes</div>
                    <div className="text-slate-600 text-xs">Acheter automatiquement de nouvelles actions</div>
                  </div>
                </label>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700">
                    <div className="font-semibold text-slate-900 mb-2 text-xs">Hypothèses du simulateur</div>
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
              <div className="bg-slate-900 rounded-xl p-6">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Capital Final</div>
                <div className="text-4xl font-semibold text-white mb-2">{dripResults.finalValue.toLocaleString()} MAD</div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">+{dripResults.totalGain.toLocaleString()} MAD ({dripResults.totalReturn}%)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-slate-600 text-xs mb-1 font-medium">Actions détenues</div>
                  <div className="text-slate-900 text-xl font-semibold">{dripResults.finalShares}</div>
                  <div className="text-slate-500 text-xs">vs {dripResults.initialShares} initialement</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-slate-600 text-xs mb-1 font-medium">Dividendes totaux</div>
                  <div className="text-slate-900 text-xl font-semibold">{dripResults.totalDividends.toLocaleString()}</div>
                  <div className="text-slate-500 text-xs">MAD perçus</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-slate-600 text-xs mb-1 font-medium">Dividendes annuels</div>
                  <div className="text-slate-900 text-xl font-semibold">{Math.round(dripResults.finalShares * company.ndf.amount)}</div>
                  <div className="text-slate-500 text-xs">MAD/an finaux</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-slate-600 text-xs mb-1 font-medium">Rendement annuel</div>
                  <div className="text-slate-900 text-xl font-semibold">{(dripResults.totalReturn / dripInputs.duration).toFixed(1)}%</div>
                  <div className="text-slate-500 text-xs">par an</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="text-slate-900 font-semibold mb-6 flex items-center gap-2 text-sm">
              <TrendingUp className="w-5 h-5 text-slate-700" />
              Évolution du Portefeuille
            </h4>
            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <g key={i}>
                    <line x1="50" y1={240 - i * 40} x2="580" y2={240 - i * 40} stroke="#e2e8f0" strokeWidth="1" />
                    <text x="10" y={245 - i * 40} fill="#94a3b8" fontSize="11">
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
                  stroke="#334155"
                  strokeWidth="2.5"
                />

                {dripResults.yearlyData.map((d, i) => {
                  const x = 50 + (i / (dripResults.yearlyData.length - 1)) * 530;
                  const y = 240 - (d.portfolioValue / dripResults.finalValue) * 200;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="#334155" className="cursor-pointer" />
                      <text x={x} y={260} fill="#94a3b8" fontSize="11" textAnchor="middle">An {d.year}</text>
                    </g>
                  );
                })}
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowPriceChart(false)}>
        <div className="bg-white rounded-xl max-w-7xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="p-8 border-b border-slate-100 sticky top-0 bg-white z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-1 flex items-center gap-3">
                  <TrendingUp className="w-7 h-7 text-slate-700" />
                  Graphique de Prix
                </h3>
                <p className="text-slate-600 text-sm">{company.name} · Prix actuel: {company.currentPrice} MAD (+{company.priceChange}%)</p>
              </div>
              <button onClick={() => setShowPriceChart(false)} className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex bg-slate-100 rounded-lg p-1">
                {['1M', '3M', '6M', '1Y', 'MAX'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setChartPeriod(period)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      chartPeriod === period ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showVolume} onChange={(e) => setShowVolume(e.target.checked)} className="w-4 h-4 accent-slate-700" />
                  <span className="text-slate-700 text-sm font-medium">Volume</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showAnnotations} onChange={(e) => setShowAnnotations(e.target.checked)} className="w-4 h-4 accent-slate-700" />
                  <span className="text-slate-700 text-sm font-medium">Annotations</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
              <div className="relative" style={{ height: '400px' }}>
                <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const price = minPrice + (priceRange / 5) * i;
                    const y = 350 - (i / 5) * 300;
                    return (
                      <g key={i}>
                        <line x1="60" y1={y} x2="950" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                        <text x="10" y={y + 5} fill="#94a3b8" fontSize="12">{price.toFixed(0)}</text>
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
                            <circle cx={x} cy={highY - 20} r="8" fill="#10b981" />
                            <text x={x} y={highY - 16} fill="#fff" fontSize="12" textAnchor="middle">✓</text>
                            <text x={x} y={highY - 35} fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold">Recovery</text>
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
                    <text x="10" y="15" fill="#94a3b8" fontSize="11">Volume</text>
                  </svg>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                  <span className="text-slate-900 font-medium text-sm">Recovery Point</span>
                </div>
                <p className="text-slate-600 text-xs">Le cours revient à son niveau pré-dividende après {company.prt.days} jours en moyenne</p>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                  <span className="text-slate-900 font-medium text-sm">Ex-Date</span>
                </div>
                <p className="text-slate-600 text-xs">Date de détachement du dividende. Le cours chute mécaniquement du montant du dividende</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-6 bg-emerald-500"></div>
                    <div className="w-2 h-6 bg-red-500"></div>
                  </div>
                  <span className="text-slate-900 font-medium text-sm">Chandelier</span>
                </div>
                <p className="text-slate-600 text-xs">Vert = hausse • Rouge = baisse</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {showKPIModal && <KPIModal kpi={showKPIModal} onClose={() => setShowKPIModal(null)} />}
      {showDRIPSimulator && <DRIPSimulator />}
      {showPriceChart && <PriceChart />}

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-xl">{company.logo}</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">{company.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-slate-600 text-sm font-medium">{company.sector}</span>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-900 font-semibold">{company.currentPrice} MAD</span>
                    <span className="text-emerald-600 text-sm font-medium">+{company.priceChange}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition shadow-sm flex items-center gap-2">
              <Target className="w-5 h-5" />
              Ajouter au Portefeuille
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-7 h-7 text-amber-400" />
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-semibold border border-amber-200">
                    {company.badge}
                  </span>
                  <span className="text-slate-400 text-sm">{company.noDecreaseYears} ans sans baisse · {company.yield}% yield</span>
                </div>
                <h2 className="text-2xl font-semibold text-white mt-2">Profil Dividende Excellent</h2>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-4 mb-3">
                <div className="text-5xl font-semibold text-white">{globalScore}</div>
                <div className="text-slate-400 text-lg mb-2">/100</div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`text-xl ${i < Math.floor(globalScore/20) ? 'text-amber-400' : 'text-slate-700'}`}>⭐</div>
                  ))}
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${globalScore}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 border border-white/10 hover:border-white/20 transition cursor-pointer group backdrop-blur" onClick={() => setShowKPIModal('cdrs')}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-300 text-sm font-medium">Fiabilité</span>
                  <Info className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition ml-auto" />
                </div>
                <div className="text-2xl font-semibold text-white mb-1">{company.cdrs.score}/100</div>
                <div className="text-emerald-400 text-sm font-medium">{company.cdrs.label}</div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 border border-white/10 hover:border-white/20 transition cursor-pointer group backdrop-blur" onClick={() => setShowKPIModal('prt')}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300 text-sm font-medium">Récupération</span>
                  <Info className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition ml-auto" />
                </div>
                <div className="text-2xl font-semibold text-white mb-1">{company.prt.days}j</div>
                <div className="text-blue-400 text-sm font-medium">{company.prt.label}</div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 border border-white/10 hover:border-white/20 transition cursor-pointer group backdrop-blur" onClick={() => setShowKPIModal('ndf')}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300 text-sm font-medium">Prochain</span>
                  <Info className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition ml-auto" />
                </div>
                <div className="text-2xl font-semibold text-white mb-1">{company.ndf.amount}</div>
                <div className="text-purple-400 text-sm font-medium">{company.ndf.date}</div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-3 rounded-lg bg-white text-slate-900 font-medium transition flex items-center justify-center gap-2 hover:bg-slate-100">
                <Bell className="w-4 h-4" />
                Alerter J-3 avant Ex-Date
              </button>
              <button onClick={() => setShowDRIPSimulator(true)} className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-2 border border-white/10">
                <Calculator className="w-4 h-4" />
                Simuler
              </button>
              <button className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-2 border border-white/10">
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
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-slate-700" />
                  <h3 className="text-xl font-semibold text-slate-900">Historique Dividendes</h3>
                </div>
                <span className="text-slate-500 text-sm font-medium">2020-2025</span>
              </div>

              <div className="relative h-48 mb-6 cursor-pointer hover:opacity-90 transition" onClick={() => setShowPriceChart(true)}>
                <div className="absolute top-2 right-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-medium border border-blue-200 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Cliquer pour graphique détaillé
                </div>
                <div className="absolute inset-0 flex items-end justify-between gap-2">
                  {company.history.map((year, idx) => {
                    const maxDiv = Math.max(...company.history.map(h => h.dividend));
                    const height = (year.dividend / maxDiv) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs text-slate-600 mb-1 font-medium">
                          {year.projected ? '🔮 ' : ''}{year.dividend.toFixed(2)}
                        </div>
                        <div 
                          className={`w-full rounded-t-lg transition-all hover:scale-105 cursor-pointer ${
                            year.projected 
                              ? 'bg-purple-400 border-2 border-purple-500 border-dashed' 
                              : 'bg-slate-900'
                          }`}
                          style={{ height: `${height}%` }}
                          title={`${year.year}: ${year.dividend} MAD${year.growth ? ` (+${year.growth}%)` : ''}`}
                        />
                        <div className="text-sm text-slate-600 font-medium">{year.year}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-slate-600 text-xs mb-1 font-medium">Croissance</div>
                  <div className="text-slate-900 text-lg font-semibold">+3.2%/an</div>
                  <div className="text-slate-500 text-xs">TCAM 2020-2024</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-slate-600 text-xs mb-1 font-medium">Stabilité</div>
                  <div className="text-slate-900 text-lg font-semibold">Excellente</div>
                  <div className="text-slate-500 text-xs">CV = 9.4%</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-slate-600 text-xs mb-1 font-medium">Constance</div>
                  <div className="text-slate-900 text-lg font-semibold">5/5 ans</div>
                  <div className="text-slate-500 text-xs">Zéro baisse</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-slate-700" />
                  <h3 className="text-xl font-semibold text-slate-900">Stratégie Recommandée</h3>
                </div>
                <button 
                  onClick={() => setShowDRIPSimulator(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Simuler DRIP
                </button>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{recommendedStrategy.icon}</div>
                  <div>
                    <div className="text-blue-600 text-xs mb-1 font-medium uppercase tracking-wide">Profil détecté</div>
                    <div className="text-slate-900 text-xl font-semibold">{recommendedStrategy.type}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
                <p className="text-slate-700 leading-relaxed text-sm">
                  Avec <span className="text-slate-900 font-semibold">C-DRS {company.cdrs.score}</span> + 
                  <span className="text-slate-900 font-semibold"> PRT {company.prt.days}j</span> + 
                  <span className="text-slate-900 font-semibold"> Yield {company.yield}%</span>, 
                  {company.name} est idéale pour une stratégie de rotation standard ou de hold moyen terme.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-slate-900 font-semibold mb-2 text-sm">Stratégie #1 : HOLD MOYEN TERME</h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
                          Acheter maintenant ou avant mai 2025
                        </li>
                        <li className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          Encaisser dividende environ 08 juin 2025 ({company.ndf.amount} MAD)
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          Revendre après recovery (environ {company.prt.days} jours = mi-juillet)
                        </li>
                        <li className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-slate-400" />
                          Gain estimé : Dividende + stabilité du prix
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-slate-900 font-semibold mb-2 text-sm">Stratégie #2 : BUY AND HOLD</h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-slate-400" />
                          Pour investisseurs passifs préférant la simplicité
                        </li>
                        <li className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-slate-400" />
                          Dividende fiable année après année (C-DRS {company.cdrs.score})
                        </li>
                        <li className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-slate-400" />
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
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:sticky lg:top-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Actions Rapides</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition shadow-sm flex items-center justify-center gap-2">
                  <Bell className="w-5 h-5" />
                  Créer une Alerte
                </button>
                
                <button onClick={() => setShowDRIPSimulator(true)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-lg font-medium transition border border-slate-200 flex items-center justify-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Simulateur DRIP
                </button>
                
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-lg font-medium transition border border-slate-200 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Télécharger Rapport
                </button>
                
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-lg font-medium transition border border-slate-200 flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Partager l'Analyse
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-700" />
                vs Secteur Télécom
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Métrique</span>
                  <span className="text-slate-900 font-semibold">{company.ticker}</span>
                  <span className="text-slate-500">Secteur</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200">
                  <span className="text-slate-700 text-sm font-medium">C-DRS™</span>
                  <span className="text-sm font-semibold text-slate-900">{company.cdrs.score}</span>
                  <span className="text-sm text-slate-500">72</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200">
                  <span className="text-slate-700 text-sm font-medium">Rendement</span>
                  <span className="text-sm font-semibold text-slate-900">{company.yield}%</span>
                  <span className="text-sm text-slate-500">4.8%</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200">
                  <span className="text-slate-700 text-sm font-medium">PRT™</span>
                  <span className="text-sm font-semibold text-slate-900">{company.prt.days}j</span>
                  <span className="text-sm text-slate-500">55j</span>
                </div>
              </div>

              <div className="mt-4 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-medium">Performance supérieure au secteur</span>
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
