import { DATA_YEARS, DIVIDENDS_URL, COMPANIES_URL } from "../constants/paths";

const norm = (s) => (s || "").toString().toLowerCase().trim();

export async function getDividendsFor(tickerOrName) {
  try {
    const results = await Promise.all(
      DATA_YEARS.map(async (year) => {
        try {
          const res = await fetch(DIVIDENDS_URL(year));
          if (!res.ok) {
            if (year === 2025 && res.status === 404) return [];
            throw new Error(`HTTP ${res.status}`);
          }
          const arr = await res.json();
          return Array.isArray(arr) ? arr.map((r) => ({ year, ...r })) : [];
        } catch (e) {
          if (year === 2025) return [];
          throw e;
        }
      })
    );

    const flat = results.flat();
    const searchValue = norm(tickerOrName);

    let filtered = flat;
    if (searchValue) {
      filtered = flat.filter((r) =>
        norm(r.ticker) === searchValue || norm(r.company) === searchValue
      );
    }

    const rows = filtered.map((r) => ({
      year: Number(r.year),
      exDate: r.exDate || r.exdate || r.detachmentDate || null,
      paymentDate: r.paymentDate || r.pay || r.payment || null,
      amount: Number(r.dividend ?? r.amount ?? 0),
      company: r.company || "",
      ticker: r.ticker || "",
    }));

    rows.sort((a, b) =>
      a.year !== b.year
        ? a.year - b.year
        : (new Date(a.exDate || 0) - new Date(b.exDate || 0))
    );

    const agg = new Map();
    rows.forEach((r) =>
      agg.set(r.year, (agg.get(r.year) || 0) + (isFinite(r.amount) ? r.amount : 0))
    );

    const yearly = [];
    for (let y = 2020; y <= 2025; y++) {
      const v = agg.has(y) ? Number(agg.get(y).toFixed(2)) : null;
      yearly.push({ year: y, total: v });
    }

    const byYear = new Map();
    rows.forEach((r) => byYear.set(r.year, r));
    const years = Array.from(byYear.keys()).sort((a, b) => a - b);
    const last5 = years.slice(-5).map((y) => ({
      year: y,
      exDate: byYear.get(y)?.exDate || null,
      pay: byYear.get(y)?.paymentDate || null,
    }));

    const latest = years.length ? byYear.get(years[years.length - 1]) : null;

    return {
      rows,
      yearly,
      last5,
      latestEx: latest?.exDate || null,
      latestPay: latest?.paymentDate || null,
    };
  } catch (error) {
    console.error("Error fetching dividends:", error);
    return {
      rows: [],
      yearly: [],
      last5: [],
      latestEx: null,
      latestPay: null,
    };
  }
}

export async function getCompanies() {
  try {
    const res = await fetch(COMPANIES_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getAllDividends(years = DATA_YEARS) {
  try {
    const results = await Promise.all(
      years.map(async (y) => {
        const res = await fetch(DIVIDENDS_URL(y));
        if (!res.ok) return [];
        const arr = await res.json();
        return Array.isArray(arr) ? arr.map((r) => ({ year: y, ...r })) : [];
      })
    );
    return results.flat().map((r) => ({
      year: Number(r.year),
      ticker: r.ticker || "",
      company: r.company || "",
      exDate: r.exDate || r.exdate || r.detachmentDate || null,
      paymentDate: r.paymentDate || r.pay || r.payment || null,
      amount: Number(r.dividend ?? r.amount ?? 0),
    }));
  } catch {
    return [];
  }
}
