import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, DollarSign, PieChart, Plus, Filter, Download, Bell, User, Crown, BookOpen, Menu, X, Copy, Check, LogOut, Settings, ChevronDown } from 'lucide-react';
import { getAllDividends, getCompanies } from '../services/dataService';
import { DATA_YEARS } from '../constants/paths';

const userData = {
  name: "Yuri Atouahri",
  email: "yuri@example.com",
  subscriptionTier: "free",
  avatar: "YB",
  joinedDate: "2024-10-15"
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedTicker, setCopiedTicker] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [year, setYear] = useState("2024");
  const [rows, setRows] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [companiesData] = await Promise.all([
          getCompanies()
        ]);
        setCompanies(companiesData);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const years = year === "tous" ? DATA_YEARS : [Number(year)];
        const dividendsData = await getAllDividends(years);
        setRows(dividendsData);
      } catch (err) {
        console.error("Error loading dividends:", err);
      }
    })();
  }, [year]);

  const portfolioData = companies.slice(0, 6).map((c, i) => {
    const companyRows = rows.filter(r => r.ticker === c.ticker);
    const totalDiv = companyRows.reduce((sum, r) => sum + (r.amount || 0), 0);
    const avgDiv = companyRows.length > 0 ? totalDiv / companyRows.length : 0;
    const shares = [50, 30, 75, 40, 120, 60][i] || 10;
    const purchasePrice = [140, 520, 280, 195, 12.5, 85][i] || 100;
    const currentPrice = purchasePrice * (1 + Math.random() * 0.1);

    const nextDiv = companyRows.find(r => r.exDate && new Date(r.exDate) > new Date());

    return {
      ticker: c.ticker,
      name: c.name,
      shares,
      purchasePrice,
      currentPrice,
      dividendYield: avgDiv > 0 ? ((avgDiv / currentPrice) * 100) : 4.5,
      sector: c.sector || "—",
      cdrs: Math.round(70 + Math.random() * 30),
      prt: Math.round(15 + Math.random() * 20),
      ndf: Math.round(70 + Math.random() * 30),
      nextDividend: nextDiv ? {
        date: nextDiv.exDate,
        amount: nextDiv.amount || 0,
        status: "confirmed"
      } : {
        date: new Date(Date.now() + 90*24*60*60*1000).toISOString().split('T')[0],
        amount: avgDiv || 5.0,
        status: "estimated"
      }
    };
  });

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(2024, i + 5, 1);
    const monthName = month.toLocaleDateString('fr-FR', { month: 'short' });
    const monthRows = rows.filter(r => {
      if (!r.exDate) return false;
      const d = new Date(r.exDate);
      return d.getMonth() === month.getMonth();
    });
    const total = monthRows.reduce((sum, r) => sum + (r.amount || 0), 0);
    return {
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      dividendes: Math.round(total * 100)
    };
  });

  const calculateStats = () => {
    const totalValue = portfolioData.reduce((sum, stock) =>
      sum + (stock.shares * stock.currentPrice), 0
    );
    const totalCost = portfolioData.reduce((sum, stock) =>
      sum + (stock.shares * stock.purchasePrice), 0
    );
    const avgYield = portfolioData.length > 0
      ? portfolioData.reduce((sum, stock) => sum + (stock.dividendYield || 0), 0) / portfolioData.length
      : 0;
    const ytdIncome = chartData.reduce((sum, month) => sum + month.dividendes, 0);

    return {
      totalYield: totalCost > 0 ? ((totalValue - totalCost) / totalCost * 100).toFixed(1) : "0.0",
      ytdIncome,
      avgDividendYield: avgYield.toFixed(1),
      upcomingPayments: portfolioData.filter(s =>
        s.nextDividend && new Date(s.nextDividend.date) <= new Date(Date.now() + 7*24*60*60*1000)
      ).length,
      totalStocks: portfolioData.length
    };
  };

  const stats = calculateStats();

  useEffect(() => {
    if (parseFloat(stats.totalYield) > 5) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [stats.totalYield]);

  const copyTicker = (ticker) => {
    navigator.clipboard.writeText(ticker);
    setCopiedTicker(ticker);
    setTimeout(() => setCopiedTicker(null), 2000);
  };

  const upcomingDividends = portfolioData
    .sort((a, b) => new Date(a.nextDividend.date) - new Date(b.nextDividend.date))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0B0D] text-white">
        <div className="text-zinc-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-[50rem] h-[50rem] rounded-full blur-[160px] bg-gradient-to-br from-teal-500/12 to-emerald-400/6 animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-[55rem] h-[55rem] rounded-full blur-[180px] bg-gradient-to-br from-orange-500/15 to-amber-400/10 animate-pulse"
          style={{ animationDuration: "15s" }}
        />
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <a
              href="#/"
              className="flex items-center gap-2 group"
            >
              <span
                className="text-[21px] font-semibold tracking-[-0.04em] bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90"
                style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui" }}
              >
                CasaDividendes
              </span>
              <span className="px-2 py-1 rounded-full text-[11px] bg-white/[0.06] border border-white/10 text-white/80">
                Beta
              </span>
            </a>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { icon: PieChart, label: 'Dashboard', href: '#/dashboard', active: true },
              { icon: Calendar, label: 'Calendrier', href: '#/calendar' },
              { icon: TrendingUp, label: 'Palmarès', href: '#/ranking' },
              { icon: Bell, label: 'Mes Alertes', href: '#/alerts' },
              { icon: User, label: 'Mon Profil', href: '#/profile' },
              { icon: Crown, label: 'Premium', href: '#/premium', badge: true },
              { icon: BookOpen, label: 'Blog', href: '#/blog' }
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-500/20 border border-teal-500/30 shadow-lg shadow-teal-500/10'
                    : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full font-semibold">
                    Pro
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="lg:ml-64 relative">
        <header className="sticky top-0 z-40 bg-[#0B0B0D]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Bonjour, {userData.name.split(' ')[0]} 👋
                </h2>
                <p className="text-sm text-zinc-500">
                  Bienvenue sur votre tableau de bord dividendes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs bg-zinc-900/60 border border-zinc-800 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                {userData.subscriptionTier === 'free' ? 'Gratuit' : 'Premium'}
              </span>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center font-bold text-white">
                    {userData.avatar}
                  </div>
                  <ChevronDown size={16} className="text-zinc-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="font-semibold">{userData.name}</p>
                      <p className="text-sm text-zinc-400">{userData.email}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
                        <Settings size={18} />
                        <span className="text-sm">Paramètres</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left text-red-400">
                        <LogOut size={18} />
                        <span className="text-sm">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: TrendingUp,
                label: 'Rendement Total',
                value: `${stats.totalYield}%`,
                trend: parseFloat(stats.totalYield) > 0 ? 'up' : 'down',
                color: 'from-emerald-500 to-teal-500',
                glow: 'emerald'
              },
              {
                icon: DollarSign,
                label: 'Revenus YTD',
                value: `${stats.ytdIncome.toLocaleString()} MAD`,
                subtext: '+18% vs 2024',
                color: 'from-amber-400 to-orange-400',
                glow: 'amber'
              },
              {
                icon: Calendar,
                label: 'Prochains Dividendes',
                value: `${stats.upcomingPayments}`,
                subtext: '7 prochains jours',
                color: 'from-teal-400 to-cyan-400',
                glow: 'teal'
              },
              {
                icon: PieChart,
                label: 'Actions Suivies',
                value: `${stats.totalStocks}`,
                subtext: `${stats.avgDividendYield}% rendement moy.`,
                color: 'from-purple-400 to-pink-400',
                glow: 'purple'
              }
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all hover:scale-105 cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <p className="text-sm text-zinc-500 mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                    {stat.trend && (
                      <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.trend === 'up' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                  {stat.subtext && (
                    <p className="text-xs text-zinc-500 mt-1">{stat.subtext}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-semibold tracking-tight">Mon Portefeuille</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 text-sm">
                  <Filter size={18} />
                  Filtrer
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 text-sm">
                  <Download size={18} />
                  Export
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-lg transition-all flex items-center gap-2 font-semibold text-sm shadow-lg shadow-teal-500/20">
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-500">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-500">Qté</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-500">Prix Achat</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-500">Prix Actuel</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-500">Scores</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-500">Rendement</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-500">Prochain Div.</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((stock, i) => {
                    const gain = ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice * 100).toFixed(1);
                    return (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold">
                              {stock.ticker.slice(0,2)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{stock.ticker}</span>
                                <button
                                  onClick={() => copyTicker(stock.ticker)}
                                  className="text-zinc-500 hover:text-white transition-colors"
                                >
                                  {copiedTicker === stock.ticker ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                              </div>
                              <p className="text-sm text-zinc-400">{stock.name}</p>
                              <span className="text-xs text-zinc-600">{stock.sector}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold">{stock.shares}</td>
                        <td className="py-4 px-4 text-zinc-400">
                          {typeof stock.purchasePrice === 'number' ? stock.purchasePrice.toFixed(2) : '—'} MAD
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold">
                              {typeof stock.currentPrice === 'number' ? stock.currentPrice.toFixed(2) : '—'} MAD
                            </p>
                            <p className={`text-xs font-medium ${parseFloat(gain) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {parseFloat(gain) > 0 ? '+' : ''}{gain}%
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-1">
                            <span className="px-2 py-1 bg-teal-500/10 border border-teal-500/20 rounded text-xs font-semibold text-teal-300" title="C-DRS">
                              {stock.cdrs}
                            </span>
                            <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs font-semibold text-purple-300" title="PRT">
                              {stock.prt}j
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-full text-sm font-semibold text-emerald-300">
                            {typeof stock.dividendYield === 'number' ? stock.dividendYield.toFixed(1) : '—'}%
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm font-semibold">
                              {typeof stock.nextDividend.amount === 'number' ? stock.nextDividend.amount.toFixed(2) : '—'} MAD
                            </p>
                            <p className="text-xs text-zinc-500">
                              {stock.nextDividend.date ? new Date(stock.nextDividend.date).toLocaleDateString('fr-FR') : '—'}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`w-2 h-2 rounded-full ${stock.nextDividend.status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                              <span className={`text-xs ${stock.nextDividend.status === 'confirmed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {stock.nextDividend.status === 'confirmed' ? 'Confirmé' : 'Estimé'}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold tracking-tight mb-6">Performance Dividendes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#0D9488" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#71717A"
                    tick={{ fill: '#71717A', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis
                    stroke="#71717A"
                    tick={{ fill: '#71717A', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                    itemStyle={{ color: '#14B8A6' }}
                  />
                  <Bar
                    dataKey="dividendes"
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold tracking-tight mb-6">Prochains Dividendes</h3>
              <div className="space-y-4">
                {upcomingDividends.map((stock, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold">
                      {stock.ticker.slice(0,2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{stock.ticker}</span>
                        <span className={`w-2 h-2 rounded-full ${stock.nextDividend.status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      </div>
                      <p className="text-sm text-zinc-400">
                        {stock.nextDividend.date ? new Date(stock.nextDividend.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {typeof stock.nextDividend.amount === 'number' ? stock.nextDividend.amount.toFixed(2) : '—'} MAD
                      </p>
                      <p className="text-xs text-zinc-500">par action</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
