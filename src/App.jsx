import React, { useState, useEffect } from "react";

// =============================================================
// CasaDividendes — Prototype interactif (desktop)
// FIX: Remplacement complet du contenu non-code qui causait
// "Missing semicolon (1:2)" par un composant React valide.
// - Aucune syntaxe TypeScript dans les props (compat universelle)
// - Ajout de tests simples (console.assert) pour les utilitaires calendrier
// - Pages: Accueil, Calendrier (enrichi), Palmarès → Fiche Société,
//         Premium, Blog, À propos & Contact, Mentions
// =============================================================

// -----------------
// Utils + Tests
// -----------------
function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function firstWeekday(y, m) {
  // 0 = Dimanche, 1 = Lundi, ... 6 = Samedi
  return new Date(y, m, 1).getDay();
}
function mondayOffsetFromSundayFirstDay(d) {
  // Convertit 0..6 (Dim..Sam) -> 0..6 (Lun..Dim)
  return d === 0 ? 6 : d - 1;
}
function buildMonthGrid(y, m) {
  const totalDays = daysInMonth(y, m);
  const start = firstWeekday(y, m);
  const offset = mondayOffsetFromSundayFirstDay(start);
  const grid = Array.from({ length: 42 }).map((_, i) => {
    const dayNum = i - offset + 1;
    const inMonth = dayNum >= 1 && dayNum <= totalDays;
    const keyDate = inMonth ? new Date(y, m, dayNum) : null;
    return { dayNum: inMonth ? dayNum : "", keyDate, events: [] };
  });
  return { grid, offset, totalDays };
}

// --- Tests (ne modifie pas l'UI) ---
(function selfTests() {
  // Juin 2025 = 30 jours, commence un Dimanche
  console.assert(daysInMonth(2025, 5) === 30, "daysInMonth(2025,5) doit être 30");
  console.assert(firstWeekday(2025, 5) === 0, "firstWeekday(2025,5) doit être 0 (Dimanche)");
  console.assert(mondayOffsetFromSundayFirstDay(0) === 6, "offset Dimanche -> 6 (Lundi start)");
  const { grid, offset, totalDays } = buildMonthGrid(2025, 5);
  console.assert(grid.length === 42, "grid length doit être 42");
  // Le 1er du mois doit se trouver à l'index 'offset'
  console.assert(grid[offset].dayNum === 1, "grid[offset] doit être jour 1");
  // Le dernier jour doit exister
  const lastIndex = offset + totalDays - 1;
  console.assert(grid[lastIndex].dayNum === 30, "dernier jour doit être 30");
})();

// -----------------
// Navigation
// -----------------
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
          <div className="w-8 h-8 rounded-full bg-teal-500/20 grid place-items-center">
            <div className="w-3 h-3 border-2 border-teal-400 rotate-45" />
          </div>
          <div className="font-semibold text-white">CasaDividendes</div>
          <Pill>Beta</Pill>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setRoute(n.key)}
              className={`transition-colors ${route === n.key ? "text-teal-400" : "text-zinc-300 hover:text-white"}`}
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={() => setRoute("premium")}
            className="ml-2 px-3 py-1.5 rounded-lg bg-orange-500 text-black font-medium hover:brightness-110"
          >
            Premium
          </button>
        </nav>
      </div>
    </header>
  );
}

