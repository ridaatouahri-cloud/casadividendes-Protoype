import React, { Suspense, lazy } from "react";
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

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-zinc-400">Chargement…</div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Page non trouvée</h1>
      <p className="text-zinc-400 mb-8">La page que vous recherchez n'existe pas.</p>
      <a href="#/" className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors">
        Retour à l'accueil
      </a>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />

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
    </div>
  );
}
