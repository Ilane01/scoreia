"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Check, ArrowRight, Star } from "lucide-react";

const PERKS = [
  "Analyse tes 4 LLMs en 2 minutes",
  "Plan de contenu pour gagner des points",
  "Benchmark contre tes concurrents",
  "Résultats gratuits, aucune CB requise",
];

export default function SignupPage() {
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#07070d" }}>

      {/* ── Left panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0d0821 0%, #120a2e 50%, #07070d 100%)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.25), transparent)" }} />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
          <span className="font-black text-lg text-white tracking-tight">ScoreIA</span>
        </Link>

        {/* Main copy */}
        <div className="relative z-10">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">GEO · Generative Engine Optimization</p>
          <h2 className="text-3xl font-black text-white leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
            Découvre si l&apos;IA parle<br />de ta marque — ou pas.
          </h2>
          <ul className="space-y-3 mb-10">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-white/65">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.15)" }}>
                  <Check size={11} className="text-green-400" />
                </div>
                {p}
              </li>
            ))}
          </ul>

          {/* Mini testimonial */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-sm text-white/65 leading-relaxed mb-4">
              &ldquo;Mon score est passé de 12 à 64 en 6 semaines. Les IA recommandent maintenant mon agence en premier.&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: "#7c3aed" }}>TB</div>
              <div>
                <p className="text-xs font-semibold text-white">Thomas B.</p>
                <p className="text-xs text-white/35">Fondateur, agence digitale</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/20 relative z-10">© 2025 ScoreIA</p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
          <span className="font-black text-base text-white">ScoreIA</span>
        </Link>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: "-0.02em" }}>Crée ton compte</h1>
          <p className="text-sm text-white/40 mb-8">Gratuit · Résultats en 2 minutes</p>

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
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                placeholder="6 caractères minimum"
                className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary rounded-xl py-3.5 font-bold text-white text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
              {loading ? "Création en cours…" : <><span>Créer mon compte</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-xs text-white/25 mt-6">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Se connecter</Link>
          </p>

          <p className="text-center text-xs text-white/18 mt-4 leading-relaxed">
            En créant un compte, tu acceptes nos{" "}
            <a href="#" className="underline underline-offset-2 hover:text-white/35">CGU</a>
            {" "}et notre{" "}
            <a href="#" className="underline underline-offset-2 hover:text-white/35">politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
