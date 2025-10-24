// src/components/StatCard.jsx --- tokens premium (cartes vitrées + pill)

import React from "react";

/**
 * StatCard - Carte statistique premium avec effet vitré
 * @param {string} title - Titre de la statistique
 * @param {string|number} value - Valeur principale à afficher
 * @param {string} sub - Sous-titre optionnel
 * @param {string} className - Classes CSS additionnelles
 */
export const StatCard = ({ title, value, sub, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-4 transition-all hover:-translate-y-1 hover:border-teal-400/30 ${className}`}
  >
    <div className="text-sm text-white/60">{title}</div>
    <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    {sub ? <div className="text-xs text-white/50 mt-1">{sub}</div> : null}
  </div>
);

/**
 * Pill - Badge/étiquette premium
 * @param {React.ReactNode} children - Contenu du badge
 */
export const Pill = ({ children }) => (
  <span className="px-2 py-1 rounded-full text-[11px] bg-white/[0.06] border border-white/10 text-white/80">
    {children}
  </span>
);

/**
 * StatCardWithIcon - Carte statistique avec icône
 * @param {string} title - Titre de la statistique
 * @param {string|number} value - Valeur principale
 * @param {React.ReactNode} icon - Icône à afficher
 * @param {string} sub - Sous-titre optionnel
 * @param {string} className - Classes CSS additionnelles
 */
export const StatCardWithIcon = ({ title, value, icon, sub, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-4 transition-all hover:-translate-y-1 hover:border-teal-400/30 ${className}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm text-white/60">{title}</div>
      {icon && <div className="text-teal-300/70">{icon}</div>}
    </div>
    <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    {sub ? <div className="text-xs text-white/50 mt-1">{sub}</div> : null}
  </div>
);

/**
 * StatCardGrid - Container pour organiser plusieurs StatCards
 * @param {React.ReactNode} children - StatCards à afficher
 * @param {number} cols - Nombre de colonnes (2, 3, ou 4)
 */
export const StatCardGrid = ({ children, cols = 3 }) => {
  const colsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${colsClass[cols]} gap-4`}>
      {children}
    </div>
  );
};

// Export par défaut pour l'import simple
export default StatCard;