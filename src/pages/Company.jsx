import React, { useState } from 'react';
import { TrendingUp, Shield, Zap, Sparkles, Bell, Calculator, BarChart3, Download, Share2, Info, Target, Award, CheckCircle2, Play, Loader2 } from 'lucide-react';

const CompanyPageRefonte = () => {
  const [kpiStates, setKpiStates] = useState({
    cdrs: { started: false, completed: false, progress: 0, step: 0, score: 0 },
    prt: { started: false, completed: false, progress: 0, step: 0, days: 0 },
    ndf: { started: false, completed: false, progress: 0, step: 0, amount: 0 }
  });

  const company = {
    ticker: 'IAM',
    name: 'Maroc Telecom',
    sector: 'Télécommunications',
    logo: 'IAM',
    currentPrice: 102.50,
    priceChange: 2.4,
    cdrs: { score: 88, label: 'Excellent' },
    prt: { days: 42, label: 'Rapide' },
    ndf: { amount: 4.25, date: 'Juin 2025' },
    yield: 5.2,
    noDecreaseYears: 10,
    badge: 'ARISTOCRATE DIVIDENDE'
  };

  const cdrsSteps = [
    { label: "Analyse de la régularité des paiements", duration: 2000 },
    { label: "Vérification de la croissance sur 5 ans", duration: 2500 },
    { label: "Évaluation de la stabilité des montants", duration: 2000 },
    { label: "Calcul de la magnitude de croissance", duration: 1500 }
  ];

  const prtSteps = [
    { label: "Identification du prix de référence", duration: 1500 },
    { label: "Détection de la date ex-dividende", duration: 1500 },
    { label: "Calcul du temps de récupération 2024", duration: 2000 },
    { label: "Calcul du temps de récupération 2023", duration: 2000 },
    { label: "Calcul du temps de récupération 2022", duration: 2000 },
    { label: "Calcul de la moyenne pondérée", duration: 1500 }
  ];

  const ndfSteps = [
    { label: "Analyse de l'historique des dividendes", duration: 2000 },
    { label: "Calcul du TCAM pondéré", duration: 2000 },
    { label: "Projection du dividende 2025", duration: 2000 },
    { label: "Détermination de la fourchette", duration: 2500 }
  ];

  const startCDRSCalculation = () => {
    setKpiStates(prev => ({
      ...prev,
      cdrs: { started: true, completed: false, progress: 0, step: 0, score: 0 }
    }));

    let currentStep = 0;
    let accumulatedScore = 0;

    const runStep = () => {
      if (currentStep >= cdrsSteps.length) {
        setKpiStates(prev => ({
          ...prev,
          cdrs: { started: true, completed: true, progress: 100, step: currentStep, score: company.cdrs.score }
        }));
        return;
      }

      const step = cdrsSteps[currentStep];
      setKpiStates(prev => ({ ...prev, cdrs: { ...prev.cdrs, step: currentStep } }));

      const interval = setInterval(() => {
        accumulatedScore += company.cdrs.score / (cdrsSteps.reduce((acc, s) => acc + s.duration, 0) / 100);
        const newProgress = ((currentStep + 1) / cdrsSteps.length) * 100;
        setKpiStates(prev => ({
          ...prev,
          cdrs: { ...prev.cdrs, score: Math.min(Math.round(accumulatedScore), company.cdrs.score), progress: newProgress }
        }));
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        currentStep++;
        runStep();
      }, step.duration);
    };

    runStep();
  };

  const startPRTCalculation = () => {
    setKpiStates(prev => ({
      ...prev,
      prt: { started: true, completed: false, progress: 0, step: 0, days: 0 }
    }));

    let currentStep = 0;

    const runStep = () => {
      if (currentStep >= prtSteps.length) {
        setKpiStates(prev => ({
          ...prev,
          prt: { started: true, completed: true, progress: 100, step: currentStep, days: company.prt.days }
        }));
        return;
      }

      const step = prtSteps[currentStep];
      setKpiStates(prev => ({ ...prev, prt: { ...prev.prt, step: currentStep } }));

      const interval = setInterval(() => {
        const incrementDays = company.prt.days / (prtSteps.reduce((acc, s) => acc + s.duration, 0) / 100);
        setKpiStates(prev => ({
          ...prev,
          prt: { ...prev.prt, days: Math.min(Math.round(prev.prt.days + incrementDays), company.prt.days) }
        }));
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        currentStep++;
        runStep();
      }, step.duration);
    };

    runStep();
  };

  const startNDFCalculation = () => {
    setKpiStates(prev => ({
      ...prev,
      ndf: { started: true, completed: false, progress: 0, step: 0, amount: 0 }
    }));

    let currentStep = 0;

    const runStep = () => {
      if (currentStep >= ndfSteps.length) {
        setKpiStates(prev => ({
          ...prev,
          ndf: { started: true, completed: true, progress: 100, step: currentStep, amount: company.ndf.amount }
        }));
        return;
      }

      const step = ndfSteps[currentStep];
      setKpiStates(prev => ({ ...prev, ndf: { ...prev.ndf, step: currentStep } }));

      const interval = setInterval(() => {
        const incrementAmount = company.ndf.amount / (ndfSteps.reduce((acc, s) => acc + s.duration, 0) / 100);
        setKpiStates(prev => ({
          ...prev,
          ndf: { ...prev.ndf, amount: Math.min(prev.ndf.amount + incrementAmount, company.ndf.amount) }
        }));
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        currentStep++;
        runStep();
      }, step.duration);
    };

    runStep();
  };

  const CircularProgress = ({ progress, score, size = 100 }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e2e8f0" strokeWidth={strokeWidth} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#10b981" strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-300" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">{score}</div>
            <div className="text-xs text-slate-500">/ 100</div>
          </div>
        </div>
      </div>
    );
  };

  const globalScore = 88;

  return (
    <div className="min-h-screen bg-slate-50">
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
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={`text-xl ${i < Math.floor(globalScore/20) ? 'text-amber-400' : 'text-slate-700'}`}>⭐</div>
                  ))}
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${globalScore}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-5 border border-white/10 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-300 text-sm font-medium">Fiabilité</span>
                  <button className="ml-auto text-slate-600 hover:text-slate-400 transition">
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {!kpiStates.cdrs.started ? (
                  <div className="text-center py-8">
                    <button onClick={startCDRSCalculation} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 mx-auto">
                      <Play className="w-4 h-4" />
                      Lancer l'analyse
                    </button>
                  </div>
                ) : !kpiStates.cdrs.completed ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <CircularProgress progress={kpiStates.cdrs.progress} score={kpiStates.cdrs.score} />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-300 text-xs animate-pulse">
                        {cdrsSteps[kpiStates.cdrs.step]?.label}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-white mb-1">{company.cdrs.score}/100</div>
                    <div className="text-emerald-400 text-sm font-medium">{company.cdrs.label}</div>
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-md">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300 text-xs font-medium">Analyse terminée</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-5 border border-white/10 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300 text-sm font-medium">Récupération</span>
                  <button className="ml-auto text-slate-600 hover:text-slate-400 transition">
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {!kpiStates.prt.started ? (
                  <div className="text-center py-8">
                    {!kpiStates.cdrs.completed ? (
                      <div className="text-slate-400 text-xs">
                        <div className="mb-2">🔒 Verrouillé</div>
                        <p>Terminez d'abord l'analyse C-DRS</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-emerald-300 text-xs mb-3 italic">
                          ✨ Prêt à découvrir le temps de récupération
                        </p>
                        <button onClick={startPRTCalculation} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 mx-auto">
                          <Play className="w-4 h-4" />
                          Calculer le PRT
                        </button>
                      </div>
                    )}
                  </div>
                ) : !kpiStates.prt.completed ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{kpiStates.prt.days}</div>
                      <div className="text-xs text-slate-400">jours</div>
                    </div>
                    <div className="space-y-2">
                      {prtSteps.slice(0, kpiStates.prt.step + 1).map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${idx < kpiStates.prt.step ? 'bg-blue-500' : 'bg-blue-400 animate-pulse'}`}>
                            {idx < kpiStates.prt.step ? (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            ) : (
                              <Loader2 className="w-3 h-3 text-white animate-spin" />
                            )}
                          </div>
                          <div className="text-slate-300 text-xs truncate">{step.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-white mb-1">{company.prt.days}j</div>
                    <div className="text-blue-400 text-sm font-medium">{company.prt.label}</div>
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-md">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300 text-xs font-medium">Calcul terminé</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-5 border border-white/10 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300 text-sm font-medium">Prochain</span>
                  <button className="ml-auto text-slate-600 hover:text-slate-400 transition">
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {!kpiStates.ndf.started ? (
                  <div className="text-center py-8">
                    {!kpiStates.prt.completed ? (
                      <div className="text-slate-400 text-xs">
                        <div className="mb-2">🔒 Verrouillé</div>
                        <p>Terminez d'abord l'analyse PRT</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-purple-300 text-xs mb-3 italic">
                          🔮 Prédisez le prochain dividende
                        </p>
                        <button onClick={startNDFCalculation} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 mx-auto">
                          <Play className="w-4 h-4" />
                          Prédire le NDF
                        </button>
                      </div>
                    )}
                  </div>
                ) : !kpiStates.ndf.completed ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{kpiStates.ndf.amount.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">MAD</div>
                    </div>
                    <div className="space-y-2">
                      {ndfSteps.slice(0, kpiStates.ndf.step + 1).map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${idx < kpiStates.ndf.step ? 'bg-purple-500' : 'bg-purple-400 animate-pulse'}`}>
                            {idx < kpiStates.ndf.step ? (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            ) : (
                              <Loader2 className="w-3 h-3 text-white animate-spin" />
                            )}
                          </div>
                          <div className="text-slate-300 text-xs truncate">{step.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-white mb-1">{company.ndf.amount}</div>
                    <div className="text-purple-400 text-sm font-medium">{company.ndf.date}</div>
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-md">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 text-xs font-medium">Prédiction terminée</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-3 rounded-lg bg-white text-slate-900 font-medium transition flex items-center justify-center gap-2 hover:bg-slate-100">
                <Bell className="w-4 h-4" />
                Alerter J-3 avant Ex-Date
              </button>
              <button className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-2 border border-white/10">
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
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-slate-700" />
              <h3 className="text-xl font-semibold text-slate-900">Indicateurs Clés</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-slate-600 text-xs mb-1 font-medium">C-DRS Score</div>
              <div className="text-slate-900 text-2xl font-semibold">{company.cdrs.score}/100</div>
              <div className="text-emerald-600 text-xs">{company.cdrs.label}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-slate-600 text-xs mb-1 font-medium">PRT Moyen</div>
              <div className="text-slate-900 text-2xl font-semibold">{company.prt.days}j</div>
              <div className="text-blue-600 text-xs">{company.prt.label}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-slate-600 text-xs mb-1 font-medium">Prochain Dividende</div>
              <div className="text-slate-900 text-2xl font-semibold">{company.ndf.amount} MAD</div>
              <div className="text-purple-600 text-xs">{company.ndf.date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPageRefonte;