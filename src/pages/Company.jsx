import React, { useState, useEffect } from 'react';
import { TrendingUp, Shield, Zap, Sparkles, Bell, Calculator, Download, Share2, Info, Target, Award, Clock, Activity, Calendar } from 'lucide-react';

const CompanyPageEnhanced = () => {
  const [animatedCDRS, setAnimatedCDRS] = useState(0);
  const [animatedPRT, setAnimatedPRT] = useState(0);
  const [animatedNDF, setAnimatedNDF] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const [calculationStep, setCalculationStep] = useState(0);
  const [showCalculation, setShowCalculation] = useState(false);
  const [prtCalculationStep, setPrtCalculationStep] = useState(0);
  const [showPrtCalculation, setShowPrtCalculation] = useState(false);
  const [ndfCalculationStep, setNdfCalculationStep] = useState(0);
  const [showNdfCalculation, setShowNdfCalculation] = useState(false);
  const [scoreCalculationStep, setScoreCalculationStep] = useState(0);
  const [showScoreCalculation, setShowScoreCalculation] = useState(false);
  
  const [hookPhrase, setHookPhrase] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);

  const company = {
    ticker: 'IAM',
    name: 'Maroc Telecom',
    sector: 'Télécommunications',
    logo: 'IAM',
    currentPrice: 102.50,
    priceChange: 2.4,
    cdrs: {
      score: 88,
      label: 'Excellent',
      details: { regularity: 95, growth: 85, stability: 90, magnitude: 86 }
    },
    prt: { days: 42, score: 78, label: 'Rapide' },
    ndf: {
      amount: 4.25,
      date: 'Juin 2025',
      confidence: 92,
      range: { min: 4.10, max: 4.40 }
    },
    yield: 5.2,
    noDecreaseYears: 10,
    badge: 'ARISTOCRATE DIVIDENDE',
  };

  const globalScore = Math.round((company.cdrs.score * 0.4 + company.prt.score * 0.3 + company.ndf.confidence * 0.3));

  const hookPhrases = {
    cdrs: ["🔍 Analyse de la fiabilité historique...", "📊 Cette entreprise paie-t-elle régulièrement ?", "💎 Découvrons la qualité de ce dividende...", "⚡ 10 ans sans baisse, vraiment ?"],
    prt: ["⏱️ Combien de temps pour récupérer ?", "🔄 Rotation rapide ou investissement patient ?", "💰 Le timing parfait pour investir...", "📈 Analysons la résilience du cours..."],
    ndf: ["🔮 Prédiction du prochain dividende...", "💡 Quel montant pouvez-vous espérer ?", "📅 Quand sera versé le prochain paiement ?", "🎯 L'algorithme calcule pour vous..."],
    score: ["🏆 Synthèse globale en cours...", "⭐ Quel est le verdict final ?", "🎪 Le moment de vérité approche...", "✨ Combinaison des 3 indicateurs..."]
  };

  const startAnimation = () => {
    if (hasAnimated) return;
    setHasAnimated(true);
    setAnimatedCDRS(0);
    setAnimatedPRT(0);
    setAnimatedNDF(0);
    setAnimatedScore(0);
    setCalculationStep(0);
    setShowCalculation(true);
  };

  useEffect(() => {
    if (!showCalculation) return;
    let phraseIndex = 0;
    setHookPhrase(hookPhrases.cdrs[0]);
    const phraseTimer = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % hookPhrases.cdrs.length;
      setHookPhrase(hookPhrases.cdrs[phraseIndex]);
    }, 1500);
    const timer1 = setTimeout(() => setCalculationStep(1), 50);
    const timer2 = setTimeout(() => setCalculationStep(2), 1550);
    const timer3 = setTimeout(() => setCalculationStep(3), 3050);
    const timer4 = setTimeout(() => setCalculationStep(4), 4550);
    const timer5 = setTimeout(() => {
      clearInterval(phraseTimer);
      setShowCalculation(false);
      setCalculationStep(0);
      const duration = 1500, steps = 60, increment = company.cdrs.score / steps;
      let currentStep = 0;
      const circleTimer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedCDRS(Math.min(Math.round(increment * currentStep), company.cdrs.score));
        } else {
          clearInterval(circleTimer);
          setShowPrtCalculation(true);
        }
      }, duration / steps);
    }, 6050);
    return () => {
      clearInterval(phraseTimer);
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); clearTimeout(timer5);
    };
  }, [showCalculation, company.cdrs.score]);

  useEffect(() => {
    if (!showPrtCalculation) return;
    let phraseIndex = 0;
    setHookPhrase(hookPhrases.prt[0]);
    const phraseTimer = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % hookPhrases.prt.length;
      setHookPhrase(hookPhrases.prt[phraseIndex]);
    }, 1000);
    setPrtCalculationStep(0);
    const timer1 = setTimeout(() => setPrtCalculationStep(1), 50);
    const timer2 = setTimeout(() => setPrtCalculationStep(2), 1050);
    const timer3 = setTimeout(() => setPrtCalculationStep(3), 2050);
    const timer4 = setTimeout(() => setPrtCalculationStep(4), 3050);
    const timer5 = setTimeout(() => {
      clearInterval(phraseTimer);
      setShowPrtCalculation(false);
      setPrtCalculationStep(0);
      const duration = 1500, steps = 60, increment = company.prt.score / steps;
      let currentStep = 0;
      const circleTimer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedPRT(Math.min(Math.round(increment * currentStep), company.prt.score));
        } else {
          clearInterval(circleTimer);
          setShowNdfCalculation(true);
        }
      }, duration / steps);
    }, 4050);
    return () => {
      clearInterval(phraseTimer);
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); clearTimeout(timer5);
    };
  }, [showPrtCalculation, company.prt.score]);

  useEffect(() => {
    if (!showNdfCalculation) return;
    let phraseIndex = 0;
    setHookPhrase(hookPhrases.ndf[0]);
    const phraseTimer = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % hookPhrases.ndf.length;
      setHookPhrase(hookPhrases.ndf[phraseIndex]);
    }, 1000);
    setNdfCalculationStep(0);
    const timer1 = setTimeout(() => setNdfCalculationStep(1), 50);
    const timer2 = setTimeout(() => setNdfCalculationStep(2), 1050);
    const timer3 = setTimeout(() => setNdfCalculationStep(3), 2050);
    const timer4 = setTimeout(() => setNdfCalculationStep(4), 3050);
    const timer5 = setTimeout(() => {
      clearInterval(phraseTimer);
      setShowNdfCalculation(false);
      setNdfCalculationStep(0);
      const duration = 1500, steps = 60, increment = company.ndf.confidence / steps;
      let currentStep = 0;
      const circleTimer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedNDF(Math.min(Math.round(increment * currentStep), company.ndf.confidence));
        } else {
          clearInterval(circleTimer);
          setShowScoreCalculation(true);
        }
      }, duration / steps);
    }, 4050);
    return () => {
      clearInterval(phraseTimer);
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); clearTimeout(timer5);
    };
  }, [showNdfCalculation, company.ndf.confidence]);

  useEffect(() => {
    if (!showScoreCalculation) return;
    let phraseIndex = 0;
    setHookPhrase(hookPhrases.score[0]);
    const phraseTimer = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % hookPhrases.score.length;
      setHookPhrase(hookPhrases.score[phraseIndex]);
    }, 1000);
    setScoreCalculationStep(0);
    const timer1 = setTimeout(() => setScoreCalculationStep(1), 50);
    const timer2 = setTimeout(() => setScoreCalculationStep(2), 1050);
    const timer3 = setTimeout(() => setScoreCalculationStep(3), 2050);
    const timer4 = setTimeout(() => {
      clearInterval(phraseTimer);
      setShowScoreCalculation(false);
      setScoreCalculationStep(0);
      setHookPhrase('');
      const duration = 1500, steps = 60, increment = globalScore / steps;
      let currentStep = 0;
      const circleTimer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedScore(Math.min(Math.round(increment * currentStep), globalScore));
        } else {
          clearInterval(circleTimer);
        }
      }, duration / steps);
    }, 3050);
    return () => {
      clearInterval(phraseTimer);
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4);
    };
  }, [showScoreCalculation, globalScore]);

  const CircularProgress = ({ value, maxValue = 100, size = 140, strokeWidth = 10, color = "#14b8a6" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / maxValue) * circumference;
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#27272a" strokeWidth={strokeWidth} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke={`url(#gradient-${color})`} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" filter="url(#glow)" style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
          {[0, 90, 180, 270].map((angle, i) => {
            const x = size / 2 + (radius + 5) * Math.cos((angle - 90) * Math.PI / 180);
            const y = size / 2 + (radius + 5) * Math.sin((angle - 90) * Math.PI / 180);
            return <circle key={i} cx={x} cy={y} r="3" fill={color} opacity="0.6" style={{ animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }} />;
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white" style={{ textShadow: `0 0 20px ${color}80` }}>{value}</div>
            <div className="text-xs text-zinc-400 mt-1">/{maxValue}</div>
          </div>
        </div>
      </div>
    );
  };

  const Tooltip = ({ children, text }) => {
    const [show, setShow] = useState(false);
    return (
      <div className="relative inline-block">
        <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>{children}</div>
        {show && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-950 border border-teal-500/30 rounded-lg text-xs text-zinc-300 shadow-2xl max-w-xs">
            <div className="whitespace-normal">{text}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-zinc-950 border-r border-b border-teal-500/30 rotate-45"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 p-6">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        .shimmer { background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.3), transparent); background-size: 1000px 100%; animation: shimmer 2s infinite; }
        @keyframes slideInFromRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {hookPhrase && (
          <div className="mb-4 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 border border-teal-500/30 rounded-2xl p-4 shimmer" style={{ animation: 'slideInFromRight 0.5s ease-out' }}>
            <p className="text-center text-lg font-semibold text-white">{hookPhrase}</p>
          </div>
        )}

        <div className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 border border-white/10 backdrop-blur rounded-2xl p-6 mb-6">
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
                  <span className="text-white font-semibold">{company.currentPrice} MAD</span>
                  <span className="text-teal-400 text-sm">+{company.priceChange}%</span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg flex items-center gap-2">
              <Target className="w-5 h-5" />Ajouter au Portefeuille
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-teal-400" />
            <div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-teal-500/20 text-teal-300 rounded-full text-sm font-semibold border border-teal-500/30">{company.badge}</span>
                <span className="text-zinc-400 text-sm">{company.noDecreaseYears} ans sans baisse • {company.yield}% yield</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-2">Profil Dividende Excellent</h2>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <Tooltip text="Le C-DRS™ mesure la fiabilité historique des dividendes : régularité, croissance, stabilité et magnitude.">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-500/50 transition cursor-pointer group relative overflow-hidden" onClick={startAnimation}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-zinc-400 text-sm">C-DRS™</span>
                  <Info className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition ml-auto" />
                </div>
                <div className="flex flex-col items-center justify-center relative z-10" style={{ minHeight: '180px' }}>
                  {showCalculation ? (
                    <div className="text-center">
                      <CircularProgress value={calculationStep * 25} maxValue={100} size={120} color="#10b981" />
                      <div className="mt-3 text-xs text-emerald-400 font-semibold">
                        {calculationStep === 0 && "Initialisation..."}
                        {calculationStep === 1 && `Régularité: ${company.cdrs.details.regularity}/25`}
                        {calculationStep === 2 && `Croissance: ${company.cdrs.details.growth}/35`}
                        {calculationStep === 3 && `Stabilité: ${company.cdrs.details.stability}/25`}
                        {calculationStep === 4 && `Magnitude: ${company.cdrs.details.magnitude}/15`}
                      </div>
                    </div>
                  ) : (
                    <>
                      <CircularProgress value={hasAnimated ? animatedCDRS : company.cdrs.score} maxValue={100} size={120} color="#10b981" />
                      <div className="text-emerald-400 text-sm font-semibold mt-2">{company.cdrs.label}</div>
                    </>
                  )}
                </div>
              </div>
            </Tooltip>

            <Tooltip text="Le PRT™ mesure le temps moyen pour que le cours revienne à son niveau pré-dividende. Parfait pour la rotation.">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-zinc-400 text-sm">PRT™</span>
                  <Info className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition ml-auto" />
                </div>
                <div className="flex flex-col items-center justify-center relative z-10" style={{ minHeight: '180px' }}>
                  {showPrtCalculation ? (
                    <div className="text-center">
                      <CircularProgress value={prtCalculationStep * 25} maxValue={100} size={120} color="#3b82f6" />
                      <div className="mt-3 text-xs text-blue-400 font-semibold">
                        {prtCalculationStep === 0 && "Analyse..."}
                        {prtCalculationStep === 1 && `Secteur: ${company.sector}`}
                        {prtCalculationStep === 2 && "Liquidité: MASI20"}
                        {prtCalculationStep === 3 && "Volatilité: β 0.85"}
                        {prtCalculationStep === 4 && "Historique: 3 ans"}
                      </div>
                    </div>
                  ) : (
                    <>
                      <CircularProgress value={hasAnimated ? animatedPRT : company.prt.score} maxValue={100} size={120} color="#3b82f6" />
                      <div className="text-blue-400 text-sm font-semibold mt-2">{company.prt.days} jours • {company.prt.label}</div>
                    </>
                  )}
                </div>
              </div>
            </Tooltip>

            <Tooltip text="Le NDF™ prédit le montant et la date du prochain dividende avec un niveau de confiance basé sur l'historique.">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-zinc-400 text-sm">NDF™</span>
                  <Info className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition ml-auto" />
                </div>
                <div className="flex flex-col items-center justify-center relative z-10" style={{ minHeight: '180px' }}>
                  {showNdfCalculation ? (
                    <div className="text-center">
                      <CircularProgress value={ndfCalculationStep * 25} maxValue={100} size={120} color="#a855f7" />
                      <div className="mt-3 text-xs text-purple-400 font-semibold">
                        {ndfCalculationStep === 0 && "Calcul..."}
                        {ndfCalculationStep === 1 && "TCAM: 3.2%"}
                        {ndfCalculationStep === 2 && `Tendance: ${company.ndf.amount} MAD`}
                        {ndfCalculationStep === 3 && `Fourchette: ${company.ndf.range.min}-${company.ndf.range.max}`}
                        {ndfCalculationStep === 4 && "Validation: ✓"}
                      </div>
                    </div>
                  ) : (
                    <>
                      <CircularProgress value={hasAnimated ? animatedNDF : company.ndf.confidence} maxValue={100} size={120} color="#a855f7" />
                      <div className="text-purple-400 text-sm font-semibold mt-2">{company.ndf.amount} MAD • {company.ndf.date}</div>
                    </>
                  )}
                </div>
              </div>
            </Tooltip>

            <Tooltip text="Le Score Global synthétise les 3 KPIs : 40% C-DRS + 30% PRT + 30% NDF pour une évaluation complète.">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-teal-500/50 transition cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Activity className="w-5 h-5 text-teal-400" />
                  <span className="text-zinc-400 text-sm">Score Global</span>
                  <Info className="w-4 h-4 text-zinc-600 group-hover:text-teal-400 transition ml-auto" />
                </div>
                <div className="flex flex-col items-center justify-center relative z-10" style={{ minHeight: '180px' }}>
                  {showScoreCalculation ? (
                    <div className="text-center">
                      <CircularProgress value={scoreCalculationStep * 33} maxValue={100} size={120} color="#14b8a6" />
                      <div className="mt-3 text-xs text-teal-400 font-semibold">
                        {scoreCalculationStep === 0 && "Synthèse..."}
                        {scoreCalculationStep === 1 && `C-DRS × 40% = ${Math.round(company.cdrs.score * 0.4)}`}
                        {scoreCalculationStep === 2 && `PRT × 30% = ${Math.round(company.prt.score * 0.3)}`}
                        {scoreCalculationStep === 3 && `NDF × 30% = ${Math.round(company.ndf.confidence * 0.3)}`}
                      </div>
                    </div>
                  ) : (
                    <>
                      <CircularProgress value={hasAnimated ? animatedScore : globalScore} maxValue={100} size={120} color="#14b8a6" />
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`text-lg ${i < Math.floor(globalScore/20) ? 'text-teal-400' : 'text-zinc-700'}`}>⭐</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Tooltip>
          </div>

          {!hasAnimated && (
            <div className="mt-6 text-center">
              <button onClick={startAnimation} className="px-8 py-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition shadow-2xl flex items-center gap-3 mx-auto relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition duration-1000"></div>
                <Calculator className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Lancer l'Analyse KPI Premium</span>
                <Sparkles className="w-6 h-6 relative z-10" />
              </button>
              <p className="text-xs text-zinc-500 mt-3">✨ Découvrez la qualité du dividende en temps réel</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button className="flex-1 px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition flex items-center justify-center gap-2">
              <Bell className="w-4 h-4" />Alerter Ex-Date
            </button>
            <button className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-2">
              <Download className="w-4 h-4" />Exporter
            </button>
            <button className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-2">
              <Share2 className="w-4 h-4" />Partager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPageEnhanced;