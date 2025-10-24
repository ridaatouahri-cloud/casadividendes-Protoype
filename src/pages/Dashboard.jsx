// src/pages/Dashboard.jsx
// Dashboard utilisateur (MVP) — CasaDividendes
// Thème: dark premium (utilitaires Tailwind existants)
// Charts: recharts. Icônes: lucide-react.
// Persistance locale: localStorage (clé "cd_dashboard_store").
// NOTE Services : ajuster les chemins selon votre projet.
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Plus,
  Wallet,
  TrendingUp,
  Percent,
  CalendarDays,
  ArrowLeftRight,
  Upload,
  Banknote,
  PiggyBank,
  Building2,
  Info,
  Search,
  Filter,
  X,
  Edit2,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { getCompanies } from "../services/companies"; // TODO: ajuster le chemin selon le projet
import { getAllDividends } from "../services/dividends"; // TODO: ajuster le chemin selon le projet

/* -----------------------------------------
 * Utils format
 * ----------------------------------------- */
const fmtMAD = (n) =>
  typeof n === "number"
    ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(
        n
      )} MAD`
    : "—";
const fmtNum = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(n)
    : "—";
const fmtPct = (n) =>
  typeof n === "number" ? `${(n * 100).toFixed(1)}%` : "—";
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("fr-FR") : "—";
const monthLabel = (i) =>
  new Date(2025, i, 1).toLocaleString("fr-FR", { month: "short" });
const nowYear = new Date().getFullYear();

/* -----------------------------------------
 * Local storage store
 * ----------------------------------------- */
const STORE_KEY = "cd_dashboard_store";
const defaultState = {
  accounts: [
    // { id, name, currency: "MAD"|"USD"|"EUR"|"GBP", balance, createdAt }
  ],
  holdings: [
    // { id, ticker, accountId, strategy?, notes?, lots:[{date,quantity,price,fees?}], sells:[{date,quantity,price}], createdAt }
  ],
  activities: [
    // dérivées : { id, type:"BUY"|"SELL"|"DIVIDEND"|"DEPOSIT"|"WITHDRAW"|"TRANSFER", date, accountId?, ticker?, amount, meta? }
  ],
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

  // Accounts CRUD
  const addAccount = (acc) =>
    setState((s) => ({ ...s, accounts: [...s.accounts, acc] }));
  const updateAccount = (id, patch) =>
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  const removeAccount = (id) =>
    setState((s) => ({
      ...s,
      accounts: s.accounts.filter((a) => a.id !== id),
      // sécuriser holdings et activités orphelins
      holdings: s.holdings.filter((h) => h.accountId !== id),
      activities: s.activities.filter((ac) => ac.accountId !== id),
    }));

  // Activities
  const addActivity = (a) =>
    setState((s) => ({ ...s, activities: [a, ...s.activities] }));

  // Wallet ops
  const deposit = (accountId, amount, date = new Date().toISOString()) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) =>
        a.id === accountId ? { ...a, balance: (a.balance || 0) + amount } : a
      ),
      activities: [
        {
          id: cryptoId(),
          type: "DEPOSIT",
          date,
          accountId,
          amount,
        },
        ...s.activities,
      ],
    }));
  };
  const withdraw = (accountId, amount, date = new Date().toISOString()) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) =>
        a.id === accountId ? { ...a, balance: (a.balance || 0) - amount } : a
      ),
      activities: [
        {
          id: cryptoId(),
          type: "WITHDRAW",
          date,
          accountId,
          amount: -amount,
        },
        ...s.activities,
      ],
    }));
  };
  const transfer = (
    fromId,
    toId,
    amount,
    date = new Date().toISOString()
  ) => {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) => {
        if (a.id === fromId)
          return { ...a, balance: (a.balance || 0) - amount };
        if (a.id === toId) return { ...a, balance: (a.balance || 0) + amount };
        return a;
      }),
      activities: [
        {
          id: cryptoId(),
          type: "TRANSFER",
          date,
          amount,
          meta: { fromId, toId },
        },
        ...s.activities,
      ],
    }));
  };

  // Holdings
  const addHolding = (h) =>
    setState((s) => ({ ...s, holdings: [h, ...s.holdings] }));
  const updateHolding = (id, patch) =>
    setState((s) => ({
      ...s,
      holdings: s.holdings.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    }));
  const removeHolding = (id) =>
    setState((s) => ({
      ...s,
      holdings: s.holdings.filter((h) => h.id !== id),
    }));

  // Buy/Sell (ajoute activités)
  const buyLot = (
    holdingId,
    { date, quantity, price, fees = 0 },
    accountId
  ) => {
    setState((s) => {
      const holding = s.holdings.find((h) => h.id === holdingId);
      if (!holding) return s;
      const upd = {
        ...holding,
        lots: [...(holding.lots || []), { date, quantity: +quantity, price: +price, fees: +fees }],
      };
      return {
        ...s,
        holdings: s.holdings.map((h) => (h.id === holdingId ? upd : h)),
        activities: [
          {
            id: cryptoId(),
            type: "BUY",
            date,
            accountId,
            ticker: holding.ticker,
            amount: quantity * price + fees,
          },
          ...s.activities,
        ],
      };
    });
  };
  const sellLot = (holdingId, { date, quantity, price }, accountId) => {
    setState((s) => {
      const holding = s.holdings.find((h) => h.id === holdingId);
      if (!holding) return s;
      const upd = {
        ...holding,
        sells: [...(holding.sells || []), { date, quantity: +quantity, price: +price }],
      };
      return {
        ...s,
        holdings: s.holdings.map((h) => (h.id === holdingId ? upd : h)),
        activities: [
          {
            id: cryptoId(),
            type: "SELL",
            date,
            accountId,
            ticker: holding.ticker,
            amount: quantity * price,
          },
          ...s.activities,
        ],
      };
    });
  };

  return {
    state,
    setState,
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

/* -----------------------------------------
 * Services data (dividendes/companies)
 * ----------------------------------------- */
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

/* -----------------------------------------
 * Aggregations / holdings math
 * ----------------------------------------- */
function qtyAtDate(holding, dateISO) {
  // quantité détenue à une date (lots - ventes <= date)
  const t = new Date(dateISO).getTime();
  const buys =
    (holding.lots || []).reduce(
      (s, l) => s + (new Date(l.date).getTime() <= t ? +l.quantity : 0),
      0
    ) || 0;
  const sells =
    (holding.sells || []).reduce(
      (s, l) => s + (new Date(l.date).getTime() <= t ? +l.quantity : 0),
      0
    ) || 0;
  return buys - sells;
}
function totalInvestedHolding(holding) {
  const cost =
    (holding.lots || []).reduce(
      (s, l) => s + (+l.quantity * +l.price + (+l.fees || 0)),
      0
    ) || 0;
  const sold =
    (holding.sells || []).reduce((s, l) => s + +l.quantity * +l.price, 0) || 0;
  return cost - sold; // capital immobilisé net
}
function currentQty(holding) {
  const buys =
    (holding.lots || []).reduce((s, l) => s + +l.quantity, 0) || 0;
  const sells =
    (holding.sells || []).reduce((s, l) => s + +l.quantity, 0) || 0;
  return buys - sells;
}
function avgCost(holding) {
  const buys = holding.lots || [];
  const q = buys.reduce((s, l) => s + +l.quantity, 0);
  const c = buys.reduce(
    (s, l) => s + +l.quantity * +l.price + (+l.fees || 0),
    0
  );
  return q > 0 ? c / q : 0;
}
function estimatedValue(holding) {
  // pas de cours: fallback PRU
  return currentQty(holding) * avgCost(holding);
}
function cryptoId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* -----------------------------------------
 * UI helpers
 * ----------------------------------------- */
const Card = ({ className = "", children }) => (
  <div
    className={
      "rounded-2xl border border-white/10 bg-white/[0.03] p-4 " + className
    }
  >
    {children}
  </div>
);

const Section = ({ title, right, children }) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {right}
    </div>
    {children}
  </section>
);

const Tooltip = ({ text }) => (
  <span
    className="inline-flex items-center text-white/50"
    title={text}
    aria-label={text}
  >
    <Info className="w-4 h-4" />
  </span>
);

function Select({ value, onChange, children, className = "" }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={
        "appearance-none bg-ink-900 border border-white/10 text-white/90 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40 " +
        className
      }
    >
      {children}
    </select>
  );
}

/* -----------------------------------------
 * Forms (modals light)
 * ----------------------------------------- */
function WalletForm({ onClose, onSubmit, init }) {
  const [name, setName] = useState(init?.name || "");
  const [currency, setCurrency] = useState(init?.currency || "MAD");
  const [balance, setBalance] = useState(init?.balance ?? 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-ink-900">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {init ? "Modifier le compte" : "Nouveau compte"}
          </h3>
          <button onClick={onClose} className="btn-ghost">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-white/60">Nom</label>
            <input
              className="w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="CTO / Banque / Mobile Money…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60">Devise</label>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option>MAD</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </Select>
            </div>
            <div>
              <label className="text-xs text-white/60">Solde initial</label>
              <input
                type="number"
                className="w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-2"
                value={balance}
                onChange={(e) => setBalance(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="btn-ghost px-3 py-2">
              Annuler
            </button>
            <button
              onClick={() =>
                onSubmit({
                  id: init?.id || cryptoId(),
                  name: name.trim() || "Compte",
                  currency,
                  balance: +balance || 0,
                  createdAt: init?.createdAt || new Date().toISOString(),
                })
              }
              className="btn-primary px-3 py-2"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TransferForm({ onClose, onSubmit, accounts }) {
  const [fromId, setFromId] = useState(accounts[0]?.id || "");
  const [toId, setToId] = useState(accounts[1]?.id || "");
  const [amount, setAmount] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-ink-900">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Virement interne</h3>
          <button onClick={onClose} className="btn-ghost">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60">Depuis</label>
              <Select value={fromId} onChange={(e) => setFromId(e.target.value)}>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.currency})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs text-white/60">Vers</label>
              <Select value={toId} onChange={(e) => setToId(e.target.value)}>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.currency})
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/60">Montant</label>
            <input
              type="number"
              className="w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="btn-ghost px-3 py-2">
              Annuler
            </button>
            <button
              onClick={() => onSubmit(fromId, toId, +amount || 0)}
              className="btn-primary px-3 py-2"
            >
              Transférer
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function HoldingForm({ onClose, onSubmit, accounts, tickers, init }) {
  const [ticker, setTicker] = useState(init?.ticker || tickers[0] || "");
  const [accountId, setAccountId] = useState(init?.accountId || accounts[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [fees, setFees] = useState(0);
  const [strategy, setStrategy] = useState(init?.strategy || "Income");
  const [notes, setNotes] = useState(init?.notes || "");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-ink-900">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {init ? "Modifier la position" : "Nouvelle position"}
          </h3>
          <button onClick={onClose} className="btn-ghost">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-white/60">Ticker</label>
              <Select value={ticker} onChange={(e) => setTicker(e.target.value)}>
                {tickers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs text-white/60">Compte</label>
              <Select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.currency})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs text-white/60">Date d’achat</label>
              <input
                type="date"
                className="w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-white/60">Quantité</label>
              <input
                type="number"
                className="w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-2"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-white/60">Prix</label>
              <input
                type="number"
                className="w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-2"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-white/60">Frais</label>
              <input
                type="number"
                className="w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-2"
                value={fees}
                onChange={(e) => setFees(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60">Stratégie</label>
              <Select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                <option>Income</option>
                <option>Long-term</option>
                <option>Swing</option>
              </Select>
            </div>
            <div>
              <label className="text-xs text-white/60">Notes</label>
              <input
                className="w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="btn-ghost px-3 py-2">
              Annuler
            </button>
            <button
              onClick={() =>
                onSubmit({
                  id: init?.id || cryptoId(),
                  ticker,
                  accountId,
                  strategy,
                  notes,
                  lots: [
                    ...(init?.lots || []),
                    { date, quantity: +quantity || 0, price: +price || 0, fees: +fees || 0 },
                  ],
                  sells: init?.sells || [],
                  createdAt: init?.createdAt || new Date().toISOString(),
                })
              }
              className="btn-primary px-3 py-2"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* -----------------------------------------
 * Charts (simple, robust)
 * ----------------------------------------- */
const COLORS = [
  "#14B8A6",
  "#F59E0B",
  "#22C55E",
  "#A78BFA",
  "#38BDF8",
  "#F97316",
  "#E879F9",
  "#4ADE80",
  "#FCA5A5",
  "#67E8F9",
];

/* -----------------------------------------
 * Dashboard
 * ----------------------------------------- */
export default function Dashboard() {
  const companies = useCompanies();
  const tickers = useMemo(
    () =>
      companies
        .map((c) => (c.ticker || "").toUpperCase())
        .filter(Boolean)
        .sort(),
    [companies]
  );

  // Dividendes pour YTD & pipeline (toutes années utile pour pipeline)
  const dividendsYTD = useDividends([nowYear]);
  const dividendsAll = useDividends([2020, 2021, 2022, 2023, 2024, 2025]);

  const store = usePortfolioStore();
  const { accounts, holdings, activities } = store.state;

  // Modals
  const [showWallet, setShowWallet] = useState(false);
  const [editWallet, setEditWallet] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showHolding, setShowHolding] = useState(false);
  const [editHolding, setEditHolding] = useState(null);

  /* ---- KPI calculations ---- */
  const cashMAD = useMemo(
    () =>
      accounts
        .filter((a) => a.currency === "MAD")
        .reduce((s, a) => s + (a.balance || 0), 0),
    [accounts]
  );
  const hasForeign = useMemo(
    () => accounts.some((a) => a.currency !== "MAD"),
    [accounts]
  );

  const invested = useMemo(
    () => holdings.reduce((s, h) => s + totalInvestedHolding(h), 0),
    [holdings]
  );
  const portValue = useMemo(
    () =>
      holdings.reduce((s, h) => s + estimatedValue(h), 0) + cashMAD,
    [holdings, cashMAD]
  );
  const pl = useMemo(() => portValue - invested, [portValue, invested]);
  const plPct = useMemo(
    () => (invested > 0 ? pl / invested : 0),
    [pl, invested]
  );

  // Dividendes YTD basés sur quantité détenue à ex-date
  const dividendsYtdAmount = useMemo(() => {
    const mapHoldings = new Map(holdings.map((h) => [h.ticker.toUpperCase(), h]));
    let total = 0;
    for (const d of dividendsYTD) {
      const t = (d.ticker || "").toUpperCase();
      const h = mapHoldings.get(t);
      if (!h || !d.exDate) continue;
      const q = qtyAtDate(h, d.exDate);
      if (q > 0 && typeof d.amount === "number") {
        total += q * d.amount;
      }
    }
    return total;
  }, [dividendsYTD, holdings]);

  const linesCount = useMemo(
    () => holdings.filter((h) => currentQty(h) > 0).length,
    [holdings]
  );

  /* ---- Charts data ---- */
  // Cashflow mensuel (in/out) basé sur activities + dividendesYTD
  const cashflowMonthly = useMemo(() => {
    const buckets = Array.from({ length: 12 }, (_, i) => ({
      m: monthLabel(i),
      inflow: 0,
      outflow: 0,
    }));
    // activities
    for (const a of activities) {
      const d = new Date(a.date);
      if (d.getFullYear() !== nowYear) continue;
      const i = d.getMonth();
      if (a.type === "DEPOSIT" || a.type === "TRANSFER" || a.type === "SELL") {
        buckets[i].inflow += Math.max(0, a.amount || 0);
        buckets[i].outflow += Math.min(0, a.amount || 0);
      } else if (a.type === "WITHDRAW" || a.type === "BUY") {
        // amount négatif ou positif selon plus haut
        if ((a.amount || 0) >= 0) buckets[i].outflow += a.amount || 0;
        else buckets[i].inflow += Math.abs(a.amount || 0);
      }
    }
    // dividendes
    const mapHoldings = new Map(holdings.map((h) => [h.ticker.toUpperCase(), h]));
    for (const d of dividendsYTD) {
      const i = new Date(d.exDate || d.paymentDate || Date.now()).getMonth();
      const h = mapHoldings.get((d.ticker || "").toUpperCase());
      if (!h) continue;
      const q = d.exDate ? qtyAtDate(h, d.exDate) : currentQty(h);
      if (q > 0 && typeof d.amount === "number") {
        buckets[i].inflow += q * d.amount;
      }
    }
    return buckets;
  }, [activities, dividendsYTD, holdings]);

  // Allocation par titre (poids)
  const allocation = useMemo(() => {
    const totalVal = holdings.reduce((s, h) => s + estimatedValue(h), 0) || 1;
    return holdings
      .map((h) => ({
        ticker: h.ticker,
        value: estimatedValue(h),
        weight: estimatedValue(h) / totalVal,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [holdings]);

  // Répartition sectorielle (donut)
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
      const v = estimatedValue(h);
      map.set(s, (map.get(s) || 0) + v);
      tot += v;
    }
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, value: +v.toFixed(2), pct: v / (tot || 1) }))
      .sort((a, b) => b.value - a.value);
  }, [holdings, sectorByTicker]);

  // Pipeline 60j (exDates/payments)
  const upcoming = useMemo(() => {
    const now = new Date();
    const in60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const mapHoldings = new Map(holdings.map((h) => [h.ticker.toUpperCase(), h]));
    return dividendsAll
      .filter((d) => {
        const t = (d.ticker || "").toUpperCase();
        const h = mapHoldings.get(t);
        if (!h) return false;
        const ex = d.exDate ? new Date(d.exDate) : null;
        const pay = d.paymentDate ? new Date(d.paymentDate) : null;
        const ref = ex || pay;
        if (!ref) return false;
        return ref >= now && ref <= in60 && qtyAtDate(h, d.exDate || d.paymentDate) > 0;
      })
      .sort((a, b) => new Date(a.exDate || a.paymentDate) - new Date(b.exDate || b.paymentDate))
      .slice(0, 12);
  }, [dividendsAll, holdings]);

  /* ---- Handlers ---- */
  const onSaveWallet = (acc) => {
    if (editWallet) store.updateAccount(acc.id, acc);
    else store.addAccount(acc);
    setShowWallet(false);
    setEditWallet(null);
  };
  const onSaveHolding = (h) => {
    if (editHolding) store.updateHolding(h.id, h);
    else store.addHolding(h);
    setShowHolding(false);
    setEditHolding(null);
  };

  /* -----------------------------------------
   * Render
   * ----------------------------------------- */
  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Mon Dashboard</h1>
            <p className="text-white/60 mt-1">
              Suivez vos comptes, positions et revenus de dividendes.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn-ghost px-3 py-2 flex items-center gap-2"
              onClick={() => setShowWallet(true)}
            >
              <Plus className="w-4 h-4" /> Compte
            </button>
            <button
              className="btn-primary px-3 py-2 flex items-center gap-2"
              onClick={() => setShowHolding(true)}
            >
              <Plus className="w-4 h-4" /> Position
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">Valeur portefeuille</div>
              <PiggyBank className="w-5 h-5 text-brand-amber" />
            </div>
            <div className="text-2xl font-bold mt-2">{fmtMAD(portValue)}</div>
            <div className="text-xs text-white/50 mt-1 flex items-center gap-1">
              <Tooltip text="Actions + OPCVM estimés au PRU + Cash MAD" /> Estimé
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">P/L total</div>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold mt-2">
              {fmtMAD(pl)} <span className="text-sm text-white/60">({fmtPct(plPct)})</span>
            </div>
            <div className="text-xs text-white/50 mt-1">vs. Investi</div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">Dividendes YTD</div>
              <Banknote className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-2xl font-bold mt-2">{fmtMAD(dividendsYtdAmount)}</div>
            <div className="text-xs text-white/50 mt-1 flex items-center gap-1">
              <Tooltip text="Somme des paiements de l'année si vous détenez à l'ex-date" />
              Année {nowYear}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">Investi total</div>
              <Building2 className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-xl font-semibold mt-2">{fmtMAD(invested)}</div>
            <div className="text-xs text-white/50 mt-1">Achats – Ventes</div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">Cash (MAD)</div>
              <Wallet className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-xl font-semibold mt-2">{fmtMAD(cashMAD)}</div>
            <div className="text-xs text-white/50 mt-1">
              {hasForeign ? "Comptes étrangers exclus (—)" : "Tous comptes inclus"}
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">Lignes actives</div>
              <Percent className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div className="text-xl font-semibold mt-2">{linesCount}</div>
            <div className="text-xs text-white/50 mt-1">Quantité &gt; 0</div>
          </Card>
        </div>

        {/* Wallet + Holdings */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Wallet */}
          <Section
            title="My Wallet"
            right={
              <div className="flex gap-2">
                <button
                  className="btn-ghost px-3 py-2 flex items-center gap-2"
                  onClick={() => setShowWallet(true)}
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
                <button
                  className="btn-ghost px-3 py-2 flex items-center gap-2"
                  onClick={() => setShowTransfer(true)}
                  disabled={accounts.length < 2}
                  title={accounts.length < 2 ? "Créer au moins 2 comptes" : ""}
                >
                  <ArrowLeftRight className="w-4 h-4" /> Virement
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accounts.map((a) => (
                <Card key={a.id} className="bg-white/[0.02]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-white/60">{a.name}</div>
                      <div className="text-2xl font-semibold mt-1">
                        {fmtNum(a.balance)} {a.currency}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="btn-ghost p-2"
                        onClick={() => {
                          setEditWallet(a);
                          setShowWallet(true);
                        }}
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="btn-ghost p-2"
                        onClick={() => store.removeAccount(a.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="btn-ghost px-3 py-1"
                      onClick={() => store.deposit(a.id, 1000)}
                      title="Dépôt rapide 1000"
                    >
                      + Dépôt
                    </button>
                    <button
                      className="btn-ghost px-3 py-1"
                      onClick={() => store.withdraw(a.id, 500)}
                      title="Retrait rapide 500"
                    >
                      – Retrait
                    </button>
                  </div>
                </Card>
              ))}
              {!accounts.length && (
                <Card>
                  <div className="text-white/60 text-sm">
                    Ajoute ton premier compte pour suivre ton cash.
                  </div>
                </Card>
              )}
            </div>
          </Section>

          {/* Holdings */}
          <div className="xl:col-span-2 space-y-4">
            <Section
              title="Mes positions"
              right={
                <button
                  className="btn-primary px-3 py-2 flex items-center gap-2"
                  onClick={() => setShowHolding(true)}
                >
                  <Plus className="w-4 h-4" /> Ajouter une ligne
                </button>
              }
            >
              <Card>
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/60 border-b border-white/10">
                        <th className="py-2 text-left">Ticker</th>
                        <th className="py-2 text-left">Compte</th>
                        <th className="py-2 text-right">Qté</th>
                        <th className="py-2 text-right">PRU</th>
                        <th className="py-2 text-right">Valeur estimée</th>
                        <th className="py-2 text-right">P/L</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((h) => {
                        const acc = accounts.find((a) => a.id === h.accountId);
                        const q = currentQty(h);
                        const pru = avgCost(h);
                        const val = estimatedValue(h);
                        const investedH = totalInvestedHolding(h);
                        const plH = val - investedH;
                        return (
                          <tr key={h.id} className="border-b border-white/5">
                            <td className="py-2 font-semibold">{h.ticker}</td>
                            <td className="py-2">{acc ? `${acc.name} (${acc.currency})` : "—"}</td>
                            <td className="py-2 text-right">{fmtNum(q)}</td>
                            <td className="py-2 text-right">{fmtMAD(pru)}</td>
                            <td className="py-2 text-right">{fmtMAD(val)}</td>
                            <td className="py-2 text-right">
                              {fmtMAD(plH)}{" "}
                              <span className="text-xs text-white/50">
                                ({fmtPct(investedH > 0 ? plH / investedH : 0)})
                              </span>
                            </td>
                            <td className="py-2 text-right">
                              <a
                                href={`#/company/${h.ticker}`}
                                className="btn-ghost px-3 py-1 text-xs inline-flex items-center gap-1"
                              >
                                Ouvrir <ChevronRight className="w-3 h-3" />
                              </a>
                              <button
                                className="btn-ghost px-2 py-1 text-xs"
                                onClick={() => {
                                  setEditHolding(h);
                                  setShowHolding(true);
                                }}
                                title="Modifier"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                className="btn-ghost px-2 py-1 text-xs"
                                onClick={() => store.removeHolding(h.id)}
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {!holdings.length && (
                        <tr>
                          <td colSpan={7} className="py-6 text-white/60">
                            Aucune position. Ajoute ta première ligne.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </Section>
          </div>
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Cashflow */}
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Cashflow mensuel (YTD)</h3>
            </div>
            <ResponsiveContainer height={280}>
              <BarChart data={cashflowMonthly}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="m" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Legend />
                <RTooltip
                  contentStyle={{
                    background: "rgba(15,17,21,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                  formatter={(v, n) => [fmtMAD(v), n === "inflow" ? "Entrées" : "Sorties"]}
                />
                <Bar dataKey="inflow" name="Entrées" fill="#10B981" />
                <Bar dataKey="outflow" name="Sorties" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Donut sectoriel */}
          <Card>
            <h3 className="font-semibold mb-3">Répartition sectorielle</h3>
            {sectorDonut.length ? (
              <ResponsiveContainer height={280}>
                <PieChart>
                  <Pie
                    data={sectorDonut}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {sectorDonut.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip
                    contentStyle={{
                      background: "rgba(15,17,21,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                    }}
                    formatter={(v, n, p) => [
                      `${fmtMAD(v)} (${(p?.payload?.pct * 100).toFixed(1)}%)`,
                      p?.payload?.name || "Secteur",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-white/60 text-sm">Aucune donnée</div>
            )}
          </Card>

          {/* Allocation par titre */}
          <Card className="xl:col-span-2">
            <h3 className="font-semibold mb-3">Top 10 — Allocation par titre</h3>
            <ResponsiveContainer height={300}>
              <BarChart data={allocation}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="ticker" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <RTooltip
                  contentStyle={{
                    background: "rgba(15,17,21,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                  formatter={(v, n, p) => [fmtMAD(v), p?.payload?.ticker || "Titre"]}
                />
                <Bar dataKey="value" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pipeline 60j */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Dividendes à venir (J+60)</h3>
              <a href="#/calendar" className="btn-ghost px-3 py-1 text-sm">
                Voir Calendrier
              </a>
            </div>
            <div className="space-y-2">
              {upcoming.map((d, i) => (
                <a
                  key={`${d.ticker}-${i}`}
                  href={`#/company/${d.ticker}`}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/60">
                      {fmtDate(d.exDate || d.paymentDate)}
                    </span>
                    <span className="font-semibold">{d.ticker}</span>
                    <span className="text-xs text-white/60">{d.company}</span>
                  </div>
                  <div className="text-sm">
                    {typeof d.amount === "number" ? `${d.amount.toFixed(2)} / action` : "—"}
                  </div>
                </a>
              ))}
              {!upcoming.length && (
                <div className="text-white/60 text-sm">Aucune ex-date d’ici 60 jours.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Activités récentes */}
        <Section title="Activités récentes" right={<div className="flex items-center gap-2 text-white/50 text-sm"><Search className="w-4 h-4" /> <Filter className="w-4 h-4" /></div>}>
          <Card>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/60 border-b border-white/10">
                    <th className="py-2 text-left">Type</th>
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Compte</th>
                    <th className="py-2 text-left">Ticker</th>
                    <th className="py-2 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.slice(0, 10).map((a) => {
                    const acc = accounts.find((x) => x.id === a.accountId);
                    return (
                      <tr key={a.id} className="border-b border-white/5">
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
                      <td colSpan={5} className="py-6 text-white/60">
                        Aucune activité pour l’instant.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </Section>
      </div>

      {/* Modals */}
      {showWallet && (
        <WalletForm
          init={editWallet || undefined}
          onClose={() => {
            setShowWallet(false);
            setEditWallet(null);
          }}
          onSubmit={onSaveWallet}
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
          init={editHolding || undefined}
          onClose={() => {
            setShowHolding(false);
            setEditHolding(null);
          }}
          onSubmit={onSaveHolding}
          accounts={accounts.length ? accounts : [{ id: "none", name: "—", currency: "MAD" }]}
          tickers={tickers.length ? tickers : ["IAM", "ATW", "BCP"]}
        />
      )}
    </div>
  );
}
