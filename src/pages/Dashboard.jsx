// src/pages/Dashboard.jsx
// Dashboard with Light (default) + Dark toggle, improved contrast on light,
// and icon styling that matches CasaDividendes accents (teal/orange).
// All logic kept from previous MVP: localStorage store + real data via dataService.

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
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
import { DATA_YEARS } from "../constants/paths";

/* -------------------------------------------------------------
   Helpers (formatters, ids, math)
------------------------------------------------------------- */
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

/* -------------------------------------------------------------
   Local store
------------------------------------------------------------- */
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

  return { state, addAccount, updateAccount, removeAccount, deposit, withdraw, transfer, addActivity,
           addHolding, updateHolding, removeHolding, buyLot, sellLot };
}

/* -------------------------------------------------------------
   External data hooks
------------------------------------------------------------- */
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

/* -------------------------------------------------------------
   Math utils (positions)
------------------------------------------------------------- */
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

/* -------------------------------------------------------------
   Theme (Light default + Dark toggle)
------------------------------------------------------------- */
const THEME_KEY = "cd_dashboard_theme";
function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "light");
  useEffect(()=>{ localStorage.setItem(THEME_KEY, theme); },[theme]);
  const isDark = theme === "dark";

  // tokens
  const tok = {
    bg: isDark ? "bg-ink-950" : "bg-[#F5F7FA]",
    textPrimary: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-700",
    textMuted: isDark ? "text-gray-400" : "text-gray-500",
    cardBg: isDark ? "bg-ink-900" : "bg-white",
    cardBorder: isDark ? "border-white/10" : "border-black/[0.06]",
    cardShadow: isDark ? "shadow-[0_1px_0_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.45)]"
                       : "shadow-[0_1px_0_rgba(0,0,0,0.03),0_12px_40px_rgba(0,0,0,0.06)]",
    surface: isDark ? "bg-ink-800" : "bg-gray-50/60",
    accent: "#14b8a6",      // teal
    warm: "#f59e0b",        // amber/orange
    iconBase: isDark ? "text-brand-teal" : "text-emerald-600",
    pillActive: isDark ? "bg-emerald-600 text-white" : "bg-gray-900 text-white",
    pill: isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100",
    input: isDark
      ? "bg-ink-900 text-white border-white/10 placeholder:text-gray-500"
      : "bg-white text-gray-900 border-black/[0.08] placeholder:text-gray-400",
  };

  const IconWrap = ({ children }) => (
    <div className={`h-11 w-11 grid place-items-center rounded-xl ${isDark ? "bg-ink-800 text-brand-teal" : "bg-emerald-50 text-emerald-600"} shadow-[0_8px_30px_rgba(16,185,129,0.25)]`}>
      {children}
    </div>
  );

  return { theme, setTheme, isDark, tok, IconWrap };
}

