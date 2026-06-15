"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, TrendingUp, Eye, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon: BarChart3, label: "Score IA de 0 à 100" },
  { icon: Eye, label: "4 LLMs monitorés simultanément" },
  { icon: TrendingUp, label: "Plan de contenu pour progresser" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#07070d" }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0d0821 0%, #120a2e 50%, #07070d 100%)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.25), transparent)" }} />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
          <span className="font-black text-lg text-white tracking-tight">ScoreIA</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            Bon retour 👋
          </h2>
          <p className="text-white/45 text-sm mb-10 leading-relaxed">
            Connecte-toi pour accéder à tes analyses et suivre l&apos;évolution de ta visibilité IA.
          </p>
          <ul className="space-y-4">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <f.icon size={16} className="text-violet-400" />
                </div>
                <span className="text-sm text-white/60">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/20 relative z-10">© 2025 ScoreIA</p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
          <span className="font-black text-base text-white">ScoreIA</span>
        </Link>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: "-0.02em" }}>Connexion</h1>
          <p className="text-sm text-white/40 mb-8">Content de te revoir.</p>

          {error && (
            <p className="text-sm mb-5 rounded-xl px-4 py-3 text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/45 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="toi@exemple.fr"
                className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/45 mb-2 uppercase tracking-wider">Mot de passe</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary rounded-xl py-3.5 font-bold text-white text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
              {loading ? "Connexion…" : <><span>Se connecter</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-xs text-white/25 mt-6">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 transition-colors">Créer un compte gratuit</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
