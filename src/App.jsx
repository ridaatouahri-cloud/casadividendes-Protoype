import React, { useState } from "react";
import Home from "./pages/Home";

const NAV = [
  { key: "home", label: "Accueil" },
  { key: "calendar", label: "Calendrier" },
  { key: "rankings", label: "Palmarès" },
  { key: "blog", label: "Blog" },
  { key: "premium", label: "Premium" },
  { key: "about", label: "À propos & Contact" },
  { key: "legal", label: "Mentions légales" },
];

const Pill = ({ children }) => (
  <span className="px-2 py-1 rounded-full text-xs bg-zinc-800/80 border border-zinc-700">{children}</span>
);

const StatCard = ({ title, value, sub }) => (
  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
    <div className="text-sm text-zinc-400">{title}</div>
    <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    {sub ? <div className="text-xs text-zinc-500 mt-1">{sub}</div> : null}
  </div>
);

function Header({ route, setRoute }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70 bg-zinc-950/90 border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRoute("home")}
            className="w-8 h-8 rounded-full bg-teal-500/20 grid place-items-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label="Retour à l'accueil"
          >
            <div className="w-3 h-3 border-2 border-teal-400 rotate-45" />
          </button>
          <button
            onClick={() => setRoute("home")}
            className="font-semibold text-white hover:text-teal-400 transition-colors focus:outline-none focus:underline"
          >
            CasaDividendes
          </button>
          <Pill>Beta</Pill>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm" aria-label="Navigation principale">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setRoute(n.key)}
              className={`transition-colors focus:outline-none focus:underline ${route === n.key ? "text-teal-400" : "text-zinc-300 hover:text-white"}`}
              aria-current={route === n.key ? "page" : undefined}
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={() => setRoute("premium")}
            className="ml-2 px-3 py-1.5 rounded-lg bg-orange-500 text-black font-medium hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label="Découvrir Premium"
          >
            Premium
          </button>
        </nav>
      </div>
    </header>
  );
}

function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

function firstWeekday(y, m) {
  return new Date(y, m, 1).getDay();
}

function mondayOffsetFromSundayFirstDay(d) {
  return d === 0 ? 6 : d - 1;
}

