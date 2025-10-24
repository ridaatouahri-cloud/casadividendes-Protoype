import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages principales
const Home = lazy(() => import("./pages/Home"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Rankings = lazy(() => import("./pages/Rankings"));
const Company = lazy(() => import("./pages/Company"));
const Premium = lazy(() => import("./pages/Premium"));
const Blog = lazy(() => import("./pages/Blog"));
const About = lazy(() => import("./pages/About"));
const Legal = lazy(() => import("./pages/Legal"));

// Pages d'authentification
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// Pages utilisateur
const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Profile = lazy(() => import("./pages/Profile"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-zinc-400">Chargement...</div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Page non trouvée</h1>
      <p className="text-zinc-400 mb-8">La page que vous recherchez n'existe pas.</p>
      <a 
        href="/" 
        className="px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold rounded-lg hover:brightness-110 transition-all"
      >
        Retour à l'accueil
      </a>
    </div>
  );
}

// Layout avec Header et Footer
function LayoutWithHeaderFooter({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

// Layout sans Header et Footer (pour auth pages)
function AuthLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-zinc-100">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Pages principales avec Header/Footer */}
          <Route path="/" element={<LayoutWithHeaderFooter><Home /></LayoutWithHeaderFooter>} />
          <Route path="/calendar" element={<LayoutWithHeaderFooter><Calendar /></LayoutWithHeaderFooter>} />
          <Route path="/ranking" element={<LayoutWithHeaderFooter><Rankings /></LayoutWithHeaderFooter>} />
          <Route path="/rankings" element={<Navigate to="/ranking" replace />} />
          <Route path="/company/:ticker" element={<LayoutWithHeaderFooter><Company /></LayoutWithHeaderFooter>} />
          <Route path="/premium" element={<LayoutWithHeaderFooter><Premium /></LayoutWithHeaderFooter>} />
          <Route path="/blog" element={<LayoutWithHeaderFooter><Blog /></LayoutWithHeaderFooter>} />
          <Route path="/about" element={<LayoutWithHeaderFooter><About /></LayoutWithHeaderFooter>} />
          <Route path="/legal" element={<LayoutWithHeaderFooter><Legal /></LayoutWithHeaderFooter>} />

          {/* Pages d'authentification SANS Header/Footer */}
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />

          {/* Pages utilisateur avec Header/Footer */}
          <Route path="/dashboard" element={<LayoutWithHeaderFooter><Dashboard /></LayoutWithHeaderFooter>} />
          {/* <Route path="/profile" element={<LayoutWithHeaderFooter><Profile /></LayoutWithHeaderFooter>} /> */}

          {/* 404 */}
          <Route path="*" element={<LayoutWithHeaderFooter><NotFound /></LayoutWithHeaderFooter>} />
        </Routes>
      </Suspense>
    </div>
  );
}