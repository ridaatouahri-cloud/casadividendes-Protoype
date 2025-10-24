// src/pages/Dashboard.jsx
// Dashboard style "OripioFin-like" — full-page composition with sidebar, cards & charts
// Tailwind-only visuals (soft whites, subtle borders, xl radii, layered shadows)
// Data logic: identical to our previous MVP (localStorage store + dataService for companies/dividends)

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Plus,
  Search,
  Layers,
  PieChart as PieIcon,
  BarChart2,
  Wallet,
  TrendingUp,
  ArrowLeftRight,
  Edit2,
  Trash2,
  Info,
  ChevronRight,
  Building2,
  Banknote,
  PiggyBank,
  Percent,
  Upload,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { getCompanies, getAllDividends } from "../services/dataService"; // TODO: garder ce chemin
import { DATA_YEARS } from "../constants/paths"; // si besoin ailleurs, le garder

/* ------------------ helpers ------------------ */
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
const COLORS = ["#10B981", "#6366F1", "#F59E0B", "#EF4444", "#22C55E", "#06B6D4", "#A855F7", "#84CC16", "#F97316", "#3B82F6"];

/* ------------------ local store ------------------ */
const STORE_KEY = "cd_dashboard_store_oripiofin";

const defaultState = {
  accounts: [],
  holdings: [],
  activities: [],
};

function usePortfolioStore() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : defaultState;
    } catch {
      return defaultState;
    }
  });
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }, [state]);

  const addAccount = (acc) => setState((s) => ({ ...s, accounts: [...s.accounts, acc] }));
  const updateAccount = (id, patch) =>
    setState((s) => ({ ...s, accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
  const removeAccount = (id) =>
    setState((s) => ({
      ...s,
      accounts: s.accounts.filter((a) => a.id !== id),
      holdings: s.holdings.filter((h) => h.accountId !== id),
      activities: s.activities.filter((ac) => ac.accountId !== id),
    }));
  const addActivity = (a) => setState((s) => ({ ...s, activities: [a, ...s.activities] }));

  const deposit = (accountId, amount, date = new Date().toISOString()) =>
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) => (a.id === accountId ? { ...a, balance: (a.balance || 0) + amount } : a)),
      activities: [{ id: uid(), type: "DEPOSIT", date, accountId, amount }, ...s.activities],
    }));
  const withdraw = (accountId, amount, date = new Date().toISOString()) =>
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) => (a.id === accountId ? { ...a, balance: (a.balance || 0) - amount } : a)),
      activities: [{ id: uid(), type: "WITHDRAW", date, accountId, amount: -amount }, ...s.activities],
    }));
  const transfer = (fromId, toId, amount, date = new Date().toISOString()) =>
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) => {
        if (a.id === fromId) return { ...a, balance: (a.balance || 0) - amount };
        if (a.id === toId) return { ...a, balance: (a.balance || 0) + amount };
        return a;
      }),
      activities: [{ id: uid(), type: "TRANSFER", date, amount, meta: { fromId, toId } }, ...s.activities],
    }));

  const addHolding = (h) => setState((s) => ({ ...s, holdings: [h, ...s.holdings] }));
  const updateHolding = (id, patch) =>
    setState((s) => ({ ...s, holdings: s.holdings.map((h) => (h.id === id ? { ...h, ...patch } : h)) }));
  const removeHolding = (id) => setState((s) => ({ ...s, holdings: s.holdings.filter((h) => h.id !== id) }));

  const buyLot = (holdingId, { date, quantity, price, fees = 0 }, accountId) =>
    setState((s) => {
      const h = s.holdings.find((x) => x.id === holdingId);
      if (!h) return s;
      const upd = { ...h, lots: [...(h.lots || []), { date, quantity: +quantity, price: +price, fees: +fees }] };
      return {
        ...s,
        holdings: s.holdings.map((x) => (x.id === holdingId ? upd : x)),
        activities: [{ id: uid(), type: "BUY", date, accountId, ticker: h.ticker, amount: quantity * price + +fees }, ...s.activities],
      };
    });
  const sellLot = (holdingId, { date, quantity, price }, accountId) =>
    setState((s) => {
      const h = s.holdings.find((x) => x.id === holdingId);
      if (!h) return s;
      const upd = { ...h, sells: [...(h.sells || []), { date, quantity: +quantity, price: +price }] };
      return {
        ...s,
        holdings: s.holdings.map((x) => (x.id === holdingId ? upd : x)),
        activities: [{ id: uid(), type: "SELL", date, accountId, ticker: h.ticker, amount: quantity * price }, ...s.activities],
      };
    });

  return {
    state,
    addAccount,
    updateAccount,
    removeAccount,
    deposit,
    withdraw,
    transfer,
    addHolding,
    updateHolding,
    removeHolding,
    buyLot,
    sellLot,
    addActivity,
  };
}

