/ ========================================
// 3. PAGE MOT DE PASSE OUBLIÉ (ForgotPassword.jsx)
// ========================================

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
          <h2 className="text-2xl font-semibold text-white mb-3">Email envoyé !</h2>
          <p className="text-zinc-400 mb-8">
            Un lien de réinitialisation a été envoyé à <span className="text-teal-300">{email}</span>
          </p>
          <a
            href="#/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition-all"
          >
            Retour à la connexion
          </a>
        </motion.div>
      </div>
    );
  }

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
        <a href="#/" className="inline-block mb-8">
          <span className="text-2xl font-semibold tracking-[-0.04em] bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent">
            CasaDividendes
          </span>
        </a>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Mot de passe oublié ?</h1>
          <p className="text-zinc-400 mb-8">
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-400/40 transition-all"
                placeholder="votre@email.com"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
            ← Retour à la connexion
          </a>
        </div>
      </motion.div>
    </div>
  );
}