// src/pages/Dashboard.jsx
// CasaDividendes — Dashboard (template refonte inspirée du modèle joint)
// - Fidèle au layout (sidebar + contenu en cartes)
// - Style Casa (typo Inter, coins 2xl, ombres soft, accents teal/orange)
// - Thème clair par défaut + toggle sombre
// - Données mock pour la démo (brancher vos services plus tard si besoin)

import React, { useMemo, useState } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  LayoutGrid, Wallet, ArrowDownRight, ArrowUpRight, PiggyBank, BarChart2,
  Search, Bell, UserCircle, Settings, HelpCircle, LogOut, Sun, Moon,
  ChevronDown, CheckCircle2, Clock, CreditCard, Shield
} from "lucide-react";

/* ============================================================
   Theme tokens (inline) — cohérent avec CasaDividendes
   ============================================================ */
const TOKENS = {
  light: {
    page: "bg-[#F6F8FB]",
    card: "bg-white",
    text: {
      primary: "text-[#0F1115]",
      secondary: "text-[#374151]",
      muted: "text-[#6B7280]",
      success: "text-emerald-600",
      danger: "text-rose-600",
    },
    border: "border-[rgba(15,17,21,0.06)]",
    soft: "bg-[#F1F5F9]", // badges soft
    accent: "#14b8a6", // teal
    accent2: "#f59e0b", // orange
    shadow: "shadow-[0_1px_0_rgba(0,0,0,0.03),0_12px_40px_rgba(0,0,0,0.06)]",
    grid: "rgba(2,6,23,0.06)",
    tooltipBg: "#fff",
    tooltipFg: "#0F1115",
    tooltipBd: "rgba(2,6,23,0.12)"
  },
  dark: {
    page: "bg-ink-950",
    card: "bg-ink-900",
    text: {
      primary: "text-white",
      secondary: "text-gray-300",
      muted: "text-gray-400",
      success: "text-brand-teal",
      danger: "text-orange-400",
    },
    border: "border-white/10",
    soft: "bg-ink-800",
    accent: "#22d3ee",
    accent2: "#f59e0b",
    shadow: "shadow-[0_0_0_rgba(0,0,0,0),0_12px_40px_rgba(0,0,0,0.25)]",
    grid: "rgba(255,255,255,0.1)",
    tooltipBg: "#0B0B0D",
    tooltipFg: "#F3F4F6",
    tooltipBd: "rgba(255,255,255,0.14)"
  }
};

const useTheme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("cd_theme") || (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  const isDark = theme === "dark";
  const t = TOKENS[isDark ? "dark" : "light"];
  const cls = {
    page: `${t.page} transition-colors duration-300`,
    card: `rounded-2xl ${t.card} border ${t.border} ${t.shadow} transition-colors duration-300`,
    h1: `text-2xl font-semibold ${t.text.primary}`,
    h2: `text-sm font-medium ${t.text.primary}`,
    p: `text-sm ${t.text.secondary}`,
    muted: `text-xs ${t.text.muted}`,
    input: `w-full rounded-xl border ${t.border} ${t.card} px-3 py-2 text-sm placeholder:${t.text.muted.split(" ").at(-1)} focus:outline-none focus:ring-2 focus:ring-emerald-300/60`,
    btn: `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm border ${t.border} ${t.card} ${t.text.secondary} hover:opacity-90 transition`,
    btnPrimary: `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition`,
    soft: `rounded-lg ${t.soft}`,
    success: t.text.success,
    danger: t.text.danger,
  };
  const toggle = () => { const v = isDark ? "light" : "dark"; setTheme(v); localStorage.setItem("cd_theme", v); };
  return { isDark, t, cls, toggle };
};

/* ============================================================
   Mock data (à brancher sur vos services si besoin)
   ============================================================ */
const KPIS = [
  { icon: ArrowUpRight, label: "Income", value: 8500, delta: "+3.7%" },
  { icon: ArrowDownRight, label: "Expense", value: 4900, delta: "-2.4%" },
  { icon: PiggyBank, label: "Savings", value: 2000, delta: "+1.5%" },
  { icon: BarChart2, label: "Investment", value: 1600, delta: "+3.8%" },
];

const FLOW = [
  { d: "Sun", income: 1500, expense: 900 },
  { d: "Mon", income: 1300, expense: 1100 },
  { d: "Tue", income: 1800, expense: 1200 },
  { d: "Wed", income: 1600, expense: 1400 },
  { d: "Thu", income: 2100, expense: 1600 },
  { d: "Fri", income: 1900, expense: 1500 },
  { d: "Sat", income: 1700, expense: 1300 },
];

const BREAKDOWN = [
  { name: "Food & Dining", value: 500 },
  { name: "Utilities", value: 300 },
  { name: "Investment", value: 200 },
];

