import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PlusCircle, TrendingUp, Zap, ArrowRight, BarChart3 } from "lucide-react";
import DeleteBrandButton from "@/components/DeleteBrandButton";

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const fill = score > 0 ? Math.max(circ * (score / 100), 5) : 0;
  const gap = circ - fill;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="7" />
      {fill > 0 && (
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${fill.toFixed(1)} ${gap.toFixed(1)}`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)" />
      )}
      <text x="40" y="45" textAnchor="middle"
        fontSize={score >= 100 ? "13" : "18"} fontWeight="800"
        fill={color} fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
        {score}
      </text>
    </svg>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: brands } = await supabase
    .from("brands")
    .select("*, reports(overall_score, created_at)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (!brands || brands.length === 0) {
    const steps = [
      { n: 1, label: "Compte créé", done: true },
      { n: 2, label: "Ajouter ta marque", done: false, active: true },
      { n: 3, label: "Lancer l'analyse", done: false },
      { n: 4, label: "Améliorer ton score", done: false },
    ];
    return (
      <div className="max-w-2xl mx-auto py-12">
        {/* Welcome */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.18)", color: "var(--accent)" }}>
            <span>🎉</span> Bienvenue sur ScoreIA
          </div>
          <h1 className="text-3xl font-black mb-3" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
            Première étape : ajoute ta marque
          </h1>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "var(--text-2)" }}>
            En 2 minutes, tu sauras exactement comment ChatGPT, Gemini, Claude et Perplexity parlent — ou ne parlent pas — de toi.
          </p>
        </div>

        {/* Progress steps */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.n} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all"
                    style={{
                      background: step.done ? "rgba(34,197,94,0.12)" : step.active ? "rgba(124,58,237,0.12)" : "var(--surface-2)",
                      border: `2px solid ${step.done ? "rgba(34,197,94,0.4)" : step.active ? "rgba(124,58,237,0.5)" : "var(--border)"}`,
                      color: step.done ? "#16a34a" : step.active ? "var(--accent)" : "var(--text-3)",
                    }}>
                    {step.done ? "✓" : step.n}
                  </div>
                  <p className="text-[10px] mt-1.5 font-medium text-center max-w-[70px]"
                    style={{ color: step.active ? "var(--text)" : step.done ? "#16a34a" : "var(--text-3)" }}>
                    {step.label}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px mx-2 mb-5" style={{ background: "var(--border)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What you'll get */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: "📊", title: "Score /100", desc: "Ta visibilité dans les IA" },
            { icon: "🔍", title: "Passages cités", desc: "Ce que les IA disent de toi" },
            { icon: "📝", title: "Plan de contenu", desc: "Quoi créer pour progresser" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl p-4 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-xs font-bold mb-0.5" style={{ color: "var(--text)" }}>{item.title}</p>
              <p className="text-[10px]" style={{ color: "var(--text-3)" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/dashboard/brands/new"
            className="btn-primary rounded-xl px-8 py-4 font-bold text-white text-sm inline-flex items-center gap-2">
            <PlusCircle size={15} /> Ajouter ma première marque
          </Link>
          <p className="text-xs mt-3" style={{ color: "var(--text-3)" }}>Ça prend 2 minutes · Gratuit</p>
        </div>
      </div>
    );
  }

  const analyzedBrands = brands.filter((b: { reports?: unknown[] }) => b.reports && (b.reports as unknown[]).length > 0);
  const avgScore = analyzedBrands.length > 0
    ? Math.round(analyzedBrands.reduce((sum: number, b: { reports?: Array<{ overall_score: number; created_at: string }> }) => {
        const latest = b.reports?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        return sum + (latest?.overall_score ?? 0);
      }, 0) / analyzedBrands.length)
    : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--accent)" }}>Dashboard</p>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
            Vos marques
          </h1>
          {avgScore !== null && (
            <p className="mt-2 text-sm flex items-center gap-2" style={{ color: "var(--text-2)" }}>
              <BarChart3 size={13} style={{ color: "var(--accent)" }} />
              Score moyen : <span className="font-semibold" style={{ color: "var(--text)" }}>{avgScore}/100</span>
            </p>
          )}
        </div>
        <Link href="/dashboard/brands/new"
          className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-white flex items-center gap-2 mt-1">
          <PlusCircle size={14} /> Nouvelle marque
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand: { id: string; name: string; industry: string; reports?: Array<{ overall_score: number; created_at: string }> }) => {
          const latestReport = brand.reports?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          const score = latestReport?.overall_score ?? null;

          const scoreColor = score === null ? "#7c3aed"
            : score >= 70 ? "#16a34a"
            : score >= 40 ? "#d97706"
            : "#dc2626";

          const scoreLabel = score === null ? null
            : score >= 70 ? "Bon"
            : score >= 40 ? "Moyen"
            : "Faible";

          const scoreBadgeBg = score === null ? "rgba(124,58,237,0.08)"
            : score >= 70 ? "rgba(22,163,74,0.09)"
            : score >= 40 ? "rgba(217,119,6,0.09)"
            : "rgba(220,38,38,0.09)";

          return (
            <Link key={brand.id} href={`/dashboard/brands/${brand.id}`}
              className="group brand-card block rounded-2xl p-5">

              {/* Top: gauge + details */}
              <div className="flex items-center gap-4">
                {score !== null ? (
                  <ScoreGauge score={score} color={scoreColor} />
                ) : (
                  <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ border: "2px dashed rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.04)" }}>
                    <Zap size={18} style={{ color: "var(--accent)" }} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Brand name + industry */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-white rounded-lg px-1.5 py-0.5 flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                      {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                    <h2 className="font-bold text-[14px] truncate" style={{ color: "var(--text)" }}>
                      {brand.name}
                    </h2>
                  </div>
                  <p className="text-xs mb-3 truncate" style={{ color: "var(--text-3)" }}>{brand.industry}</p>

                  {/* Score row */}
                  {score !== null ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black leading-none" style={{ color: scoreColor }}>{score}</span>
                      <span className="text-xs" style={{ color: "var(--text-3)" }}>/100</span>
                      {scoreLabel && (
                        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: scoreBadgeBg, color: scoreColor }}>
                          {scoreLabel}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Prêt à analyser</p>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>Lancez une analyse</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2">
                  <DeleteBrandButton brandId={brand.id} brandName={brand.name} />
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>
                    {latestReport
                      ? new Date(latestReport.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                      : "Pas encore analysé"}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ color: "var(--accent)" }}>
                  Voir <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          );
        })}

        {/* Add card */}
        <Link href="/dashboard/brands/new"
          className="group rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[150px] transition-all duration-200"
          style={{ border: "1.5px dashed var(--border)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{ background: "var(--surface-2)" }}>
            <PlusCircle size={18} style={{ color: "var(--text-3)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-3)" }}>Ajouter une marque</p>
        </Link>
      </div>
    </div>
  );
}