/* ------------------ external data hooks ------------------ */
function useCompanies() {
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const cs = await getCompanies();
        setCompanies(cs || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  return companies;
}
function useDividends(years) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllDividends(years);
        setRows(data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [JSON.stringify(years)]);
  return rows;
}

/* ------------------ math utils ------------------ */
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function currentQty(h) {
  const b = (h.lots || []).reduce((s, l) => s + +l.quantity, 0);
  const s = (h.sells || []).reduce((ss, l) => ss + +l.quantity, 0);
  return b - s;
}
function avgCost(h) {
  const q = (h.lots || []).reduce((s, l) => s + +l.quantity, 0);
  const c = (h.lots || []).reduce((s, l) => s + (+l.quantity * +l.price + (+l.fees || 0)), 0);
  return q > 0 ? c / q : 0;
}
function investedNet(h) {
  const buys = (h.lots || []).reduce((s, l) => s + (+l.quantity * +l.price + (+l.fees || 0)), 0);
  const sells = (h.sells || []).reduce((s, l) => s + +l.quantity * +l.price, 0);
  return buys - sells;
}
function valueEst(h) {
  // no live price: fallback PRU
  return currentQty(h) * avgCost(h);
}
function qtyAtDate(h, dateISO) {
  const t = new Date(dateISO).getTime();
  const b = (h.lots || []).reduce((s, l) => s + (new Date(l.date).getTime() <= t ? +l.quantity : 0), 0);
  const s = (h.sells || []).reduce((ss, l) => ss + (new Date(l.date).getTime() <= t ? +l.quantity : 0), 0);
  return b - s;
}

/* ------------------ forms ------------------ */
function WalletForm({ init, onClose, onSubmit }) {
  const [name, setName] = useState(init?.name || "");
  const [currency, setCurrency] = useState(init?.currency || "MAD");
  const [balance, setBalance] = useState(init?.balance ?? 0);
  return (
    <Modal title={init ? "Modifier le compte" : "Nouveau compte"} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Nom">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="CTO / Banque…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Devise">
            <select className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option>MAD</option><option>USD</option><option>EUR</option><option>GBP</option>
            </select>
          </Field>
          <Field label="Solde initial">
            <input type="number" className="input" value={balance} onChange={(e) => setBalance(parseFloat(e.target.value))} />
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <button className="btn-soft" onClick={onClose}>Annuler</button>
          <button
            className="btn-primary"
            onClick={() =>
              onSubmit({
                id: init?.id || uid(),
                name: name.trim() || "Compte",
                currency,
                balance: +balance || 0,
                createdAt: init?.createdAt || new Date().toISOString(),
              })
            }
          >
            Enregistrer
          </button>
        </div>
      </div>
    </Modal>
  );
}

function TransferForm({ accounts, onClose, onSubmit }) {
  const [fromId, setFromId] = useState(accounts[0]?.id || "");
  const [toId, setToId] = useState(accounts[1]?.id || "");
  const [amount, setAmount] = useState(0);
  return (
    <Modal title="Virement interne" onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Depuis">
            <select className="input" value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </Field>
          <Field label="Vers">
            <select className="input" value={toId} onChange={(e) => setToId(e.target.value)}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </Field>
        </div>
        <Field label="Montant">
          <input type="number" className="input" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
        </Field>
        <div className="flex justify-end gap-2">
          <button className="btn-soft" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={() => onSubmit(fromId, toId, +amount || 0)}>Transférer</button>
        </div>
      </div>
    </Modal>
  );
}

