// ========================================
// 1. PAGE INSCRIPTION (Register.jsx)
// ========================================

import React, { useState } from "react";
import { motion } from "framer-motion";

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (!formData.acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Calendrier des dividendes personnalisé",
    "Alertes en temps réel",
    "Scores exclusifs C-DRS™, PRT™, NDF™",
    "Simulateur DRIP avancé",
    "Analyses sectorielles premium",
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-teal-300" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">Compte créé avec succès !</h2>
          <p className="text-zinc-400 mb-8">
            Un email de vérification a été envoyé à <span className="text-teal-300">{formData.email}</span>
          </p>
          <a
            href="#/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition-all"
          >
            Se connecter
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full blur-[140px] bg-gradient-to-br from-teal-500/10 to-emerald-400/5 animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute -bottom-24 -right-24 w-[45rem] h-[45rem] rounded-full blur-[160px] bg-gradient-to-br from-orange-500/12 to-amber-400/8 animate-pulse" style={{ animationDuration: "15s" }} />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Section gauche - Formulaire */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <a href="#/" className="inline-block mb-8">
              <span className="text-2xl font-semibold tracking-[-0.04em] bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent">
                CasaDividendes
              </span>
            </a>

            <h1 className="text-3xl font-semibold text-white mb-2">Créer un compte</h1>
            <p className="text-zinc-400 mb-8">
              Déjà inscrit ?{" "}
              <a href="#/login" className="text-teal-300 hover:text-teal-200 transition-colors">
                Se connecter
              </a>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prénom et Nom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm text-zinc-400 mb-2">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-400/40 transition-all"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm text-zinc-400 mb-2">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-400/40 transition-all"
                    placeholder="Nom"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-400/40 transition-all"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-400/40 transition-all"
                  placeholder="••••••••"
                />
                <p className="text-xs text-zinc-500 mt-1">Minimum 8 caractères</p>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-zinc-400 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-400/40 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Checkbox CGU */}
              <div className="flex items-start gap-3">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-white/10 bg-white/[0.03] text-teal-400 focus:ring-2 focus:ring-teal-400/50"
                />
                <label htmlFor="acceptTerms" className="text-sm text-zinc-400">
                  J'accepte les{" "}
                  <a href="#/terms" className="text-teal-300 hover:text-teal-200">
                    conditions d'utilisation
                  </a>{" "}
                  et la{" "}
                  <a href="#/privacy" className="text-teal-300 hover:text-teal-200">
                    politique de confidentialité
                  </a>
                </label>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Création en cours..." : "Créer mon compte"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Section droite - Bénéfices */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-12 py-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md"
          >
            <h2 className="text-3xl font-semibold text-white mb-6">
              Rejoignez <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">2 000+ investisseurs</span>
            </h2>
            <p className="text-zinc-400 mb-8">
              Accédez aux outils exclusifs pour optimiser vos investissements dividendes sur la Bourse de Casablanca.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-teal-300" />
                  </div>
                  <span className="text-zinc-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}