function CalendarPage({ onSelectCompany }) {
  const [view, setView] = useState("table");
  const [sector, setSector] = useState("tous");
  const [type, setType] = useState("tous");
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const queryDate = `${monthNames[month]} ${year}`;

  const rawRows = [
    { t: "IAM",  n: "Maroc Telecom",     date: new Date(2025,5,12), pay: "28/06", amt: "4.010 MAD", src: "Communiqué", sector: "Télécom",    kind: "Ordinaire", badge: "Rendement ↑", premium: true },
    { t: "ATW",  n: "Attijariwafa Bank", date: new Date(2025,5,5),  pay: "21/06", amt: "15.000 MAD", src: "AG",         sector: "Banques",   kind: "Ordinaire", badge: "Alertes 🔔",  premium: false },
    { t: "BCP",  n: "Banque Populaire",  date: new Date(2025,5,3),  pay: "18/06", amt: "7.000 MAD",  src: "Communiqué", sector: "Banques",   kind: "Spécial",   badge: "Spécial",      premium: true },
    { t: "SNEP", n: "SNEP",              date: new Date(2025,5,15), pay: "01/07", amt: "5.500 MAD",  src: "Communiqué", sector: "Industrie", kind: "Intérim",   badge: "Intérim",      premium: false },
    { t: "ADI",  n: "Addoha",            date: new Date(2025,6,4),  pay: "20/07", amt: "1.200 MAD",  src: "Communiqué", sector: "Immobilier",kind: "Ordinaire", badge: "Nouveau",      premium: false },
  ];

  const rows = rawRows.map((r) => ({ ...r, ex: `${String(r.date.getDate()).padStart(2, "0")}/${String(r.date.getMonth()+1).padStart(2, "0")}` }));
  const filtered = rows.filter((r) => (sector === "tous" || r.sector === sector) && (type === "tous" || r.kind === type));

  const totalDays = daysInMonth(year, month);
  const start = firstWeekday(year, month);
  const offset = mondayOffsetFromSundayFirstDay(start);
  const grid = Array.from({ length: 42 }).map((_, i) => {
    const dayNum = i - offset + 1;
    const inMonth = dayNum >= 1 && dayNum <= totalDays;
    const keyDate = inMonth ? new Date(year, month, dayNum) : null;
    return { dayNum: inMonth ? dayNum : "", keyDate, events: [] };
  });

  filtered.forEach((ev) => {
    if (ev.date.getFullYear() === year && ev.date.getMonth() === month) {
      const index = offset + ev.date.getDate() - 1;
      if (grid[index]) grid[index].events.push(ev);
    }
  });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); } else { setMonth((m) => m - 1); }
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); } else { setMonth((m) => m + 1); }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white text-2xl font-bold">Calendrier des dividendes (BVC)</h1>
          <p className="text-zinc-400 mt-2">Prochaines <span className="text-teal-400 font-medium">ex-dates</span>, paiements et montants. Données vérifiées.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => setView("table")} className={`px-3 py-2 rounded-lg border ${view === "table" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-400`} aria-pressed={view === "table"}>Tableau</button>
          <button onClick={() => setView("agenda")} className={`px-3 py-2 rounded-lg border ${view === "agenda" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-400`} aria-pressed={view === "agenda"}>Calendrier</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 items-start">
        <div className="flex items-center gap-2 col-span-full md:col-span-2">
          <button onClick={prevMonth} className="px-2 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Mois précédent">◀</button>
          <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 min-w-[180px] text-center">{queryDate}</div>
          <button onClick={nextMonth} className="px-2 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Mois suivant">▶</button>
        </div>
        <select value={sector} onChange={(e) => setSector(e.target.value)} className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Filtrer par secteur"><option value="tous">Secteur (tous)</option><option value="Télécom">Télécom</option><option value="Banques">Banques</option><option value="Industrie">Industrie</option><option value="Immobilier">Immobilier</option></select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Filtrer par type"><option value="tous">Type (tous)</option><option value="Ordinaire">Ordinaire</option><option value="Intérim">Intérim</option><option value="Spécial">Spécial</option></select>
        <button className="px-3 py-2 rounded-lg bg-teal-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950">Appliquer</button>
        <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400">Exporter CSV</button>
        <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400">Exporter iCal</button>
        <div className="text-xs text-zinc-500 col-span-full">Astuce : activez des alertes J-3 (Premium) depuis la colonne Alerte.</div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Dividendes ce mois" value="12" sub="Annoncés / à venir" />
        <StatCard title="Rendement moyen attendu" value="3.9%" sub="Sur l'échantillon filtré" />
        <StatCard title="Secteur le + actif" value="Banques" sub="Par nb. d'événements" />
      </div>

      {view === "table" && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th scope="col" className="text-left p-3">Ticker</th>
                <th scope="col" className="text-left p-3">Société</th>
                <th scope="col" className="text-left p-3">Secteur</th>
                <th scope="col" className="text-left p-3">Ex-date</th>
                <th scope="col" className="text-left p-3">Paiement</th>
                <th scope="col" className="text-left p-3">Montant</th>
                <th scope="col" className="text-left p-3">Badge</th>
                <th scope="col" className="text-left p-3">Alerte</th>
                <th scope="col" className="text-left p-3">Source</th>
                <th scope="col" className="text-left p-3">Fiche</th>
              </tr>
            </thead>
            <tbody>
              {filtered.filter((r) => r.date.getFullYear() === year && r.date.getMonth() === month).map((r, i) => (
                <tr key={`${r.t}-${i}`} className="border-t border-zinc-800">
                  <td className="p-3 text-white"><button onClick={() => onSelectCompany(r.t)} className="underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">{r.t}</button></td>
                  <td className="p-3 text-zinc-200">{r.n}</td>
                  <td className="p-3 text-zinc-300">{r.sector}</td>
                  <td className="p-3 text-zinc-300">{r.ex}</td>
                  <td className="p-3 text-zinc-300">{r.pay}</td>
                  <td className="p-3 text-teal-400 font-medium">{r.amt}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs border ${r.badge === "Spécial" ? "border-orange-500 text-orange-400" : r.badge === "Intérim" ? "border-blue-400 text-blue-300" : "border-teal-500 text-teal-400"}`}>{r.badge}</span></td>
                  <td className="p-3">{r.premium ? <span className="text-zinc-400">🔔 <span className="text-xs">(Premium)</span></span> : <button className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400">Activer</button>}</td>
                  <td className="p-3 text-zinc-400 underline">{r.src}</td>
                  <td className="p-3"><button onClick={() => onSelectCompany(r.t)} className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400">Ouvrir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-4 text-sm text-zinc-400 flex-wrap gap-2">
            <div>Page 1 sur 4</div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400">Précédent</button>
              <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400">Suivant</button>
            </div>
          </div>
        </div>
      )}

      {view === "agenda" && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between mb-3 text-sm text-zinc-300 flex-wrap gap-2">
            <div>{queryDate}</div>
            <div className="flex gap-2 flex-wrap"><Pill>Ordinaire</Pill><Pill>Intérim</Pill><Pill>Spécial</Pill></div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map((d) => <div key={d} className="text-xs text-zinc-500 p-1">{d}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-2">
            {grid.map((d, idx) => (
              <div key={idx} className="relative min-h-[96px] border border-zinc-800 rounded-lg bg-zinc-950/60 p-1">
                <div className="text-[10px] text-zinc-500">{d.dayNum}</div>
                <div className="mt-1 space-y-1">
                  {d.events.map((ev, i) => (
                    <button
                      key={`${ev.t}-${i}`}
                      onClick={() => onSelectCompany(ev.t)}
                      className={`text-[10px] px-1 py-0.5 rounded border inline-block cursor-pointer focus:outline-none focus:ring-1 focus:ring-white ${ev.kind === "Spécial" ? "border-orange-500 text-orange-400" : ev.kind === "Intérim" ? "border-blue-400 text-blue-300" : "border-teal-500 text-teal-400"}`}
                    >
                      {ev.t} • {ev.amt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-white font-semibold">Sources</h2>
          <p className="text-zinc-400 text-sm mt-1">Bourse de Casablanca, communiqués officiels des émetteurs, avis d&apos;AG.</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-white font-semibold">Pédagogie</h2>
          <p className="text-zinc-400 text-sm mt-1">⚡ Ex-date = date à partir de laquelle l&apos;achat ne donne plus droit au dividende.</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white font-semibold">Débloquez les alertes automatiques J-3, l&apos;export iCal/CSV et les vues avancées.</p>
        <button className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 whitespace-nowrap">Essayer Premium</button>
      </div>

      <p className="mt-6 text-xs text-zinc-500">⚠️ Les informations sont fournies à titre indicatif. Référez-vous toujours à la source officielle.</p>
    </main>
  );
}

function RankingsPage({ onSelectCompany }) {
  const rows = Array.from({ length: 10 }).map((_, i) => ({
    r: i + 1,
    t: ["IAM", "BCP", "ATW", "ADI", "BCI", "SNEP"][i % 6],
    n: ["Maroc Telecom", "Banque Populaire", "Attijariwafa Bank", "Addoha", "BOA CI", "SNEP"][i % 6],
    d: (3 + Math.random() * 3).toFixed(2) + "%",
    c: (100 + Math.random() * 200).toFixed(2),
  }));
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-white text-2xl font-bold">Palmarès des dividendes</h1>
      <p className="text-zinc-400 mt-2">Comparez les sociétés selon le rendement, la régularité et la croissance.</p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Pill>Rendement TTM</Pill>
        <Pill>Régularité</Pill>
        <Pill>Croissance 5 ans</Pill>
        <Pill>Score sécurité 🔒</Pill>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Rendement moyen" value="4.1%" />
        <StatCard title="Top secteur" value="Télécom" />
        <StatCard title="Meilleure régularité" value="IAM (10 ans)" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th scope="col" className="text-left p-3">Rang</th>
              <th scope="col" className="text-left p-3">Ticker</th>
              <th scope="col" className="text-left p-3">Société</th>
              <th scope="col" className="text-left p-3">Div. TTM</th>
              <th scope="col" className="text-left p-3">Cours</th>
              <th scope="col" className="text-left p-3">Rendement</th>
              <th scope="col" className="text-left p-3">Fiche</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.r} className="border-t border-zinc-800">
                <td className="p-3 text-zinc-300">{r.r}</td>
                <td className="p-3 text-white">{r.t}</td>
                <td className="p-3 text-zinc-200">{r.n}</td>
                <td className="p-3 text-zinc-300">{r.d}</td>
                <td className="p-3 text-zinc-300">{r.c} MAD</td>
                <td className="p-3 text-teal-400 font-medium">{r.d}</td>
                <td className="p-3"><button onClick={() => onSelectCompany(r.t)} className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400">Ouvrir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <p className="text-zinc-300 text-sm">⚡ Rendement TTM = dividende versé sur 12 mois / cours actuel.</p>
      </div>
    </main>
  );
}

const meta = {
  IAM:  { name: "Maroc Telecom",    sector: "Télécom",    country: "Maroc", nextPay: "28/06/2024", yieldTTM: "5.2%", streak: "10" },
  ATW:  { name: "Attijariwafa Bank",sector: "Banques",    country: "Maroc", nextPay: "21/06/2024", yieldTTM: "4.3%", streak: "7" },
  BCP:  { name: "Banque Populaire", sector: "Banques",    country: "Maroc", nextPay: "18/06/2024", yieldTTM: "4.8%", streak: "6" },
  SNEP: { name: "SNEP",             sector: "Industrie",  country: "Maroc", nextPay: "01/07/2024", yieldTTM: "3.7%", streak: "4" },
  ADI:  { name: "Addoha",           sector: "Immobilier", country: "Maroc", nextPay: "20/07/2025", yieldTTM: "2.1%", streak: "2" },
};

function CompanyPage({ ticker }) {
  const m = meta[ticker] || meta["IAM"];
  const history = [
    { ex: "12/06/2024", pay: "28/06/2024", amt: "4.010 MAD", type: "Ordinaire", src: "Communiqué" },
    { ex: "14/06/2023", pay: "30/06/2023", amt: "3.950 MAD", type: "Ordinaire", src: "Communiqué" },
    { ex: "15/06/2022", pay: "01/07/2022", amt: "3.860 MAD", type: "Ordinaire", src: "AG" },
  ];
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-white text-2xl font-bold">{m.name} ({ticker})</h1>
          <p className="mt-1 text-zinc-400 text-sm">{m.sector} • {m.country} • <a className="underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded" href="#" aria-label={`Visiter le site web de ${m.name}`}>Site web</a></p>
        </div>
        <div className="w-14 h-14 rounded-full bg-teal-500/20 grid place-items-center" aria-hidden="true"><div className="w-5 h-5 border-2 border-teal-400 rotate-45"/></div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Rendement TTM" value={m.yieldTTM} />
        <StatCard title="Années sans baisse" value={m.streak} />
        <StatCard title="Prochain paiement" value={m.nextPay || "—"} />
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6" aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-zinc-300 text-sm mb-3">Historique des dividendes</h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th scope="col" className="text-left p-3">Ex-date</th>
                <th scope="col" className="text-left p-3">Paiement</th>
                <th scope="col" className="text-left p-3">Montant</th>
                <th scope="col" className="text-left p-3">Type</th>
                <th scope="col" className="text-left p-3">Source</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={`${h.ex}-${i}`} className="border-t border-zinc-800">
                  <td className="p-3 text-zinc-300">{h.ex}</td>
                  <td className="p-3 text-zinc-300">{h.pay}</td>
                  <td className="p-3 text-teal-400 font-medium">{h.amt}</td>
                  <td className="p-3 text-zinc-300">{h.type}</td>
                  <td className="p-3 text-zinc-400 underline">{h.src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Activer alerte J-3</button>
          <button className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Ajouter à mon portefeuille</button>
          <button className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Exporter CSV/PDF</button>
        </div>

        <p className="mt-6 text-xs text-zinc-500">⚡ Ex-date : date à partir de laquelle l&apos;achat de l&apos;action ne donne plus droit au dividende.</p>
      </section>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-white font-semibold">Analyse Premium 🔒</h2>
            <p className="text-zinc-400 text-sm">Score sécurité, payout ratio, projections de revenus…</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 whitespace-nowrap">Essayer Premium</button>
        </div>
      </div>
    </main>
  );
}

function PremiumPage() {
  const features = [
    { t: "Alertes J-3", d: "Rappel avant l'ex-date sur vos titres favoris." },
    { t: "Score sécurité", d: "Indicateur 0–100 basé sur payout, régularité, couverture." },
    { t: "Simulations de revenus", d: "Projetez vos flux annuels selon votre capital." },
    { t: "Comparateurs avancés", d: "Rendement, régularité, croissance en un clic." },
    { t: "Exports CSV/PDF", d: "Téléchargez vos calendriers et palmarès filtrés." },
    { t: "Contenus exclusifs", d: "Analyses et rapports dédiés aux abonnés." },
  ];
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-white text-3xl font-bold">Passez au Premium et maximisez vos dividendes</h1>
          <p className="text-zinc-400 mt-2">Des alertes personnalisées, des scores de sécurité et des comparateurs avancés pour de meilleures décisions.</p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950">Essayer Premium</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h2 className="text-white font-medium">{f.t}</h2>
              <p className="text-zinc-400 text-sm mt-1">{f.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-white font-semibold">Mensuel</h2>
          <p className="text-3xl font-bold text-white mt-1">49 MAD</p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900">Je m&apos;abonne</button>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-white font-semibold">Annuel</h2>
          <p className="text-3xl font-bold text-white mt-1">490 MAD <span className="text-teal-400 text-sm">(2 mois offerts)</span></p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900">Je m&apos;abonne</button>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex items-center justify-between flex-wrap gap-4">
        <p className="text-white font-semibold">Rejoignez les investisseurs qui construisent leurs revenus passifs.</p>
        <button className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 whitespace-nowrap">Essayer Premium</button>
      </div>
    </main>
  );
}

function BlogPage() {
  const posts = [
    { c: "Bases", t: "Comprendre l'ex-dividende en 3 minutes", x: "L'ex-date est la date à partir de laquelle l'achat ne donne plus droit au dividende…" },
    { c: "Stratégies", t: "Rendement vs sécurité : éviter les yield traps", x: "Un rendement élevé peut masquer une situation fragile…" },
    { c: "Marché Maroc", t: "Lire un communiqué de dividende (AG, coupon)", x: "Les éléments clés à vérifier dans l'avis officiel…" },
  ];
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-white text-3xl font-bold">Blog & pédagogie</h1>
          <p className="text-zinc-400 mt-2">Comprendre les dividendes et investir sereinement à la Bourse de Casablanca.</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6" aria-hidden="true">
          <div className="text-zinc-400 text-sm">Illustration</div>
          <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-400">Bases</button>
          <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-400">Stratégies</button>
          <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-400">Marché Maroc</button>
          <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-400">Afrique</button>
        </div>
        <label htmlFor="blog-search" className="sr-only">Rechercher dans le blog</label>
        <input id="blog-search" type="search" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 w-64 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Rechercher…" />
      </div>

      <article className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 rounded-xl bg-zinc-950/60 h-48" aria-hidden="true" />
        <div>
          <span className="text-xs text-teal-400">En vedette</span>
          <h2 className="text-white text-xl font-semibold mt-1">Rendement vs sécurité : éviter les yield traps</h2>
          <p className="text-zinc-400 text-sm mt-2">Un rendement élevé peut masquer une situation fragile : apprenez à lire les signaux de risque (payout, couverture, volatilité)…</p>
          <button className="mt-3 text-teal-400 underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">Découvrir</button>
        </div>
      </article>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.t} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="rounded-lg bg-zinc-950/60 h-28 mb-3" aria-hidden="true" />
            <span className="text-xs text-teal-400">{p.c}</span>
            <h2 className="mt-2 text-white font-semibold">{p.t}</h2>
            <p className="text-zinc-400 text-sm mt-2">{p.x}</p>
            <button className="mt-3 text-teal-400 text-sm underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">Lire la suite</button>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-zinc-400 flex-wrap gap-2">
        <div>Page 1 sur 6</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400">Précédent</button>
          <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-400">Suivant</button>
        </div>
      </div>
    </main>
  );
}

function AboutContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-white text-2xl font-bold">À propos & Contact</h1>
      <p className="text-zinc-400 mt-2">Découvrez notre mission et entrez en contact avec l&apos;équipe CasaDividendes.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Mission" value="Fiabilité • Pédagogie • Accès" sub="Démocratiser l'investissement en dividendes au Maroc." />
        <StatCard title="Vision" value="Référence BVC" sub="Devenir le hub des dividendes à Casablanca." />
        <StatCard title="Transparence" value="Sources officielles" sub="BVC & communiqués émetteurs." />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-white font-semibold">Contactez-nous</h2>
          <form className="mt-4 grid gap-3">
            <label htmlFor="contact-name" className="sr-only">Nom</label>
            <input id="contact-name" type="text" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Nom" required />
            <label htmlFor="contact-email" className="sr-only">Email</label>
            <input id="contact-email" type="email" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Email" required />
            <label htmlFor="contact-subject" className="sr-only">Sujet</label>
            <input id="contact-subject" type="text" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Sujet" required />
            <label htmlFor="contact-message" className="sr-only">Message</label>
            <textarea id="contact-message" className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 h-28 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Message" required />
            <button type="submit" className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold w-full focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Envoyer</button>
          </form>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-white font-semibold">Coordonnées</h2>
          <ul className="mt-3 text-zinc-300 text-sm space-y-2">
            <li>✉️ contact@casadividendes.com</li>
            <li>🔗 LinkedIn / Twitter (optionnel)</li>
            <li>📍 Casablanca</li>
          </ul>
          <p className="mt-6 text-xs text-zinc-500">Nous répondons sous 48h ouvrées.</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-white font-semibold">Rejoignez la communauté CasaDividendes</h2>
        <p className="text-zinc-400 text-sm mt-1">Commencez par consulter le calendrier des prochains dividendes.</p>
        <button className="mt-3 px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900">Voir le calendrier</button>
      </div>
    </main>
  );
}

function LegalPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-white text-2xl font-bold">Mentions légales & CGU</h1>
      <div className="mt-4 space-y-6 text-sm text-zinc-300 leading-6">
        <section>
          <h2 className="text-white font-semibold">Mentions légales</h2>
          <p>Éditeur : CasaDividendes • Directeur de publication • Hébergeur : o2switch • © CasaDividendes.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold">CGU</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Objet & acceptation</li>
            <li>Accès au service</li>
            <li>Abonnements : gratuit / premium</li>
            <li>Sources & limites (pas de conseil d&apos;investissement)</li>
            <li>Disponibilité & responsabilité</li>
            <li>Résiliation • Loi applicable</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState("home");
  const [viewport, setViewport] = useState("desktop");
  const [selectedCompany, setSelectedCompany] = useState("IAM");

  const Frame = ({ children }) => (
    <div className={viewport === "mobile" ? "mx-auto border border-zinc-800 rounded-[22px] overflow-hidden max-w-[420px] shadow-2xl" : ""}>{children}</div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header route={route} setRoute={setRoute} />

      <div className="mx-auto max-w-6xl px-6 mt-4 flex items-center justify-end gap-2 text-sm" role="toolbar" aria-label="Sélecteur d'aperçu">
        <span className="text-zinc-500 hidden md:inline">Aperçu :</span>
        <button onClick={() => setViewport("desktop")} className={`px-3 py-1 rounded-lg border ${viewport === "desktop" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-400`} aria-pressed={viewport === "desktop"}>Desktop</button>
        <button onClick={() => setViewport("mobile")} className={`px-3 py-1 rounded-lg border ${viewport === "mobile" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-400`} aria-pressed={viewport === "mobile"}>Mobile</button>
      </div>

      <Frame>
        {route === "home" && <Home goCalendar={() => setRoute("calendar")} goPremium={() => setRoute("premium")} goRankings={() => setRoute("rankings")} />}
        {route === "calendar" && <CalendarPage onSelectCompany={(t) => { setSelectedCompany(t); setRoute("company"); }} />}
        {route === "rankings" && <RankingsPage onSelectCompany={(t) => { setSelectedCompany(t); setRoute("company"); }} />}
        {route === "company" && <CompanyPage ticker={selectedCompany} />}
        {route === "premium" && <PremiumPage />}
        {route === "blog" && <BlogPage />}
        {route === "about" && <AboutContactPage />}
        {route === "legal" && <LegalPage />}

        <footer className="mt-16 border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <nav className="flex flex-wrap gap-4 text-zinc-400" aria-label="Navigation du pied de page">
              {NAV.map((n) => (
                <button key={n.key} onClick={() => setRoute(n.key)} className="hover:text-white transition-colors focus:outline-none focus:underline">
                  {n.label}
                </button>
              ))}
            </nav>
            <div className="text-zinc-500">© {new Date().getFullYear()} CasaDividendes. Tous droits réservés.</div>
          </div>
        </footer>
      </Frame>
    </div>
  );
}
