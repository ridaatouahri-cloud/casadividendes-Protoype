import React from "react";

export const StatCard = ({ title, value, sub }) => (
  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
    <div className="text-sm text-zinc-400">{title}</div>
    <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    {sub ? <div className="text-xs text-zinc-500 mt-1">{sub}</div> : null}
  </div>
);

export const Pill = ({ children }) => (
  <span className="px-2 py-1 rounded-full text-xs bg-zinc-800/80 border border-zinc-700">{children}</span>
);
