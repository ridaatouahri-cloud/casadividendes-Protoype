import React, { useState, useMemo } from 'react';
import { TrendingUp, Award, Building2, ChevronLeft, ChevronRight, Download, Calendar, Bell, Info, Zap } from 'lucide-react';

export default function CasaDividendesCalendar() {
  const [selectedCompany, setSelectedCompany] = useState('ATW');
  const [currentMonth, setCurrentMonth] = useState('Juin 2025');
  const [selectedSector, setSelectedSector] = useState('tous');
  const [selectedType, setSelectedType] = useState('tous');
  const [animatedCDRS, setAnimatedCDRS] = useState(0);
  const [animatedPRT, setAnimatedPRT] = useState(0);
  const [animatedNDF, setAnimatedNDF] = useState(0);
  const [calculationStep, setCalculationStep] = useState(0);
  const [showCalculation, setShowCalculation] = useState(false);
  const [prtCalculationStep, setPrtCalculationStep] = useState(0);
  const [showPrtCalculation, setShowPrtCalculation] = useState(false);
  const [ndfCalculationStep, setNdfCalculationStep] = useState(0);
  const [showNdfCalculation, setShowNdfCalculation] = useState(false);
  const [showCDRSInfo, setShowCDRSInfo] = useState(false);
  const [showPRTInfo, setShowPRTInfo] = useState(false);
  const [showNDFInfo, setShowNDFInfo] = useState(false);

  // MASI20 Data with realistic simulated PRT
  const masi20Data = [
    // Banques (6)
    { ticker: "ATW", societe: "Attijariwafa Bank", secteur: "Banques", exDate: "05/06", paiement: "21/06", montant: 15.000, yield: 6.0, badge: "Rendement ↑", alerte: "Premium", source: "AG", div2024: 15.000, div2023: 13.50, div2022: 12.00, div2021: 11.00, div2020: 10.00, status: "high", prt: 18, beta: 0.85 },
    { ticker: "BCP", societe: "Banque Populaire", secteur: "Banques", exDate: "03/06", paiement: "18/06", montant: 7.000, yield: 4.8, badge: "Stable", alerte: "Activer", source: "Communiqué", div2024: 7.000, div2023: 6.50, div2022: 6.00, div2021: 5.50, div2020: 5.00, status: "high", prt: 21, beta: 0.90 },
    { ticker: "BMCE", societe: "BMCE Bank", secteur: "Banques", exDate: "08/06", paiement: "23/06", montant: 6.500, yield: 4.5, badge: "Bon", alerte: "Activer", source: "AG", div2024: 6.500, div2023: 6.00, div2022: 5.50, div2021: 5.20, div2020: 4.80, status: "high", prt: 23, beta: 0.92 },
    { ticker: "CIH", societe: "CIH Bank", secteur: "Banques", exDate: "10/06", paiement: "25/06", montant: 4.200, yield: 3.8, badge: "Croissance", alerte: "Premium", source: "Communiqué", div2024: 4.200, div2023: 3.80, div2022: 3.40, div2021: 3.00, div2020: 2.70, status: "medium", prt: 25, beta: 0.88 },
    { ticker: "CDM", societe: "Crédit du Maroc", secteur: "Banques", exDate: "12/06", paiement: "27/06", montant: 41.7, yield: 5.2, badge: "Rendement ↑", alerte: "Activer", source: "AG", div2024: 41.7, div2023: 34.2, div2022: 27, div2021: 25.9, div2020: 4.55, status: "medium", prt: 20, beta: 0.95 },
    { ticker: "BOA", societe: "Bank of Africa", secteur: "Banques", exDate: "15/06", paiement: "30/06", montant: 3.800, yield: 4.2, badge: "Stable", alerte: "Activer", source: "Communiqué", div2024: 3.800, div2023: 3.50, div2022: 3.20, div2021: 3.00, div2020: 2.80, status: "high", prt: 22, beta: 0.87 },
    
    // Télécoms (2)
    { ticker: "IAM", societe: "Maroc Telecom", secteur: "Télécom", exDate: "12/06", paiement: "28/06", montant: 4.010, yield: 4.5, badge: "Rendement ↑", alerte: "Premium", source: "Communiqué", div2024: 4.010, div2023: 3.85, div2022: 3.70, div2021: 3.55, div2020: 3.40, status: "high", prt: 15, beta: 0.75 },
    { ticker: "HPS", societe: "HPS", secteur: "Tech", exDate: "18/06", paiement: "03/07", montant: 12.500, yield: 3.2, badge: "Tech", alerte: "Activer", source: "AG", div2024: 12.500, div2023: 10.00, div2022: 8.50, div2021: 7.00, div2020: 6.00, status: "high", prt: 32, beta: 1.15 },
    
    // Assurances (3)
    { ticker: "WAA", societe: "Wafa Assurance", secteur: "Assurance", exDate: "25/06", paiement: "12/07", montant: 140, yield: 5.8, badge: "Stable", alerte: "Activer", source: "AG", div2024: 140, div2023: 140, div2022: 130, div2021: 120, div2020: 100, status: "medium", prt: 28, beta: 0.82 },
    { ticker: "SAH", societe: "Saham Assurance", secteur: "Assurance", exDate: "20/06", paiement: "05/07", montant: 95, yield: 5.5, badge: "Bon", alerte: "Premium", source: "Communiqué", div2024: 95, div2023: 88, div2022: 80, div2021: 75, div2020: 70, status: "high", prt: 26, beta: 0.85 },
    { ticker: "ATL", societe: "Atlanta", secteur: "Assurance", exDate: "22/06", paiement: "08/07", montant: 72, yield: 4.9, badge: "Croissance", alerte: "Activer", source: "AG", div2024: 72, div2023: 65, div2022: 58, div2021: 52, div2020: 48, status: "medium", prt: 30, beta: 0.88 },
    
    // Énergie (3)
    { ticker: "AFG", societe: "Afriquia Gaz", secteur: "Énergie", exDate: "28/06", paiement: "15/07", montant: 175, yield: 6.5, badge: "Rendement ↑", alerte: "Premium", source: "Communiqué", div2024: 175, div2023: 140, div2022: 140, div2021: 140, div2020: 125, status: "high", prt: 24, beta: 0.95 },
    { ticker: "TQM", societe: "TotalEnergies", secteur: "Énergie", exDate: "02/07", paiement: "18/07", montant: 113, yield: 7.2, badge: "Excellent", alerte: "Premium", source: "AG", div2024: 113, div2023: 56, div2022: 56, div2021: 56, div2020: 50, status: "high", prt: 22, beta: 1.05 },
    { ticker: "TAQ", societe: "Taqa Morocco", secteur: "Énergie", exDate: "05/07", paiement: "20/07", montant: 3.200, yield: 5.1, badge: "Utilities", alerte: "Activer", source: "Communiqué", div2024: 3.200, div2023: 3.000, div2022: 2.800, div2021: 2.600, div2020: 2.400, status: "high", prt: 26, beta: 0.78 },
    
    // Industrie (3)
    { ticker: "LAF", societe: "LafargeHolcim", secteur: "Industrie", exDate: "08/07", paiement: "23/07", montant: 85, yield: 4.2, badge: "Matériaux", alerte: "Activer", source: "AG", div2024: 85, div2023: 80, div2022: 75, div2021: 70, div2020: 65, status: "medium", prt: 38, beta: 1.08 },
    { ticker: "MNG", societe: "Managem", secteur: "Industrie", exDate: "10/07", paiement: "25/07", montant: 42, yield: 3.8, badge: "Mining", alerte: "Premium", source: "Communiqué", div2024: 42, div2023: 38, div2022: 35, div2021: 32, div2020: 30, status: "medium", prt: 42, beta: 1.20 },
    { ticker: "SID", societe: "SONASID", secteur: "Industrie", exDate: "12/07", paiement: "27/07", montant: 68, yield: 4.5, badge: "Sidérurgie", alerte: "Activer", source: "AG", div2024: 68, div2023: 62, div2022: 58, div2021: 54, div2020: 50, status: "medium", prt: 35, beta: 1.12 },
    
    // Distribution (3)
    { ticker: "LAB", societe: "Label Vie", secteur: "Distribution", exDate: "22/06", paiement: "08/07", montant: 110.57, yield: 5.5, badge: "Croissance", alerte: "Premium", source: "Communiqué", div2024: 110.57, div2023: 96.75, div2022: 86.38, div2021: 70.40, div2020: 59.88, status: "high", prt: 29, beta: 0.92 },
    { ticker: "CSR", societe: "Cosumar", secteur: "Distribution", exDate: "24/06", paiement: "10/07", montant: 92, yield: 4.8, badge: "Agroalimentaire", alerte: "Activer", source: "AG", div2024: 92, div2023: 88, div2022: 84, div2021: 80, div2020: 76, status: "high", prt: 31, beta: 0.88 },
    { ticker: "CDA", societe: "Centrale Danone", secteur: "Distribution", exDate: "26/06", paiement: "12/07", montant: 48, yield: 3.9, badge: "Alimentaire", alerte: "Premium", source: "Communiqué", div2024: 48, div2023: 45, div2022: 42, div2021: 40, div2020: 38, status: "medium", prt: 33, beta: 0.85 },
  ];

  const filteredData = masi20Data.filter(item => {
    if (selectedSector !== 'tous' && item.secteur !== selectedSector) return false;
    if (selectedType !== 'tous') return false;
    return true;
  });

  // C-DRS CALCULATION
  const calculateCDRS = (company) => {
    const years = [company.div2020, company.div2021, company.div2022, company.div2023, company.div2024];
    
    const weights = [1, 2, 3, 4, 5];
    let regularitySum = 0;
    years.forEach((div, idx) => {
      if (div > 0) regularitySum += weights[idx];
    });
    const regularityScore = (regularitySum / 15) * 25;
    
    const growthWeights = [2, 3, 4, 5];
    let growthSum = 0;
    for (let i = 1; i < years.length; i++) {
      if (years[i] > years[i-1] && years[i-1] > 0 && years[i] > 0) {
        growthSum += growthWeights[i-1];
      }
    }
    const growthYearsScore = (growthSum / 14) * 20;
    
    let consecutiveGrowth = 0;
    let maxConsecutive = 0;
    let endsIn2024 = false;
    for (let i = 1; i < years.length; i++) {
      if (years[i] > years[i-1] && years[i-1] > 0 && years[i] > 0) {
        consecutiveGrowth++;
        if (i === years.length - 1) endsIn2024 = true;
      } else {
        if (consecutiveGrowth > maxConsecutive) {
          maxConsecutive = consecutiveGrowth;
        }
        consecutiveGrowth = 0;
        endsIn2024 = false;
      }
    }
    maxConsecutive = Math.max(maxConsecutive, consecutiveGrowth);
    
    let bonusGrowth = 0;
    if (maxConsecutive >= 4 && endsIn2024) bonusGrowth = 10;
    else if (maxConsecutive >= 3 && endsIn2024) bonusGrowth = 8;
    else if (maxConsecutive >= 2 && endsIn2024) bonusGrowth = 5;
    else if (maxConsecutive >= 3) bonusGrowth = 5;
    else if (maxConsecutive >= 2) bonusGrowth = 3;
    
    let penaltyDecline = 0;
    const yearMultipliers = [1.0, 1.2, 1.5, 2.0];
    for (let i = 1; i < years.length; i++) {
      if (years[i] < years[i-1] && years[i-1] > 0) {
        const decline = Math.abs((years[i] - years[i-1]) / years[i-1]);
        let basePenalty = 0;
        if (decline > 0.30) basePenalty = -3;
        else if (decline > 0.20) basePenalty = -2;
        else if (decline > 0.10) basePenalty = -1;
        penaltyDecline += basePenalty * yearMultipliers[i-1];
      }
    }
    penaltyDecline = Math.max(-5, penaltyDecline);
    
    const growthScore = growthYearsScore + bonusGrowth + penaltyDecline;
    
    const validDivs = years.filter(d => d > 0);
    if (validDivs.length < 2) {
      var stabilityScore = 0;
    } else {
      const mean = validDivs.reduce((a, b) => a + b, 0) / validDivs.length;
      const variance = validDivs.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validDivs.length;
      const stdDev = Math.sqrt(variance);
      const cv = (stdDev / mean) * 100;
      var stabilityScore = Math.max(0, 25 - (cv / 2));
    }
    
    if (company.div2020 > 0 && company.div2024 > 0) {
      const tcam = (Math.pow(company.div2024 / company.div2020, 1/4) - 1) * 100;
      var magnitudeScore = Math.min(15, Math.max(0, (tcam / 10) * 15));
    } else if (company.div2020 === 0 && company.div2024 > 0) {
      var magnitudeScore = 7;
    } else {
      var magnitudeScore = 0;
    }
    
    const totalScore = Math.round(regularityScore + growthScore + stabilityScore + magnitudeScore);
    
    return {
      total: totalScore,
      regularity: Math.round(regularityScore),
      growth: Math.round(growthScore),
      stability: Math.round(stabilityScore),
      magnitude: Math.round(magnitudeScore)
    };
  };

  const calculatePRTScore = (prt) => {
    return Math.max(0, Math.round(100 - (prt * 1.5)));
  };

  // NDF CALCULATION - Next Dividend Forecast
  const calculateNDF = (company) => {
    const years = [company.div2020, company.div2021, company.div2022, company.div2023, company.div2024];
    const weights = [1, 2, 3, 4, 5];
    
    // 1. TCAM pondéré pour tendance
    let weightedGrowthSum = 0;
    let weightSum = 0;
    for (let i = 1; i < years.length; i++) {
      if (years[i] > 0 && years[i-1] > 0) {
        const growth = (years[i] - years[i-1]) / years[i-1];
        weightedGrowthSum += growth * weights[i];
        weightSum += weights[i];
      }
    }
    const tcamWeighted = weightSum > 0 ? (weightedGrowthSum / weightSum) : 0;
    
    // 2. Dividende 2025 probable (méthode tendance)
    const div2025Trend = company.div2024 * (1 + tcamWeighted);
    
    // 3. Volatilité historique pour fourchette
    const validDivs = years.filter(d => d > 0);
    let volatility = 0.06; // 6% par défaut
    if (validDivs.length >= 3) {
      const mean = validDivs.reduce((a, b) => a + b, 0) / validDivs.length;
      const variance = validDivs.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validDivs.length;
      const stdDev = Math.sqrt(variance);
      volatility = Math.min(0.15, stdDev / mean); // Max 15%
    }
    
    // 4. Fourchette
    const divMin = div2025Trend * (1 - volatility);
    const divMax = div2025Trend * (1 + volatility);
    const divProbable = div2025Trend;
    
    // 5. Score de confiance basé sur régularité et stabilité
    const regularityCount = years.filter(d => d > 0).length;
    const regularityScore = (regularityCount / 5) * 40;
    
    const stabilityScore = Math.max(0, 30 - (volatility * 100));
    
    const growthConsistency = years.filter((d, i) => i > 0 && d > years[i-1]).length;
    const growthScore = (growthConsistency / 4) * 30;
    
    const confidence = Math.round(regularityScore + stabilityScore + growthScore);
    
    // 6. Estimation date ex-date (exemple: toujours début juin pour simulation)
    const exDateEstimate = "03/06/2026 - 12/06/2026";
    const exDateProbable = "07/06/2026";
    
    return {
      divMin: Math.round(divMin * 100) / 100,
      divMax: Math.round(divMax * 100) / 100,
      divProbable: Math.round(divProbable * 100) / 100,
      exDateRange: exDateEstimate,
      exDateProbable: exDateProbable,
      confidence: Math.min(100, confidence),
      tcam: Math.round(tcamWeighted * 1000) / 10 // en %
    };
  };

  const getCDRSLabel = (score) => {
    if (score >= 90) return { 
      text: 'Exceptionnel', 
      textEn: 'Exceptional', 
      color: 'text-green-400', 
      bgColor: 'bg-green-500/20', 
      borderColor: 'border-green-500',
      interpretation: 'Excellence absolue ! Dividende ultra-fiable avec historique remarquable. Confiance maximale.'
    };
    if (score >= 80) return { 
      text: 'Hautement Fiable', 
      textEn: 'Highly Reliable', 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-500/20', 
      borderColor: 'border-blue-500',
      interpretation: 'Très bonne qualité. Paiements constants et croissance soutenue. Excellent choix.'
    };
    if (score >= 70) return { 
      text: 'Fiable', 
      textEn: 'Reliable', 
      color: 'text-cyan-400', 
      bgColor: 'bg-cyan-500/20', 
      borderColor: 'border-cyan-500',
      interpretation: 'Bonne fiabilité. Dividende régulier avec quelques variations. Bon candidat.'
    };
    if (score >= 60) return { 
      text: 'Modérément Fiable', 
      textEn: 'Moderately Reliable', 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500/20', 
      borderColor: 'border-yellow-500',
      interpretation: 'Fiabilité moyenne. Historique acceptable mais à surveiller. Prudence recommandée.'
    };
    if (score >= 50) return { 
      text: 'Correct', 
      textEn: 'Fair', 
      color: 'text-orange-400', 
      bgColor: 'bg-orange-500/20', 
      borderColor: 'border-orange-500',
      interpretation: 'Qualité limitée. Irrégularités détectées dans les paiements. Attention.'
    };
    return { 
      text: 'Peu Fiable', 
      textEn: 'Unreliable', 
      color: 'text-red-400', 
      bgColor: 'bg-red-500/20', 
      borderColor: 'border-red-500',
      interpretation: 'Fiabilité faible. Historique problématique avec interruptions. Éviter.'
    };
  };

  const getPRTLabel = (prt) => {
    if (prt <= 15) return { 
      text: 'Excellent', 
      textEn: 'Excellent', 
      color: 'text-green-400', 
      bgColor: 'bg-green-500/20', 
      borderColor: 'border-green-500', 
      days: `${prt}j`,
      interpretation: 'Recovery ultra-rapide ! Parfait pour rotation intensive et maximiser les dividendes.'
    };
    if (prt <= 30) return { 
      text: 'Bon', 
      textEn: 'Good', 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-500/20', 
      borderColor: 'border-blue-500', 
      days: `${prt}j`,
      interpretation: 'Recovery rapide. Idéal pour stratégie de rotation avec plusieurs cycles par an.'
    };
    if (prt <= 45) return { 
      text: 'Moyen', 
      textEn: 'Average', 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500/20', 
      borderColor: 'border-yellow-500', 
      days: `${prt}j`,
      interpretation: 'Recovery modéré. Rotation possible mais moins fréquente. Planifier avec soin.'
    };
    if (prt <= 60) return { 
      text: 'Faible', 
      textEn: 'Fair', 
      color: 'text-orange-400', 
      bgColor: 'bg-orange-500/20', 
      borderColor: 'border-orange-500', 
      days: `${prt}j`,
      interpretation: 'Recovery lent. Rotation difficile. Privilégier une stratégie buy & hold.'
    };
    return { 
      text: 'Très Faible', 
      textEn: 'Poor', 
      color: 'text-red-400', 
      bgColor: 'bg-red-500/20', 
      borderColor: 'border-red-500', 
      days: `${prt}+j`,
      interpretation: 'Recovery très lent. Rotation déconseillée. Investissement long terme uniquement.'
    };
  };

  const getNDFLabel = (confidence) => {
    if (confidence >= 85) return { 
      text: 'Très Haute', 
      color: 'text-green-400', 
      bgColor: 'bg-green-500/20', 
      borderColor: 'border-green-500',
      stars: '⭐⭐⭐⭐⭐',
      interpretation: 'Prédiction très fiable ! Historique exemplaire et tendance claire. Planifiez en confiance.'
    };
    if (confidence >= 70) return { 
      text: 'Haute', 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-500/20', 
      borderColor: 'border-blue-500',
      stars: '⭐⭐⭐⭐',
      interpretation: 'Bonne fiabilité. Données cohérentes permettant une estimation solide. Recommandé.'
    };
    if (confidence >= 55) return { 
      text: 'Moyenne', 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500/20', 
      borderColor: 'border-yellow-500',
      stars: '⭐⭐⭐',
      interpretation: 'Fiabilité modérée. Estimation indicative, à confirmer avec données récentes. Prudence.'
    };
    if (confidence >= 40) return { 
      text: 'Faible', 
      color: 'text-orange-400', 
      bgColor: 'bg-orange-500/20', 
      borderColor: 'border-orange-500',
      stars: '⭐⭐',
      interpretation: 'Incertitude élevée. Historique irrégulier rend la prédiction difficile. Surveiller.'
    };
    return { 
      text: 'Très Faible', 
      color: 'text-red-400', 
      bgColor: 'bg-red-500/20', 
      borderColor: 'border-red-500',
      stars: '⭐',
      interpretation: 'Prédiction peu fiable. Données insuffisantes ou trop volatiles. Attendre confirmation.'
    };
  };

  const selectedCompanyData = masi20Data.find(c => c.ticker === selectedCompany);
  const cdrsScores = selectedCompanyData ? calculateCDRS(selectedCompanyData) : { total: 0, regularity: 0, growth: 0, stability: 0, magnitude: 0 };
  const prtScore = selectedCompanyData ? calculatePRTScore(selectedCompanyData.prt) : 0;
  const ndfData = selectedCompanyData ? calculateNDF(selectedCompanyData) : { divMin: 0, divMax: 0, divProbable: 0, exDateRange: '', exDateProbable: '', confidence: 0, tcam: 0 };
  
  const cdrsLabel = getCDRSLabel(animatedCDRS);
  const prtLabel = selectedCompanyData ? getPRTLabel(selectedCompanyData.prt) : { text: '', textEn: '', color: '', bgColor: '', borderColor: '', days: '', interpretation: '' };
  const ndfLabel = getNDFLabel(ndfData.confidence);
  
  // Animation effect for C-DRS with sequential calculation display
  React.useEffect(() => {
    setAnimatedCDRS(0);
    setCalculationStep(0);
    setShowCalculation(true);

    const timer1 = setTimeout(() => setCalculationStep(1), 50);
    const timer2 = setTimeout(() => setCalculationStep(2), 1550);
    const timer3 = setTimeout(() => setCalculationStep(3), 3050);
    const timer4 = setTimeout(() => setCalculationStep(4), 4550);
    
    const timer5 = setTimeout(() => {
      setShowCalculation(false);
      setCalculationStep(0);
      
      const duration = 1500;
      const steps = 60;
      const increment = cdrsScores.total / steps;
      let currentStep = 0;

      const circleTimer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedCDRS(Math.min(Math.round(increment * currentStep), cdrsScores.total));
        } else {
          clearInterval(circleTimer);
        }
      }, duration / steps);
    }, 6050);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [selectedCompany, cdrsScores.total]);

  // Animation effect for PRT with sequential calculation
  React.useEffect(() => {
    setAnimatedPRT(0);
    setPrtCalculationStep(0);
    setShowPrtCalculation(true);

    const timer1 = setTimeout(() => setPrtCalculationStep(1), 50);
    const timer2 = setTimeout(() => setPrtCalculationStep(2), 1050);
    const timer3 = setTimeout(() => setPrtCalculationStep(3), 2050);
    const timer4 = setTimeout(() => setPrtCalculationStep(4), 3050);
    
    const timer5 = setTimeout(() => {
      setShowPrtCalculation(false);
      setPrtCalculationStep(0);
      
      const duration = 1500;
      const steps = 60;
      const increment = prtScore / steps;
      let currentStep = 0;

      const circleTimer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedPRT(Math.min(Math.round(increment * currentStep), prtScore));
        } else {
          clearInterval(circleTimer);
        }
      }, duration / steps);
    }, 4050);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [selectedCompany, prtScore]);

  // Animation effect for NDF with sequential calculation
  React.useEffect(() => {
    setAnimatedNDF(0);
    setNdfCalculationStep(0);
    setShowNdfCalculation(true);

    const timer1 = setTimeout(() => setNdfCalculationStep(1), 50);
    const timer2 = setTimeout(() => setNdfCalculationStep(2), 1050);
    const timer3 = setTimeout(() => setNdfCalculationStep(3), 2050);
    const timer4 = setTimeout(() => setNdfCalculationStep(4), 3050);
    
    const timer5 = setTimeout(() => {
      setShowNdfCalculation(false);
      setNdfCalculationStep(0);
      
      const duration = 1500;
      const steps = 60;
      const increment = ndfData.confidence / steps;
      let currentStep = 0;

      const circleTimer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedNDF(Math.min(Math.round(increment * currentStep), ndfData.confidence));
        } else {
          clearInterval(circleTimer);
        }
      }, duration / steps);
    }, 4050);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [selectedCompany, ndfData.confidence]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const avgYield = filteredData.reduce((sum, d) => sum + d.yield, 0) / total;
    
    const sectorCounts = {};
    filteredData.forEach(d => {
      sectorCounts[d.secteur] = (sectorCounts[d.secteur] || 0) + 1;
    });
    const topSector = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])[0];
    
    const avgPRT = Math.round(filteredData.reduce((sum, d) => sum + d.prt, 0) / total);
    
    return {
      count: total,
      avgYield: avgYield.toFixed(1),
      topSector: topSector ? topSector[0] : 'Banques',
      avgPRT: avgPRT
    };
  }, [filteredData]);

  const badgeColors = {
    "Rendement ↑": "border-teal-500 text-teal-400",
    "Stable": "border-gray-500 text-gray-400",
    "Bon": "border-cyan-500 text-cyan-400",
    "Croissance": "border-blue-500 text-blue-400",
    "Tech": "border-indigo-500 text-indigo-400",
    "Utilities": "border-green-500 text-green-400",
    "Matériaux": "border-stone-500 text-stone-400",
    "Mining": "border-amber-500 text-amber-400",
    "Sidérurgie": "border-slate-500 text-slate-400",
    "Agroalimentaire": "border-lime-500 text-lime-400",
    "Alimentaire": "border-emerald-500 text-emerald-400",
    "Excellent": "border-green-500 text-green-400"
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M70 30C70 19.5066 61.4934 11 51 11C40.5066 11 32 19.5066 32 30" stroke="url(#gradient1)" strokeWidth="8" strokeLinecap="round"/>
                <path d="M32 70C32 80.4934 40.5066 89 51 89C61.4934 89 70 80.4934 70 70" stroke="url(#gradient2)" strokeWidth="8" strokeLinecap="round"/>
                <path d="M30 70L70 30" stroke="url(#gradient3)" strokeWidth="6" strokeLinecap="round"/>
                <path d="M62 38L70 30L62 22" stroke="url(#gradient3)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient1" x1="32" y1="20" x2="70" y2="20">
                    <stop stopColor="#14B8A6"/><stop offset="1" stopColor="#06B6D4"/>
                  </linearGradient>
                  <linearGradient id="gradient2" x1="32" y1="80" x2="70" y2="80">
                    <stop stopColor="#0891B2"/><stop offset="1" stopColor="#0E7490"/>
                  </linearGradient>
                  <linearGradient id="gradient3" x1="30" y1="50" x2="70" y2="50">
                    <stop stopColor="#10B981"/><stop offset="1" stopColor="#14B8A6"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xl font-bold">CasaDividendes</span>
              <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded-full font-semibold">MASI20</span>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white">Accueil</a>
            <a href="#" className="text-white font-medium">Calendrier</a>
            <a href="#" className="text-gray-400 hover:text-white">Palmarès</a>
            <a href="#" className="text-gray-400 hover:text-white">Blog</a>
            <a href="#" className="text-gray-400 hover:text-white">Premium</a>
          </nav>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold">
            Premium
          </button>
        </div>
      </header>

      <div className="flex max-w-[1800px] mx-auto">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-900 m-4 p-6 rounded-3xl overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                <path d="M70 30C70 19.5066 61.4934 11 51 11C40.5066 11 32 19.5066 32 30" stroke="url(#gS1)" strokeWidth="8" strokeLinecap="round"/>
                <path d="M32 70C32 80.4934 40.5066 89 51 89C61.4934 89 70 80.4934 70 70" stroke="url(#gS2)" strokeWidth="8" strokeLinecap="round"/>
                <path d="M30 70L70 30" stroke="url(#gS3)" strokeWidth="6" strokeLinecap="round"/>
                <path d="M62 38L70 30L62 22" stroke="url(#gS3)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gS1" x1="32" y1="20" x2="70" y2="20"><stop stopColor="#14B8A6"/><stop offset="1" stopColor="#06B6D4"/></linearGradient>
                  <linearGradient id="gS2" x1="32" y1="80" x2="70" y2="80"><stop stopColor="#0891B2"/><stop offset="1" stopColor="#0E7490"/></linearGradient>
                  <linearGradient id="gS3" x1="30" y1="50" x2="70" y2="50"><stop stopColor="#10B981"/><stop offset="1" stopColor="#14B8A6"/></linearGradient>
                </defs>
              </svg>
              <h2 className="text-lg font-bold">Scores KPIs</h2>
            </div>
            <div className="relative">
              <button 
                className="p-1 hover:bg-gray-800 rounded-lg transition"
                onMouseEnter={() => setShowCDRSInfo(true)}
                onMouseLeave={() => setShowCDRSInfo(false)}
              >
                <Info className="w-4 h-4 text-gray-400" />
              </button>
              
              {/* Tooltip C-DRS */}
              {showCDRSInfo && (
                <div className="absolute right-0 top-8 w-80 bg-gray-800 border border-teal-500/30 rounded-xl p-4 shadow-2xl z-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <span className="text-teal-400 font-bold text-sm">C-DRS™</span>
                    </div>
                    <h3 className="font-bold text-sm text-teal-400">Casa-Dividend Reliability Score</h3>
                  </div>
                  <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                    Le <strong>C-DRS™</strong> évalue la <span className="text-teal-400">fiabilité</span> des dividendes d'une entreprise sur une échelle de 0 à 100.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></div>
                      <p className="text-gray-400"><strong className="text-white">Régularité</strong> : Paiement constant sur 5 ans</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></div>
                      <p className="text-gray-400"><strong className="text-white">Croissance</strong> : Augmentation progressive</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                      <p className="text-gray-400"><strong className="text-white">Stabilité</strong> : Faible volatilité des montants</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                      <p className="text-gray-400"><strong className="text-white">Magnitude</strong> : Taux de croissance annuel</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500 italic">
                      Un score élevé indique un dividende fiable et prévisible.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Company Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Analyser une entreprise
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {masi20Data.map((company) => (
                <option key={company.ticker} value={company.ticker}>
                  {company.ticker} - {company.societe}
                </option>
              ))}
            </select>
          </div>

          {/* C-DRS Circle with INSIDE Animation */}
          <div className="relative mb-6">
            <div className="flex items-center justify-center">
              <div className="relative w-44 h-44">
                <svg className="transform -rotate-90 w-44 h-44">
                  <circle cx="88" cy="88" r="80" stroke="#374151" strokeWidth="14" fill="transparent" />
                  <circle cx="88" cy="88" r="80" stroke="url(#gradientScore)" strokeWidth="14" fill="transparent"
                    strokeDasharray={`${(animatedCDRS / 100) * 502} 502`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
                  />
                  <defs>
                    <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#14B8A6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* CONTENT INSIDE THE CIRCLE */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                  {showCalculation ? (
                    // ANIMATION MODE
                    <div className="text-center">
                      {/* HOURGLASS SPINNER */}
                      <svg className="w-10 h-10 mx-auto mb-3 text-teal-400" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      
                      {/* SEQUENTIAL STEPS */}
                      {calculationStep === 0 && (
                        <div className="text-xs text-teal-400 font-semibold">Initialisation...</div>
                      )}
                      {calculationStep === 1 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Régularité</div>
                          <div className="text-2xl font-bold text-teal-400">{cdrsScores.regularity}</div>
                          <div className="text-xs text-gray-500">/25</div>
                        </div>
                      )}
                      {calculationStep === 2 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Croissance</div>
                          <div className="text-2xl font-bold text-cyan-400">{cdrsScores.growth}</div>
                          <div className="text-xs text-gray-500">/35</div>
                        </div>
                      )}
                      {calculationStep === 3 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Stabilité</div>
                          <div className="text-2xl font-bold text-blue-400">{cdrsScores.stability}</div>
                          <div className="text-xs text-gray-500">/25</div>
                        </div>
                      )}
                      {calculationStep === 4 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Magnitude</div>
                          <div className="text-2xl font-bold text-purple-400">{cdrsScores.magnitude}</div>
                          <div className="text-xs text-gray-500">/15</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // FINAL SCORE MODE
                    <>
                      <span className="text-xs text-gray-400 mb-1">C-DRS™</span>
                      <span className="text-4xl font-bold transition-all duration-500">{animatedCDRS}</span>
                      <span className="text-xs text-gray-400">/100</span>
                      <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cdrsLabel.bgColor} ${cdrsLabel.color}`}>
                        {cdrsLabel.text}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Interpretation Summary - Only show after animation */}
            {!showCalculation && (
              <div className="mt-3 bg-gray-800/50 rounded-lg p-3 border border-teal-500/20">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {cdrsLabel.interpretation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PRT Score - New Design with Circle & Timeline */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">PRT™ Score</span>
              </div>
              <div className="relative">
                <button 
                  className="p-1 hover:bg-purple-800/30 rounded transition"
                  onMouseEnter={() => setShowPRTInfo(true)}
                  onMouseLeave={() => setShowPRTInfo(false)}
                >
                  <Info className="w-3 h-3 text-purple-400" />
                </button>
                
                {/* Tooltip PRT */}
                {showPRTInfo && (
                  <div className="absolute right-0 top-6 w-80 bg-gray-800 border border-purple-500/30 rounded-xl p-4 shadow-2xl z-50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="font-bold text-sm text-purple-400">Price Recovery Time</h3>
                    </div>
                    <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                      Le <strong>PRT™</strong> mesure le temps nécessaire pour que le <span className="text-purple-400">prix de l'action revienne</span> à son niveau d'avant le détachement du dividende.
                    </p>
                    <div className="bg-purple-900/20 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-300 mb-2">
                        <strong className="text-purple-300">Exemple :</strong>
                      </p>
                      <div className="space-y-1 text-xs text-gray-400">
                        <p>• 3 jours avant ex-date : 300 MAD</p>
                        <p>• Ex-date : 285 MAD (-15 MAD dividende)</p>
                        <p className="text-purple-300">• <strong>PRT = 18 jours</strong> pour revenir à 300 MAD</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-gray-400"><strong className="text-white">PRT court</strong> : Rotation rapide possible</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-gray-400"><strong className="text-white">PRT long</strong> : Stratégie Buy & Hold</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-500 italic">
                        Un PRT faible (10-20j) est idéal pour maximiser la rotation de dividendes.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PRT Circle with Animation */}
            <div className="flex items-center justify-center mb-3">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle cx="64" cy="64" r="56" stroke="#4C1D95" strokeWidth="8" fill="transparent" />
                  <circle cx="64" cy="64" r="56" stroke="url(#gradientPRT)" strokeWidth="8" fill="transparent"
                    strokeDasharray={`${(animatedPRT / 100) * 352} 352`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
                  />
                  <defs>
                    <linearGradient id="gradientPRT" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Content inside circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                  {showPrtCalculation ? (
                    // ANIMATION MODE
                    <div className="text-center">
                      {/* SPINNER */}
                      <svg className="w-8 h-8 mx-auto mb-2 text-purple-400" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      
                      {/* SEQUENTIAL STEPS */}
                      {prtCalculationStep === 0 && (
                        <div className="text-xs text-purple-400 font-semibold">Analyse...</div>
                      )}
                      {prtCalculationStep === 1 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Secteur</div>
                          <div className="text-xl font-bold text-purple-400">{selectedCompanyData?.secteur || 'N/A'}</div>
                        </div>
                      )}
                      {prtCalculationStep === 2 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Liquidité</div>
                          <div className="text-xl font-bold text-pink-400">MASI20</div>
                        </div>
                      )}
                      {prtCalculationStep === 3 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Volatilité</div>
                          <div className="text-xl font-bold text-purple-300">β {selectedCompanyData?.beta.toFixed(2)}</div>
                        </div>
                      )}
                      {prtCalculationStep === 4 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Historique</div>
                          <div className="text-xl font-bold text-fuchsia-400">3 ans</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // FINAL SCORE MODE
                    <>
                      <span className="text-xs text-gray-400 mb-1">Score</span>
                      <span className="text-3xl font-bold text-purple-300 transition-all duration-500">{animatedPRT}</span>
                      <span className="text-xs text-gray-400">/100</span>
                      <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${prtLabel.bgColor} ${prtLabel.color}`}>
                        {prtLabel.text}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Recovery */}
            <div className="bg-purple-900/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-purple-300 font-semibold">Recovery Timeline</span>
                <span className="text-xs text-purple-400 font-bold">{prtLabel.days}</span>
              </div>
              
              {/* Visual Timeline */}
              <div className="relative h-12 bg-gray-800 rounded-lg overflow-hidden">
                {/* Background grid */}
                <div className="absolute inset-0 flex">
                  <div className="flex-1 border-r border-gray-700"></div>
                  <div className="flex-1 border-r border-gray-700"></div>
                  <div className="flex-1 border-r border-gray-700"></div>
                  <div className="flex-1"></div>
                </div>
                
                {/* Progress bar */}
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 opacity-50"
                  style={{ width: `${Math.min((selectedCompanyData?.prt || 0) / 60 * 100, 100)}%` }}
                ></div>
                
                {/* Markers */}
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <div className="text-xs text-gray-500 font-medium">J-3</div>
                  <div className="text-xs text-gray-500 font-medium">Ex</div>
                  <div className="text-xs text-gray-400 font-medium">+15j</div>
                  <div className="text-xs text-gray-400 font-medium">+30j</div>
                  <div className="text-xs text-gray-500 font-medium">+60j</div>
                </div>
                
                {/* Recovery point indicator */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-8 bg-purple-300 rounded-full shadow-lg transition-all duration-1000"
                  style={{ left: `calc(${Math.min((selectedCompanyData?.prt || 0) / 60 * 100, 100)}% - 4px)` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap font-bold">
                    {selectedCompanyData?.prt}j
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-gray-400">Prix initial</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <span className="text-gray-400">Recovery complet</span>
                </div>
              </div>
            </div>
            
            {/* Interpretation Summary */}
            {!showPrtCalculation && (
              <div className="mt-3 bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {prtLabel.interpretation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* NDF Score - Next Dividend Forecast */}
          <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 border border-orange-500/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-300">NDF™ Forecast</span>
              </div>
              <div className="relative">
                <button 
                  className="p-1 hover:bg-orange-800/30 rounded transition"
                  onMouseEnter={() => setShowNDFInfo(true)}
                  onMouseLeave={() => setShowNDFInfo(false)}
                >
                  <Info className="w-3 h-3 text-orange-400" />
                </button>
                
                {/* Tooltip NDF */}
                {showNDFInfo && (
                  <div className="absolute right-0 top-6 w-80 bg-gray-800 border border-orange-500/30 rounded-xl p-4 shadow-2xl z-50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-orange-400" />
                      </div>
                      <h3 className="font-bold text-sm text-orange-400">Next Dividend Forecast</h3>
                    </div>
                    <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                      Le <strong>NDF™</strong> prédit le <span className="text-orange-400">prochain dividende</span> (montant et date) en utilisant une méthodologie composite.
                    </p>
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-gray-400"><strong className="text-white">Tendance pondérée</strong> : TCAM avec années récentes prioritaires</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-gray-400"><strong className="text-white">Payout Ratio</strong> : Validation via santé financière</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-gray-400"><strong className="text-white">Historique dates</strong> : Pattern des ex-dates précédentes</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-500 italic">
                        Une confiance élevée (80+) permet de planifier vos investissements en avance.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* NDF Circle with Animation */}
            <div className="flex items-center justify-center mb-3">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle cx="64" cy="64" r="56" stroke="#78350F" strokeWidth="8" fill="transparent" />
                  <circle cx="64" cy="64" r="56" stroke="url(#gradientNDF)" strokeWidth="8" fill="transparent"
                    strokeDasharray={`${(animatedNDF / 100) * 352} 352`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
                  />
                  <defs>
                    <linearGradient id="gradientNDF" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Content inside circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                  {showNdfCalculation ? (
                    // ANIMATION MODE
                    <div className="text-center">
                      {/* SPINNER */}
                      <svg className="w-8 h-8 mx-auto mb-2 text-orange-400" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      
                      {/* SEQUENTIAL STEPS */}
                      {ndfCalculationStep === 0 && (
                        <div className="text-xs text-orange-400 font-semibold">Calcul...</div>
                      )}
                      {ndfCalculationStep === 1 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">TCAM</div>
                          <div className="text-xl font-bold text-orange-400">{ndfData.tcam}%</div>
                        </div>
                      )}
                      {ndfCalculationStep === 2 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Tendance</div>
                          <div className="text-xl font-bold text-amber-400">{ndfData.divProbable} MAD</div>
                        </div>
                      )}
                      {ndfCalculationStep === 3 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Fourchette</div>
                          <div className="text-sm font-bold text-orange-300">{ndfData.divMin}-{ndfData.divMax}</div>
                        </div>
                      )}
                      {ndfCalculationStep === 4 && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                          <div className="text-xs text-gray-400 mb-1">Validation</div>
                          <div className="text-xl font-bold text-yellow-400">✓</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // FINAL SCORE MODE
                    <>
                      <span className="text-xs text-gray-400 mb-1">Confiance</span>
                      <span className="text-3xl font-bold text-orange-300 transition-all duration-500">{animatedNDF}</span>
                      <span className="text-xs text-gray-400">/100</span>
                      <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${ndfLabel.bgColor} ${ndfLabel.color}`}>
                        {ndfLabel.text}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Forecast Details */}
            <div className="bg-orange-900/20 rounded-lg p-3 space-y-3">
              {/* Montant */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-orange-300 font-semibold">💰 Dividende 2026</span>
                  <span className="text-xs text-gray-400">{ndfLabel.stars}</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-300">{ndfData.divProbable} MAD</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Fourchette : {ndfData.divMin} - {ndfData.divMax} MAD
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Ex-Date */}
              <div>
                <div className="text-xs text-orange-300 font-semibold mb-1">📅 Ex-Date Estimée</div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <div className="text-center">
                    <div className="text-sm font-bold text-orange-300">{ndfData.exDateProbable}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Fenêtre : {ndfData.exDateRange}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interpretation Summary */}
            {!showNdfCalculation && (
              <div className="mt-3 bg-orange-900/20 rounded-lg p-3 border border-orange-500/20">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {ndfLabel.interpretation}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-black py-4 rounded-xl font-semibold hover:shadow-lg transition">
            Méthodologie C-DRS™, PRT™ & NDF™
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Calendrier MASI20 - Dividendes (BVC)</h1>
            <p className="text-gray-400 text-sm">
              Les 20 entreprises les plus liquides • <span className="text-teal-400">C-DRS™</span>, <span className="text-purple-400">PRT™</span> & <span className="text-orange-400">NDF™</span> activés
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-2">Actions MASI20</p>
              <p className="text-4xl font-bold mb-1">{stats.count}</p>
              <p className="text-gray-500 text-sm">Plus liquides</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-2">Yield Moyen</p>
              <p className="text-4xl font-bold mb-1">{stats.avgYield}%</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-2">PRT Moyen</p>
              <p className="text-4xl font-bold mb-1">{stats.avgPRT}j</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-2">Top Secteur</p>
              <p className="text-4xl font-bold mb-1 truncate">{stats.topSector}</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-center text-gray-400">Tableau complet disponible dans la version complète</p>
          </div>
        </div>
      </div>
    </div>
  );
}