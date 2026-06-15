import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog GEO — ScoreIA",
  description: "Conseils et stratégies pour améliorer ta visibilité dans les IA génératives : ChatGPT, Gemini, Claude, Perplexity.",
};

const ARTICLES = [
  {
    slug: "geo-generative-engine-optimization",
    title: "Qu'est-ce que le GEO ? Le nouveau SEO à maîtriser en 2025",
    excerpt: "Le Generative Engine Optimization (GEO) est la discipline qui consiste à optimiser ta présence dans les réponses des IA génératives. Voici pourquoi c'est urgent et comment commencer.",
    date: "10 juin 2025",
    readTime: "5 min",
    tag: "Fondamentaux",
    tagColor: "#7c3aed",
  },
  {
    slug: "comment-chatgpt-choisit-les-marques",
    title: "Comment ChatGPT choisit les marques qu'il cite (et comment en faire partie)",
    excerpt: "ChatGPT ne cite pas les marques au hasard. Il existe des signaux précis qui augmentent drastiquement tes chances d'apparaître. Analyse des mécanismes et stratégies concrètes.",
    date: "5 juin 2025",
    readTime: "7 min",
    tag: "Stratégie",
    tagColor: "#2563eb",
  },
  {
    slug: "5-strategies-visibilite-ia",
    title: "5 stratégies pour apparaître dans les réponses IA dès aujourd'hui",
    excerpt: "Des actions concrètes, testées et mesurées pour améliorer ton score GEO rapidement. De la FAQ structurée aux études de cas, voici ce qui fonctionne vraiment.",
    date: "1 juin 2025",
    readTime: "6 min",
    tag: "Pratique",
    tagColor: "#059669",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: "#07070d", color: "#f1f5f9" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(124,58,237,0.08), transparent 60%)" }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
          <span className="font-black text-sm text-white">ScoreIA</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm transition-colors" style={{ color: "rgba(255,255,255,0.35)" }}>
          <ArrowLeft size={13} /> Accueil
        </Link>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-4"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
            Blog
          </div>
          <h1 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: "-0.03em" }}>
            GEO : maîtriser sa visibilité IA
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)" }}>
            Stratégies, analyses et guides pratiques pour apparaître dans ChatGPT, Gemini, Claude et Perplexity.
          </p>
        </div>

        {/* Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ARTICLES.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`}
              className="group rounded-2xl p-6 flex flex-col transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={undefined}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold rounded-full px-2.5 py-1"
                  style={{ background: `${a.tagColor}18`, color: a.tagColor, border: `1px solid ${a.tagColor}30` }}>
                  {a.tag}
                </span>
                <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  <Clock size={10} /> {a.readTime}
                </span>
              </div>
              <h2 className="font-bold text-base text-white leading-snug mb-3 flex-1" style={{ letterSpacing: "-0.01em" }}>
                {a.title}
              </h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {a.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{a.date}</span>
                <span className="flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: "#a78bfa" }}>
                  Lire <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
          <h3 className="text-xl font-black text-white mb-2">Mesure ta visibilité IA maintenant</h3>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Score gratuit · Pas de CB · 2 minutes</p>
          <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white text-sm">
            Obtenir mon score <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
