// ========================================
// 2. PAGE CONNEXION (Login.jsx)
// ========================================

export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Rediriger vers le dashboard
        window.location.hash = "#/dashboard";
      } else {
        setError(data.error || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] relative overflow-hidden flex items-center justify-center px-6">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full blur-[140px] bg-gradient-to-br from-teal-500/10 to-emerald-400/5 animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute -bottom-24 -right-24 w-[45rem] h-[45rem] rounded-full blur-[160px] bg-gradient-to-br from-orange-500/12 to-amber-400/8 animate-pulse" style={{ animationDuration: "15s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <a href="#/" className="inline-block mb-8">
          <span className="text-2xl font-semibold tracking-[-0.04em] bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent">
            CasaDividendes
          </span>
        </a>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Bon retour !</h1>
          <p className="text-zinc-400 mb-8">
            Pas encore inscrit ?{" "}
            <a href="#/register" className="text-teal-300 hover:text-teal-200 transition-colors">
              Créer un compte
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/[0.03] text-teal-400 focus:ring-2 focus:ring-teal-400/50"
                />
                <label htmlFor="remember" className="text-sm text-zinc-400">
                  Se souvenir de moi
                </label>
              </div>
              <a href="#/forgot-password" className="text-sm text-teal-300 hover:text-teal-200 transition-colors">
                Mot de passe oublié ?
              </a>
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
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        {/* Retour à l'accueil */}
        <div className="mt-6 text-center">
          <a href="#/" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
            ← Retour à l'accueil
          </a>
        </div>
      </motion.div>
    </div>
  );
}