// src/pages/Dashboard.jsx
// Phase 1 — Tokens dans le fichier + transitions fluides + lisibilité Light + icônes CasaDividendes
// Conserve la logique existante (localStorage store + dataService pour données réelles)

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart, Bar,
  CartesianGrid, XAxis, YAxis,
  Tooltip as RTooltip, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Plus, Search, Layers, PieChart as PieIcon, BarChart2, Wallet,
  TrendingUp, ArrowLeftRight, Edit2, Trash2, Info, ChevronRight,
  Building2, Banknote, PiggyBank, Percent, Upload, Settings,
  LifeBuoy, LogOut, Sun, Moon
} from "lucide-react";

import { getCompanies, getAllDividends } from "../services/dataService"; // TODO: garder ce chemin
import { DATA_YEARS } from "../constants/paths"; // TODO: garder ce chemin

/* ===========================================================
   0) TOKENS — palette + styles centralisés (inline)
   =========================================================== */
const TOKENS = {
  light: {
    pageBg: "bg-[#F6F8FB]", // plus clair que #F5F7FA
    textPrimary: "text-[#0F1115]", // très lisible
    textSecondary: "text-[#374151]", // gris foncé pour le corps
    textMuted: "text-[#6B7280]", // légende / aides
    cardBg: "bg-white",
    surface: "bg-[#F9FAFB]", // surfaces claires (mini-stats)
    border: "border-[rgba(15,17,21,0.06)]",
    gridStroke: "rgba(0,0,0,0.05)",
    tooltipBg: "#FFFFFF",
    tooltipFg: "#0F1115",
    tooltipBorder: "rgba(15,17,21,0.10)",
    iconAccent: "text-emerald-600",
    pillActive: "bg-[#0F1115] text-white",
    pillHover: "hover:bg-[#EEF2F7]",
    input: "bg-white text-[#0F1115] border-[rgba(15,17,21,0.10)] placeholder:text-[#9CA3AF]",
    hoverSoft: "hover:bg-[#EEF2F7]",
    kpiBadge: "bg-emerald-50 text-emerald-700",
  },
  dark: {
    pageBg: "bg-ink-950", // déjà présent dans ton preset
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
    textMuted: "text-gray-400",
    cardBg: "bg-ink-900",
    surface: "bg-ink-800",
    border: "border-white/10",
    gridStroke: "rgba(255,255,255,0.08)",
    tooltipBg: "#0F1115",
    tooltipFg: "#F3F4F6",
    tooltipBorder: "rgba(255,255,255,0.12)",
    iconAccent: "text-brand-teal",
    pillActive: "bg-emerald-600 text-white",
    pillHover: "hover:bg-white/10",
    input: "bg-ink-900 text-white border-white/10 placeholder:text-gray-500",
    hoverSoft: "hover:bg-white/5",
    kpiBadge: "bg-emerald-900/30 text-emerald-200",
  },
};

const THEME_KEY = "cd_dashboard_theme";

/* ===========================================================
   1) Helpers
   =========================================================== */
