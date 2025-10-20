import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";

const AVAILABLE_YEARS = [2020, 2021, 2022, 2023, 2024];

/* =========================================================================
   SIDEBAR NEWS (desktop >= xl)
   ========================================================================= */
/* ======= REPLACE L5–L85 START ======= */
function timeAgo(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  const mins = Math.floor(s / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (mins > 0) return `${mins}m`;
  return `${s}s`;
}

function detectTag(title = "") {
  const t = title.toLowerCase();
  if (/(ex[- ]?date|détachement|ex-div)/.test(t)) return "Ex-Date";
  if (/(payment|paiement|payé)/.test(t)) return "Paiement";
  if (/(earnings|résultats|q\d|trimestre)/.test(t)) return "Résultats";
  if (/(agm|assemblée)/.test(t)) return "AGM";
  return null;
}

function getFavicon(url = "") {
  try {
    const u = new URL(url);
    return `${u.origin}/favicon.ico`;
  } catch {
    return "/favicon.ico";
  }
}

function NewsCard({ item, saved, pinned, read, onToggleSave, onTogglePin, onOpen }) {
  const tag = detectTag(item.title);
  return (
    <article
      className={`relative p-4 border border-zinc-800 rounded-xl transition-all group ${
        read ? "opacity-70" : ""
      } hover:bg-zinc-800/40 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10
         ring-0 hover:ring-1 hover:ring-teal-500/30 hover:scale-[1.01]`}
    >
      {/* Actions rapides */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <button
          onClick={(e) => { e.preventDefault(); onTogglePin(item); }}
          className={`text-xs px-2 py-1 rounded-md border transition
            ${pinned ? "border-yellow-400 text-yellow-300 bg-yellow-400/10" : "border-zinc-700 text-zinc-400 hover:text-yellow-300"}`}
          title={pinned ? "Unpin" : "Pin"}
        >
          📌
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onToggleSave(item); }}
          className="text-xs px-2 py-1 rounded-md border border-zinc-700 text-zinc-400 hover:text-yellow-300 transition"
          title={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      {/* Meta-bar */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
        <img src={item.favicon || getFavicon(item.url)} alt="" className="w-4 h-4 rounded-sm opacity-80" />
        <span className="truncate max-w-[140px]">{item.source}</span>
        <span>•</span>
        <time title={item.date}>{timeAgo(item.date)}</time>
        {tag && (
          <>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-300">{tag}</span>
          </>
        )}
      </div>

      {/* Contenu cliquable */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener"
        onClick={(e) => { onOpen(item); }}
        className="block"
      >
        <h3 className="text-zinc-100 font-medium group-hover:text-teal-400 transition line-clamp-2">
          {item.title}
        </h3>
        {item.image && (
          <img
            src={item.image}
            alt=""
            className="mt-3 rounded-lg border border-zinc-800 w-full max-h-36 object-cover"
            loading="lazy"
          />
        )}
        <p className="text-sm text-zinc-400 mt-2 line-clamp-3">{item.excerpt}</p>
        <span className="text-[#EAB308] text-sm mt-2 inline-block">Read More →</span>
      </a>
    </article>
  );
}

function NewsSidebar() {
  // Données statiques pour le front uniquement (remplace si besoin)
  const [news] = React.useState([
    {
      source: "Bloomberg",
      date: "2025-10-15T07:00:00Z",
      title: "Morocco’s Market Rebounds as Dividend Season Approaches",
      excerpt:
        "Analysts expect strong payout ratios across telecom and banking sectors as listed companies finalize 2025 distributions.",
      url: "#",
      image: "",
    },
    {
      source: "Reuters",
      date: "2025-10-14T10:30:00Z",
      title: "Casablanca Exchange Gains Momentum After Q3 Earnings",
      excerpt:
        "Banks and insurers lead gains on the BVC, supported by better-than-expected results and dividend outlook.",
      url: "#",
      image: "",
    },
    {
      source: "Les Éco",
      date: "2025-10-12T12:00:00Z",
      title: "Les dividendes marocains continuent de séduire les investisseurs",
      excerpt:
        "Malgré la volatilité, les dividendes restent une source stable de revenus pour les porteurs à long terme.",
      url: "#",
      image: "",
    },
  ]);

  // États UI: favoris, pins, lus
  const [saved, setSaved] = React.useState(() => new Set());
  const [pinned, setPinned] = React.useState(() => new Set());
  const [read, setRead] = React.useState(() => new Set());

  const onToggleSave = (item) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(item.url) ? next.delete(item.url) : next.add(item.url);
      return next;
    });
  };

  const onTogglePin = (item) => {
    setPinned((prev) => {
      const next = new Set(prev);
      next.has(item.url) ? next.delete(item.url) : next.add(item.url);
      return next;
    });
  };

  const onOpen = (item) => {
    setRead((prev) => new Set([...prev, item.url]));
  };

  // Tri: pins d'abord, puis date desc
  const items = [...news].sort((a, b) => {
    const ap = pinned.has(a.url) ? 1 : 0;
    const bp = pinned.has(b.url) ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return new Date(b.date) - new Date(a.date);
  });

  return (
   <aside className="hidden xl:block w-[320px] sticky top-10 self-start h-fit">
  <div
    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 backdrop-blur
               max-h-[calc(100vh-4rem)] sidebar-maxh flex flex-col min-h-0"
  >
    {/* Header (fixe) */}
    <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
      📰 <span>Financial News Feed</span>
    </h2>

    {/* Liste d’articles (seule zone scrollable) */}
    <div className="flex-1 overflow-y-auto scrollbar-hide overscroll-contain pr-1 space-y-5 min-h-0">
      {items.map((item) => (
        <NewsCard
          key={item.url}
          item={{ ...item, favicon: getFavicon(item.url) }}
          saved={saved.has(item.url)}
          pinned={pinned.has(item.url)}
          read={read.has(item.url)}
          onToggleSave={onToggleSave}
          onTogglePin={onTogglePin}
          onOpen={onOpen}
        />
      ))}
    </div>

    {/* Newsletter (fixe en bas) */}
    <div className="border-t border-zinc-800 pt-4 mt-4">
      <h3 className="text-md font-semibold mb-2">📬 Newsletter</h3>
      <p className="text-sm text-zinc-400 mb-3">
        Recevez chaque semaine les dernières actualités et analyses.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Votre email"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-teal-500 outline-none"
        />
        <button className="px-3 py-2 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 text-sm rounded-lg">
          S&apos;abonner
        </button>
      </div>
    </div>
  </div>
</aside>
  );
}
/* ======= REPLACE L5–L85 END ======= */