function HoldingForm({ accounts, tickers, init, onClose, onSubmit }) {
  const [ticker, setTicker] = useState(init?.ticker || tickers[0] || "");
  const [accountId, setAccountId] = useState(init?.accountId || accounts[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [fees, setFees] = useState(0);
  const [strategy, setStrategy] = useState(init?.strategy || "Income");
  const [notes, setNotes] = useState(init?.notes || "");

  return (
    <Modal title={init ? "Modifier la position" : "Nouvelle position"} onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Ticker">
            <select className="input" value={ticker} onChange={(e) => setTicker(e.target.value)}>
              {tickers.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Compte">
            <select className="input" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </Field>
          <Field label="Date d’achat"><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Quantité"><input type="number" className="input" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} /></Field>
          <Field label="Prix"><input type="number" className="input" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} /></Field>
          <Field label="Frais"><input type="number" className="input" value={fees} onChange={(e) => setFees(parseFloat(e.target.value))} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Stratégie">
            <select className="input" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
              <option>Income</option><option>Long-term</option><option>Swing</option>
            </select>
          </Field>
          <Field label="Notes"><input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
        </div>
        <div className="flex justify-end gap-2">
          <button className="btn-soft" onClick={onClose}>Annuler</button>
          <button
            className="btn-primary"
            onClick={() =>
              onSubmit({
                id: init?.id || uid(),
                ticker,
                accountId,
                strategy,
                notes,
                lots: [...(init?.lots || []), { date, quantity: +quantity || 0, price: +price || 0, fees: +fees || 0 }],
                sells: init?.sells || [],
                createdAt: init?.createdAt || new Date().toISOString(),
              })
            }
          >
            Enregistrer
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------ small UI primitives ------------------ */
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-6">
    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-black/[0.06]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-900 rounded-lg p-1">✕</button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);
const Field = ({ label, children }) => (
  <label className="block">
    <span className="text-xs text-gray-500">{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);

/* ---------- shared inputs (light theme for OripioFin look) ---------- */
const inputBase =
  "w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm text-gray-900 shadow-[0_1px_0_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-emerald-300/60";
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition";
const btnPrimary = `${btnBase} bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_6px_16px_rgba(16,185,129,0.25)] px-3.5 py-2`;
const btnSoft = `${btnBase} bg-gray-100 text-gray-800 hover:bg-gray-200 px-3.5 py-2`;
const btnGhost = `${btnBase} text-gray-600 hover:bg-gray-100 px-3 py-2`;

const classes = {
  input: inputBase,
  "btn-primary": btnPrimary,
  "btn-soft": btnSoft,
  "btn-ghost": btnGhost,
};
Object.assign(window, {});

/* allow use in JSX className="input"/"btn-primary" */
const ProxyClass = new Proxy(classes, {
  get: (_, k) => classes[k] || "",
});
const input = ProxyClass.input;
const btnP = ProxyClass["btn-primary"];
const btnS = ProxyClass["btn-soft"];
const btnG = ProxyClass["btn-ghost"];

/* ------------------ Dashboard main ------------------ */
export default function Dashboard() {
  const companies = useCompanies();
  const tickers = useMemo(
    () => companies.map((c) => (c.ticker || "").toUpperCase()).filter(Boolean).sort(),
    [companies]
  );
  const dividendsYTD = useDividends([nowYear]);
  const dividendsAll = useDividends(DATA_YEARS);

  const store = usePortfolioStore();
  const { accounts, holdings, activities } = store.state;

  const [showWallet, setShowWallet] = useState(false);
  const [editWallet, setEditWallet] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showHolding, setShowHolding] = useState(false);
  const [editHolding, setEditHolding] = useState(null);

  // KPIs
  const cashMAD = useMemo(() => accounts.filter((a) => a.currency === "MAD").reduce((s, a) => s + (a.balance || 0), 0), [accounts]);
  const hasForeign = useMemo(() => accounts.some((a) => a.currency !== "MAD"), [accounts]);
  const invested = useMemo(() => holdings.reduce((s, h) => s + investedNet(h), 0), [holdings]);
  const portValue = useMemo(() => holdings.reduce((s, h) => s + valueEst(h), 0) + cashMAD, [holdings, cashMAD]);
  const plAbs = useMemo(() => portValue - invested, [portValue, invested]);
  const plRel = useMemo(() => (invested > 0 ? plAbs / invested : 0), [plAbs, invested]);
  const linesCount = useMemo(() => holdings.filter((h) => currentQty(h) > 0).length, [holdings]);

  // YTD dividends based on ex-date & qty held
  const ytdDividends = useMemo(() => {
    const mapH = new Map(holdings.map((h) => [h.ticker.toUpperCase(), h]));
    let t = 0;
    for (const d of dividendsYTD) {
      const h = mapH.get((d.ticker || "").toUpperCase());
      if (!h || !d.exDate) continue;
      const q = qtyAtDate(h, d.exDate);
      if (q > 0 && typeof d.amount === "number") t += q * d.amount;
    }
    return t;
  }, [dividendsYTD, holdings]);

  // Cashflow monthly
  const cashflow = useMemo(() => {
    const buckets = Array.from({ length: 12 }, (_, i) => ({ m: monthLabel(i), inflow: 0, outflow: 0 }));
    for (const a of activities) {
      const d = new Date(a.date);
      if (d.getFullYear() !== nowYear) continue;
      const i = d.getMonth();
      const amt = a.amount || 0;
      if (["DEPOSIT", "TRANSFER", "SELL"].includes(a.type)) amt >= 0 ? (buckets[i].inflow += amt) : (buckets[i].outflow += amt);
      if (["WITHDRAW", "BUY"].includes(a.type)) amt >= 0 ? (buckets[i].outflow += amt) : (buckets[i].inflow += Math.abs(amt));
    }
    const mapH = new Map(holdings.map((h) => [h.ticker.toUpperCase(), h]));
    for (const d of dividendsYTD) {
      const i = new Date(d.exDate || d.paymentDate || Date.now()).getMonth();
      const h = mapH.get((d.ticker || "").toUpperCase());
      if (!h) continue;
      const q = d.exDate ? qtyAtDate(h, d.exDate) : currentQty(h);
      if (q > 0 && typeof d.amount === "number") buckets[i].inflow += q * d.amount;
    }
    return buckets;
  }, [activities, dividendsYTD, holdings]);

  // Allocation + sectors
  const allocation = useMemo(() => {
    const tv = holdings.reduce((s, h) => s + valueEst(h), 0) || 1;
    return holdings
      .map((h) => ({ ticker: h.ticker, value: valueEst(h), weight: valueEst(h) / tv }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [holdings]);

  const sectorByTicker = useMemo(() => {
    const m = new Map();
    companies.forEach((c) => m.set((c.ticker || "").toUpperCase(), c.sector || "Autres"));
    return m;
  }, [companies]);

  const sectorDonut = useMemo(() => {
    const map = new Map();
    let tot = 0;
    for (const h of holdings) {
      const s = sectorByTicker.get((h.ticker || "").toUpperCase()) || "Autres";
      const v = valueEst(h);
      map.set(s, (map.get(s) || 0) + v);
      tot += v;
    }
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, value: +v.toFixed(2), pct: v / (tot || 1) }))
      .sort((a, b) => b.value - a.value);
  }, [holdings, sectorByTicker]);

  // Upcoming 60 days
  const upcoming = useMemo(() => {
    const now = new Date();
    const in60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const mapH = new Map(holdings.map((h) => [h.ticker.toUpperCase(), h]));
    return dividendsAll
      .filter((d) => {
        const t = (d.ticker || "").toUpperCase();
        const h = mapH.get(t);
        if (!h) return false;
        const ref = d.exDate ? new Date(d.exDate) : d.paymentDate ? new Date(d.paymentDate) : null;
        if (!ref) return false;
        return ref >= now && ref <= in60 && qtyAtDate(h, d.exDate || d.paymentDate) > 0;
      })
      .sort((a, b) => new Date(a.exDate || a.paymentDate) - new Date(b.exDate || b.paymentDate))
      .slice(0, 8);
  }, [dividendsAll, holdings]);

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FA]">
      {/* Shell: sidebar + top content container */}
      <div className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar (left) */}
          <aside className="col-span-3 xl:col-span-2">
            <div className="rounded-[18px] bg-white/90 backdrop-blur border border-black/[0.06] shadow-[0_1px_0_rgba(0,0,0,0.03),0_10px_30px_rgba(0,0,0,0.06)] p-4 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white grid place-items-center font-semibold">CD</div>
                <div className="font-semibold">CasaDividendes</div>
              </div>
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input className={input} placeholder="Search" style={{ paddingLeft: 36 }} />
              </div>
              <nav className="space-y-1">
                {[
                  { label: "Dashboard", icon: Layers },
                  { label: "Analytics", icon: BarChart2 },
                  { label: "Transactions", icon: Wallet },
                  { label: "Invoices", icon: Upload },
                ].map((m, i) => (
                  <a
                    key={m.label}
                    href="#"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      i === 0 ? "bg-gray-900 text-white shadow-[0_8px_24px_rgba(17,24,39,0.15)]" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <m.icon className="w-4 h-4" />
                    <span className="text-sm">{m.label}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-5">
                <div className="text-xs font-semibold text-gray-400 mb-2">FEATURES</div>
                <div className="space-y-1">
                  {[
                    { label: "Recurring", icon: PieIcon },
                    { label: "Subscriptions", icon: Wallet },
                    { label: "Feedback", icon: Info },
                  ].map((m) => (
                    <a key={m.label} href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100">
                      <m.icon className="w-4 h-4" />
                      <span className="text-sm">{m.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold text-gray-400 mb-2">GENERAL</div>
                <div className="space-y-1">
                  {[
                    { label: "Settings", icon: Settings },
                    { label: "Help Desk", icon: LifeBuoy },
                    { label: "Log out", icon: LogOut },
                  ].map((m) => (
                    <a key={m.label} href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100">
                      <m.icon className="w-4 h-4" />
                      <span className="text-sm">{m.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 p-4">
                <div className="text-sm font-medium">Upgrade Pro! 🔔</div>
                <p className="text-xs text-gray-500 mt-1">Higher productivity with better organization</p>
                <button className={`${btnP} mt-3 w-full py-2`}>Upgrade</button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="col-span-9 xl:col-span-10 space-y-6">
            {/* Overview row (3 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <CardLight>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Portfolio value</div>
                    <div className="text-2xl font-semibold mt-1">{fmtMAD(portValue)}</div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Actions + OPCVM estimés (PRU) + Cash MAD
                    </div>
                  </div>
                  <div className="h-11 w-11 grid place-items-center rounded-xl bg-emerald-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)]">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                </div>
                <a href="#" className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                  See details <ChevronRight className="w-4 h-4" />
                </a>
              </CardLight>

              <CardLight>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">P/L total</div>
                    <div className="text-2xl font-semibold mt-1">
                      {fmtMAD(plAbs)} <span className="text-sm text-gray-500">({fmtPct(plRel)})</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">vs. capital investi</div>
                  </div>
                  <div className="h-11 w-11 grid place-items-center rounded-xl bg-indigo-600 text-white shadow-[0_8px_30px_rgba(79,70,229,0.35)]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <a href="#" className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                  View summary <ChevronRight className="w-4 h-4" />
                </a>
              </CardLight>

              <CardLight>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Dividendes YTD</div>
                    <div className="text-2xl font-semibold mt-1">{fmtMAD(ytdDividends)}</div>
                    <div className="text-xs text-gray-400 mt-1">Année {nowYear}</div>
                  </div>
                  <div className="h-11 w-11 grid place-items-center rounded-xl bg-amber-500 text-white shadow-[0_8px_30px_rgba(245,158,11,0.35)]">
                    <Banknote className="w-5 h-5" />
                  </div>
                </div>
                <a href="#" className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                  Analyze performance <ChevronRight className="w-4 h-4" />
                </a>
              </CardLight>
            </div>

            {/* Row: wallet + cashflow */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <CardLight className="xl:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-gray-900 font-medium">My Wallet</div>
                    <div className="text-xs text-gray-400">Cash (MAD only)</div>
                  </div>
                  <div className="flex gap-2">
                    <button className={btnS} onClick={() => setShowWallet(true)}><Plus className="w-4 h-4" /> Add</button>
                    <button className={btnS} onClick={() => setShowTransfer(true)} disabled={accounts.length < 2}>
                      <ArrowLeftRight className="w-4 h-4" /> Transfer
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {accounts.map((a) => (
                    <div key={a.id} className="rounded-xl border border-black/[0.06] bg-white p-3 flex items-start justify-between">
                      <div>
                        <div className="text-xs text-gray-500">{a.name}</div>
                        <div className="text-lg font-semibold mt-0.5">{fmtNum(a.balance)} {a.currency}</div>
                      </div>
                      <div className="flex gap-1">
                        <button className="rounded-lg p-2 hover:bg-gray-100" onClick={() => { setEditWallet(a); setShowWallet(true); }}>
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-gray-100" onClick={() => store.removeAccount(a.id)}>
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {!accounts.length && <EmptyHint text="Create your first cash account." />}
                  <div className="text-xs text-gray-500 mt-1">{hasForeign ? "MAD aggregated — other currencies excluded (—)" : "All accounts included"}</div>
                </div>
              </CardLight>

              <CardLight className="xl:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-900 font-medium">Cash Flow</div>
                  <div className="text-xs text-gray-500">Monthly • {nowYear}</div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer>
                    <BarChart data={cashflow}>
                      <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                      <XAxis dataKey="m" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Legend />
                      <RTooltip
                        contentStyle={{
                          background: "white",
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: 12,
                        }}
                        formatter={(v, n) => [fmtMAD(v), n === "inflow" ? "Entrées" : "Sorties"]}
                      />
                      <Bar dataKey="inflow" name="Entrées" fill="#10B981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="outflow" name="Sorties" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardLight>
            </div>

            {/* Row: positions (table) */}
            <CardLight>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-900 font-medium">My Positions</div>
                <button className={btnP} onClick={() => setShowHolding(true)}><Plus className="w-4 h-4" /> Add position</button>
              </div>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-black/[0.06]">
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
                    {holdings.map((h) => {
                      const acc = accounts.find((a) => a.id === h.accountId);
                      const q = currentQty(h);
                      const pru = avgCost(h);
                      const val = valueEst(h);
                      const inv = investedNet(h);
                      const pl = val - inv;
                      return (
                        <tr key={h.id} className="border-b border-black/[0.04]">
                          <td className="py-2 font-semibold">{h.ticker}</td>
                          <td className="py-2">{acc ? `${acc.name} (${acc.currency})` : "—"}</td>
                          <td className="py-2 text-right">{fmtNum(q)}</td>
                          <td className="py-2 text-right">{fmtMAD(pru)}</td>
                          <td className="py-2 text-right">{fmtMAD(val)}</td>
                          <td className="py-2 text-right">
                            {fmtMAD(pl)}{" "}
                            <span className="text-xs text-gray-500">({fmtPct(inv > 0 ? pl / inv : 0)})</span>
                          </td>
                          <td className="py-2 text-right">
                            <a href={`#/company/${h.ticker}`} className={btnG + " text-xs"}>
                              Open <ChevronRight className="w-3 h-3" />
                            </a>
                            <button className={btnG + " text-xs"} onClick={() => { setEditHolding(h); setShowHolding(true); }}>
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button className={btnG + " text-xs"} onClick={() => store.removeHolding(h.id)}>
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {!holdings.length && (
                      <tr>
                        <td colSpan={7} className="py-6 text-gray-500">No position yet. Add your first holding.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
                <MiniStat icon={Building2} title="Invested" value={fmtMAD(invested)} />
                <MiniStat icon={Wallet} title="Cash (MAD)" value={fmtMAD(cashMAD)} />
                <MiniStat icon={Percent} title="Active lines" value={fmtNum(linesCount)} />
              </div>
            </CardLight>

            {/* Row: sector donut + allocation + upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <CardLight>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-900 font-medium">Sector split</div>
                </div>
                {sectorDonut.length ? (
                  <div className="h-[260px]">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={sectorDonut} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                          {sectorDonut.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <RTooltip
                          contentStyle={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12 }}
                          formatter={(v, n, p) => [`${fmtMAD(v)} (${(p?.payload?.pct * 100).toFixed(1)}%)`, p?.payload?.name || "Secteur"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyHint text="Add positions to see sector distribution." />
                )}
              </CardLight>

              <CardLight className="lg:col-span-1">
                <div className="text-sm text-gray-900 font-medium mb-3">Top allocation</div>
                <div className="space-y-2">
                  {allocation.map((a, i) => (
                    <div key={a.ticker} className="rounded-xl border border-black/[0.06] p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{a.ticker}</div>
                        <div className="text-sm text-gray-500">{fmtMAD(a.value)}</div>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${Math.min(100, a.weight * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {!allocation.length && <EmptyHint text="Your top weights will appear here." />}
                </div>
              </CardLight>

              <CardLight className="lg:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-900 font-medium">Upcoming (60 days)</div>
                  <a href="#/calendar" className={btnS + " text-xs"}>View Calendar</a>
                </div>
                <div className="space-y-2">
                  {upcoming.map((d, i) => (
                    <a key={`${d.ticker}-${i}`} href={`#/company/${d.ticker}`} className="rounded-xl border border-black/[0.06] p-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-gray-500">{fmtDate(d.exDate || d.paymentDate)}</div>
                        <div className="font-medium">{d.ticker}</div>
                      </div>
                      <div className="text-sm text-gray-600">{typeof d.amount === "number" ? `${d.amount.toFixed(2)} / sh` : "—"}</div>
                    </a>
                  ))}
                  {!upcoming.length && <EmptyHint text="No ex-dates in the next 60 days." />}
                </div>
              </CardLight>
            </div>

            {/* Activities */}
            <CardLight>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-900 font-medium">Recent activities</div>
                <div className="flex items-center gap-2">
                  <button className={btnS}><Search className="w-4 h-4" /> Search</button>
                  <button className={btnS}><PieIcon className="w-4 h-4" /> Filter</button>
                </div>
              </div>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-black/[0.06]">
                      <th className="py-2 text-left">Type</th>
                      <th className="py-2 text-left">Date</th>
                      <th className="py-2 text-left">Account</th>
                      <th className="py-2 text-left">Ticker</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.slice(0, 10).map((a) => {
                      const acc = accounts.find((x) => x.id === a.accountId);
                      return (
                        <tr key={a.id} className="border-b border-black/[0.04]">
                          <td className="py-2">{a.type}</td>
                          <td className="py-2">{fmtDate(a.date)}</td>
                          <td className="py-2">{acc ? `${acc.name} (${acc.currency})` : "—"}</td>
                          <td className="py-2">{a.ticker || "—"}</td>
                          <td className="py-2 text-right">{fmtMAD(a.amount)}</td>
                        </tr>
                      );
                    })}
                    {!activities.length && (
                      <tr>
                        <td colSpan={5} className="py-6 text-gray-500">No activity yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardLight>
          </main>
        </div>
      </div>

      {/* Modals */}
      {showWallet && (
        <WalletForm
          init={editWallet || undefined}
          onClose={() => {
            setShowWallet(false);
            setEditWallet(null);
          }}
          onSubmit={(acc) => {
            if (editWallet) store.updateAccount(acc.id, acc);
            else store.addAccount(acc);
            setShowWallet(false);
            setEditWallet(null);
          }}
        />
      )}
      {showTransfer && accounts.length >= 2 && (
        <TransferForm
          accounts={accounts}
          onClose={() => setShowTransfer(false)}
          onSubmit={(from, to, amt) => {
            store.transfer(from, to, amt);
            setShowTransfer(false);
          }}
        />
      )}
      {showHolding && (
        <HoldingForm
          accounts={accounts.length ? accounts : [{ id: "none", name: "—", currency: "MAD" }]}
          tickers={tickers.length ? tickers : ["IAM", "ATW", "BCP"]}
          init={editHolding || undefined}
          onClose={() => {
            setShowHolding(false);
            setEditHolding(null);
          }}
          onSubmit={(h) => {
            if (editHolding) store.updateHolding(h.id, h);
            else store.addHolding(h);
            setShowHolding(false);
            setEditHolding(null);
          }}
        />
      )}
    </div>
  );
}

/* ------------------ presentational ------------------ */
function CardLight({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-[18px] bg-white border border-black/[0.06] shadow-[0_1px_0_rgba(0,0,0,0.03),0_12px_40px_rgba(0,0,0,0.06)] p-4 " +
        className
      }
    >
      {children}
    </div>
  );
}
function MiniStat({ icon: Icon, title, value }) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-gray-50/60 p-3 flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-lg font-semibold mt-0.5">{value}</div>
      </div>
      <div className="h-9 w-9 rounded-xl bg-gray-900 text-white grid place-items-center shadow-[0_8px_24px_rgba(17,24,39,0.15)]">
        <Icon className="w-4 h-4" />
      </div>
    </div>
  );
}
function EmptyHint({ text }) {
  return <div className="rounded-xl border border-black/[0.06] bg-white p-3 text-sm text-gray-500">{text}</div>;
}

/* ---------- light-theme utility classes (JSX friendly aliases) ---------- */
const style = document.createElement("style");
style.innerHTML = `
.input{ ${tw(inputBase)} }
.btn-primary{ ${tw(btnPrimary)} }
.btn-soft{ ${tw(btnSoft)} }
.btn-ghost{ ${tw(btnGhost)} }
`;
document.head.appendChild(style);

// Convert a utility string into CSS var block so it can be re-used above (no-op for Tailwind runtime build)
function tw(_) { return ""; }