const fmtMAD = (n) =>
  typeof n === "number"
    ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(n)} MAD`
    : "—";
const fmtNum = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)
    : "—";
const fmtPct = (n) => (typeof n === "number" ? `${(n * 100).toFixed(1)}%` : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");
const monthLabel = (i) => new Date(2025, i, 1).toLocaleString("fr-FR", { month: "short" });
const nowYear = new Date().getFullYear();
const COLORS = ["#14b8a6","#64748b","#f59e0b","#ef4444","#22c55e","#06b6d4","#a855f7","#84cc16","#f97316","#3b82f6"];
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/* ===========================================================
   2) Theme hook — gère tokens + transitions
   =========================================================== */
function useThemeTokens() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || inferPref());
  useEffect(() => { localStorage.setItem(THEME_KEY, theme); }, [theme]);
  const isDark = theme === "dark";
  const t = isDark ? TOKENS.dark : TOKENS.light;

  // Wrap d’icône accentué (CasaDividendes teal)
  const IconWrap = ({ children }) => (
    <div className={`h-11 w-11 grid place-items-center rounded-xl ${isDark ? "bg-ink-800 text-brand-teal" : "bg-emerald-50 text-emerald-600"} shadow-[0_8px_30px_rgba(16,185,129,0.25)] transition-colors duration-300`}>
      {children}
    </div>
  );

  // Classes utilitaires unifiées + transitions
  const cls = {
    page: `${t.pageBg} transition-colors duration-300`,
    card: `rounded-[18px] ${t.cardBg} border ${t.border} shadow-[0_1px_0_rgba(0,0,0,0.03),0_12px_40px_rgba(0,0,0,0.06)] p-4 transition-colors duration-300`,
    surfaceCard: `rounded-xl ${t.surface} border ${t.border} p-3 transition-colors duration-300`,
    textPrimary: `${t.textPrimary} transition-colors duration-300`,
    textSecondary: `${t.textSecondary} transition-colors duration-300`,
    textMuted: `${t.textMuted} transition-colors duration-300`,
    input: `w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300/60 ${t.input} transition-colors duration-300`,
    btnPrimary: `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 px-3.5 py-2 transition-colors duration-200`,
    btnSoft: `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium ${t.cardBg} border ${t.border} ${t.textSecondary} px-3.5 py-2 transition-colors duration-200`,
    btnGhost: `inline-flex items-center justify-center gap-2 rounded-xl text-sm ${t.textSecondary} ${t.pillHover} px-3 py-2 transition-colors duration-200`,
    iconAccent: t.iconAccent,
    pillActive: `${t.pillActive} transition-colors duration-300`,
    hoverSoft: `${t.hoverSoft} transition-colors duration-200`,
    kpiBadge: `${t.kpiBadge} inline-flex items-center rounded-md px-2 py-0.5 text-xs`,
  };

  return { theme, setTheme, isDark, t, cls, IconWrap };
}

// détection initiale du thème système
function inferPref() {
  try {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch { return "light"; }
}

/* ===========================================================
   3) Local store (comptes, holdings, activités)
   =========================================================== */
const STORE_KEY = "cd_dashboard_store_oripiofin";
const defaultState = { accounts: [], holdings: [], activities: [] };

function usePortfolioStore() {
  const [state, setState] = useState(() => {
    try { const raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : defaultState; }
    catch { return defaultState; }
  });
  useEffect(() => { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }, [state]);

  const addAccount = (acc) => setState((s) => ({ ...s, accounts: [...s.accounts, acc] }));
  const updateAccount = (id, patch) => setState((s) => ({ ...s, accounts: s.accounts.map(a => a.id===id?{...a,...patch}:a) }));
  const removeAccount = (id) => setState((s) => ({
    ...s,
    accounts: s.accounts.filter(a => a.id !== id),
    holdings: s.holdings.filter(h => h.accountId !== id),
    activities: s.activities.filter(a => a.accountId !== id),
  }));

  const addActivity = (a) => setState((s) => ({ ...s, activities: [a, ...s.activities] }));
  const deposit = (accountId, amount, date=new Date().toISOString()) => setState((s)=>({
    ...s,
    accounts: s.accounts.map(a=>a.id===accountId?{...a,balance:(a.balance||0)+amount}:a),
    activities: [{id:uid(), type:"DEPOSIT", date, accountId, amount}, ...s.activities],
  }));
  const withdraw = (accountId, amount, date=new Date().toISOString()) => setState((s)=>({
    ...s,
    accounts: s.accounts.map(a=>a.id===accountId?{...a,balance:(a.balance||0)-amount}:a),
    activities: [{id:uid(), type:"WITHDRAW", date, accountId, amount:-amount}, ...s.activities],
  }));
  const transfer = (fromId, toId, amount, date=new Date().toISOString()) => setState((s)=>({
    ...s,
    accounts: s.accounts.map(a=>{
      if(a.id===fromId) return {...a,balance:(a.balance||0)-amount};
      if(a.id===toId) return {...a,balance:(a.balance||0)+amount};
      return a;
    }),
    activities: [{id:uid(), type:"TRANSFER", date, amount, meta:{fromId,toId}}, ...s.activities],
  }));

  const addHolding = (h) => setState((s)=>({ ...s, holdings:[h, ...s.holdings]}));
  const updateHolding = (id,patch)=>setState((s)=>({ ...s, holdings:s.holdings.map(h=>h.id===id?{...h,...patch}:h)}));
  const removeHolding = (id)=>setState((s)=>({ ...s, holdings:s.holdings.filter(h=>h.id!==id)}));

  const buyLot = (holdingId, {date,quantity,price,fees=0}, accountId) => setState((s)=>{
    const h = s.holdings.find(x=>x.id===holdingId); if(!h) return s;
    const upd = {...h, lots:[...(h.lots||[]), {date,quantity:+quantity,price:+price,fees:+fees}]};
    return {
      ...s,
      holdings: s.holdings.map(x=>x.id===holdingId?upd:x),
      activities: [{id:uid(), type:"BUY", date, accountId, ticker:h.ticker, amount: quantity*price+(+fees||0)}, ...s.activities],
    };
  });
  const sellLot = (holdingId, {date,quantity,price}, accountId) => setState((s)=>{
    const h = s.holdings.find(x=>x.id===holdingId); if(!h) return s;
    const upd = {...h, sells:[...(h.sells||[]), {date,quantity:+quantity,price:+price}]};
    return {
      ...s,
      holdings: s.holdings.map(x=>x.id===holdingId?upd:x),
      activities: [{id:uid(), type:"SELL", date, accountId, ticker:h.ticker, amount: quantity*price}, ...s.activities],
    };
  });

  return { state, addAccount, updateAccount, removeAccount, deposit, withdraw, transfer,
           addHolding, updateHolding, removeHolding, buyLot, sellLot, addActivity };
}

/* ===========================================================
   4) External data hooks
   =========================================================== */
function useCompanies() {
  const [companies, setCompanies] = useState([]);
  useEffect(()=>{(async()=>{
    try{ setCompanies(await getCompanies() || []);} catch(e){ console.error(e);}
  })();},[]);
  return companies;
}
function useDividends(years) {
  const [rows,setRows] = useState([]);
  useEffect(()=>{(async()=>{
    try{ setRows(await getAllDividends(years) || []);} catch(e){ console.error(e);}
  })();},[JSON.stringify(years)]);
  return rows;
}

/* ===========================================================
   5) Math utils (positions)
   =========================================================== */
const currentQty = (h)=> (h.lots||[]).reduce((s,l)=>s+ +l.quantity,0) - (h.sells||[]).reduce((s,l)=>s+ +l.quantity,0);
const avgCost = (h)=>{ const q=(h.lots||[]).reduce((s,l)=>s+ +l.quantity,0); const c=(h.lots||[]).reduce((s,l)=>s + (+l.quantity*+l.price + (+l.fees||0)),0); return q>0?c/q:0; };
const investedNet = (h)=> (h.lots||[]).reduce((s,l)=>s + (+l.quantity*+l.price + (+l.fees||0)),0) - (h.sells||[]).reduce((s,l)=>s + +l.quantity*+l.price,0);
const valueEst = (h)=> currentQty(h) * avgCost(h);
const qtyAtDate = (h, dateISO)=> {
  const t = new Date(dateISO).getTime();
  const b = (h.lots||[]).reduce((s,l)=> s + (new Date(l.date).getTime()<=t ? +l.quantity:0),0);
  const s = (h.sells||[]).reduce((ss,l)=> ss + (new Date(l.date).getTime()<=t ? +l.quantity:0),0);
  return b-s;
};

/* ===========================================================
   6) UI primitives
   =========================================================== */
const Field = ({ label, children, cls }) => (
  <label className="block">
    <span className={`text-xs ${cls.textMuted}`}>{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);
const Modal = ({ title, onClose, children, cls }) => (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
    <div className={`w-full max-w-2xl rounded-2xl ${TOKENS.dark.cardBg} md:transition-none ${TOKENS.dark.border} ${TOKENS.dark.cardBg.includes("ink") ? "" : ""}`}>
      <div className={`flex items-center justify-between px-5 py-4 border ${TOKENS.dark.border}`}>
        <h3 className={`font-semibold text-white`}>{title}</h3>
        <button onClick={onClose} className={`text-gray-300 rounded-lg p-1`}>✕</button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);
const Card = ({ children, cls, className = "" }) => (
  <div className={`${cls.card} ${className}`}>{children}</div>
);
const EmptyHint = ({ text, cls }) => (
  <div className={`rounded-xl border ${TOKENS.light.border} ${TOKENS.light.cardBg} p-3 text-sm ${TOKENS.light.textSecondary}`}>{text}</div>
);

/* ===========================================================
   7) Forms
   =========================================================== */
function WalletForm({ init, onClose, onSubmit, cls }) {
  const [name, setName] = useState(init?.name || "");
  const [currency, setCurrency] = useState(init?.currency || "MAD");
  const [balance, setBalance] = useState(init?.balance ?? 0);

  return (
    <Modal title={init ? "Modifier le compte" : "Nouveau compte"} onClose={onClose} cls={cls}>
      <div className="space-y-3">
        <Field label="Nom" cls={cls}>
          <input className={cls.input} value={name} onChange={(e)=>setName(e.target.value)} placeholder="CTO / Banque…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Devise" cls={cls}>
            <select className={cls.input} value={currency} onChange={(e)=>setCurrency(e.target.value)}>
              <option>MAD</option><option>USD</option><option>EUR</option><option>GBP</option>
            </select>
          </Field>
          <Field label="Solde initial" cls={cls}>
            <input type="number" className={cls.input} value={balance} onChange={(e)=>setBalance(parseFloat(e.target.value))}/>
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <button className={cls.btnSoft} onClick={onClose}>Annuler</button>
          <button
            className={cls.btnPrimary}
            onClick={()=>onSubmit({
              id: init?.id || uid(),
              name: name.trim() || "Compte",
              currency, balance: +balance || 0,
              createdAt: init?.createdAt || new Date().toISOString(),
            })}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </Modal>
  );
}

function TransferForm({ accounts, onClose, onSubmit, cls }) {
  const [fromId, setFromId] = useState(accounts[0]?.id || "");
  const [toId, setToId] = useState(accounts[1]?.id || "");
  const [amount, setAmount] = useState(0);

  return (
    <Modal title="Virement interne" onClose={onClose} cls={cls}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Depuis" cls={cls}>
            <select className={cls.input} value={fromId} onChange={(e)=>setFromId(e.target.value)}>
              {accounts.map(a=><option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </Field>
          <Field label="Vers" cls={cls}>
            <select className={cls.input} value={toId} onChange={(e)=>setToId(e.target.value)}>
              {accounts.map(a=><option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </Field>
        </div>
        <Field label="Montant" cls={cls}>
          <input type="number" className={cls.input} value={amount} onChange={(e)=>setAmount(parseFloat(e.target.value))}/>
        </Field>
        <div className="flex justify-end gap-2">
          <button className={cls.btnSoft} onClick={onClose}>Annuler</button>
          <button className={cls.btnPrimary} onClick={()=>onSubmit(fromId,toId,+amount||0)}>Transférer</button>
        </div>
      </div>
    </Modal>
  );
}

function HoldingForm({ accounts, tickers, init, onClose, onSubmit, cls }) {
  const [ticker, setTicker] = useState(init?.ticker || tickers[0] || "");
  const [accountId, setAccountId] = useState(init?.accountId || accounts[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [fees, setFees] = useState(0);
  const [strategy, setStrategy] = useState(init?.strategy || "Income");
  const [notes, setNotes] = useState(init?.notes || "");

  return (
    <Modal title={init ? "Modifier la position" : "Nouvelle position"} onClose={onClose} cls={cls}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Ticker" cls={cls}>
            <select className={cls.input} value={ticker} onChange={(e)=>setTicker(e.target.value)}>
              {tickers.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Compte" cls={cls}>
            <select className={cls.input} value={accountId} onChange={(e)=>setAccountId(e.target.value)}>
              {accounts.map(a=><option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </Field>
          <Field label="Date d’achat" cls={cls}>
            <input type="date" className={cls.input} value={date} onChange={(e)=>setDate(e.target.value)}/>
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Quantité" cls={cls}><input type="number" className={cls.input} value={quantity} onChange={(e)=>setQuantity(parseFloat(e.target.value))}/></Field>
          <Field label="Prix" cls={cls}><input type="number" className={cls.input} value={price} onChange={(e)=>setPrice(parseFloat(e.target.value))}/></Field>
          <Field label="Frais" cls={cls}><input type="number" className={cls.input} value={fees} onChange={(e)=>setFees(parseFloat(e.target.value))}/></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Stratégie" cls={cls}>
            <select className={cls.input} value={strategy} onChange={(e)=>setStrategy(e.target.value)}>
              <option>Income</option><option>Long-term</option><option>Swing</option>
            </select>
          </Field>
          <Field label="Notes" cls={cls}><input className={cls.input} value={notes} onChange={(e)=>setNotes(e.target.value)}/></Field>
        </div>
        <div className="flex justify-end gap-2">
          <button className={cls.btnSoft} onClick={onClose}>Annuler</button>
          <button
            className={cls.btnPrimary}
            onClick={()=>onSubmit({
              id: init?.id || uid(),
              ticker, accountId, strategy, notes,
              lots:[...(init?.lots||[]), {date, quantity:+quantity||0, price:+price||0, fees:+fees||0}],
              sells: init?.sells || [],
              createdAt: init?.createdAt || new Date().toISOString(),
            })}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ===========================================================
   8) Page
   =========================================================== */
export default function Dashboard() {
  const { theme, setTheme, isDark, cls, IconWrap, t } = useThemeTokens();
  const store = usePortfolioStore();
  const { accounts, holdings, activities } = store.state;

  const companies = useCompanies();
  const tickers = useMemo(()=> companies.map(c=>(c.ticker||"").toUpperCase()).filter(Boolean).sort(),[companies]);
  const dividendsYTD = useDividends([nowYear]);
  const dividendsAll = useDividends(DATA_YEARS);

  // UI state
  const [showWallet, setShowWallet] = useState(false);
  const [editWallet, setEditWallet] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showHolding, setShowHolding] = useState(false);
  const [editHolding, setEditHolding] = useState(null);

  // Aggregates
  const cashMAD = useMemo(()=>accounts.filter(a=>a.currency==="MAD").reduce((s,a)=>s+(a.balance||0),0),[accounts]);
  const hasForeign = useMemo(()=>accounts.some(a=>a.currency!=="MAD"),[accounts]);
  const invested = useMemo(()=>holdings.reduce((s,h)=>s+investedNet(h),0),[holdings]);
  const portValue = useMemo(()=>holdings.reduce((s,h)=>s+valueEst(h),0)+cashMAD,[holdings,cashMAD]);
  const plAbs = useMemo(()=> portValue - invested, [portValue, invested]);
  const plRel = useMemo(()=> invested>0 ? plAbs/invested : 0, [plAbs, invested]);
  const linesCount = useMemo(()=> holdings.filter(h=>currentQty(h)>0).length, [holdings]);

  const ytdDividends = useMemo(()=>{
    const mapH = new Map(holdings.map(h=>[h.ticker.toUpperCase(),h]));
    let tSum = 0;
    for(const d of dividendsYTD){
      const h = mapH.get((d.ticker||"").toUpperCase());
      if(!h || !d.exDate) continue;
      const q = qtyAtDate(h, d.exDate);
      if(q>0 && typeof d.amount==="number") tSum += q * d.amount;
    }
    return tSum;
  },[dividendsYTD, holdings]);

  const cashflow = useMemo(()=>{
    const buckets = Array.from({length:12},(_,i)=>({m:monthLabel(i), inflow:0, outflow:0}));
    for(const a of activities){
      const d = new Date(a.date); if(d.getFullYear()!==nowYear) continue;
      const i = d.getMonth(); const amt = a.amount||0;
      if(["DEPOSIT","TRANSFER","SELL"].includes(a.type)) amt>=0 ? buckets[i].inflow+=amt : buckets[i].outflow+=amt;
      if(["WITHDRAW","BUY"].includes(a.type)) amt>=0 ? buckets[i].outflow+=amt : buckets[i].inflow+=Math.abs(amt);
    }
    const mapH = new Map(holdings.map(h=>[h.ticker.toUpperCase(),h]));
    for(const d of dividendsYTD){
      const i = new Date(d.exDate || d.paymentDate || Date.now()).getMonth();
      const h = mapH.get((d.ticker||"").toUpperCase());
      if(!h) continue;
      const q = d.exDate ? qtyAtDate(h,d.exDate) : currentQty(h);
      if(q>0 && typeof d.amount==="number") buckets[i].inflow += q*d.amount;
    }
    return buckets;
  },[activities, dividendsYTD, holdings]);

  const allocation = useMemo(()=>{
    const tv = holdings.reduce((s,h)=>s+valueEst(h),0)||1;
    return holdings
      .map(h=>({ticker:h.ticker, value:valueEst(h), weight:valueEst(h)/tv}))
      .sort((a,b)=>b.value-a.value).slice(0,8);
  },[holdings]);

  const sectorByTicker = useMemo(()=>{
    const m = new Map();
    companies.forEach(c=>m.set((c.ticker||"").toUpperCase(), c.sector || "Autres"));
    return m;
  },[companies]);

  const sectorDonut = useMemo(()=>{
    const map = new Map(); let tot=0;
    for(const h of holdings){
      const s = sectorByTicker.get((h.ticker||"").toUpperCase()) || "Autres";
      const v = valueEst(h); map.set(s,(map.get(s)||0)+v); tot+=v;
    }
    return Array.from(map.entries()).map(([name,v])=>({name,value:+v.toFixed(2),pct:v/(tot||1)})).sort((a,b)=>b.value-a.value);
  },[holdings, sectorByTicker]);

  const upcoming = useMemo(()=>{
    const now = new Date(); const in60 = new Date(now.getTime()+60*24*60*60*1000);
    const mapH = new Map(holdings.map(h=>[h.ticker.toUpperCase(),h]));
    return dividendsAll.filter(d=>{
      const tkr = (d.ticker||"").toUpperCase(); const h = mapH.get(tkr); if(!h) return false;
      const ref = d.exDate? new Date(d.exDate) : d.paymentDate? new Date(d.paymentDate) : null; if(!ref) return false;
      return ref>=now && ref<=in60 && qtyAtDate(h, d.exDate||d.paymentDate) > 0;
    }).sort((a,b)=> new Date(a.exDate||a.paymentDate) - new Date(b.exDate||b.paymentDate)).slice(0,8);
  },[dividendsAll, holdings]);

  return (
    <div className={`min-h-[calc(100vh-64px)] ${cls.page}`}>
      <div className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3 xl:col-span-2">
            <div className={cls.card + " sticky top-6"}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`h-9 w-9 rounded-xl grid place-items-center font-semibold ${cls.pillActive}`}>CD</div>
                  <div className={`font-semibold ${cls.textPrimary}`}>CasaDividendes</div>
                </div>
                <button
                  className={cls.btnGhost}
                  onClick={()=> setTheme(isDark? "light":"dark")}
                  title={isDark? "Passer en clair":"Passer en sombre"}
                >
                  {isDark? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
                </button>
              </div>

              <div className="relative mb-4">
                <Search className={`w-4 h-4 ${cls.textMuted} absolute left-3 top-1/2 -translate-y-1/2`} />
                <input className={cls.input} placeholder="Search" style={{ paddingLeft: 36 }} />
              </div>

              <nav className="space-y-1">
                {[
                  { label: "Dashboard", icon: Layers, active:true },
                  { label: "Analytics", icon: BarChart2 },
                  { label: "Transactions", icon: Wallet },
                  { label: "Invoices", icon: Upload },
                ].map((m)=>(
                  <a key={m.label} href="#"
                     className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${m.active ? cls.pillActive : cls.btnGhost} !justify-start`}>
                    <m.icon className="w-4 h-4"/>
                    <span className="text-sm">{m.label}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-5">
                <div className={`text-xs font-semibold ${cls.textMuted} mb-2`}>FEATURES</div>
                <div className="space-y-1">
                  {[{label:"Recurring",icon:PieIcon},{label:"Subscriptions",icon:Wallet},{label:"Feedback",icon:Info}].map(m=>(
                    <a key={m.label} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${cls.btnGhost}`}>
                      <m.icon className="w-4 h-4"/><span className="text-sm">{m.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className={`text-xs font-semibold ${cls.textMuted} mb-2`}>GENERAL</div>
                <div className="space-y-1">
                  {[{label:"Settings",icon:Settings},{label:"Help Desk",icon:LifeBuoy},{label:"Log out",icon:LogOut}].map(m=>(
                    <a key={m.label} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${cls.btnGhost}`}>
                      <m.icon className="w-4 h-4"/><span className="text-sm">{m.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className={`mt-6 rounded-xl border ${TOKENS.light.border} p-4 ${isDark ? "bg-ink-800":"bg-emerald-50"} transition-colors duration-300`}>
                <div className={`text-sm font-medium ${cls.textPrimary}`}>Upgrade Pro! 🔔</div>
                <p className={`text-xs ${cls.textMuted} mt-1`}>Higher productivity with better organization</p>
                <button className={`${cls.btnPrimary} mt-3 w-full py-2`}>Upgrade</button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="col-span-9 xl:col-span-10 space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card cls={cls}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm ${cls.textMuted}`}>Valeur du portefeuille</div>
                    <div className={`text-2xl font-semibold mt-1 ${cls.textPrimary}`}>{fmtMAD(portValue)}</div>
                    <div className={`mt-1 ${cls.kpiBadge}`}><span>Actions + OPCVM (PRU) + Cash MAD</span></div>
                  </div>
                  <IconWrap><PiggyBank className={`w-5 h-5 ${cls.iconAccent}`}/></IconWrap>
                </div>
              </Card>

              <Card cls={cls}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm ${cls.textMuted}`}>P/L total</div>
                    <div className={`text-2xl font-semibold mt-1 ${cls.textPrimary}`}>
                      {fmtMAD(plAbs)} <span className={`text-sm ${cls.textMuted}`}>({fmtPct(plRel)})</span>
                    </div>
                    <div className={`text-xs mt-1 ${cls.textMuted}`}>vs. capital investi</div>
                  </div>
                  <IconWrap><TrendingUp className={`w-5 h-5 ${cls.iconAccent}`}/></IconWrap>
                </div>
              </Card>

              <Card cls={cls}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm ${cls.textMuted}`}>Dividendes YTD</div>
                    <div className={`text-2xl font-semibold mt-1 ${cls.textPrimary}`}>{fmtMAD(ytdDividends)}</div>
                    <div className={`text-xs mt-1 ${cls.textMuted}`}>Année {nowYear}</div>
                  </div>
                  <IconWrap><Banknote className={`w-5 h-5 ${cls.iconAccent}`}/></IconWrap>
                </div>
              </Card>
            </div>

            {/* Wallet + Cashflow */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <Card cls={cls} className="xl:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={`text-sm font-medium ${cls.textPrimary}`}>My Wallet</div>
                    <div className={`text-xs ${cls.textMuted}`}>Cash (MAD only)</div>
                  </div>
                  <div className="flex gap-2">
                    <button className={cls.btnSoft} onClick={()=>setShowWallet(true)}><Plus className="w-4 h-4"/> Ajouter</button>
                    <button className={cls.btnSoft} onClick={()=>setShowTransfer(true)} disabled={accounts.length<2}>
                      <ArrowLeftRight className="w-4 h-4"/> Virement
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {accounts.map(a=>(
                    <div key={a.id} className={`rounded-xl border ${TOKENS.light.border} ${TOKENS.light.cardBg} p-3 flex items-start justify-between transition-colors duration-300`}>
                      <div>
                        <div className={`text-xs ${cls.textMuted}`}>{a.name}</div>
                        <div className={`text-lg font-semibold mt-0.5 ${cls.textPrimary}`}>{fmtNum(a.balance)} {a.currency}</div>
                      </div>
                      <div className="flex gap-1">
                        <button className={`rounded-lg p-2 ${TOKENS.light.pageBg ? "hover:bg-[#EEF2F7]" : ""}`} onClick={()=>{setEditWallet(a); setShowWallet(true);}}>
                          <Edit2 className={`w-4 h-4 ${cls.textSecondary}`}/>
                        </button>
                        <button className={`rounded-lg p-2 ${TOKENS.light.pageBg ? "hover:bg-[#EEF2F7]" : ""}`} onClick={()=>store.removeAccount(a.id)}>
                          <Trash2 className={`w-4 h-4 ${cls.textSecondary}`}/>
                        </button>
                      </div>
                    </div>
                  ))}
                  {!accounts.length && <EmptyHint text="Create your first cash account." cls={cls}/>}
                  <div className={`text-xs mt-1 ${cls.textMuted}`}>{hasForeign ? "MAD aggregated — other currencies excluded (—)" : "All accounts included"}</div>
                </div>
              </Card>

              <Card cls={cls} className="xl:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-sm font-medium ${cls.textPrimary}`}>Cash Flow</div>
                  <div className={`text-xs ${cls.textMuted}`}>Mensuel • {nowYear}</div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer>
                    <BarChart data={cashflow}>
                      <CartesianGrid stroke={TOKENS.dark.gridStroke} vertical={false}/>
                      <XAxis dataKey="m" stroke={isDark?"#D1D5DB":"#374151"}/>
                      <YAxis stroke={isDark?"#D1D5DB":"#374151"}/>
                      <Legend/>
                      <RTooltip contentStyle={{
                        background: TOKENS.light.tooltipBg,
                        color: TOKENS.light.tooltipFg,
                        border: `1px solid ${TOKENS.light.tooltipBorder}`,
                        borderRadius: 12
                      }}
                        formatter={(v,n)=>[fmtMAD(v), n==="inflow"?"Entrées":"Sorties"]}
                      />
                      <Bar dataKey="inflow" name="Entrées" fill="#14b8a6" radius={[6,6,0,0]}/>
                      <Bar dataKey="outflow" name="Sorties" fill="#f59e0b" radius={[6,6,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Positions */}
            <Card cls={cls}>
              <div className="flex items-center justify-between mb-3">
                <div className={`text-sm font-medium ${cls.textPrimary}`}>Mes positions</div>
                <button className={cls.btnPrimary} onClick={()=>setShowHolding(true)}><Plus className="w-4 h-4"/> Ajouter une ligne</button>
              </div>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${cls.textMuted} border ${TOKENS.light.border}`}>
                      <th className="py-2 text-left">Ticker</th>
                      <th className="py-2 text-left">Compte</th>
                      <th className="py-2 text-right">Qté</th>
                      <th className="py-2 text-right">PRU</th>
                      <th className="py-2 text-right">Valeur</th>
                      <th className="py-2 text-right">P/L</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map(h=>{
                      const acc = accounts.find(a=>a.id===h.accountId);
                      const q=currentQty(h), pru=avgCost(h), val=valueEst(h), inv=investedNet(h), pl=val-inv;
                      return (
                        <tr key={h.id} className={`border-b ${TOKENS.light.border}`}>
                          <td className={`py-2 font-semibold ${cls.textPrimary}`}>{h.ticker}</td>
                          <td className={`py-2 ${cls.textSecondary}`}>{acc?`${acc.name} (${acc.currency})`:"—"}</td>
                          <td className={`py-2 text-right ${cls.textSecondary}`}>{fmtNum(q)}</td>
                          <td className={`py-2 text-right ${cls.textSecondary}`}>{fmtMAD(pru)}</td>
                          <td className={`py-2 text-right ${cls.textSecondary}`}>{fmtMAD(val)}</td>
                          <td className={`py-2 text-right ${cls.textSecondary}`}>
                            {fmtMAD(pl)} <span className={`text-xs ${cls.textMuted}`}>({fmtPct(inv>0?pl/inv:0)})</span>
                          </td>
                          <td className="py-2 text-right">
                            <a href={`#/company/${h.ticker}`} className={`${cls.btnGhost} text-xs`}>Ouvrir <ChevronRight className="w-3 h-3"/></a>
                            <button className={`${cls.btnGhost} text-xs`} onClick={()=>{setEditHolding(h); setShowHolding(true);}}>
                              <Edit2 className="w-3 h-3"/>
                            </button>
                            <button className={`${cls.btnGhost} text-xs`} onClick={()=>store.removeHolding(h.id)}>
                              <Trash2 className="w-3 h-3"/>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {!holdings.length && (
                      <tr>
                        <td colSpan={7} className={`py-6 ${cls.textSecondary}`}>Aucune position. Ajoutez votre première ligne.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
                <MiniStat icon={Building2} title="Investi" value={fmtMAD(invested)} cls={cls}/>
                <MiniStat icon={Wallet} title="Cash (MAD)" value={fmtMAD(cashMAD)} cls={cls}/>
                <MiniStat icon={Percent} title="Lignes actives" value={fmtNum(linesCount)} cls={cls}/>
              </div>
            </Card>

            {/* Split row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card cls={cls}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-sm font-medium ${cls.textPrimary}`}>Répartition sectorielle</div>
                </div>
                {sectorDonut.length ? (
                  <div className="h-[260px]">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={sectorDonut} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                          {sectorDonut.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                        </Pie>
                        <RTooltip
                          contentStyle={{
                            background: TOKENS.light.tooltipBg,
                            color: TOKENS.light.tooltipFg,
                            border: `1px solid ${TOKENS.light.tooltipBorder}`,
                            borderRadius: 12
                          }}
                          formatter={(v,n,p)=>[`${fmtMAD(v)} (${(p?.payload?.pct*100).toFixed(1)}%)`, p?.payload?.name || "Secteur"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <EmptyHint text="Ajoutez des positions pour voir la répartition." cls={cls}/>}
              </Card>

              <Card cls={cls}>
                <div className={`text-sm font-medium mb-3 ${cls.textPrimary}`}>Top allocations</div>
                <div className="space-y-2">
                  {allocation.map(a=>(
                    <div key={a.ticker} className={`rounded-xl border ${TOKENS.light.border} p-3`}>
                      <div className="flex items-center justify-between">
                        <div className={`font-medium ${cls.textPrimary}`}>{a.ticker}</div>
                        <div className={`text-sm ${cls.textSecondary}`}>{fmtMAD(a.value)}</div>
                      </div>
                      <div className={`mt-2 h-2 rounded-full ${isDark?"bg-white/10":"bg-gray-100"} overflow-hidden`}>
                        <div className="h-full rounded-full" style={{ width:`${Math.min(100,a.weight*100)}%`, background: "#14b8a6" }}/>
                      </div>
                    </div>
                  ))}
                  {!allocation.length && <EmptyHint text="Vos plus gros poids apparaîtront ici." cls={cls}/>}
                </div>
              </Card>

              <Card cls={cls}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-sm font-medium ${cls.textPrimary}`}>À venir (60 jours)</div>
                  <a href="#/calendar" className={`${cls.btnSoft} text-xs`}>Voir Calendrier</a>
                </div>
                <div className="space-y-2">
                  {upcoming.map((d,i)=>(
                    <a key={`${d.ticker}-${i}`} href={`#/company/${d.ticker}`}
                       className={`rounded-xl border ${TOKENS.light.border} p-3 flex items-center justify-between ${cls.hoverSoft}`}>
                      <div className="flex items-center gap-3">
                        <div className={`text-xs ${cls.textMuted}`}>{fmtDate(d.exDate||d.paymentDate)}</div>
                        <div className={`font-medium ${cls.textPrimary}`}>{d.ticker}</div>
                      </div>
                      <div className={`text-sm ${cls.textSecondary}`}>{typeof d.amount==="number" ? `${d.amount.toFixed(2)} / sh` : "—"}</div>
                    </a>
                  ))}
                  {!upcoming.length && <EmptyHint text="Aucune ex-date dans les 60 prochains jours." cls={cls}/>}
                </div>
              </Card>
            </div>

            {/* Activities */}
            <Card cls={cls}>
              <div className="flex items-center justify-between mb-3">
                <div className={`text-sm font-medium ${cls.textPrimary}`}>Activités récentes</div>
                <div className="flex items-center gap-2">
                  <button className={cls.btnSoft}><Search className="w-4 h-4"/> Rechercher</button>
                  <button className={cls.btnSoft}><PieIcon className="w-4 h-4"/> Filtrer</button>
                </div>
              </div>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${cls.textMuted} border ${TOKENS.light.border}`}>
                      <th className="py-2 text-left">Type</th>
                      <th className="py-2 text-left">Date</th>
                      <th className="py-2 text-left">Compte</th>
                      <th className="py-2 text-left">Ticker</th>
                      <th className="py-2 text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.slice(0,10).map(a=>{
                      const acc = accounts.find(x=>x.id===a.accountId);
                      return (
                        <tr key={a.id} className={`border-b ${TOKENS.light.border}`}>
                          <td className={`py-2 ${cls.textSecondary}`}>{a.type}</td>
                          <td className={`py-2 ${cls.textSecondary}`}>{fmtDate(a.date)}</td>
                          <td className={`py-2 ${cls.textSecondary}`}>{acc?`${acc.name} (${acc.currency})`:"—"}</td>
                          <td className={`py-2 ${cls.textSecondary}`}>{a.ticker || "—"}</td>
                          <td className={`py-2 text-right ${cls.textSecondary}`}>{fmtMAD(a.amount)}</td>
                        </tr>
                      );
                    })}
                    {!activities.length && (
                      <tr><td colSpan={5} className={`py-6 ${cls.textSecondary}`}>Aucune activité pour l’instant.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </main>
        </div>
      </div>

      {/* Modals */}
      {showWallet && (
        <WalletForm
          init={editWallet||undefined}
          onClose={()=>{setShowWallet(false); setEditWallet(null);}}
          onSubmit={(acc)=>{ if(editWallet) store.updateAccount(acc.id,acc); else store.addAccount(acc); setShowWallet(false); setEditWallet(null); }}
          cls={cls}
        />
      )}
      {showTransfer && accounts.length>=2 && (
        <TransferForm
          accounts={accounts}
          onClose={()=>setShowTransfer(false)}
          onSubmit={(from,to,amt)=>{store.transfer(from,to,amt); setShowTransfer(false);}}
          cls={cls}
        />
      )}
      {showHolding && (
        <HoldingForm
          accounts={accounts.length?accounts:[{id:"none",name:"—",currency:"MAD"}]}
          tickers={tickers.length?tickers:["IAM","ATW","BCP"]}
          init={editHolding||undefined}
          onClose={()=>{setShowHolding(false); setEditHolding(null);}}
          onSubmit={(h)=>{ if(editHolding) store.updateHolding(h.id,h); else store.addHolding(h); setShowHolding(false); setEditHolding(null); }}
          cls={cls}
        />
      )}
    </div>
  );
}

/* ===========================================================
   9) Mini Stat
   =========================================================== */
function MiniStat({ icon: Icon, title, value, cls }) {
  return (
    <div className={`rounded-xl ${TOKENS.light.surface} border ${TOKENS.light.border} p-3 flex items-center justify-between transition-colors duration-300`}>
      <div>
        <div className={`text-xs ${cls.textMuted}`}>{title}</div>
        <div className={`text-lg font-semibold mt-0.5 ${cls.textPrimary}`}>{value}</div>
      </div>
      <div className={`h-9 w-9 rounded-xl grid place-items-center ${cls.pillActive}`}>
        <Icon className="w-4 h-4"/>
      </div>
    </div>
  );
}
