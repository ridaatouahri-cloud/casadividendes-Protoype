import React, { useEffect, useState, Suspense, lazy } from "react";
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

function getHashPath() {
  const h = window.location.hash || "#/";
  return h.replace(/^#/, "").split("?")[0] || "/";
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-zinc-400">Chargement…</div>
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(getHashPath());

  useEffect(() => {
    const onHash = () => setPath(getHashPath());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const renderRoute = () => {
    switch (path) {
      case "/":
        return <Home />;
      case "/calendar":
        return <Calendar />;
      case "/rankings":
        return <Rankings />;
      case "/premium":
        return <Premium />;
      case "/blog":
        return <Blog />;
      case "/about":
        return <About />;
      case "/legal":
        return <Legal />;
      default:
        if (path.startsWith("/company/")) {
          const ticker = path.split("/")[2] || "IAM";
          return <Company ticker={ticker} />;
        }
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
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />

      <Suspense fallback={<LoadingFallback />}>
        {renderRoute()}
      </Suspense>

      <Footer />
    </div>
  );
}
