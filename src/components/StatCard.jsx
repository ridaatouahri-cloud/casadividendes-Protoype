// src/components/StatCard.jsx — tokens premium (cartes vitrées + pill)
import React from "react";

export const StatCard = ({ title, value, sub, className = "" }) => (
  <div className={`card-premium p-4 ${className}`}>
    <div className="text-sm text-white/60">{title}</div>
    <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    {sub ? <div className="text-xs text-white/50 mt-1">{sub}</div> : null}
  </div>
);

export const Pill = ({ children }) => (
  <span className="px-2 py-1 rounded-full text-[11px] bg-white/[0.06] border border-white/10 text-white/80">
    {children}
  </span>
);