/* =========================================================================
   PAGE CALENDRIER (version VF conservée + wrapper full-width + sidebar)
   ========================================================================= */
export default function Calendar() {
  const [view, setView] = useState("calendar");
  const [dividends, setDividends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [filters, setFilters] = useState({
    year: "tous",
    company: "tous",
    sector: "tous",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [favorites, setFavorites] = useState([]);
  const [timelineView, setTimelineView] = useState("year");

  useEffect(() => {
    const loadDividends = async () => {
      setLoading(true);
      try {
        let allDividends = [];

        if (filters.year === "tous") {
          const promises = AVAILABLE_YEARS.map(year =>
            fetch(`/data/dividends/${year}.json`)
              .then(res => {
                if (!res.ok) {
                  console.warn(`Fichier ${year}.json introuvable`);
                  return [];
                }
                return res.json();
              })
              .catch(err => {
                console.warn(`Erreur lors du chargement de ${year}.json:`, err);
                return [];
              })
          );

          const results = await Promise.all(promises);
          allDividends = results.flat();
        } else {
          const year = filters.year;
          const response = await fetch(`/data/dividends/${year}.json`);
          if (response.ok) {
            allDividends = await response.json();
          } else {
            console.warn(`Aucune donnée pour l'année ${year}`);
            allDividends = [];
          }
        }

        setDividends(allDividends);
      } catch (error) {
        console.error("Erreur lors du chargement des dividendes:", error);
        setDividends([]);
      } finally {
        setLoading(false);
      }
    };

    loadDividends();
  }, [filters.year]);

  useEffect(() => {
    let filtered = [...dividends];

    if (filters.year !== "tous") {
      filtered = filtered.filter((d) => d.year === parseInt(filters.year));
    }
    if (filters.company !== "tous") {
      filtered = filtered.filter((d) => d.ticker === filters.company);
    }
    if (filters.sector !== "tous") {
      filtered = filtered.filter((d) => d.sector === filters.sector);
    }

    filtered.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return new Date(b.paymentDate) - new Date(a.paymentDate);
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [dividends, filters]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const uniqueCompanies = {};
    dividends.forEach((d) => {
      if (!uniqueCompanies[d.ticker]) {
        uniqueCompanies[d.ticker] = {
          ticker: d.ticker,
          name: d.company,
          sector: d.sector,
          count: 0,
        };
      }
      uniqueCompanies[d.ticker].count++;
    });

    const companies = Object.values(uniqueCompanies);
    const query = searchQuery.toLowerCase();

    const filtered = companies.filter(
      (company) =>
        company.ticker.toLowerCase().includes(query) ||
        company.name.toLowerCase().includes(query) ||
        company.sector.toLowerCase().includes(query)
    );

    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchQuery, dividends]);

  const uniqueYears = [...new Set(dividends.map((d) => d.year))].sort((a, b) => b - a);
  const uniqueCompanies = [
    ...new Map(dividends.map((d) => [d.ticker, { ticker: d.ticker, name: d.company }])).values(),
  ].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  const uniqueSectors = [...new Set(dividends.map((d) => d.sector))].sort();

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Timeline - Distribution par mois/trimestre
  const getMonthlyDistribution = () => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    const distribution = new Array(12).fill(0);

    dividends.forEach((d) => {
      if (d.year === 2024) {
        const month = new Date(d.exDate).getMonth();
        if (!Number.isNaN(month)) distribution[month]++;
      }
    });

    const maxCount = Math.max(...distribution, 1);

    return months.map((name, index) => ({
      name,
      fullName: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ][index],
      count: distribution[index],
      height: (distribution[index] / maxCount) * 100,
      month: index,
    }));
  };

  const getQuarterlyDistribution = () => {
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const distribution = new Array(4).fill(0);

    dividends.forEach((d) => {
      if (d.year === 2024) {
        const month = new Date(d.exDate).getMonth();
        if (!Number.isNaN(month)) distribution[Math.floor(month / 3)]++;
      }
    });

    const maxCount = Math.max(...distribution, 1);

    return quarters.map((name, index) => ({
      name,
      fullName: `T${index + 1} 2024`,
      count: distribution[index],
      height: (distribution[index] / maxCount) * 100,
      months: ["Jan-Mar", "Avr-Jun", "Jul-Sep", "Oct-Déc"][index],
    }));
  };

  const monthlyData = getMonthlyDistribution();
  const quarterlyData = getQuarterlyDistribution();

  // Countdown - Prochains événements
  const getUpcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = filteredData
      .map((d) => ({
        ...d,
        exDate: new Date(d.exDate),
        paymentDate: new Date(d.paymentDate),
      }))
      .filter((d) => d.exDate >= today || d.paymentDate >= today)
      .sort((a, b) => {
        const aDate = a.exDate >= today ? a.exDate : a.paymentDate;
        const bDate = b.exDate >= today ? b.exDate : b.paymentDate;
        return aDate - bDate;
      })
      .slice(0, 5)
      .map((d) => {
        const nextDate = d.exDate >= today ? d.exDate : d.paymentDate;
        const isExDate = d.exDate >= today;
        const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

        let urgency = "future";
        if (daysUntil <= 3) urgency = "imminent";
        else if (daysUntil <= 7) urgency = "proche";
        else if (daysUntil <= 30) urgency = "avenir";

        return {
          ...d,
          nextDate,
          isExDate,
          daysUntil,
          urgency,
          dateLabel: isExDate ? "Détachement" : "Paiement",
        };
      });

    return upcoming;
  }, [filteredData]);

  // Stats calculations
  const upcomingEventsCount = getUpcomingEvents.length;

  const mostActiveMonth = monthlyData.reduce((max, curr) => (curr.count > max.count ? curr : max), monthlyData[0]);

  const avgDelay =
    filteredData.length > 0
      ? Math.round(
          filteredData.reduce((sum, d) => {
            const ex = new Date(d.exDate);
            const pay = new Date(d.paymentDate);
            const diff = Math.floor((pay - ex) / (1000 * 60 * 60 * 24));
            return sum + diff;
          }, 0) / filteredData.length
        )
      : 0;

  const bankDelay = filteredData
    .filter((d) => d.sector === "Banques")
    .reduce((sum, d, idx, arr) => {
      const ex = new Date(d.exDate);
      const pay = new Date(d.paymentDate);
      const diff = Math.floor((pay - ex) / (1000 * 60 * 60 * 24));
      return idx === arr.length - 1 ? Math.round((sum + diff) / arr.length) : sum + diff;
    }, 0);

  const inProgressPayments = filteredData.filter((d) => {
    const exDate = new Date(d.exDate);
    const payDate = new Date(d.paymentDate);
    const today = new Date();
    return exDate < today && payDate > today;
  }).length;

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ year: "tous", company: "tous", sector: "tous" });
    setSearchQuery("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatAmount = (amount) => {
    return `${Number(amount).toFixed(2)} MAD`;
  };

  const handleSelectCompany = (ticker) => {
    window.location.hash = `#/company/${ticker}`;
  };

  const toggleFavorite = (ticker) => {
    setFavorites((prev) => (prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]));
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getDividendsForDay = (day, month, year) => {
    return filteredData.filter((d) => {
      const exDate = new Date(d.exDate);
      const payDate = new Date(d.paymentDate);
      const checkDate = new Date(year, month, day);

      return exDate.toDateString() === checkDate.toDateString() || payDate.toDateString() === checkDate.toDateString();
    });
  };

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const LoadingSkeleton = () => (
    <div className="mt-6 space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 bg-zinc-900/50 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const today = new Date();
    const isToday = (day) => {
      return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    const days = [];
    const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    // Headers
    dayNames.forEach((name) => {
      days.push(
        <div key={`header-${name}`} className="text-center p-3 text-zinc-400 font-semibold text-sm">
          {name}
        </div>
      );
    });

    // Empty cells before month starts (Mon-based grid)
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 min-h-[100px] opacity-30"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDividends = getDividendsForDay(day, month, year);
      const isTodayDate = isToday(day);

      days.push(
        <div
          key={`day-${day}`}
          className={`p-2 min-h-[100px] border border-zinc-800 rounded-lg bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-teal-500/50 transition-all cursor-pointer ${
            isTodayDate ? "ring-2 ring-teal-500" : ""
          }`}
        >
          <div className={`font-semibold mb-2 text-sm ${isTodayDate ? "text-teal-400" : "text-zinc-400"}`}>
            {isTodayDate ? (
              <span className="bg-teal-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {day}
              </span>
            ) : (
              day
            )}
          </div>
          <div className="space-y-1">
            {dayDividends.slice(0, 3).map((div, idx) => {
              const exDate = new Date(div.exDate);
              const checkDate = new Date(year, month, day);
              const isExDate = exDate.toDateString() === checkDate.toDateString();

              return (
                <div
                  key={`${div.ticker}-${idx}`}
                  className={`text-xs px-2 py-1 rounded ${
                    isExDate
                      ? "bg-red-500/20 text-red-300 border-l-2 border-red-500"
                      : "bg-green-500/20 text-green-300 border-l-2 border-green-500"
                  } truncate hover:scale-105 transition-transform`}
                  title={`${div.ticker} - ${div.company}`}
                >
                  {div.ticker}
                </div>
              );
            })}
            {dayDividends.length > 3 && (
              <div className="text-xs text-zinc-500 text-center">+{dayDividends.length - 3}</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "imminent":
        return "border-red-500 bg-red-500/10";
      case "proche":
        return "border-yellow-500 bg-yellow-500/10";
      case "avenir":
        return "border-blue-500 bg-blue-500/10";
      default:
        return "border-zinc-700 bg-zinc-900/30";
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case "imminent":
        return "🔴";
      case "proche":
        return "🟡";
      case "avenir":
        return "🔵";
      default:
        return "⚪";
    }
  };

  /* ===========================
     RENDER (wrapper + sidebar)
     =========================== */
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-200">
      <Helmet>
        <title>Calendrier des Dividendes - CasaDividendes</title>
        <meta
          name="description"
          content="Calendrier interactif des dividendes de la Bourse de Casablanca. Timeline, countdown et analyse temporelle."
        />
      </Helmet>

      {/* Full-width container + sidebar + content */}
      <div className="max-w-[1800px] mx-auto flex gap-6 px-6 pt-8">
        {/* Sidebar News (desktop) */}
        <NewsSidebar />

        {/* MAIN CONTENT (VF conservée) */}
        <main className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6 animate-[fadeIn_0.6s_ease-out]">
            <div>
              <h1 className="text-white text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                Calendrier des Dividendes
              </h1>
              <p className="text-zinc-400 mt-2">
                Suivez toutes les dates de détachement et de paiement des{" "}
                <span className="text-teal-400 font-medium">dividendes</span> à la BVC
              </p>
            </div>
          </div>

          {/* Timeline - Distribution temporelle */}
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-6 animate-[fadeIn_0.6s_ease-out_0.2s_backwards]">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <span className="text-xl">📊</span>
                Distribution annuelle 2024
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimelineView("year")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    timelineView === "year"
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-700 hover:bg-zinc-800"
                  }`}
                >
                  Mois
                </button>
                <button
                  onClick={() => setTimelineView("quarter")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    timelineView === "quarter"
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-700 hover:bg-zinc-800"
                  }`}
                >
                  Trimestre
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-full pb-2">
                {(timelineView === "year" ? monthlyData : quarterlyData).map((period, index) => (
                  <div
                    key={period.name}
                    className="flex-1 min-w-[70px] group cursor-pointer"
                    onClick={() => timelineView === "year" && setCurrentMonth(new Date(2024, period.month, 1))}
                  >
                    <div className="text-center mb-2 text-xs text-zinc-500 font-semibold">{period.name}</div>
                    <div className="relative h-12 bg-zinc-800/30 rounded-lg overflow-hidden hover:bg-zinc-800/50 transition-all">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500/70 to-teal-500/30 rounded-lg transition-all duration-700"
                        style={{
                          height: `${period.height}%`,
                          animationDelay: `${index * 0.05}s`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm z-10">{period.count}</span>
                      </div>
                    </div>
                    {timelineView === "year" && (
                      <div className="text-center mt-1 text-xs text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Cliquer
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Banner */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-500/20 animate-[fadeIn_0.6s_ease-out_0.3s_backwards]">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⭐</div>
              <div>
                <h3 className="text-white text-lg font-bold">Fonctionnalités Premium</h3>
                <p className="text-white/80 text-sm">Passez à la vitesse supérieure : alertes, exports et synchronisation.</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm hover:bg-white/30 transition-all opacity-60 cursor-not-allowed flex items-center gap-2">
                <span>⏰</span> Alertes J-3
              </button>
              <button className="px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm hover:bg-white/30 transition-all opacity-60 cursor-not-allowed flex items-center gap-2">
                <span>📧</span> Notifications
              </button>
              <button className="px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm hover:bg-white/30 transition-all opacity-60 cursor-not-allowed flex items-center gap-2">
                <span>📥</span> Export CSV
              </button>
              <button className="px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm hover:bg-white/30 transition-all opacity-60 cursor-not-allowed flex items-center gap-2">
                <span>📅</span> Export iCal
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="mt-6 flex gap-2 animate-[slideIn_0.6s_ease-out_0.4s_backwards]">
            <button
              onClick={() => setView("calendar")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                view === "calendar"
                  ? "bg-teal-500/20 border-2 border-teal-500 text-teal-400 shadow-lg shadow-teal-500/20"
                  : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <span>📅</span> Vue Calendrier
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                view === "table"
                  ? "bg-teal-500/20 border-2 border-teal-500 text-teal-400 shadow-lg shadow-teal-500/20"
                  : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <span>📊</span> Vue Tableau
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative animate-[slideIn_0.6s_ease-out_0.5s_backwards]">
            <div className="relative flex items-center bg-zinc-900/40 backdrop-blur border border-zinc-700 rounded-xl p-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
              <span className="text-zinc-500 text-xl mr-3">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une société ou un ticker..."
                className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 w-7 h-7 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:scale-110 transition-all flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950/98 backdrop-blur-xl border border-zinc-700 rounded-xl max-h-96 overflow-y-auto z-50 shadow-2xl animate-[fadeIn_0.3s_ease-out]">
                {searchResults.map((company) => (
                  <div
                    key={company.ticker}
                    onClick={() => {
                      handleFilterChange("company", company.ticker);
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="p-4 border-b border-zinc-800 hover:bg-teal-500/10 cursor-pointer transition-all flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-teal-400 font-bold text-lg">{company.ticker}</span>
                      <div>
                        <div className="text-zinc-200 font-medium">{company.name}</div>
                        <div className="text-zinc-500 text-sm">{company.sector}</div>
                      </div>
                    </div>
                    <span className="text-teal-400 text-sm bg-teal-500/20 px-3 py-1 rounded-full font-semibold">
                      {company.count} div.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sticky top-20 z-40 backdrop-blur animate-[slideIn_0.6s_ease-out_0.6s_backwards]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
              >
                <option value="tous">Toutes les années</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
              >
                <option value="tous">Toutes les sociétés</option>
                {uniqueCompanies.map((comp) => (
                  <option key={comp.ticker} value={comp.ticker}>
                    {comp.name || comp.ticker}
                  </option>
                ))}
              </select>

              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange("sector", e.target.value)}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
              >
                <option value="tous">Tous les secteurs</option>
                {uniqueSectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>

              <button
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm hover:bg-zinc-800 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
              >
                🔄 Réinitialiser
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Calendar View */}
              {view === "calendar" && (
                <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 animate-[fadeIn_0.4s_ease-out]">
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h2 className="text-white text-2xl font-bold">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeMonth(-1)}
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:border-teal-500 transition-all text-sm"
                      >
                        ← Précédent
                      </button>
                      <button
                        onClick={goToToday}
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:border-teal-500 transition-all text-sm"
                      >
                        Aujourd&apos;hui
                      </button>
                      <button
                        onClick={() => changeMonth(1)}
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:border-teal-500 transition-all text-sm"
                      >
                        Suivant →
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>

                  <div className="flex gap-6 justify-center mt-6 text-sm text-zinc-400 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500/50 rounded"></div>
                      <span>Date de détachement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500/50 rounded"></div>
                      <span>Date de paiement</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Table View */}
              {view === "table" && (
                <>
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 animate-[fadeIn_0.4s_ease-out]">
                    <table className="min-w-full text-sm">
                      <thead className="bg-zinc-900 text-zinc-300 sticky top-0 z-10 border-b-2 border-teal-500">
                        <tr>
                          <th className="text-left p-3 font-semibold">⭐</th>
                          <th className="text-left p-3 font-semibold">Ticker</th>
                          <th className="text-left p-3 font-semibold">Société</th>
                          <th className="text-left p-3 font-semibold">Secteur</th>
                          <th className="text-left p-3 font-semibold">Année</th>
                          <th className="text-right p-3 font-semibold">Dividende</th>
                          <th className="text-left p-3 font-semibold">Date détachement</th>
                          <th className="text-left p-3 font-semibold">Date paiement</th>
                          <th className="text-right p-3 font-semibold">Rendement</th>
                          <th className="text-left p-3 font-semibold">Type</th>
                          <th className="text-left p-3 font-semibold">Fiche</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.length === 0 ? (
                          <tr>
                            <td colSpan="11" className="p-8 text-center text-zinc-400">
                              Aucun dividende trouvé avec ces filtres
                            </td>
                          </tr>
                        ) : (
                          currentData.map((dividend, i) => (
                            <tr
                              key={`${dividend.ticker}-${dividend.year}-${i}`}
                              className="border-t border-zinc-800 hover:bg-zinc-900/50 transition-all group"
                              style={{ backgroundColor: i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}
                            >
                              <td className="p-3">
                                <button
                                  onClick={() => toggleFavorite(dividend.ticker)}
                                  className="text-xl hover:scale-125 transition-transform"
                                >
                                  {favorites.includes(dividend.ticker) ? (
                                    <span className="text-yellow-400">★</span>
                                  ) : (
                                    <span className="text-zinc-600 group-hover:text-zinc-400">☆</span>
                                  )}
                                </button>
                              </td>
                              <td className="p-3 text-white font-medium">
                                <button
                                  onClick={() => handleSelectCompany(dividend.ticker)}
                                  className="underline hover:text-teal-400 transition-colors"
                                >
                                  {dividend.ticker}
                                </button>
                              </td>
                              <td className="p-3 text-zinc-200">{dividend.company}</td>
                              <td className="p-3 text-zinc-300">{dividend.sector}</td>
                              <td className="p-3 text-zinc-300 font-medium">{dividend.year}</td>
                              <td className="p-3 text-teal-400 font-semibold text-right">
                                {formatAmount(dividend.dividend)}
                              </td>
                              <td className="p-3 text-zinc-300">{formatDate(dividend.exDate)}</td>
                              <td className="p-3 text-zinc-300">{formatDate(dividend.paymentDate)}</td>
                              <td className="p-3 text-teal-400 font-medium text-right">{dividend.yield}%</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs border ${
                                    dividend.type === "Spécial"
                                      ? "border-orange-500 text-orange-400 bg-orange-500/10"
                                      : dividend.type === "Intérim"
                                      ? "border-blue-400 text-blue-300 bg-blue-400/10"
                                      : "border-teal-500 text-teal-400 bg-teal-500/10"
                                  }`}
                                >
                                  {dividend.type}
                                </span>
                              </td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleSelectCompany(dividend.ticker)}
                                  className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
                                >
                                  Ouvrir
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {filteredData.length > 0 && (
                    <div className="flex items-center justify-between p-4 text-sm text-zinc-400 rounded-b-2xl border-x border-b border-zinc-800 bg-zinc-900/40 flex-wrap gap-2">
                      <div>
                        Page {currentPage} sur {totalPages} ({filteredData.length} résultat
                        {filteredData.length > 1 ? "s" : ""})
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Insights Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Événements à venir */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all animate-[fadeIn_0.6s_ease-out]">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl mb-4">
                📌
              </div>
              <h3 className="text-zinc-400 text-sm font-semibold mb-2">Événements à venir</h3>
              <div className="text-3xl font-bold text-white mb-1">
                {upcomingEventsCount} <span className="text-base font-normal text-zinc-400">détachements</span>
              </div>
              <p className="text-zinc-500 text-sm">dans les 30 prochains jours</p>
            </div>

            {/* Card 2: Statistiques Temporelles */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all animate-[fadeIn_0.6s_ease-out_0.1s_backwards]">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-xl mb-4">
                📊
              </div>
              <h3 className="text-zinc-400 text-sm font-semibold mb-3">Statistiques Temporelles</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xl font-bold text-white">{mostActiveMonth.name}</div>
                  <div className="text-xs text-zinc-500">Mois le plus actif</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {avgDelay} <span className="text-xs">jours</span>
                  </div>
                  <div className="text-xs text-zinc-500">Délai moyen</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {bankDelay} <span className="text-xs">jours</span>
                  </div>
                  <div className="text-xs text-zinc-500">Délai Banques</div>
                </div>
              </div>
            </div>

            {/* Card 3: Paiements en cours */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all animate-[fadeIn_0.6s_ease-out_0.2s_backwards]">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-xl mb-4">
                💰
              </div>
              <h3 className="text-zinc-400 text-sm font-semibold mb-2">Paiements en cours</h3>
              <div className="text-3xl font-bold text-white mb-1">
                {inProgressPayments}{" "}
                <span className="text-base font-normal text-zinc-400">
                  dividende{inProgressPayments > 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-zinc-500 text-sm">entre détachement et paiement</p>
            </div>
          </div>

          {/* Educational Section */}
          <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
            <h2 className="text-white text-2xl font-bold text-center mb-8">Comprendre le Calendrier des Dividendes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-teal-500/50 transition-all">
                <div className="text-4xl mb-4">🏷️</div>
                <h3 className="text-white text-lg font-semibold mb-3">Qu&apos;est-ce que la date de détachement ?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  La date clé ! Vous devez détenir l&apos;action la veille pour toucher le dividende. À partir de cette
                  date, l&apos;action est vendue &quot;ex-dividende&quot;.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-teal-500/50 transition-all">
                <div className="text-4xl mb-4">💵</div>
                <h3 className="text-white text-lg font-semibold mb-3">Quand recevrai-je mon dividende ?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  C&apos;est la date de paiement. L&apos;argent est crédité sur votre compte-titres. Le délai varie d&apos;une
                  société à l&apos;autre.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-teal-500/50 transition-all">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-white text-lg font-semibold mb-3">Dates passées et à venir</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Les couleurs vous aident à naviguer. <span className="text-red-500 font-semibold">Rouge</span> pour les
                  détachements, <span className="text-green-500 font-semibold"> Vert</span> pour les paiements.
                </p>
              </div>
            </div>
            <div className="text-center mt-6">
              <a href="#/blog" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                Lire notre guide complet sur les dividendes →
              </a>
            </div>
          </div>

          {/* Newsletter Section (MOBILE/TABLET UNIQUEMENT) */}
          <div className="mt-8 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-8 text-center xl:hidden">
            <h2 className="text-white text-2xl font-bold mb-2">Vos Dividendes, Votre Agenda.</h2>
            <p className="text-zinc-400 mb-6">
              Recevez l&apos;essentiel des dividendes directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-3">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                className="flex-1 px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
              />
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/50 transition-all">
                S&apos;abonner
              </button>
            </div>
            <p className="text-zinc-500 text-sm">Exclusif & sans spam. Désabonnez-vous à tout moment.</p>
          </div>

          {/* Source Info */}
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="text-white font-semibold mb-2">Source</h2>
            <p className="text-zinc-400 text-sm">
              Historique des dividendes CasaDividendes (2020-2024), données officielles BVC et sociétés émettrices.
            </p>
          </div>

          {/* Premium CTA */}
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white font-semibold">
              Débloquez les alertes automatiques J-3, l&apos;export iCal/CSV et les vues avancées.
            </p>
            <button
              onClick={() => (window.location.hash = "#/premium")}
              className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 whitespace-nowrap transition-colors"
            >
              Essayer Premium
            </button>
          </div>

          <p className="mt-6 text-xs text-zinc-500 text-center">
            Les informations sont fournies à titre indicatif. Référez-vous toujours à la source officielle.
          </p>
        </main>
      </div>

      {/* (Optionnel) newsletter légère mobile déjà incluse plus haut (xl:hidden) */}

      {/* Styles anim / scrollbar (styled-jsx si Next.js ; sinon déplacer en CSS global) */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.7);
        }
      `}</style>
    </div>
  );
}
