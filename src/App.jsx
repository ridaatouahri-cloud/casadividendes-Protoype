import React, { Suspense, lazy, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Rankings = lazy(() => import("./pages/Rankings"));
const Company = lazy(() => import("./pages/Company"));
const Premium = lazy(() => import("./pages/Premium"));
const Blog = lazy(() => import("./pages/Blog"));
const About = lazy(() => import("./pages/About"));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-zinc-400">Chargement…</div>
    </div>
  );
}

export default function App() {
  const [viewport, setViewport] = useState("desktop");

  const Frame = ({ children }) => (
    <div className={viewport === "mobile" ? "mx-auto border border-zinc-800 rounded-[22px] overflow-hidden max-w-[420px] shadow-2xl" : ""}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />

      <div className="mx-auto max-w-6xl px-6 mt-4 flex items-center justify-end gap-2 text-sm" role="toolbar" aria-label="Sélecteur d'aperçu">
        <span className="text-zinc-500 hidden md:inline">Aperçu :</span>
        <button
          onClick={() => setViewport("desktop")}
          className={`px-3 py-1 rounded-lg border ${viewport === "desktop" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-400`}
          aria-pressed={viewport === "desktop"}
        >
          Desktop
        </button>
        <button
          onClick={() => setViewport("mobile")}
          className={`px-3 py-1 rounded-lg border ${viewport === "mobile" ? "border-teal-500 text-white" : "border-zinc-700 text-zinc-300"} bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-400`}
          aria-pressed={viewport === "mobile"}
        >
          Mobile
        </button>
      </div>

      <Frame>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/company/:ticker" element={<Company />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <Footer />
      </Frame>
    </div>
  );
}