const TXS = [
  { id: 1, name: "Dividend Payout", acc: "Investments", date: "2024-09-25", time: "09:45", amount: +200.0, status: "Completed" },
  { id: 2, name: "Grocery Shopping", acc: "Platinum Plus Visa", date: "2024-09-24", time: "14:30", amount: -154.2, status: "Completed" },
  { id: 3, name: "Freelance Payment", acc: "Freedom Mastercard", date: "2024-09-22", time: "15:09", amount: +850.0, status: "Completed" },
  { id: 4, name: "Electricity Bill", acc: "Freedom Mastercard", date: "2024-09-20", time: "10:26", amount: -120.75, status: "Completed" },
  { id: 5, name: "Online Subscription", acc: "Platinum Plus Visa", date: "2024-09-18", time: "08:30", amount: -12.99, status: "Pending" },
];

const SAVINGS = [
  { label: "Emergency Fund", now: 4500, max: 10000 },
  { label: "Retirement Fund", now: 5000, max: 20000 },
  { label: "Vacation Fund", now: 2500, max: 5000 },
];

const COLORS = ["#14b8a6", "#64748b", "#f59e0b"];

/* ============================================================
   Primitives UI
   ============================================================ */
const StatCard = ({ t, cls, icon: Icon, label, value, delta, positive=true }) => (
  <div className={cls.card}>
    <div className="flex items-start justify-between">
      <div className={`h-10 w-10 grid place-items-center rounded-xl ${positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`text-xs px-2 py-1 rounded-md ${positive ? "bg-emerald-50 text-emerald-700":"bg-rose-50 text-rose-700"}`}>{delta}</span>
    </div>
    <div className={`mt-3 ${cls.muted}`}>{label}</div>
    <div className={`text-2xl font-semibold ${t.text.primary}`}>${value.toLocaleString("en-US")}</div>
  </div>
);

const SectionHeader = ({ cls, title, right }) => (
  <div className="flex items-center justify-between mb-3">
    <div className={cls.h2}>{title}</div>
    <div className="flex items-center gap-2">{right}</div>
  </div>
);

const Progress = ({ value, max, color="#14b8a6", bg="bg-gray-100" }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`h-2 w-full rounded-full overflow-hidden ${bg}`}>
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
};

/* ============================================================
   Page
   ============================================================ */
export default function Dashboard() {
  const { isDark, t, cls, toggle } = useTheme();

  const totalBalance = useMemo(() => FLOW.reduce((s,r)=>s + r.income - r.expense, 0), []);
  const totalExpense = useMemo(() => BREAKDOWN.reduce((s,d)=>s + d.value, 0), []);
  const financeScore = 92;

  return (
    <div className={`min-h-screen ${cls.page}`}>
      <div className="mx-auto max-w-[1400px] grid grid-cols-12 gap-6 px-5 py-6">
        {/* Sidebar */}
        <aside className="col-span-2">
          <div className={cls.card + " p-4 sticky top-6"}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white grid place-items-center font-semibold">CD</div>
              <div className={`font-semibold ${t.text.primary}`}>CasaDividendes</div>
            </div>

            <div className="relative mb-3">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${t.text.muted}`} />
              <input className={cls.input} style={{ paddingLeft: 36 }} placeholder="Search placeholder" />
            </div>

            <nav className="space-y-1">
              {[
                { icon: LayoutGrid, label: "Dashboard", active: true },
                { icon: Wallet, label: "Payments" },
                { icon: CreditCard, label: "Transactions" },
                { icon: Shield, label: "Invoices" },
                { icon: PiggyBank, label: "Cards" },
                { icon: BarChart2, label: "Saving Plans" },
                { icon: ArrowUpRight, label: "Investments" },
                { icon: Clock, label: "Inbox", badge: 9 },
                { icon: HelpCircle, label: "Promos" },
                { icon: Settings, label: "Insights" },
              ].map((m) => (
                <a key={m.label} href="#" className={`flex items-center justify-between rounded-xl px-3 py-2 ${m.active ? "bg-emerald-600 text-white" : `${cls.btn}`}`}>
                  <span className="flex items-center gap-3">
                    <m.icon className="w-4 h-4" />
                    <span className="text-sm">{m.label}</span>
                  </span>
                  {m.badge ? <span className="text-xs rounded-md px-1.5 py-0.5 bg-rose-100 text-rose-700">{m.badge}</span> : null}
                </a>
              ))}
            </nav>

            <div className="mt-6">
              <div className={`text-xs ${t.text.muted} mb-2`}>GENERAL</div>
              <div className="space-y-1">
                {[{icon:Settings,label:"Settings"},{icon:HelpCircle,label:"Help Desk"},{icon:LogOut,label:"Log out"}].map(m=>(
                  <a key={m.label} href="#" className={`${cls.btn} w-full justify-start`}>
                    <m.icon className="w-4 h-4" /><span>{m.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-xl border ${t.border} ${t.soft}`}>
              <div className={`${t.text.primary} text-sm font-medium`}>Get Pro</div>
              <p className={`${cls.muted} mt-1`}>Full access to analytics & reports.</p>
              <button className={`${cls.btnPrimary} mt-3 w-full`}>Upgrade</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-7 space-y-6">
          {/* Header bar */}
          <div className="flex items-center justify-between">
            <h1 className={cls.h1}>Dashboard</h1>
            <div className="flex items-center gap-2">
              <button className={cls.btn} onClick={toggle}>{isDark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}</button>
              <button className={cls.btn}><Bell className="w-4 h-4"/></button>
              <button className={cls.btn}><UserCircle className="w-4 h-4"/></button>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {KPIS.map((k,i)=>(
              <StatCard
                key={i}
                t={t}
                cls={cls}
                icon={k.icon}
                label={k.label}
                value={k.value}
                delta={k.delta}
                positive={k.value>=0}
              />
            ))}
          </div>

          {/* Cashflow + Breakdown */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className={cls.card + " xl:col-span-2 p-5"}>
              <SectionHeader
                cls={cls}
                title="Cashflow"
                right={
                  <button className={cls.btn}>
                    Last 7 Days <ChevronDown className="w-4 h-4" />
                  </button>
                }
              />
              <div className={`${cls.muted} mb-2`}>Total Balance</div>
              <div className={`text-xl font-semibold ${t.text.primary}`}>${totalBalance.toLocaleString("en-US")}</div>
              <div className="h-[260px] mt-3">
                <ResponsiveContainer>
                  <LineChart data={FLOW}>
                    <CartesianGrid stroke={t.grid} vertical={false}/>
                    <XAxis dataKey="d" stroke={isDark ? "#D1D5DB" : "#374151"} />
                    <YAxis stroke={isDark ? "#D1D5DB" : "#374151"} />
                    <RTooltip
                      contentStyle={{ background: t.tooltipBg, color: t.tooltipFg, border: `1px solid ${t.tooltipBd}`, borderRadius: 12 }}
                      formatter={(v, n) => [`$${v.toLocaleString("en-US")}`, n === "income" ? "Income" : "Expense"]}
                    />
                    <Line dot={false} type="monotone" dataKey="income" stroke="#A3E635" strokeWidth={2}/>
                    <Line dot={false} type="monotone" dataKey="expense" stroke="#16A34A" strokeWidth={2}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cls.card + " p-5"}>
              <SectionHeader cls={cls} title="Expense Breakdown" right={
                <button className={cls.btn}>Today <ChevronDown className="w-4 h-4" /></button>
              }/>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="h-[220px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={BREAKDOWN} innerRadius={48} outerRadius={80} dataKey="value" stroke="transparent">
                        {BREAKDOWN.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className={cls.muted}>Total Expense</div>
                    <div className={`text-xl font-semibold ${t.text.primary}`}>${totalExpense.toLocaleString("en-US")}</div>
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 rounded-md px-2 py-0.5 mt-1">+1.5%</span>
                  </div>
                  {BREAKDOWN.map((b, i) => {
                    const pct = Math.round((b.value / totalExpense) * 100);
                    return (
                      <div key={b.name}>
                        <div className="flex items-center justify-between text-sm">
                          <div className={t.text.secondary}>{b.name}</div>
                          <div className={t.text.secondary}>{pct}%</div>
                        </div>
                        <Progress value={pct} max={100} color={COLORS[i%COLORS.length]} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className={cls.card + " p-5"}>
            <SectionHeader
              cls={cls}
              title="Recent Transactions"
              right={
                <>
                  <button className={cls.btn}>This Month <ChevronDown className="w-4 h-4"/></button>
                  <button className={cls.btn}><Settings className="w-4 h-4"/></button>
                </>
              }
            />
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${t.border} ${t.text.muted}`}>
                    <th className="text-left py-2 px-5">Transaction Name</th>
                    <th className="text-left py-2 px-5">Account</th>
                    <th className="text-left py-2 px-5">Date & Time</th>
                    <th className="text-right py-2 px-5">Amount</th>
                    <th className="text-center py-2 px-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TXS.map(tx=>(
                    <tr key={tx.id} className={`border-b ${t.border}`}>
                      <td className={`py-3 px-5 ${t.text.primary}`}>{tx.name}</td>
                      <td className={`py-3 px-5 ${t.text.secondary}`}>{tx.acc}</td>
                      <td className={`py-3 px-5 ${t.text.secondary}`}>{tx.date} — {tx.time}</td>
                      <td className={`py-3 px-5 text-right ${tx.amount>=0?cls.success:cls.danger}`}>
                        {tx.amount>=0?"+":"-"}${Math.abs(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-5 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${tx.status==="Completed"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`}>
                          <CheckCircle2 className="w-3 h-3"/>{tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Right rail */}
        <aside className="col-span-3 space-y-6">
          {/* Search + profile */}
          <div className={cls.card + " p-4"}>
            <div className="flex items-center gap-2">
              <Search className={`w-4 h-4 ${t.text.muted}`} />
              <input className={cls.input} placeholder="Search placeholder" />
            </div>
            <div className="mt-3 flex items-center gap-2 justify-end">
              <button className={cls.btn}><Settings className="w-4 h-4" /></button>
              <button className={cls.btn}><Bell className="w-4 h-4" /></button>
              <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center">A</div>
            </div>
          </div>

          {/* Finance score */}
          <div className={cls.card + " p-5"}>
            <div className={cls.h2}>Finance Score</div>
            <div className={`${cls.muted} mt-1`}>Finance Quality</div>
            <div className={`text-xl font-semibold mt-1 ${t.text.primary}`}>Excellent</div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <div className={t.text.secondary}>Score</div>
                <div className={t.text.secondary}>{financeScore}%</div>
              </div>
              <Progress value={financeScore} max={100} color="#22c55e" />
            </div>
          </div>

          {/* Balance cards */}
          <div className={cls.card + " p-5"}>
            <div className={cls.h2}>Balance</div>
            <div className={`${cls.muted} mt-1`}>Total Balance</div>
            <div className={`text-xl font-semibold ${t.text.primary}`}>${(1_377_000).toLocaleString("en-US")}</div>

            <div className="mt-4 space-y-3">
              {[
                { brand: "Platinum Plus Visa", value: 415000 },
                { brand: "Freedom Mastercard", value: 532000 },
              ].map((c,i)=>(
                <div key={i} className={`flex items-center justify-between rounded-xl border ${t.border} ${t.card} p-3`}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-14 rounded-md bg-emerald-600/10 grid place-items-center text-emerald-700">VISA</div>
                    <div>
                      <div className={t.text.primary}>{c.brand}</div>
                      <div className={cls.muted}>4532 8723 3045 9987</div>
                    </div>
                  </div>
                  <div className={`text-sm ${t.text.primary}`}>${c.value.toLocaleString("en-US")}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Saving plans */}
          <div className={cls.card + " p-5"}>
            <SectionHeader cls={cls} title="Saving Plans" right={<button className={cls.btn}>+ Add Plans</button>}/>
            <div className={`${cls.muted} mb-1`}>Total Savings</div>
            <div className={`text-xl font-semibold ${t.text.primary}`}>${(12_000).toLocaleString("en-US")}</div>
            <div className="mt-4 space-y-4">
              {SAVINGS.map((s)=>(
                <div key={s.label}>
                  <div className="flex items-center justify-between text-sm">
                    <div className={t.text.secondary}>{s.label}</div>
                    <div className={t.text.secondary}>${s.now.toLocaleString("en-US")} / ${s.max.toLocaleString("en-US")}</div>
                  </div>
                  <Progress value={s.now} max={s.max} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent activities */}
          <div className={cls.card + " p-5"}>
            <SectionHeader cls={cls} title="Recent Activities" />
            <div className="space-y-3">
              {[
                { when: "Today", items: [
                  { icon: Bell, text: "Reviewed alerts for low balance" },
                  { icon: Shield, text: "Checked account balance" },
                  { icon: LogOut, text: "Logged in from mobile device" },
                ]},
                { when: "Yesterday", items: [
                  { icon: Clock, text: "Scheduled a recurring utility payment" },
                  { icon: CreditCard, text: "Updated payment method" },
                ]},
              ].map(group=>(
                <div key={group.when}>
                  <div className={`text-xs mb-1 ${t.text.muted}`}>{group.when}</div>
                  <div className="space-y-2">
                    {group.items.map((it,i)=>(
                      <div key={i} className={`flex items-center gap-3 rounded-lg ${t.soft} px-3 py-2`}>
                        <it.icon className={`w-4 h-4 ${t.text.secondary}`} />
                        <div className={`text-sm ${t.text.secondary}`}>{it.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-5 pb-8">
        <div className={`text-xs ${t.text.muted} flex items-center justify-between`}>
          <div>Copyright © 2025 CasaDividendes</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:opacity-80">Privacy Policy</a>
            <a href="#" className="hover:opacity-80">Terms</a>
            <a href="#" className="hover:opacity-80">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
