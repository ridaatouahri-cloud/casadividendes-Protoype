// src/pages/Dashboard.jsx
// CasaDividendes — Dashboard (template calqué sur le mock "Overview + Monthly Volume")
// - Dimensions, largeur, filtres et structure respectés
// - Style premium Casa (Inter, arrondis 2xl, ombres soft, accents teal/orange)
// - Thème clair par défaut + toggle sombre
// - Données mock pour la démo (brancher vos services réelles ensuite)

import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, BarChart, Bar,
} from "recharts";
import {
  Menu, UserCircle, Bell, Plus, Download, ChevronDown, Sun, Moon,
  CreditCard, CheckCircle2, Clock4, CircleX, ArrowUpRight, ArrowDownRight
} from "lucide-react";

/* ============================================================
   TOKENS — palette & styles (inline, cohérent CasaDividendes)
   ============================================================ */
const TOKENS = {
  light: {
    page: "bg-[#F6F8FB]",
    card: "bg-white",
    text: { primary: "text-[#0F1115]", secondary: "text-[#374151]", muted: "text-[#6B7280]" },
    border: "border-[rgba(15,17,21,0.06)]",
    shadow: "shadow-[0_1px_0_rgba(0,0,0,0.03),0_12px_40px_rgba(0,0,0,0.06)]",
    soft: "bg-[#F1F5F9]",
    success: "text-emerald-600",
    danger: "text-rose-600",
    brand: "#14b8a6",
    brand2: "#f59e0b",
    grid: "rgba(2,6,23,0.06)",
    tooltipBg: "#fff",
    tooltipFg: "#0F1115",
    tooltipBd: "rgba(2,6,23,0.12)",
  },
  dark: {
    page: "bg-ink-950",
    card: "bg-ink-900",
    text: { primary: "text-white", secondary: "text-gray-300", muted: "text-gray-400" },
    border: "border-white/10",
    shadow: "shadow-[0_0_0_rgba(0,0,0,0),0_12px_40px_rgba(0,0,0,0.25)]",
    soft: "bg-ink-800",
    success: "text-brand-teal",
    danger: "text-orange-400",
    brand: "#22d3ee",
    brand2: "#f59e0b",
    grid: "rgba(255,255,255,0.10)",
    tooltipBg: "#0B0B0D",
    tooltipFg: "#F3F4F6",
    tooltipBd: "rgba(255,255,255,0.14)",
  },
};

function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("cd_theme_overview") ||
      (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  const isDark = theme === "dark";
  const t = TOKENS[isDark ? "dark" : "light"];
  const cls = {
    page: `${t.page} transition-colors duration-300`,
    card: `rounded-2xl ${t.card} border ${t.border} ${t.shadow} transition-colors duration-300`,
    h1: `text-[22px] font-semibold ${t.text.primary}`,
    h2: `text-sm font-medium ${t.text.primary}`,
    p: `text-sm ${t.text.secondary}`,
    muted: `text-xs ${t.text.muted}`,
    btn: `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm border ${t.border} ${t.card} ${t.text.secondary} hover:opacity-90 transition`,
    btnPrimary: `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition`,
    input: `w-full rounded-xl border ${t.border} ${t.card} px-3 py-2 text-sm placeholder:${t.text.muted.split(" ").at(-1)} focus:outline-none focus:ring-2 focus:ring-emerald-300/60`,
    pill: `inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs border ${t.border} ${t.card} ${t.text.secondary} hover:opacity-90`,
    pillActive: `inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs bg-[#0F1115] text-white`,
  };
  const toggle = () => {
    const v = isDark ? "light" : "dark";
    setTheme(v);
    localStorage.setItem("cd_theme_overview", v);
  };
  return { isDark, t, cls, toggle };
}

/* ============================================================
   MOCKS — (à brancher sur vos services plus tard)
   ============================================================ */
const kpis = [
  { label: "Approved Transactions", value: 1748, delta: "+3.5%", icon: CheckCircle2 },
  { label: "Declined Transactions", value: 224, delta: "+1.2%", icon: CircleX },
  { label: "Refunded Transactions", value: 87, delta: "-3.5%", icon: ArrowDownRight, down: true },
  { label: "New Customers", value: 344, delta: "+1.3%", icon: ArrowUpRight },
];

const revenueSeries = Array.from({ length: 52 }, (_, i) => {
  const gross = 45000 + Math.sin(i / 4) * 8000 + i * 500 + (i % 7) * 800;
  const net = gross * (0.61 + (Math.cos(i / 5) * 0.04));
  const base = 7000 + (i % 12) * 200;
  return {
    w: i + 1,
    gross: Math.round(gross),
    net: Math.round(net),
    base: Math.round(base),
  };
});