/* -------------------------------------------------------------
   Small UI primitives
------------------------------------------------------------- */
const Field = ({ label, children, tok }) => (
  <label className="block">
    <span className={`text-xs ${tok.textMuted}`}>{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);
const Modal = ({ title, onClose, children, tok }) => (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
    <div className={`w-full max-w-2xl rounded-2xl ${tok.cardBg} border ${tok.cardBorder} ${tok.cardShadow}`}>
      <div className={`flex items-center justify-between px-5 py-4 border-b ${tok.cardBorder}`}>
        <h3 className={`font-semibold ${tok.textPrimary}`}>{title}</h3>
        <button onClick={onClose} className={`${tok.textSecondary} rounded-lg p-1`}>✕</button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);
const Card = ({ children, tok, className="" }) => (
  <div className={`rounded-[18px] ${tok.cardBg} border ${tok.cardBorder} ${tok.cardShadow} p-4 ${className}`}>{children}</div>
);
const EmptyHint = ({ text, tok }) => (
  <div className={`rounded-xl border ${tok.cardBorder} ${tok.cardBg} p-3 text-sm ${tok.textSecondary}`}>{text}</div>
);

/* -------------------------------------------------------------
   Forms
------------------------------------------------------------- */
function WalletForm({ init, onClose, onSubmit, tok }) {
  const [name, setName] = useState(init?.name || "");
  const [currency, setCurrency] = useState(init?.currency || "MAD");
  const [balance, setBalance] = useState(init?.balance ?? 0);
  const inputCls = `w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300/60 ${tok.input}`;
  const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 px-3.5 py-2`;
  const btnSoft = `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium ${tok.cardBg} border ${tok.cardBorder} ${tok.textSecondary} px-3.5 py-2`;

  return (
    <Modal title={init ? "Modifier le compte" : "Nouveau compte"} onClose={onClose} tok={tok}>
      <div className="space-y-3">
        <Field label="Nom" tok={tok}>
          <input className={inputCls} value={name} onChange={(e)=>setName(e.target.value)} placeholder="CTO / Banque…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Devise" tok={tok}>
            <select className={inputCls} value={currency} onChange={(e)=>setCurrency(e.target.value)}>
              <option>MAD</option><option>USD</option><option>EUR</option><option>GBP</option>
            </select>
          </Field>
          <Field label="Solde initial" tok={tok}>
            <input type="number" className={inputCls} value={balance} onChange={(e)=>setBalance(parseFloat(e.target.value))}/>
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <button className={btnSoft} onClick={onClose}>Annuler</button>
          <button
            className={btnPrimary}
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

function TransferForm({ accounts, onClose, onSubmit, tok }) {
  const [fromId, setFromId] = useState(accounts[0]?.id || "");
  const [toId, setToId] = useState(accounts[1]?.id || "");
  const [amount, setAmount] = useState(0);
  const inputCls = `w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300/60 ${tok.input}`;
  const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 px-3.5 py-2`;
  const btnSoft = `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium ${tok.cardBg} border ${tok.cardBorder} ${tok.textSecondary} px-3.5 py-2`;

  return (
    <Modal title="Virement interne" onClose={onClose} tok={tok}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Depuis" tok={tok}>
            <select className={inputCls} value={fromId} onChange={(e)=>setFromId(e.target.value)}>
              {accounts.map(a=><option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </Field>
          <Field label="Vers" tok={tok}>
            <select className={inputCls} value={toId} onChange={(e)=>setToId(e.target.value)}>
              {accounts.map(a=><option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </Field>
        </div>
        <Field label="Montant" tok={tok}>
          <input type="number" className={inputCls} value={amount} onChange={(e)=>setAmount(parseFloat(e.target.value))}/>
        </Field>
        <div className="flex justify-end gap-2">
          <button className={btnSoft} onClick={onClose}>Annuler</button>
          <button className={btnPrimary} onClick={()=>onSubmit(fromId,toId,+amount||0)}>Transférer</button>
        </div>
      </div>
    </Modal>
  );
}

function HoldingForm({ accounts, tickers, init, onClose, onSubmit, tok }) {
  const [ticker, setTicker] = useState(init?.ticker || tickers[0] || "");
  const [accountId, setAccountId] = useState(init?.accountId || accounts[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [fees, setFees] = useState(0);
  const [strategy, setStrategy] = useState(init?.strategy || "Income");
  const [notes, setNotes] = useState(init?.notes || "");

  const inputCls = `w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300/60 ${tok.input}`;
  const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 px-3.5 py-2`;
  const btnSoft = `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium ${tok.cardBg} border ${tok.cardBorder} ${tok.textSecondary} px-3.5 py-2`;

  return (
    <Modal title={init ? "Modifier la position" : "Nouvelle position"} onClose={onClose} tok={tok}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Ticker" tok={tok}>
            <select className={inputCls} value={ticker} onChange={(e)=>setTicker(e.target.value)}>
              {tickers.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Compte" tok={tok}>
            <select className={inputCls} value={accountId} onChange={(e)=>setAccountId(e.target.value)}>
              {accounts.map(a=><option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </Field>
          <Field label="Date d’achat" tok={tok}><input type="date" className={inputCls} value={date} onChange={(e)=>setDate(e.target.value)}/></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Quantité" tok={tok}><input type="number" className={inputCls} value={quantity} onChange={(e)=>setQuantity(parseFloat(e.target.value))}/></Field>
          <Field label="Prix" tok={tok}><input type="number" className={inputCls} value={price} onChange={(e)=>setPrice(parseFloat(e.target.value))}/></Field>
          <Field label="Frais" tok={tok}><input type="number" className={inputCls} value={fees} onChange={(e)=>setFees(parseFloat(e.target.value))}/></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Stratégie" tok={tok}>
            <select className={inputCls} value={strategy} onChange={(e)=>setStrategy(e.target.value)}>
              <option>Income</option><option>Long-term</option><option>Swing</option>
            </select>
          </Field>
          <Field label="Notes" tok={tok}><input className={inputCls} value={notes} onChange={(e)=>setNotes(e.target.value)}/></Field>
        </div>
        <div className="flex justify-end gap-2">
          <button className={btnSoft} onClick={onClose}>Annuler</button>
          <button
            className={btnPrimary}
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

/* -------------------------------------------------------------
   Page
------------------------------------------------------------- */
export default function Dashboard() {
  const { theme, setTheme, isDark, tok, IconWrap } = useTheme();
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
    let t = 0;
    for(const d of dividendsYTD){
      const h = mapH.get((d.ticker||"").toUpperCase());
      if(!h || !d.exDate) continue;
      const q = qtyAtDate(h, d.exDate);
      if(q>0 && typeof d.amount==="number") t += q * d.amount;
    }
    return t;
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
      const t = (d.ticker||"").toUpperCase(); const h = mapH.get(t); if(!h) return false;
      const ref = d.exDate? new Date(d.exDate) : d.paymentDate? new Date(d.paymentDate) : null; if(!ref) return false;
      return ref>=now && ref<=in60 && qtyAtDate(h, d.exDate||d.paymentDate) > 0;
    }).sort((a,b)=> new Date(a.exDate||a.paymentDate) - new Date(b.exDate||b.paymentDate)).slice(0,8);
  },[dividendsAll, holdings]);

  // Controls (input/button classes per theme)
  const inputCls = `w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300/60 ${tok.input}`;
  const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 px-3.5 py-2`;
  const btnSoft = `inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium ${tok.cardBg} border ${tok.cardBorder} ${tok.textSecondary} px-3.5 py-2`;
  const btnGhost = `inline-flex items-center justify-center gap-2 rounded-xl text-sm ${tok.textSecondary} hover:${isDark?"bg-white/10":"bg-gray-100"} px-3 py-2`;

  return (
    <div className={`min-h-[calc(100vh-64px)] ${tok.bg}`}>
      <div className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3 xl:col-span-2">
            <Card tok={tok} className="p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`h-9 w-9 rounded-xl grid place-items-center font-semibold ${tok.pillActive}`}>CD</div>
                  <div className={`font-semibold ${tok.textPrimary}`}>CasaDividendes</div>
                </div>
                <button
                  className={`${btnGhost}`}
                  onClick={()=> setTheme(isDark? "light":"dark")}
                  title={isDark? "Passer en clair":"Passer en sombre"}
                >
                  {isDark? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
                </button>
              </div>

              <div className="relative mb-4">
                <Search className={`w-4 h-4 ${tok.textMuted} absolute left-3 top-1/2 -translate-y-1/2`} />
                <input className={inputCls} placeholder="Search" style={{ paddingLeft: 36 }} />
              </div>

              <nav className="space-y-1">
                {[
                  { label: "Dashboard", icon: Layers, active:true },
                  { label: "Analytics", icon: BarChart2 },
                  { label: "Transactions", icon: Wallet },
                  { label: "Invoices", icon: Upload },
                ].map((m)=>(
                  <a key={m.label} href="#"
                     className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition 
                      ${m.active ? `${tok.pillActive} shadow-[0_8px_24px_rgba(2,6,23,0.2)]` : `${tok.pill}`}`}>
                    <m.icon className="w-4 h-4"/>
                    <span className="text-sm">{m.label}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-5">
                <div className={`text-xs font-semibold ${tok.textMuted} mb-2`}>FEATURES</div>
                <div className="space-y-1">
                  {[{label:"Recurring",icon:PieIcon},{label:"Subscriptions",icon:Wallet},{label:"Feedback",icon:Info}].map(m=>(
                    <a key={m.label} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${tok.pill}`}>
                      <m.icon className="w-4 h-4"/><span className="text-sm">{m.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className={`text-xs font-semibold ${tok.textMuted} mb-2`}>GENERAL</div>
                <div className="space-y-1">
                  {[{label:"Settings",icon:Settings},{label:"Help Desk",icon:LifeBuoy},{label:"Log out",icon:LogOut}].map(m=>(
                    <a key={m.label} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${tok.pill}`}>
                      <m.icon className="w-4 h-4"/><span className="text-sm">{m.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className={`mt-6 rounded-xl border ${tok.cardBorder} p-4 ${isDark ? "bg-ink-800":"bg-emerald-50"}`}>
                <div className={`text-sm font-medium ${tok.textPrimary}`}>Upgrade Pro! 🔔</div>
                <p className={`text-xs ${tok.textMuted} mt-1`}>Higher productivity with better organization</p>
                <button className={`${btnPrimary} mt-3 w-full py-2`}>Upgrade</button>
              </div>
            </Card>
          </aside>

          {/* Main */}
          <main className="col-span-9 xl:col-span-10 space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card tok={tok}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm ${tok.textMuted}`}>Portfolio value</div>
                    <div className={`text-2xl font-semibold mt-1 ${tok.textPrimary}`}>{fmtMAD(portValue)}</div>
                    <div className={`text-xs mt-1 flex items-center gap-1 ${tok.textMuted}`}>
                      <Info className="w-3.5 h-3.5" /> Actions + OPCVM (PRU) + Cash MAD
                    </div>
                  </div>
                  <IconWrap><PiggyBank className="w-5 h-5"/></IconWrap>
                </div>
              </Card>

              <Card tok={tok}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm ${tok.textMuted}`}>P/L total</div>
                    <div className={`text-2xl font-semibold mt-1 ${tok.textPrimary}`}>
                      {fmtMAD(plAbs)} <span className={`text-sm ${tok.textMuted}`}>({fmtPct(plRel)})</span>
                    </div>
                    <div className={`text-xs mt-1 ${tok.textMuted}`}>vs. capital investi</div>
                  </div>
                  <IconWrap><TrendingUp className="w-5 h-5"/></IconWrap>
                </div>
              </Card>

              <Card tok={tok}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm ${tok.textMuted}`}>Dividendes YTD</div>
                    <div className={`text-2xl font-semibold mt-1 ${tok.textPrimary}`}>{fmtMAD(ytdDividends)}</div>
                    <div className={`text-xs mt-1 ${tok.textMuted}`}>Année {nowYear}</div>
                  </div>
                  <IconWrap><Banknote className="w-5 h-5"/></IconWrap>
                </div>
              </Card>
            </div>

            {/* Wallet + Cashflow */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <Card tok={tok} className="xl:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={`text-sm font-medium ${tok.textPrimary}`}>My Wallet</div>
                    <div className={`text-xs ${tok.textMuted}`}>Cash (MAD only)</div>
                  </div>
                  <div className="flex gap-2">
                    <button className={btnSoft} onClick={()=>setShowWallet(true)}><Plus className="w-4 h-4"/> Add</button>
                    <button className={btnSoft} onClick={()=>setShowTransfer(true)} disabled={accounts.length<2}>
                      <ArrowLeftRight className="w-4 h-4"/> Transfer
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {accounts.map(a=>(
                    <div key={a.id} className={`rounded-xl border ${tok.cardBorder} ${tok.cardBg} p-3 flex items-start justify-between`}>
                      <div>
                        <div className={`text-xs ${tok.textMuted}`}>{a.name}</div>
                        <div className={`text-lg font-semibold mt-0.5 ${tok.textPrimary}`}>{fmtNum(a.balance)} {a.currency}</div>
                      </div>
                      <div className="flex gap-1">
                        <button className={`rounded-lg p-2 ${isDark?"hover:bg-white/10":"hover:bg-gray-100"}`} onClick={()=>{setEditWallet(a); setShowWallet(true);}}>
                          <Edit2 className={`w-4 h-4 ${tok.textSecondary}`}/>
                        </button>
                        <button className={`rounded-lg p-2 ${isDark?"hover:bg-white/10":"hover:bg-gray-100"}`} onClick={()=>store.removeAccount(a.id)}>
                          <Trash2 className={`w-4 h-4 ${tok.textSecondary}`}/>
                        </button>
                      </div>
                    </div>
                  ))}
                  {!accounts.length && <EmptyHint text="Create your first cash account." tok={tok}/>}
                  <div className={`text-xs mt-1 ${tok.textMuted}`}>{hasForeign ? "MAD aggregated — other currencies excluded (—)" : "All accounts included"}</div>
                </div>
              </Card>

              <Card tok={tok} className="xl:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-sm font-medium ${tok.textPrimary}`}>Cash Flow</div>
                  <div className={`text-xs ${tok.textMuted}`}>Monthly • {nowYear}</div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer>
                    <BarChart data={cashflow}>
                      <CartesianGrid stroke={isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)"} vertical={false}/>
                      <XAxis dataKey="m" stroke={isDark?"#9CA3AF":"#6B7280"}/>
                      <YAxis stroke={isDark?"#9CA3AF":"#6B7280"}/>
                      <Legend/>
                      <RTooltip contentStyle={{
                        background: isDark?"#0F1115":"white",
                        color: isDark?"#F3F4F6":"#111827",
                        border: `1px solid ${isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)"}`,
                        borderRadius: 12
                      }}
                        formatter={(v,n)=>[fmtMAD(v), n==="inflow"?"Entrées":"Sorties"]}
                      />
                      <Bar dataKey="inflow" name="Entrées" fill={tok.accent} radius={[6,6,0,0]}/>
                      <Bar dataKey="outflow" name="Sorties" fill={tok.warm} radius={[6,6,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Positions */}
            <Card tok={tok}>
              <div className="flex items-center justify-between mb-3">
                <div className={`text-sm font-medium ${tok.textPrimary}`}>My Positions</div>
                <button className={btnPrimary} onClick={()=>setShowHolding(true)}><Plus className="w-4 h-4"/> Add position</button>
              </div>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${tok.textMuted} border-b ${tok.cardBorder}`}>
                      <th className="py-2 text-left">Ticker</th>
                      <th className="py-2 text-left">Account</th>
                      <th className="py-2 text-right">Qty</th>
                      <th className="py-2 text-right">Avg Price</th>
                      <th className="py-2 text-right">Value</th>
                      <th className="py-2 text-right">P/L</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map(h=>{
                      const acc = accounts.find(a=>a.id===h.accountId);
                      const q=currentQty(h), pru=avgCost(h), val=valueEst(h), inv=investedNet(h), pl=val-inv;
                      return (
                        <tr key={h.id} className={`border-b ${tok.cardBorder}`}>
                          <td className={`py-2 font-semibold ${tok.textPrimary}`}>{h.ticker}</td>
                          <td className={`py-2 ${tok.textSecondary}`}>{acc?`${acc.name} (${acc.currency})`:"—"}</td>
                          <td className={`py-2 text-right ${tok.textSecondary}`}>{fmtNum(q)}</td>
                          <td className={`py-2 text-right ${tok.textSecondary}`}>{fmtMAD(pru)}</td>
                          <td className={`py-2 text-right ${tok.textSecondary}`}>{fmtMAD(val)}</td>
                          <td className={`py-2 text-right ${tok.textSecondary}`}>
                            {fmtMAD(pl)} <span className={`text-xs ${tok.textMuted}`}>({fmtPct(inv>0?pl/inv:0)})</span>
                          </td>
                          <td className="py-2 text-right">
                            <a href={`#/company/${h.ticker}`} className={`${btnGhost} text-xs`}>Open <ChevronRight className="w-3 h-3"/></a>
                            <button className={`${btnGhost} text-xs`} onClick={()=>{setEditHolding(h); setShowHolding(true);}}>
                              <Edit2 className="w-3 h-3"/>
                            </button>
                            <button className={`${btnGhost} text-xs`} onClick={()=>store.removeHolding(h.id)}>
                              <Trash2 className="w-3 h-3"/>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {!holdings.length && (
                      <tr>
                        <td colSpan={7} className={`py-6 ${tok.textSecondary}`}>No position yet. Add your first holding.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
                <MiniStat icon={Building2} title="Invested" value={fmtMAD(invested)} tok={tok}/>
                <MiniStat icon={Wallet} title="Cash (MAD)" value={fmtMAD(cashMAD)} tok={tok}/>
                <MiniStat icon={Percent} title="Active lines" value={fmtNum(linesCount)} tok={tok}/>
              </div>
            </Card>

            {/* Split row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card tok={tok}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-sm font-medium ${tok.textPrimary}`}>Sector split</div>
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
                            background: isDark?"#0F1115":"white",
                            color: isDark?"#F3F4F6":"#111827",
                            border: `1px solid ${isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)"}`,
                            borderRadius: 12
                          }}
                          formatter={(v,n,p)=>[`${fmtMAD(v)} (${(p?.payload?.pct*100).toFixed(1)}%)`, p?.payload?.name || "Secteur"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <EmptyHint text="Add positions to see sector distribution." tok={tok}/>}
              </Card>

              <Card tok={tok}>
                <div className={`text-sm font-medium mb-3 ${tok.textPrimary}`}>Top allocation</div>
                <div className="space-y-2">
                  {allocation.map(a=>(
                    <div key={a.ticker} className={`rounded-xl border ${tok.cardBorder} p-3`}>
                      <div className="flex items-center justify-between">
                        <div className={`font-medium ${tok.textPrimary}`}>{a.ticker}</div>
                        <div className={`text-sm ${tok.textSecondary}`}>{fmtMAD(a.value)}</div>
                      </div>
                      <div className={`mt-2 h-2 rounded-full ${isDark?"bg-white/10":"bg-gray-100"} overflow-hidden`}>
                        <div className="h-full rounded-full" style={{ width:`${Math.min(100,a.weight*100)}%`, background: tok.accent }}/>
                      </div>
                    </div>
                  ))}
                  {!allocation.length && <EmptyHint text="Your top weights will appear here." tok={tok}/>}
                </div>
              </Card>

              <Card tok={tok}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-sm font-medium ${tok.textPrimary}`}>Upcoming (60 days)</div>
                  <a href="#/calendar" className={`${btnSoft} text-xs`}>View Calendar</a>
                </div>
                <div className="space-y-2">
                  {upcoming.map((d,i)=>(
                    <a key={`${d.ticker}-${i}`} href={`#/company/${d.ticker}`}
                       className={`rounded-xl border ${tok.cardBorder} p-3 flex items-center justify-between ${isDark?"hover:bg-white/5":"hover:bg-gray-50"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`text-xs ${tok.textMuted}`}>{fmtDate(d.exDate||d.paymentDate)}</div>
                        <div className={`font-medium ${tok.textPrimary}`}>{d.ticker}</div>
                      </div>
                      <div className={`text-sm ${tok.textSecondary}`}>{typeof d.amount==="number" ? `${d.amount.toFixed(2)} / sh` : "—"}</div>
                    </a>
                  ))}
                  {!upcoming.length && <EmptyHint text="No ex-dates in the next 60 days." tok={tok}/>}
                </div>
              </Card>
            </div>

            {/* Activities */}
            <Card tok={tok}>
              <div className="flex items-center justify-between mb-3">
                <div className={`text-sm font-medium ${tok.textPrimary}`}>Recent activities</div>
                <div className="flex items-center gap-2">
                  <button className={btnSoft}><Search className="w-4 h-4"/> Search</button>
                  <button className={btnSoft}><PieIcon className="w-4 h-4"/> Filter</button>
                </div>
              </div>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${tok.textMuted} border-b ${tok.cardBorder}`}>
                      <th className="py-2 text-left">Type</th>
                      <th className="py-2 text-left">Date</th>
                      <th className="py-2 text-left">Account</th>
                      <th className="py-2 text-left">Ticker</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.slice(0,10).map(a=>{
                      const acc = accounts.find(x=>x.id===a.accountId);
                      return (
                        <tr key={a.id} className={`border-b ${tok.cardBorder}`}>
                          <td className={`py-2 ${tok.textSecondary}`}>{a.type}</td>
                          <td className={`py-2 ${tok.textSecondary}`}>{fmtDate(a.date)}</td>
                          <td className={`py-2 ${tok.textSecondary}`}>{acc?`${acc.name} (${acc.currency})`:"—"}</td>
                          <td className={`py-2 ${tok.textSecondary}`}>{a.ticker || "—"}</td>
                          <td className={`py-2 text-right ${tok.textSecondary}`}>{fmtMAD(a.amount)}</td>
                        </tr>
                      );
                    })}
                    {!activities.length && (
                      <tr><td colSpan={5} className={`py-6 ${tok.textSecondary}`}>No activity yet.</td></tr>
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
          tok={tok}
        />
      )}
      {showTransfer && accounts.length>=2 && (
        <TransferForm
          accounts={accounts}
          onClose={()=>setShowTransfer(false)}
          onSubmit={(from,to,amt)=>{store.transfer(from,to,amt); setShowTransfer(false);}}
          tok={tok}
        />
      )}
      {showHolding && (
        <HoldingForm
          accounts={accounts.length?accounts:[{id:"none",name:"—",currency:"MAD"}]}
          tickers={tickers.length?tickers:["IAM","ATW","BCP"]}
          init={editHolding||undefined}
          onClose={()=>{setShowHolding(false); setEditHolding(null);}}
          onSubmit={(h)=>{ if(editHolding) store.updateHolding(h.id,h); else store.addHolding(h); setShowHolding(false); setEditHolding(null); }}
          tok={tok}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------
   Mini Stat
------------------------------------------------------------- */
function MiniStat({ icon: Icon, title, value, tok }) {
  return (
    <div className={`rounded-xl border ${tok.cardBorder} ${tok.surface} p-3 flex items-center justify-between`}>
      <div>
        <div className={`text-xs ${tok.textMuted}`}>{title}</div>
        <div className={`text-lg font-semibold mt-0.5 ${tok.textPrimary}`}>{value}</div>
      </div>
      <div className={`h-9 w-9 rounded-xl grid place-items-center ${tok.pillActive}`}>
        <Icon className="w-4 h-4"/>
      </div>
    </div>
  );
}
