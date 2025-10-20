import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

/* =========================
   CONFIG & HELPERS
   ========================= */

// Années disponibles (mets à jour si tu ajoutes 2025, etc.)
const AVAILABLE_YEARS = [2020, 2021, 2022, 2023, 2024];

// Base path (utile si l'app est servie sous un sous-répertoire)
const BASE = import.meta.env.BASE_URL || "/";

// Format date → "12 juin 2025"
function formatDateISO(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

// Raccourcis date relative "time-ago" pour la News
function timeAgo(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  const m = Math.floor(diff / 60);
  const h = Math.floor(m / 60);
  const day = Math.floor(h / 24);
  if (day > 0) return `${day}j`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return `${diff}s`;
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

/* =========================
   NEWS SIDEBAR (header + newsletter fixes)
   ========================= */

function NewsCard({ item, saved, pinned, read, onToggleSave, onTogglePin, onOpen }) {
  const tag = detectTag(item.title);
  return (
    <article
      className={`relative p-4 border border-zinc-800 rounded-xl transition-all group transform-gpu will-change-transform
        ${read ? "opacity-70" : ""} hover:bg-zinc-800/40 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10
        ring-0 hover:ring-1 hover:ring-teal-500/30 hover:scale-[1.01]`}
    >
      {/* Actions rapides */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <button
          aria-label={pinned ? "Retirer l'épingle" : "Épingler l’article"}
          onClick={(e) => {
            e.preventDefault();
            onTogglePin(item);
          }}
          className={`text-xs px-2 py-1 rounded-md border transition
            ${pinned ? "border-yellow-400 text-yellow-300 bg-yellow-400/10" : "border-zinc-700 text-zinc-400 hover:text-yellow-300"}`}
          title={pinned ? "Unpin" : "Pin"}
        >
          📌
        </button>
        <button
          aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={(e) => {
            e.preventDefault();
            onToggleSave(item);
          }}
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
        rel="noopener noreferrer"
        onClick={() => onOpen(item)}
        className="block"
        aria-label={`Lire: ${item.title} (nouvel onglet)`}
      >
        <h3 className="text-zinc-100 font-medium group-hover:text-teal-400 transition line-clamp-2">
          {item.title}
        </h3>
        {!!item.image && (
          <div className="mt-3 rounded-lg border border-zinc-800 overflow-hidden">
            <img src={item.image} alt="" className="w-full h-36 object-cover" loading="lazy" />
          </div>
        )}
        <p className="text-sm text-zinc-400 mt-2 line-clamp-3">{item.excerpt}</p>
        <span className="text-[#EAB308] text-sm mt-2 inline-block">Read More →</span>
      </a>
    </article>
  );
}

function NewsSidebar() {
  // Données front de démo
  const [news] = useState([
    {
      source: "Reuters Afrique",
      date: "2025-10-15T07:00:00Z",
      title: "Casablanca: le marché reste soutenu par la saison des dividendes",
      excerpt: "Les financières et télécoms soutiennent les indices; la visibilité s'améliore sur les distributions 2025.",
      url: "https://www.reuters.com/markets/africa/",
    },
    {
      source: "Bourse News",
      date: "2025-10-14T10:30:00Z",
      title: "Q3: les banques confirment leur guidance dividendes",
      excerpt: "Les publications confirment la résilience de la profitabilité et un payout stable.",
      url: "https://www.boursenews.ma/",
    },
    {
      source: "MAP Économie",
      date: "2025-10-12T12:00:00Z",
      title: "BVC: flux acheteurs sur blue chips en amont des paiements",
      excerpt: "Le marché intègre progressivement les prochaines dates de détachement et de paiement.",
      url: "https://www.mapnews.ma/",
    },
  ]);

  const [saved, setSaved] = useState(() => new Set());
  const [pinned, setPinned] = useState(() => new Set());
  const [read, setRead] = useState(() => new Set());

  const onToggleSave = (item) =>
    setSaved((prev) => {
      const n = new Set(prev);
      n.has(item.url) ? n.delete(item.url) : n.add(item.url);
      return n;
    });

  const onTogglePin = (item) =>
    setPinned((prev) => {
      const n = new Set(prev);
      n.has(item.url) ? n.delete(item.url) : n.add(item.url);
      return n;
    });

  const onOpen = (item) => setRead((prev) => new Set(prev).add(item.url));

  // Pins d'abord, puis date desc
  const items = useMemo(() => {
    const arr = [...news];
    return arr.sort((a, b) => {
      const ap = pinned.has(a.url) ? 1 : 0;
      const bp = pinned.has(b.url) ? 1 : 0;
      if (ap !== bp) return bp - ap;
      return new Date(b.date) - new Date(a.date);
    });
  }, [news, pinned]);

  return (
    <aside className="hidden xl:block w-[320px] sticky top-10 self-start h-fit">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 backdrop-blur
                      max-h-[calc(100vh-4rem)] sidebar-maxh flex flex-col min-h-0">
        {/* Header fixe */}
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          📰 <span>Financial News Feed</span>
        </h2>

        {/* Liste scrollable */}
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

        {/* Newsletter fixe */}
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

/* =========================
   CALENDAR PAGE
   ========================= */

export default function Calendar() {
  // Vue par défaut = TABLEAU
  const [view, setView] = useState("table"); // "calendar" | "table"
  const [dividends, setDividends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtres (année, recherche texte simple)
  const [filters, setFilters] = useState({
    year: String(Math.max(...AVAILABLE_YEARS)), // ex: "2024"
    q: "",
  });

  // Chargement dynamique selon l’année
  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setLoading(true);
      try {
        if (filters.year === "tous") {
          const all = await Promise.all(
            AVAILABLE_YEARS.map((year) =>
              fetch(`${BASE}data/dividends/${year}.json`, { cache: "no-store" }).then((r) => r.json())
            )
          );
          if (isActive) setDividends(all.flat());
        } else {
          const res = await fetch(`${BASE}data/dividends/${filters.year}.json`, { cache: "no-store" });
          if (!res.ok) throw new Error("Fichier introuvable");
          const data = await res.json();
          if (isActive) setDividends(data);
        }
      } catch (e) {
        console.warn(e);
        if (isActive) setDividends([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [filters.year]);

  // Filtrage simple (recherche dans ticker / company / sector)
  const filteredData = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return dividends
      .filter((d) =>
        q
          ? (d.ticker || "").toLowerCase().includes(q) ||
            (d.company || "").toLowerCase().includes(q) ||
            ((d.sector || "").toLowerCase().includes(q))
          : true
      )
      .sort((a, b) => new Date(a.exDate) - new Date(b.exDate));
  }, [dividends, filters.q]);

  return (
    <>
      <Helmet>
        <title>Calendrier des Dividendes • CasaDividendes</title>
      </Helmet>

      {/* Wrapper full-width */}
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
        <div className="max-w-[1800px] mx-auto flex gap-6 px-6 pt-8 min-h-0">
          {/* Sidebar News (desktop) */}
          <NewsSidebar />

          {/* Contenu principal */}
          <main className="flex-1 min-h-0">
            {/* Header */}
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-semibold">
                Calendrier des Dividendes
              </h1>
              <p className="text-zinc-400 mt-1">
                Sélectionnez une année pour charger uniquement les dividendes correspondants.
              </p>
            </header>

            {/* Toolbar filtres */}
            <section className="mb-5 flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-400">Année</label>
                <select
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-teal-500 outline-none"
                  value={filters.year}
                  onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
                >
                  <option value="tous">Toutes</option>
                  {[...AVAILABLE_YEARS]
                    .sort((a, b) => b - a)
                    .map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <label className="text-sm text-zinc-400">Recherche</label>
                <input
                  type="text"
                  placeholder="Société, ticker ou secteur…"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-teal-500 outline-none"
                  value={filters.q}
                  onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                />
              </div>

              <div className="flex justify-end">
                <div className="inline-flex rounded-xl border border-zinc-800 p-1 bg-zinc-900/40">
                  <button
                    onClick={() => setView("calendar")}
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                      view === "calendar" ? "bg-zinc-800 text-teal-300" : "text-zinc-400"
                    }`}
                  >
                    Vue Calendrier
                  </button>
                  <button
                    onClick={() => setView("table")}
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                      view === "table" ? "bg-zinc-800 text-teal-300" : "text-zinc-400"
                    }`}
                  >
                    Vue Tableau
                  </button>
                </div>
              </div>
            </section>

            {/* Contenu */}
            {loading ? (
              <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/40">
                Chargement…
              </div>
            ) : filteredData.length === 0 ? (
              <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/40">
                Aucune donnée pour ces critères.
              </div>
            ) : view === "table" ? (
              <section className="border border-zinc-800 rounded-2xl bg-zinc-900/40 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-zinc-400">
                    <tr className="[&>th]:p-3 border-b border-zinc-800">
                      <th className="text-left">Ticker</th>
                      <th className="text-left">Société</th>
                      <th className="text-left">Type</th>
                      <th className="text-left">Ex-Date</th>
                      <th className="text-left">Paiement</th>
                      <th className="text-right">Dividende</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((d, i) => (
                      <tr key={`${d.ticker}-${d.company}-${d.exDate}-${i}`} className="[&>td]:p-3 border-b border-zinc-800/60">
                        <td className="font-medium">{d.ticker || "—"}</td>
                        <td className="text-zinc-300">{d.company || "—"}</td>
                        <td className="text-zinc-400">{d.type || "—"}</td>
                        <td>{formatDateISO(d.exDate)}</td>
                        <td>{formatDateISO(d.paymentDate)}</td>
                        <td className="text-right text-teal-300 font-semibold">
                          {d.dividend != null ? d.dividend : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : (
              // Vue Calendrier compacte (groupée par mois d'ex-date)
              <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Object.entries(
                  filteredData.reduce((acc, d) => {
                    const k = new Date(d.exDate || d.paymentDate || Date.now()).toLocaleDateString(
                      "fr-FR",
                      { year: "numeric", month: "long" }
                    );
                    (acc[k] ||= []).push(d);
                    return acc;
                  }, {})
                ).map(([month, rows]) => (
                  <div key={month} className="border border-zinc-800 rounded-2xl bg-zinc-900/40">
                    <div className="px-4 py-3 border-b border-zinc-800 text-zinc-300 font-medium">
                      {month}
                    </div>
                    <ul className="divide-y divide-zinc-800">
                      {rows
                        .sort((a, b) => new Date(a.exDate) - new Date(b.exDate))
                        .map((d, i) => (
                          <li key={`${d.ticker}-${d.company}-${d.exDate}-${i}`} className="px-4 py-3 flex items-center justify-between gap-4">
                            <div>
                              <div className="font-medium">{d.company || d.ticker}</div>
                              <div className="text-xs text-zinc-400">
                                Ex-Date: {formatDateISO(d.exDate)} • Paiement: {formatDateISO(d.paymentDate)}
                              </div>
                            </div>
                            <div className="text-teal-300 font-semibold">{d.dividend ?? "—"}</div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {/* Newsletter mobile (visible < xl) */}
            <section className="xl:hidden mt-8 border border-zinc-800 rounded-2xl bg-zinc-900/40 p-5">
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
            </section>
          </main>
        </div>
      </div>

      {/* Styles globaux pour la sidebar */}
      <style>{`
        .scrollbar-hide{ scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar{ width:0; height:0; display:none; }
        @supports (height: 100dvh){
          .sidebar-maxh{ max-height: calc(100dvh - 4rem); }
        }
        :focus-visible { outline: 2px solid #14B8A6; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce){
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
}
