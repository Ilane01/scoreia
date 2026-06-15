"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, ArrowLeft, Check, Star, X, Plus } from "lucide-react";
import Link from "next/link";

const TOTAL_STEPS = 4;

const INDUSTRIES = [
  "E-commerce", "Retail & Commerce", "Santé & Bien-être", "Services B2B",
  "Formation & Éducation", "Immobilier", "Finance & Assurance", "Marketing & Agences",
  "Restauration & Hôtellerie", "Juridique & Conseil", "Coaching & Consulting", "Artisanat & BTP", "Autre",
];

export default function OnboardingPage() {
  const router = useRouter();

  // Form data
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [competitors, setCompetitors] = useState<string[]>(["", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const addCompetitor = () => { if (competitors.length < 5) setCompetitors([...competitors, ""]); };
  const updateCompetitor = (i: number, v: string) => { const u = [...competitors]; u[i] = v; setCompetitors(u); };
  const removeCompetitor = (i: number) => { if (competitors.length > 1) setCompetitors(competitors.filter((_, idx) => idx !== i)); };

  const canProceed = () => {
    if (step === 1) return brandName.trim().length > 1;
    if (step === 2) return industry.length > 0;
    if (step === 3) return true; // concurrents optionnels
    return false;
  };

  const goNext = () => {
    if (!canProceed()) return;
    setAnimating(true);
    setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 150);
  };

  const goBack = () => {
    if (step === 1) return;
    setAnimating(true);
    setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 150);
  };

  const handleSubmit = async () => {
    if (!email.trim() || password.length < 6) return;
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (authErr) { setError(authErr.message); setLoading(false); return; }

    const userId = authData.user?.id;
    if (!userId) { router.push("/dashboard"); return; }

    // If no session = email confirmation required
    if (!authData.session) {
      setEmailSent(true);
      setLoading(false);
      return;
    }

    // Create brand with onboarding data
    const { data: brand, error: brandErr } = await supabase
      .from("brands")
      .insert({
        name: brandName.trim(),
        industry: industry || "Non précisé",
        competitors: competitors.filter(c => c.trim()),
        user_id: userId,
      })
      .select()
      .single();

    if (brandErr || !brand) {
      router.push("/dashboard");
      return;
    }

    router.push(`/dashboard/brands/${brand.id}`);
  };

  const pct = (step / TOTAL_STEPS) * 100;

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12 relative" style={{ background: "#07070d" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(124,58,237,0.13), transparent 65%)" }} />
        <div className="relative z-10 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
            <span className="text-3xl">📬</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-3" style={{ letterSpacing: "-0.025em" }}>Vérifie ton email</h2>
          <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            On a envoyé un lien de confirmation à <strong className="text-white">{email}</strong>.
          </p>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
            Clique dessus pour activer ton compte et voir ton score IA.
          </p>
          <div className="rounded-xl px-5 py-4 text-sm text-left" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
            Pas reçu ? Vérifie tes spams · Le lien expire dans 24h
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12 relative" style={{ background: "#07070d" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(124,58,237,0.13), transparent 65%)" }} />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10 relative z-10">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
        <span className="font-black text-sm text-white tracking-tight">ScoreIA</span>
      </Link>

      {/* Card */}
      <div className={`w-full max-w-md relative z-10 transition-opacity duration-150 ${animating ? "opacity-0" : "opacity-100"}`}>

        {/* Progress */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs text-white/35 font-medium">{step < TOTAL_STEPS ? `Étape ${step} sur ${TOTAL_STEPS - 1}` : "Dernière étape"}</p>
            <p className="text-xs text-violet-400 font-semibold">{Math.round(pct)}%</p>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7c3aed, #a855f7)" }} />
          </div>
        </div>

        {/* Step content card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>

          {/* ── Step 1: Brand name ── */}
          {step === 1 && (
            <div className="p-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>Ta marque</p>
              <h2 className="text-[26px] font-black text-white leading-tight mb-3" style={{ letterSpacing: "-0.025em" }}>
                Quelle marque veux-tu<br />analyser ?
              </h2>
              <p className="text-sm text-white/40 mb-8 leading-relaxed">
                On va demander à ChatGPT, Gemini, Claude et Perplexity ce qu&apos;ils savent d&apos;elle.
              </p>
              <input
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && goNext()}
                placeholder="Ex : Decathlon, Ma Clinique, MonSaaS…"
                autoFocus
                className="w-full rounded-xl px-5 py-4 text-white text-[15px] focus:outline-none placeholder-white/20"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          )}

          {/* ── Step 2: Industry ── */}
          {step === 2 && (
            <div className="p-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>Ton secteur</p>
              <h2 className="text-[26px] font-black text-white leading-tight mb-3" style={{ letterSpacing: "-0.025em" }}>
                Dans quel secteur<br />tu opères ?
              </h2>
              <p className="text-sm text-white/40 mb-7 leading-relaxed">
                On adapte les 15+ questions posées aux IA selon ton domaine.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map(ind => (
                  <button key={ind} onClick={() => setIndustry(ind)}
                    className="flex items-center gap-2 rounded-xl px-3.5 py-3 text-[13px] font-medium text-left transition-all duration-150"
                    style={{
                      background: industry === ind ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${industry === ind ? "rgba(124,58,237,0.55)" : "rgba(255,255,255,0.07)"}`,
                      color: industry === ind ? "#c4b5fd" : "rgba(255,255,255,0.55)",
                    }}>
                    {industry === ind && <Check size={12} className="text-violet-400 flex-shrink-0" />}
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Competitors ── */}
          {step === 3 && (
            <div className="p-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>Concurrents</p>
              <h2 className="text-[26px] font-black text-white leading-tight mb-3" style={{ letterSpacing: "-0.025em" }}>
                Qui sont tes<br />principaux concurrents ?
              </h2>
              <p className="text-sm text-white/40 mb-7 leading-relaxed">
                On vérifiera si les IA les citent à ta place. Optionnel — tu peux passer cette étape.
              </p>
              <div className="space-y-2.5">
                {competitors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white/20 w-4 text-right flex-shrink-0">{i + 1}</span>
                    <input
                      value={c}
                      onChange={e => updateCompetitor(i, e.target.value)}
                      placeholder={["Ex : Decathlon", "Ex : Nike", "Ex : Adidas"][i] ?? `Concurrent ${i + 1}`}
                      className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                    {competitors.length > 1 && (
                      <button onClick={() => removeCompetitor(i)} className="text-white/20 hover:text-white/45 transition-colors">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {competitors.length < 5 && (
                <button onClick={addCompetitor} className="mt-3 flex items-center gap-1.5 text-xs font-semibold transition-colors" style={{ color: "#a78bfa" }}>
                  <Plus size={12} /> Ajouter un concurrent
                </button>
              )}
            </div>
          )}

          {/* ── Step 4: Account creation ── */}
          {step === 4 && (
            <div className="p-8">
              {/* Ready badge */}
              <div className="flex items-center gap-2.5 mb-6 rounded-xl px-4 py-3"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.15)" }}>
                  <Check size={13} className="text-green-400" />
                </div>
                <p className="text-sm font-semibold text-green-400">Ton analyse est prête à être lancée !</p>
              </div>

              <h2 className="text-[22px] font-black text-white leading-tight mb-2" style={{ letterSpacing: "-0.025em" }}>
                Crée ton compte pour<br />voir ton score IA
              </h2>
              <p className="text-sm text-white/40 mb-7">Gratuit · Pas de CB · Résultats en 2 minutes</p>

              {error && (
                <div className="mb-5 rounded-xl px-4 py-3 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  {error}
                </div>
              )}

              <div className="space-y-3 mb-6">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="ton@email.fr"
                  className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Mot de passe (6 caractères min)"
                  minLength={6}
                  className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>

              {/* Recap */}
              <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2.5">Ce qu&apos;on va analyser</p>
                <div className="space-y-1.5 text-sm">
                  <p className="text-white/70">🏷 <span className="text-white font-semibold">{brandName}</span></p>
                  <p className="text-white/70">🏢 {industry}</p>
                  {competitors.filter(c => c.trim()).length > 0 && (
                    <p className="text-white/70">⚔️ {competitors.filter(c => c.trim()).join(" · ")}</p>
                  )}
                  <p className="text-white/70">🤖 ChatGPT · Gemini · Claude · Perplexity</p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !email.trim() || password.length < 6}
                className="w-full btn-primary rounded-xl py-4 font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading
                  ? <><span className="animate-pulse">Lancement de l&apos;analyse…</span></>
                  : <><span>Voir mon score gratuitement</span><ArrowRight size={15} /></>
                }
              </button>

              <p className="text-center text-xs text-white/22 mt-4">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Se connecter</Link>
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 5 && (
          <div className="flex items-center justify-between mt-5">
            <button onClick={goBack}
              className="flex items-center gap-1.5 text-sm transition-colors px-3 py-2"
              style={{ color: step === 1 ? "transparent" : "rgba(255,255,255,0.3)", pointerEvents: step === 1 ? "none" : "auto" }}>
              <ArrowLeft size={14} /> Retour
            </button>
            <button onClick={goNext} disabled={!canProceed()}
              className="btn-primary rounded-xl px-7 py-3 text-sm font-bold text-white flex items-center gap-2 disabled:opacity-35 transition-opacity">
              Continuer <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Social proof */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />)}
          </div>
          <p className="text-xs text-white/25">500+ marques analysées · 4.9/5</p>
        </div>
      </div>
    </div>
  );
}