const miniSpark = revenueSeries.slice(-20).map((d, i) => ({ x: i, v: d.net * (0.96 + (i % 5) * 0.01) }));

const txs = [
  { id: "L-9843", customer: "Leslie Alexander", type: "Sale", status: "Approved", last4: "9843", date: "08/15/17", amount: 1272.5 },
  { id: "D-0039", customer: "Dianne Russell", type: "Refund", status: "Declined", last4: "0039", date: "02/11/12", amount: 1272.5 },
];

/* ============================================================
   PRIMITIVES
   ============================================================ */
const Stat = ({ t, cls, icon: Icon, label, value, delta, down }) => (
  <div className={cls.card + " p-4"}>
    <div className="flex items-center justify-between">
      <div className={`h-9 w-9 grid place-items-center rounded-xl ${down ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className={`text-[11px] px-2 py-0.5 rounded-md ${down ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{delta}</span>
    </div>
    <div className={`mt-3 ${cls.muted}`}>{label}</div>
    <div className={`text-xl font-semibold ${t.text.primary}`}>{value.toLocaleString("fr-FR")}</div>
  </div>
);

const Row = ({ left, right }) => (
  <div className="flex items-center justify-between gap-2">{left}{right}</div>
);

/* ============================================================
   PAGE
   ============================================================ */
export default function Dashboard() {
  const { isDark, t, cls, toggle } = useTheme();

  const grossVol = useMemo(() => revenueSeries.at(-1)?.gross ?? 0, []);
  const netVol = useMemo(() => revenueSeries.at(-1)?.net ?? 0, []);
  const monthlyTotal = 2243.34;

  return (
    <div className={`min-h-screen ${cls.page}`}>
      <div className="mx-auto max-w-[1400px] px-5 py-6">
        {/* Barre top (menu, brand, user) */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button className={cls.btn}><Menu className="w-4 h-4" /></button>
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white grid place-items-center font-semibold">CD</div>
            <div className={`font-medium ${t.text.primary}`}>Finance</div>
          </div>
          <div className="flex items-center gap-2">
            <button className={cls.btn} onClick={toggle}>{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
            <button className={cls.btn}><Bell className="w-4 h-4" /></button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center">A</div>
              <span className={`text-sm ${t.text.secondary}`}>Andrew Tang</span>
            </div>
          </div>
        </div>

        {/* Grille principale : gauche (overview) / droite (monthly panel) */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT — Overview */}
          <section className="col-span-12 xl:col-span-8 space-y-6">
            {/* Titre + bouton */}
            <div className="flex items-center justify-between">
              <h1 className={cls.h1}>Overview</h1>
              <button className={cls.btnPrimary}><Plus className="w-4 h-4" /> New payment</button>
            </div>

            {/* KPIs (4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k) => (
                <Stat key={k.label} t={t} cls={cls} {...k} />
              ))}
            </div>

            {/* Revenue Chart */}
            <div className={cls.card + " p-5"}>
              <Row
                left={<div className="flex items-center gap-6">
                  <div>
                    <div className={`${cls.muted} mb-0.5`}>Gross Volume</div>
                    <div className={`text-lg font-semibold ${t.text.primary}`}>${grossVol.toLocaleString("en-US")} <span className="text-xs text-emerald-600 ml-1">+3.2% last year</span></div>
                  </div>
                  <div>
                    <div className={`${cls.muted} mb-0.5`}>Net Volume</div>
                    <div className={`text-lg font-semibold ${t.text.primary}`}>${netVol.toLocaleString("en-US")} <span className="text-xs text-emerald-600 ml-1">+1.5% last year</span></div>
                  </div>
                </div>}
                right={<div className="flex items-center gap-2">
                  <button className={cls.pill}>This year <ChevronDown className="w-3.5 h-3.5" /></button>
                  <button className={cls.pill}>Decline <ChevronDown className="w-3.5 h-3.5" /></button>
                </div>}
              />
              <div className="h-[280px] mt-3">
                <ResponsiveContainer>
                  <LineChart data={revenueSeries}>
                    <CartesianGrid stroke={t.grid} vertical={false} />
                    <XAxis dataKey="w" tickLine={false} stroke={isDark?"#D1D5DB":"#374151"} />
                    <YAxis tickLine={false} stroke={isDark?"#D1D5DB":"#374151"} />
                    <RTooltip
                      contentStyle={{ background: t.tooltipBg, color: t.tooltipFg, border: `1px solid ${t.tooltipBd}`, borderRadius: 12 }}
                      formatter={(v, n) => [`$${Number(v).toLocaleString("en-US")}`, n === "gross" ? "Gross" : n === "net" ? "Net" : "Base"]}
                    />
                    <Line type="monotone" dataKey="gross" stroke="#4F46E5" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="net" stroke="#22C55E" strokeWidth={2} dot={false} />
                    <BarChart data={revenueSeries}>
                      <Bar dataKey="base" fill={isDark?"#0EA5E9":"#E5E7EB"} radius={[4,4,0,0]} />
                    </BarChart>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transactions table */}
            <div className={cls.card + " p-5"}>
              <div className="flex items-center justify-between mb-3">
                <div className={cls.h2}>Transactions</div>
                <div className="flex items-center gap-2">
                  <button className={cls.pill}>This Month <ChevronDown className="w-3.5 h-3.5" /></button>
                  <button className={cls.pill}><Download className="w-4 h-4" /> Export</button>
                </div>
              </div>
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${t.border} ${t.text.muted}`}>
                      <th className="text-left py-2 px-5">Customer ID</th>
                      <th className="text-left py-2 px-5">Customer</th>
                      <th className="text-left py-2 px-5">Type</th>
                      <th className="text-left py-2 px-5">Status</th>
                      <th className="text-left py-2 px-5">Account Data</th>
                      <th className="text-left py-2 px-5">Transaction Date</th>
                      <th className="text-right py-2 px-5">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.map((r) => (
                      <tr key={r.id} className={`border-b ${t.border}`}>
                        <td className={`py-3 px-5 ${t.text.secondary}`}>{r.id}</td>
                        <td className={`py-3 px-5 ${t.text.primary}`}>{r.customer}</td>
                        <td className={`py-3 px-5 ${t.text.secondary}`}>{r.type}</td>
                        <td className={`py-3 px-5`}>
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${r.status==="Approved"?"bg-emerald-50 text-emerald-700":"bg-rose-50 text-rose-700"}`}>
                            {r.status==="Approved"?<CheckCircle2 className="w-3 h-3"/>:<Clock4 className="w-3 h-3"/>}
                            {r.status}
                          </span>
                        </td>
                        <td className={`py-3 px-5 ${t.text.secondary}`}>
                          <span className="inline-flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />•••• {r.last4}
                          </span>
                        </td>
                        <td className={`py-3 px-5 ${t.text.secondary}`}>{r.date}</td>
                        <td className={`py-3 px-5 text-right ${r.type==="Refund" ? "text-rose-600" : "text-emerald-600"}`}>
                          {r.type==="Refund"?"-":"+"}${r.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* RIGHT — Monthly Volume panel (collé au mock) */}
          <aside className="col-span-12 xl:col-span-4">
            <div className={cls.card + " p-5"}>
              <div className="flex items-start justify-between">
                <div className={cls.h2}>Monthly Volume</div>
                <button className={cls.btn}>✕</button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button className={cls.pill + " !text-xs"}>Total</button>
                <button className={cls.pill + " !text-xs"}>Transaction</button>
                <button className={cls.pill + " !text-xs"}>Day Sale</button>
              </div>

              <div className="mt-4">
                <div className={`${cls.muted} mb-1`}>This month day sale volume is 3.54% larger than last month</div>
                <div className={`text-[22px] font-semibold ${t.text.primary}`}>${monthlyTotal.toLocaleString("en-US")}</div>
                {/* mini sparkline */}
                <div className="h-[140px] mt-3">
                  <ResponsiveContainer>
                    <LineChart data={miniSpark}>
                      <CartesianGrid stroke={t.grid} vertical={false} />
                      <XAxis dataKey="x" hide />
                      <YAxis hide />
                      <RTooltip contentStyle={{ background: t.tooltipBg, color: t.tooltipFg, border: `1px solid ${t.tooltipBd}`, borderRadius: 12 }}/>
                      <Line type="monotone" dataKey="v" stroke={t.brand} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Volume by Card Type */}
              <div className="mt-5">
                <div className={cls.h2}>Volume by Card Type</div>
                <div className="mt-3 space-y-3">
                  {[
                    { label: "Visa", amount: 1500.31, color: "#22c55e" },
                    { label: "Mastercard", amount: 489.30, color: "#14b8a6" },
                    { label: "American Express", amount: 312.00, color: "#4f46e5" },
                    { label: "Discover", amount: 60.50, color: "#f59e0b" },
                    { label: "Capital One", amount: 45.00, color: "#64748b" },
                    { label: "Other", amount: 15.75, color: isDark ? "#334155" : "#E5E7EB" },
                  ].map((c) => (
                    <div key={c.label}>
                      <div className="flex items-center justify-between text-sm">
                        <div className={t.text.secondary}>{c.label}</div>
                        <div className={t.text.secondary}>${c.amount.toLocaleString("en-US")}</div>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, (c.amount / 1500.31) * 100)}%`, background: c.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button className={cls.btn}><Download className="w-4 h-4" /> Export</button>
                <button className={cls.btnPrimary}>Create Report</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
