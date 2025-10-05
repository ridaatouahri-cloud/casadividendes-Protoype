import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { StatCard, Pill } from "../components/StatCard";
import { daysInMonth, firstWeekday, mondayOffsetFromSundayFirstDay } from "../utils/calendar";

export default function Calendar() {
  const navigate = useNavigate();
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

  const handleSelectCompany = (ticker) => {
    navigate(`/company/${ticker}`);
  };

  return (
    <>
      <Helmet>
        <title>Calendrier des Dividendes - CasaDividendes</title>
        <meta name="description" content="Consultez le calendrier complet des dividendes de la Bourse de Casablanca. Ex-dates, paiements, montants et alertes pour toutes les sociétés cotées." />
      </Helmet>

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
                    <td className="p-3 text-white"><button onClick={() => handleSelectCompany(r.t)} className="underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">{r.t}</button></td>
                    <td className="p-3 text-zinc-200">{r.n}</td>
                    <td className="p-3 text-zinc-300">{r.sector}</td>
                    <td className="p-3 text-zinc-300">{r.ex}</td>
                    <td className="p-3 text-zinc-300">{r.pay}</td>
                    <td className="p-3 text-teal-400 font-medium">{r.amt}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs border ${r.badge === "Spécial" ? "border-orange-500 text-orange-400" : r.badge === "Intérim" ? "border-blue-400 text-blue-300" : "border-teal-500 text-teal-400"}`}>{r.badge}</span></td>
                    <td className="p-3">{r.premium ? <span className="text-zinc-400">🔔 <span className="text-xs">(Premium)</span></span> : <button className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400">Activer</button>}</td>
                    <td className="p-3 text-zinc-400 underline">{r.src}</td>
                    <td className="p-3"><button onClick={() => handleSelectCompany(r.t)} className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-400">Ouvrir</button></td>
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
                        onClick={() => handleSelectCompany(ev.t)}
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
          <button onClick={() => navigate("/premium")} className="px-4 py-2 rounded-xl bg-orange-500 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 whitespace-nowrap">Essayer Premium</button>
        </div>

        <p className="mt-6 text-xs text-zinc-500">⚠️ Les informations sont fournies à titre indicatif. Référez-vous toujours à la source officielle.</p>
      </main>
    </>
  );
}