// -----------------
// Accueil
// -----------------
function HeroHome({ goCalendar, goPremium }) {
  return (
    <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            CasaDividendes : la première plateforme dédiée aux dividendes de la Bourse de Casablanca
          </h1>
          <p className="text-zinc-300 mt-4 md:text-lg">
            Un calendrier clair, des fiches sociétés fiables et des outils concrets pour investir avec sérénité.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={goCalendar} className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold hover:brightness-110">
              Voir le calendrier
            </button>
            <button onClick={goPremium} className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold hover:brightness-110">
              Découvrir Premium
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="text-zinc-400 text-sm">Illustration</div>
          <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black grid place-items-center">
            <div className="w-2/3 h-2/3 border border-teal-500/50 rounded-xl relative">
              <div className="absolute inset-x-6 bottom-6 h-1 bg-orange-500/60" />
              <div className="absolute left-6 bottom-6 w-1 h-1/2 bg-teal-400/70" />
              <div className="absolute left-1/3 bottom-6 w-1 h-2/3 bg-teal-400/70" />
              <div className="absolute left-2/3 bottom-6 w-1 h-3/4 bg-teal-400/70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Values() {
  const items = [
    { t: "Des données vérifiées", d: "Dates ex-dividende, paiements et historiques sourcés.", icon: "🧭" },
    { t: "Des outils utiles", d: "Palmarès, fiches, projections — l’essentiel, sans superflu.", icon: "🛠️" },
    { t: "Pédagogie locale", d: "Articles clairs en FR/Darija pour éviter les pièges.", icon: "📚" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-3 gap-6">
      {items.map((it) => (
        <div key={it.t} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="text-3xl">{it.icon}</div>
          <h3 className="text-white font-semibold mt-3">{it.t}</h3>
          <p className="text-zinc-400 mt-2 text-sm">{it.d}</p>
        </div>
      ))}
    </section>
  );
}

function PalmaresPreview({ goRankings }) {
  const rows = [
    { r: 1, t: "IAM", n: "Maroc Telecom", y: "5.2%", pay: "28/06" },
    { r: 2, t: "BCP", n: "Banque Populaire", y: "4.8%", pay: "21/06" },
    { r: 3, t: "ATW", n: "Attijariwafa Bank", y: "4.3%", pay: "05/07" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-semibold">Aperçu Palmarès</h3>
        <button onClick={goRankings} className="text-teal-400 hover:underline">Voir le palmarès complet</button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th className="text-left p-3">Rang</th>
              <th className="text-left p-3">Ticker</th>
              <th className="text-left p-3">Société</th>
              <th className="text-left p-3">Rendement</th>
              <th className="text-left p-3">Paiement</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.r} className="border-t border-zinc-800">
                <td className="p-3 text-zinc-300">{d.r}</td>
                <td className="p-3 text-white">{d.t}</td>
                <td className="p-3 text-zinc-200">{d.n}</td>
                <td className="p-3 text-teal-400 font-medium">{d.y}</td>
                <td className="p-3 text-zinc-300">{d.pay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div>
          <h4 className="text-white font-semibold">Restez informé(e)</h4>
          <p className="text-zinc-400 text-sm">Prochains dividendes, tendances & mises à jour.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <input className="flex-1 md:w-80 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 placeholder-zinc-500" placeholder="Entrez votre email" />
          <button className="px-4 py-2 rounded-lg bg-teal-400 text-black font-semibold hover:brightness-110">Je m’inscris</button>
        </div>
      </div>
    </section>
  );
}

function PremiumBand({ goPremium }) {
  return (
    <section className="border-t border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white text-lg font-semibold">
          Passez au Premium : alertes J-3, scores de sécurité, comparateurs.
        </div>
        <button onClick={goPremium} className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold hover:brightness-110">Essayer Premium</button>
      </div>
    </section>
  );
}

// -----------------
// Calendrier (enrichi)
// -----------------
function CalendarPage({ onSelectCompany }) {
  const [view, setView] = useState("table"); // "table" | "agenda"
  const [sector, setSector] = useState("tous");
  const [type, setType] = useState("tous");
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const queryDate = `${monthNames[month]} ${year}`;

  // Démo multi-sociétés & multi-mois
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-2xl font-bold">Calendrier des dividendes (BVC)</h2>
          <p className="text-zinc-400 mt-2">Prochaines <span className="text-teal-400 font-medium">ex-dates</span>, paiements et montants. Données vérifiées.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => setView("table")} className={`px-3 py-2 rounded-lg border ${view === "table" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900`}>Tableau</button>
          <button onClick={() => setView("agenda")} className={`px-3 py-2 rounded-lg border ${view === "agenda" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900`}>Calendrier</button>
        </div>
      </div>

      {/* Filtres enrichis */}
      <div className="mt-6 grid md:grid-cols-7 gap-3 items-center">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="px-2 py-2 rounded-lg bg-zinc-900 border border-zinc-700">◀</button>
          <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 min-w-[180px] text-center">{queryDate}</div>
          <button onClick={nextMonth} className="px-2 py-2 rounded-lg bg-zinc-900 border border-zinc-700">▶</button>
        </div>
        <select value={sector} onChange={(e) => setSector(e.target.value)} className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200"><option value="tous">Secteur (tous)</option><option value="Télécom">Télécom</option><option value="Banques">Banques</option><option value="Industrie">Industrie</option><option value="Immobilier">Immobilier</option></select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200"><option value="tous">Type (tous)</option><option value="Ordinaire">Ordinaire</option><option value="Intérim">Intérim</option><option value="Spécial">Spécial</option></select>
        <button className="px-3 py-2 rounded-lg bg-teal-400 text-black font-semibold">Appliquer</button>
        <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">Exporter CSV</button>
        <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">Exporter iCal</button>
        <div className="text-xs text-zinc-500">Astuce : activez des alertes J-3 (Premium) depuis la colonne Alerte.</div>
      </div>

      {/* Stats synthétiques */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <StatCard title="Dividendes ce mois" value="12" sub="Annoncés / à venir" />
        <StatCard title="Rendement moyen attendu" value="3.9%" sub="Sur l’échantillon filtré" />
        <StatCard title="Secteur le + actif" value="Banques" sub="Par nb. d’événements" />
      </div>

      {/* Vue tableau */}
      {view === "table" && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="text-left p-3">Ticker</th>
                <th className="text-left p-3">Société</th>
                <th className="text-left p-3">Secteur</th>
                <th className="text-left p-3">Ex-date</th>
                <th className="text-left p-3">Paiement</th>
                <th className="text-left p-3">Montant</th>
                <th className="text-left p-3">Badge</th>
                <th className="text-left p-3">Alerte</th>
                <th className="text-left p-3">Source</th>
                <th className="text-left p-3">Fiche</th>
              </tr>
            </thead>
            <tbody>
              {filtered.filter((r) => r.date.getFullYear() === year && r.date.getMonth() === month).map((r, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  <td className="p-3 text-white"><button onClick={() => onSelectCompany(r.t)} className="underline">{r.t}</button></td>
                  <td className="p-3 text-zinc-200">{r.n}</td>
                  <td className="p-3 text-zinc-300">{r.sector}</td>
                  <td className="p-3 text-zinc-300">{r.ex}</td>
                  <td className="p-3 text-zinc-300">{r.pay}</td>
                  <td className="p-3 text-teal-400 font-medium">{r.amt}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs border ${r.badge === "Spécial" ? "border-orange-500 text-orange-400" : r.badge === "Intérim" ? "border-blue-400 text-blue-300" : "border-teal-500 text-teal-400"}`}>{r.badge}</span></td>
                  <td className="p-3">{r.premium ? <span className="text-zinc-400">🔔 <span className="text-xs">(Premium)</span></span> : <button className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200">Activer</button>}</td>
                  <td className="p-3 text-zinc-400 underline">{r.src}</td>
                  <td className="p-3"><button onClick={() => onSelectCompany(r.t)} className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">Ouvrir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-4 text-sm text-zinc-400">
            <div>Page 1 sur 4</div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700">Précédent</button>
              <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700">Suivant</button>
            </div>
          </div>
        </div>
      )}

      {/* Vue agenda */}
      {view === "agenda" && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between mb-3 text-sm text-zinc-300">
            <div>{queryDate}</div>
            <div className="flex gap-2"><Pill>Ordinaire</Pill><Pill>Intérim</Pill><Pill>Spécial</Pill></div>
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
                      key={i}
                      onClick={() => onSelectCompany(ev.t)}
                      className={`text-[10px] px-1 py-0.5 rounded border inline-block cursor-pointer ${ev.kind === "Spécial" ? "border-orange-500 text-orange-400" : ev.kind === "Intérim" ? "border-blue-400 text-blue-300" : "border-teal-500 text-teal-400"}`}
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

      {/* Confiance & pédagogie */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="text-white font-semibold">Sources</div>
          <div className="text-zinc-400 text-sm mt-1">Bourse de Casablanca, communiqués officiels des émetteurs, avis d’AG.</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="text-white font-semibold">Pédagogie</div>
          <div className="text-zinc-400 text-sm mt-1">⚡ Ex-date = date à partir de laquelle l’achat ne donne plus droit au dividende.</div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white font-semibold">Débloquez les alertes automatiques J-3, l’export iCal/CSV et les vues avancées.</div>
        <button className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold">Essayer Premium</button>
      </div>

      <div className="mt-6 text-xs text-zinc-500">⚠️ Les informations sont fournies à titre indicatif. Référez-vous toujours à la source officielle.</div>
    </main>
  );
}

// -----------------
// Palmarès
// -----------------
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
      <h2 className="text-white text-2xl font-bold">Palmarès des dividendes</h2>
      <p className="text-zinc-400 mt-2">Comparez les sociétés selon le rendement, la régularité et la croissance.</p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Pill>Rendement TTM</Pill>
        <Pill>Régularité</Pill>
        <Pill>Croissance 5 ans</Pill>
        <Pill>Score sécurité 🔒</Pill>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <StatCard title="Rendement moyen" value="4.1%" />
        <StatCard title="Top secteur" value="Télécom" />
        <StatCard title="Meilleure régularité" value="IAM (10 ans)" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th className="text-left p-3">Rang</th>
              <th className="text-left p-3">Ticker</th>
              <th className="text-left p-3">Société</th>
              <th className="text-left p-3">Div. TTM</th>
              <th className="text-left p-3">Cours</th>
              <th className="text-left p-3">Rendement</th>
              <th className="text-left p-3">Fiche</th>
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
                <td className="p-3"><button onClick={() => onSelectCompany(r.t)} className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">Ouvrir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="text-zinc-300 text-sm">⚡ Rendement TTM = dividende versé sur 12 mois / cours actuel.</div>
      </div>
    </main>
  );
}

// -----------------
// Fiche Société
// -----------------
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
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-white text-2xl font-bold">{m.name} ({ticker})</h2>
          <div className="mt-1 text-zinc-400 text-sm">{m.sector} • {m.country} • <a className="underline" href="#">Site web</a></div>
        </div>
        <div className="w-14 h-14 rounded-full bg-teal-500/20 grid place-items-center"><div className="w-5 h-5 border-2 border-teal-400 rotate-45"/></div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <StatCard title="Rendement TTM" value={m.yieldTTM} />
        <StatCard title="Années sans baisse" value={m.streak} />
        <StatCard title="Prochain paiement" value={m.nextPay || "—"} />
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="text-zinc-300 text-sm mb-3">Historique des dividendes</div>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="text-left p-3">Ex-date</th>
                <th className="text-left p-3">Paiement</th>
                <th className="text-left p-3">Montant</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Source</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-t border-zinc-800">
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
          <button className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold">Activer alerte J-3</button>
          <button className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">Ajouter à mon portefeuille</button>
          <button className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">Exporter CSV/PDF</button>
        </div>

        <div className="mt-6 text-xs text-zinc-500">⚡ Ex-date : date à partir de laquelle l’achat de l’action ne donne plus droit au dividende.</div>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">Analyse Premium 🔒</div>
            <div className="text-zinc-400 text-sm">Score sécurité, payout ratio, projections de revenus…</div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold">Essayer Premium</button>
        </div>
      </div>
    </main>
  );
}

// -----------------
// Premium
// -----------------
function PremiumPage() {
  const features = [
    { t: "Alertes J-3", d: "Rappel avant l’ex-date sur vos titres favoris." },
    { t: "Score sécurité", d: "Indicateur 0–100 basé sur payout, régularité, couverture." },
    { t: "Simulations de revenus", d: "Projetez vos flux annuels selon votre capital." },
    { t: "Comparateurs avancés", d: "Rendement, régularité, croissance en un clic." },
    { t: "Exports CSV/PDF", d: "Téléchargez vos calendriers et palmarès filtrés." },
    { t: "Contenus exclusifs", d: "Analyses et rapports dédiés aux abonnés." },
  ];
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-white text-3xl font-bold">Passez au Premium et maximisez vos dividendes</h2>
          <p className="text-zinc-400 mt-2">Des alertes personnalisées, des scores de sécurité et des comparateurs avancés pour de meilleures décisions.</p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold">Essayer Premium</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="text-white font-medium">{f.t}</div>
              <div className="text-zinc-400 text-sm mt-1">{f.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="text-white font-semibold">Mensuel</div>
          <div className="text-3xl font-bold text-white mt-1">49 MAD</div>
          <button className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold w-full">Je m’abonne</button>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="text-white font-semibold">Annuel</div>
          <div className="text-3xl font-bold text-white mt-1">490 MAD <span className="text-teal-400 text-sm">(2 mois offerts)</span></div>
          <button className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold w-full">Je m’abonne</button>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex items-center justify-between">
        <div className="text-white font-semibold">Rejoignez les investisseurs qui construisent leurs revenus passifs.</div>
        <button className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold">Essayer Premium</button>
      </div>
    </main>
  );
}

// -----------------
// Blog
// -----------------
function BlogPage() {
  const posts = [
    { c: "Bases", t: "Comprendre l’ex-dividende en 3 minutes", x: "L’ex-date est la date à partir de laquelle l’achat ne donne plus droit au dividende…" },
    { c: "Stratégies", t: "Rendement vs sécurité : éviter les yield traps", x: "Un rendement élevé peut masquer une situation fragile…" },
    { c: "Marché Maroc", t: "Lire un communiqué de dividende (AG, coupon)", x: "Les éléments clés à vérifier dans l’avis officiel…" },
  ];
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-white text-3xl font-bold">Blog & pédagogie</h2>
          <p className="text-zinc-400 mt-2">Comprendre les dividendes et investir sereinement à la Bourse de Casablanca.</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="text-zinc-400 text-sm">Illustration</div>
          <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">Bases</button>
          <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">Stratégies</button>
          <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">Marché Maroc</button>
          <button className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">Afrique</button>
        </div>
        <input className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 w-64" placeholder="Rechercher…" />
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 rounded-xl bg-zinc-950/60 h-48" />
        <div>
          <div className="text-xs text-teal-400">En vedette</div>
          <h3 className="text-white text-xl font-semibold mt-1">Rendement vs sécurité : éviter les yield traps</h3>
          <p className="text-zinc-400 text-sm mt-2">Un rendement élevé peut masquer une situation fragile : apprenez à lire les signaux de risque (payout, couverture, volatilité)…</p>
          <button className="mt-3 text-teal-400 underline">Découvrir</button>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.t} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="rounded-lg bg-zinc-950/60 h-28 mb-3" />
            <div className="text-xs text-teal-400">{p.c}</div>
            <h3 className="mt-2 text-white font-semibold">{p.t}</h3>
            <p className="text-zinc-400 text-sm mt-2">{p.x}</p>
            <button className="mt-3 text-teal-400 text-sm underline">Lire la suite</button>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-zinc-400">
        <div>Page 1 sur 6</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700">Précédent</button>
          <button className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700">Suivant</button>
        </div>
      </div>

      <Newsletter />
    </main>
  );
}

// -----------------
// À propos & Contact
// -----------------
function AboutContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="text-white text-2xl font-bold">À propos & Contact</h2>
      <p className="text-zinc-400 mt-2">Découvrez notre mission et entrez en contact avec l’équipe CasaDividendes.</p>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <StatCard title="Mission" value="Fiabilité • Pédagogie • Accès" sub="Démocratiser l’investissement en dividendes au Maroc." />
        <StatCard title="Vision" value="Référence BVC" sub="Devenir le hub des dividendes à Casablanca." />
        <StatCard title="Transparence" value="Sources officielles" sub="BVC & communiqués émetteurs." />
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="text-white font-semibold">Contactez-nous</div>
          <div className="mt-4 grid gap-3">
            <input className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200" placeholder="Nom" />
            <input className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200" placeholder="Email" />
            <input className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200" placeholder="Sujet" />
            <textarea className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 h-28" placeholder="Message" />
            <button className="px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold w-full">Envoyer</button>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="text-white font-semibold">Coordonnées</div>
          <ul className="mt-3 text-zinc-300 text-sm space-y-2">
            <li>✉️ contact@casadividendes.com</li>
            <li>🔗 LinkedIn / Twitter (optionnel)</li>
            <li>📍 Casablanca</li>
          </ul>
          <div className="mt-6 text-xs text-zinc-500">Nous répondons sous 48h ouvrées.</div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="text-white font-semibold">Rejoignez la communauté CasaDividendes</div>
        <div className="text-zinc-400 text-sm mt-1">Commencez par consulter le calendrier des prochains dividendes.</div>
        <button className="mt-3 px-4 py-2 rounded-xl bg-teal-400 text-black font-semibold">Voir le calendrier</button>
      </div>
    </main>
  );
}

// -----------------
// Mentions légales & CGU
// -----------------
function LegalPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h2 className="text-white text-2xl font-bold">Mentions légales & CGU</h2>
      <div className="mt-4 space-y-6 text-sm text-zinc-300 leading-6">
        <section>
          <h3 className="text-white font-semibold">Mentions légales</h3>
          <p>Éditeur : CasaDividendes • Directeur de publication • Hébergeur : o2switch • © CasaDividendes.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold">CGU</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Objet & acceptation</li>
            <li>Accès au service</li>
            <li>Abonnements : gratuit / premium</li>
            <li>Sources & limites (pas de conseil d’investissement)</li>
            <li>Disponibilité & responsabilité</li>
            <li>Résiliation • Loi applicable</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

// -----------------
// App (nav + routes + responsive preview)
// -----------------
export default function App() {
  const [route, setRoute] = useState("home");
  const [viewport, setViewport] = useState("desktop"); // "desktop" | "mobile"
  const [selectedCompany, setSelectedCompany] = useState("IAM");

  const Frame = ({ children }) => (
    <div className={viewport === "mobile" ? "mx-auto border border-zinc-800 rounded-[22px] overflow-hidden max-w-[420px] shadow-2xl" : ""}>{children}</div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header route={route} setRoute={setRoute} />

      <div className="mx-auto max-w-6xl px-6 mt-4 flex items-center justify-end gap-2 text-sm">
        <span className="text-zinc-500 hidden md:inline">Aperçu :</span>
        <button onClick={() => setViewport("desktop")} className={`px-3 py-1 rounded-lg border ${viewport === "desktop" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900`}>Desktop</button>
        <button onClick={() => setViewport("mobile")} className={`px-3 py-1 rounded-lg border ${viewport === "mobile" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900`}>Mobile</button>
      </div>

      <Frame>
        {route === "home" && (
          <>
            <HeroHome goCalendar={() => setRoute("calendar")} goPremium={() => setRoute("premium")} />
            <Values />
            <PalmaresPreview goRankings={() => setRoute("rankings")} />
            <Newsletter />
            <PremiumBand goPremium={() => setRoute("premium")} />
          </>
        )}

        {route === "calendar" && <CalendarPage onSelectCompany={(t) => { setSelectedCompany(t); setRoute("company"); }} />}
        {route === "rankings" && <RankingsPage onSelectCompany={(t) => { setSelectedCompany(t); setRoute("company"); }} />}
        {route === "company" && <CompanyPage ticker={selectedCompany} />}
        {route === "premium" && <PremiumPage />}
        {route === "blog" && <BlogPage />}
        {route === "about" && <AboutContactPage />}
        {route === "legal" && <LegalPage />}

        <footer className="mt-16 border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <nav className="flex flex-wrap gap-4 text-zinc-400">
              {NAV.map((n) => (
                <button key={n.key} onClick={() => setRoute(n.key)} className="hover:text-white">
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
