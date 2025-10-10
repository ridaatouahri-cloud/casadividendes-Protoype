import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { StatCard } from "../components/StatCard";
import dividendsData from "../data/dividends.json";

export default function Calendar() {
  const [view, setView] = useState("table");
  const [dividends, setDividends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [filters, setFilters] = useState({
    year: "tous",
    company: "tous",
    sector: "tous"
  });

  useEffect(() => {
    setTimeout(() => {
      setDividends(dividendsData);
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    let filtered = [...dividends];

    if (filters.year !== "tous") {
      filtered = filtered.filter(d => d.year === parseInt(filters.year));
    }

    if (filters.company !== "tous") {
      filtered = filtered.filter(d => d.ticker === filters.company);
    }

    if (filters.sector !== "tous") {
      filtered = filtered.filter(d => d.sector === filters.sector);
    }

    filtered.sort((a, b) => {
      if (b.year !== a.year) {
        return b.year - a.year;
      }
      return new Date(b.paymentDate) - new Date(a.paymentDate);
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [dividends, filters]);

  const uniqueYears = [...new Set(dividends.map(d => d.year))].sort((a, b) => b - a);
  const uniqueCompanies = [...new Set(dividends.map(d => ({ ticker: d.ticker, name: d.company })))].sort((a, b) => a.name.localeCompare(b.name));
  const uniqueSectors = [...new Set(dividends.map(d => d.sector))].sort();

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ year: "tous", company: "tous", sector: "tous" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatAmount = (amount) => {
    return `${amount.toFixed(2)} MAD`;
  };

  const avgYield = filteredData.length > 0
    ? (filteredData.reduce((sum, d) => sum + d.yield, 0) / filteredData.length).toFixed(1)
    : "0.0";

  const mostActiveSector = filteredData.length > 0
    ? Object.entries(
        filteredData.reduce((acc, d) => {
          acc[d.sector] = (acc[d.sector] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : "N/A";

  const handleSelectCompany = (ticker) => {
    window.location.hash = `#/company/${ticker}`;
  };

  const LoadingSkeleton = () => (
    <div className="mt-6 space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-12 bg-zinc-900/50 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Calendrier des Dividendes - CasaDividendes</title>
        <meta name="description" content="Consultez l'historique complet des dividendes de la Bourse de Casablanca (2020-2024). Ex-dates, paiements, montants et rendements pour toutes les sociétés cotées." />
      </Helmet>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-white text-2xl font-bold">Historique des Dividendes (2020-2024)</h1>
            <p className="text-zinc-400 mt-2">Historique complet des <span className="text-teal-400 font-medium">dividendes</span> versés par les sociétés cotées à la BVC.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total dividendes" value={filteredData.length} sub="Événements enregistrés" />
          <StatCard title="Rendement moyen" value={`${avgYield}%`} sub="Sur l'échantillon filtré" />
          <StatCard title="Secteur le + actif" value={mostActiveSector} sub="Par nb. d'événements" />
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Filtrer par année"
            >
              <option value="tous">Toutes les années</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Filtrer par société"
            >
              <option value="tous">Toutes les sociétés</option>
              {uniqueCompanies.map(comp => (
                <option key={comp.ticker} value={comp.ticker}>{comp.name}</option>
              ))}
            </select>

            <select
              value={filters.sector}
              onChange={(e) => handleFilterChange("sector", e.target.value)}
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Filtrer par secteur"
            >
              <option value="tous">Tous les secteurs</option>
              {uniqueSectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>

            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-zinc-900 text-zinc-300 sticky top-0 z-10 border-b-2 border-teal-500">
                    <tr>
                      <th scope="col" className="text-left p-3 font-semibold">Ticker</th>
                      <th scope="col" className="text-left p-3 font-semibold">Société</th>
                      <th scope="col" className="text-left p-3 font-semibold">Secteur</th>
                      <th scope="col" className="text-left p-3 font-semibold">Année</th>
                      <th scope="col" className="text-right p-3 font-semibold">Dividende</th>
                      <th scope="col" className="text-left p-3 font-semibold">Date détachement</th>
                      <th scope="col" className="text-left p-3 font-semibold">Date paiement</th>
                      <th scope="col" className="text-right p-3 font-semibold">Rendement</th>
                      <th scope="col" className="text-left p-3 font-semibold">Type</th>
                      <th scope="col" className="text-left p-3 font-semibold">Fiche</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="p-8 text-center text-zinc-400">
                          Aucun dividende trouvé avec ces filtres
                        </td>
                      </tr>
                    ) : (
                      currentData.map((dividend, i) => (
                        <tr
                          key={`${dividend.ticker}-${dividend.year}-${i}`}
                          className="border-t border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                          style={{ backgroundColor: i % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                        >
                          <td className="p-3 text-white font-medium">
                            <button
                              onClick={() => handleSelectCompany(dividend.ticker)}
                              className="underline hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded transition-colors"
                            >
                              {dividend.ticker}
                            </button>
                          </td>
                          <td className="p-3 text-zinc-200">{dividend.company}</td>
                          <td className="p-3 text-zinc-300">{dividend.sector}</td>
                          <td className="p-3 text-zinc-300 font-medium">{dividend.year}</td>
                          <td className="p-3 text-teal-400 font-semibold text-right">{formatAmount(dividend.dividend)}</td>
                          <td className="p-3 text-zinc-300">{formatDate(dividend.exDate)}</td>
                          <td className="p-3 text-zinc-300">{formatDate(dividend.paymentDate)}</td>
                          <td className="p-3 text-teal-400 font-medium text-right">{dividend.yield}%</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs border ${
                              dividend.type === "Spécial"
                                ? "border-orange-500 text-orange-400 bg-orange-500/10"
                                : dividend.type === "Intérim"
                                ? "border-blue-400 text-blue-300 bg-blue-400/10"
                                : "border-teal-500 text-teal-400 bg-teal-500/10"
                            }`}>
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
                <div className="flex items-center justify-between p-4 text-sm text-zinc-400 border-t border-zinc-800 flex-wrap gap-2">
                  <div>
                    Page {currentPage} sur {totalPages} ({filteredData.length} résultat{filteredData.length > 1 ? 's' : ''})
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h2 className="text-white font-semibold mb-2">Source</h2>
              <p className="text-zinc-400 text-sm">
                Historique des dividendes CasaDividendes (2020–2024), données officielles BVC et sociétés émettrices.
              </p>
            </div>
          </>
        )}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white font-semibold">Débloquez les alertes automatiques J-3, l'export iCal/CSV et les vues avancées.</p>
          <button
            onClick={() => window.location.hash = "#/premium"}
            className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 whitespace-nowrap transition-colors"
          >
            Essayer Premium
          </button>
        </div>

        <p className="mt-6 text-xs text-zinc-500">Les informations sont fournies à titre indicatif. Référez-vous toujours à la source officielle.</p>
      </main>
    </>
  );
}
