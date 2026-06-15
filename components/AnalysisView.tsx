"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Zap, RotateCcw, MessageSquare, AlertTriangle,
  Lightbulb, Target, TrendingUp, Eye, ArrowRight, Flame, Star, Wand2, BookCheck, Pencil, Lock
} from "lucide-react";
import ContentGeneratorModal from "@/components/ContentGeneratorModal";

interface Brand { id: string; name: string; website?: string; industry: string; keywords: string[]; context?: string; competitors?: string[] }
interface Report { id: string; overall_score: number; openai_score: number; anthropic_score: number; gemini_score: number; perplexity_score: number; created_at: string }
interface Analysis { id: string; provider: string; question: string; excerpt: string | null; sentiment: string; is_mentioned: boolean; response: string }
interface PublishedArticle { id: string; article_title: string; platform: string; published_at: string }

const PROVIDER_LABELS: Record<string, string> = { openai: "ChatGPT", anthropic: "Claude", gemini: "Gemini", perplexity: "Perplexity" };
const PROVIDER_COLORS: Record<string, string> = { openai: "bg-green-500", anthropic: "bg-violet-500", gemini: "bg-blue-500", perplexity: "bg-cyan-500" };
const PROVIDER_TEXT: Record<string, string> = { openai: "text-green-400", anthropic: "text-violet-400", gemini: "text-blue-400", perplexity: "text-cyan-400" };

function ScoreCircle({ score, size = 80 }: { score: number; size?: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#eab308" : "#ef4444";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-extrabold text-white" style={{ fontSize: size * 0.22 }}>{pct}</span>
      </div>
    </div>
  );
}

type PlanItem = { title: string; why: string; impact: "high" | "medium"; effort: "low" | "medium"; question: string };

function articleFromQuestion(q: string, brand: Brand): Omit<PlanItem, "question"> {
  const ql = q.toLowerCase();
  if (ql.includes("meilleur") || ql.includes("top ") || ql.includes("leader") || ql.includes("numéro 1"))
    return { title: `${brand.name} dans le top des meilleures solutions en ${brand.industry}`, why: `Les requêtes "meilleur" ont le plus fort intent d'achat — les IA citent les marques qui s'y positionnent explicitement.`, impact: "high", effort: "low" };
  if (ql.includes("comment") || ql.includes("étape") || ql.includes("guide"))
    return { title: `${q.replace(/\?$/, "").trim()} : guide complet par ${brand.name}`, why: `Répondre mot pour mot à la question augmente directement vos chances d'être cité par l'IA.`, impact: "high", effort: "medium" };
  if (ql.includes("recommand") || ql.includes("conseil") || ql.includes("choisir") || ql.includes("sélection"))
    return { title: `Comment choisir en ${brand.industry} ? Les conseils de ${brand.name}`, why: `Les requêtes de recommandation convertissent le plus — être cité ici = clients directs.`, impact: "high", effort: "low" };
  if (ql.includes("prix") || ql.includes("tarif") || ql.includes("coût") || ql.includes("budget"))
    return { title: `Tarifs ${brand.industry} en 2025 : ce que propose ${brand.name}`, why: `Les pages tarifaires transparentes sont souvent sourcées par les IA pour répondre aux questions de budget.`, impact: "medium", effort: "low" };
  if (ql.includes("comparatif") || ql.includes(" vs ") || ql.includes("alternative") || ql.includes("différence"))
    return { title: `Comparatif ${brand.industry} : pourquoi ${brand.name} se démarque`, why: `Les comparatifs sont très cités par les IA — ils synthétisent exactement ce que les utilisateurs cherchent.`, impact: "high", effort: "medium" };
  if (ql.includes("avis") || ql.includes("témoignage") || ql.includes("retour") || ql.includes("expérience"))
    return { title: `Avis clients ${brand.name} : résultats réels en ${brand.industry}`, why: `La preuve sociale est un signal de confiance fort pour les IA qui recommandent des marques établies.`, impact: "medium", effort: "low" };
  if (ql.includes("erreur") || ql.includes("éviter") || ql.includes("piège") || ql.includes("problème"))
    return { title: `Les erreurs à éviter en ${brand.industry} — selon ${brand.name}`, why: `Le contenu "erreurs à éviter" est massivement repris par les IA car il répond à une vraie douleur client.`, impact: "medium", effort: "low" };
  if (ql.includes("avantage") || ql.includes("bénéfice") || ql.includes("pourquoi"))
    return { title: `Pourquoi choisir ${brand.name} ? ${q.replace(/\?$/, "").replace(/pourquoi /i, "")}`, why: `Répondre directement aux "pourquoi" positionne ${brand.name} comme la solution évidente pour les IA.`, impact: "high", effort: "low" };
  // Fallback : article qui répond directement à la question
  return { title: `${brand.name} répond : "${q.replace(/\?$/, "").trim()}"`, why: `Créer une page qui répond exactement à cette question est le moyen le plus direct d'être cité par l'IA.`, impact: "medium", effort: "low" };
}

function generateContentPlan(brand: Brand, gaps: Analysis[]): PlanItem[] {
  const uniqueQuestions = [...new Set(gaps.map((g) => g.question))];
  const q0 = uniqueQuestions[0] ?? "";
  const result: PlanItem[] = [];
  const usedTitles = new Set<string>();

  const add = (item: PlanItem) => {
    if (!usedTitles.has(item.title)) { result.push(item); usedTitles.add(item.title); }
  };

  // 1. One tailored article per gap question
  for (const q of uniqueQuestions) {
    const article = articleFromQuestion(q, brand);
    add({ ...article, question: q });
  }

  // 2. High-value universal templates (always useful regardless of gaps)
  const templates: PlanItem[] = [
    { title: `FAQ : les 20 questions les plus posées sur ${brand.industry}, répondues par ${brand.name}`, why: `Le format FAQ est le plus repris verbatim par les IA. Chaque question est une chance d'être cité.`, impact: "high", effort: "low", question: q0 },
    { title: `${brand.name} : la référence en ${brand.industry} — Guide complet 2025`, why: `Page pilier autoritaire. Les IA s'appuient dessus pour toutes les requêtes de leadership de votre secteur.`, impact: "high", effort: "medium", question: q0 },
    { title: `Comparatif ${brand.industry} : ${brand.name} vs les autres solutions du marché`, why: `Les IA adorent citer les comparatifs car ils répondent exactement à ce que cherche l'utilisateur.`, impact: "high", effort: "medium", question: q0 },
    { title: `Témoignages clients ${brand.name} : résultats concrets en ${brand.industry}`, why: `La preuve sociale est un signal de crédibilité majeur pour les IA qui recommandent des prestataires.`, impact: "medium", effort: "low", question: q0 },
    { title: `Les erreurs à éviter en ${brand.industry} (et comment ${brand.name} les évite)`, why: `Les articles "erreurs à éviter" sont massivement cités par les IA — fort impact immédiat.`, impact: "high", effort: "low", question: q0 },
    { title: `Prix et tarifs en ${brand.industry} : grille tarifaire transparente de ${brand.name}`, why: `Les IA sourcent les pages tarifaires pour répondre aux questions budget de vos prospects.`, impact: "medium", effort: "low", question: q0 },
    { title: `Pourquoi choisir ${brand.name} en ${brand.industry} ? 7 raisons concrètes`, why: `Répondre directement au "pourquoi vous ?" positionne la marque comme choix évident dans les réponses IA.`, impact: "high", effort: "low", question: q0 },
    { title: `${brand.name} en ${new Date().getFullYear()} : nouveautés, offres et actualités`, why: `Le contenu récent est privilégié par les IA pour les requêtes actuelles. Signal de marque active.`, impact: "medium", effort: "low", question: q0 },
    { title: `Comment fonctionne ${brand.name} ? Processus et méthode expliqués`, why: `Les questions "comment ça marche" sont très fréquentes — y répondre clairement augmente votre citation.`, impact: "medium", effort: "medium", question: q0 },
    { title: `${brand.name} répond aux questions les plus posées par les clients en ${brand.industry}`, why: `Format Q&A direct = le type de contenu le plus souvent repris mot pour mot par ChatGPT et Claude.`, impact: "high", effort: "low", question: q0 },
    { title: `Les critères pour choisir un bon prestataire en ${brand.industry} — guide ${brand.name}`, why: `Être l'auteur du guide de sélection positionne ${brand.name} comme expert de référence pour les IA.`, impact: "high", effort: "medium", question: q0 },
    { title: `Étude de cas : résultats obtenus avec ${brand.name} en ${brand.industry}`, why: `Les études de cas apportent des données concrètes que les IA valorisent pour justifier une recommandation.`, impact: "medium", effort: "medium", question: q0 },
  ];

  for (const t of templates) add(t);

  return result;
}

function checkCompetitorsMentioned(competitors: string[], allResponses: Analysis[]): { name: string; cited: boolean; count: number; total: number; providers: string[] }[] {
  return competitors.map((comp) => {
    const lower = comp.toLowerCase().trim();
    const matches = allResponses.filter((r) => r.response?.toLowerCase().includes(lower));
    const providers = [...new Set(matches.map((r) => r.provider))];
    return { name: comp.trim(), cited: matches.length > 0, count: matches.length, total: allResponses.length, providers };
  });
}

function MentionCard({ m }: { m: Analysis }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium text-white ${PROVIDER_COLORS[m.provider] ?? "bg-gray-500"}`}>
          {PROVIDER_LABELS[m.provider] ?? m.provider}
        </span>
        <span className="text-xs font-medium" style={{ color: m.sentiment === "positive" ? "#16a34a" : m.sentiment === "negative" ? "#dc2626" : "var(--text-3)" }}>
          {m.sentiment === "positive" ? "✓ Positif" : m.sentiment === "negative" ? "⚠ Négatif" : "Neutre"}
        </span>
      </div>
      <p className="text-xs mb-2 italic" style={{ color: "var(--text-3)" }}>&ldquo;{m.question}&rdquo;</p>
      {expanded ? (
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-2)" }}>{m.response}</p>
      ) : (
        m.excerpt && <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>&ldquo;...{m.excerpt}...&rdquo;</p>
      )}
      {m.response && (
        <button onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs transition-colors" style={{ color: "var(--accent)" }}>
          {expanded ? "▲ Réduire" : "▼ Voir la réponse complète"}
        </button>
      )}
    </div>
  );
}

function PaywallGate({ score, targetScore, previewItems }: {
  score: number; targetScore: number; previewItems: { title: string }[]
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(124,58,237,0.2)" }}>
      {/* Blurred preview */}
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}
        className="p-5 space-y-2">
        {previewItems.map((item, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.1)" }}>
            <div className="h-3 rounded-full mb-2" style={{ background: "var(--surface-2)", width: `${70 + i * 10}%` }} />
            <div className="h-2 rounded-full" style={{ background: "var(--surface-2)", width: "45%" }} />
          </div>
        ))}
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
        style={{ background: "linear-gradient(to bottom, rgba(245,246,250,0.4) 0%, rgba(245,246,250,0.97) 40%)" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <Lock size={20} style={{ color: "var(--accent)" }} />
        </div>
        <h3 className="text-base font-black mb-2" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
          Débloque ton plan de contenu
        </h3>
        <p className="text-sm mb-6 max-w-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
          Ton score est de <strong style={{ color: "var(--text)" }}>{score}/100</strong>. Voici exactement quoi créer pour atteindre <strong style={{ color: "var(--accent)" }}>{targetScore}/100</strong> — en 4 à 8 semaines.
        </p>
        <a href="/pricing"
          className="btn-primary rounded-xl px-6 py-3 font-bold text-white text-sm inline-flex items-center gap-2">
          Passer au Starter — 89€/mois <ArrowRight size={14} />
        </a>
        <p className="text-xs mt-3" style={{ color: "var(--text-3)" }}>
          Essai gratuit 14 jours · Annulable à tout moment
        </p>
      </div>
    </div>
  );
}

function ScoreChart({ reports }: { reports: Report[] }) {
  const sorted = [...reports].reverse();
  if (sorted.length < 2) return null;
  const W = 500, H = 140, P = { t: 12, r: 12, b: 28, l: 30 };
  const cW = W - P.l - P.r, cH = H - P.t - P.b;
  const xStep = cW / Math.max(sorted.length - 1, 1);
  const ys = (v: number) => P.t + cH - (v / 100) * cH;
  const lines = [
    { key: "overall_score", color: "rgba(0,0,0,0.35)", label: "Global", dash: "4,2" },
    { key: "openai_score", color: "#22c55e", label: "ChatGPT" },
    { key: "anthropic_score", color: "#a855f7", label: "Claude" },
    { key: "perplexity_score", color: "#06b6d4", label: "Perplexity" },
  ];
  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--text)" }}>
          <TrendingUp size={15} style={{ color: "var(--accent)" }} /> Évolution du score
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          {lines.map(l => (
            <div key={l.key} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ background: l.color }} />
              <span className="text-xs" style={{ color: "var(--text-3)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={P.l} y1={ys(v)} x2={W - P.r} y2={ys(v)} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            <text x={P.l - 5} y={ys(v) + 3.5} textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.25)">{v}</text>
          </g>
        ))}
        {lines.map(l => {
          const d = sorted.map((r, i) => {
            const x = P.l + i * xStep;
            const y = ys((r as unknown as Record<string, number>)[l.key] ?? 0);
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ");
          return <path key={l.key} d={d} fill="none" stroke={l.color} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" strokeDasharray={l.dash} />;
        })}
        {sorted.map((r, i) => (
          <text key={i} x={P.l + i * xStep} y={H - 5} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.3)">
            {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
          </text>
        ))}
      </svg>
    </div>
  );
}

const ANALYSIS_PROVIDERS = [
  { key: "openai", label: "ChatGPT", color: "#10a37f", delay: 0 },
  { key: "anthropic", label: "Claude", color: "#d97757", delay: 8 },
  { key: "gemini", label: "Gemini", color: "#4285f4", delay: 14 },
  { key: "perplexity", label: "Perplexity", color: "#20b2aa", delay: 20 },
];

function AnalysisLoader() {
  const [progress, setProgress] = useState(0);
  const [providerStatus, setProviderStatus] = useState<Record<string, "waiting" | "loading" | "done">>({
    openai: "waiting", anthropic: "waiting", gemini: "waiting", perplexity: "waiting",
  });
  const startTime = useRef(Date.now());

  useEffect(() => {
    const DURATION = 45000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const raw = Math.min(92, (elapsed / DURATION) * 100);
      setProgress(Math.round(raw));

      setProviderStatus({
        openai: elapsed > 0 ? (elapsed > 14000 ? "done" : "loading") : "waiting",
        anthropic: elapsed > 8000 ? (elapsed > 22000 ? "done" : "loading") : "waiting",
        gemini: elapsed > 14000 ? (elapsed > 28000 ? "done" : "loading") : "waiting",
        perplexity: elapsed > 20000 ? (elapsed > 40000 ? "done" : "loading") : "waiting",
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const statusIcon = (s: "waiting" | "loading" | "done") => {
    if (s === "done") return <span style={{ color: "#4ade80" }}>✓</span>;
    if (s === "loading") return <span className="inline-block w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "currentColor", borderTopColor: "transparent" }} />;
    return <span style={{ color: "var(--text-3)" }}>○</span>;
  };

  const messages = [
    "Génération des questions personnalisées…",
    "Interrogation des IA en cours…",
    "Analyse des réponses…",
    "Calcul du score de visibilité…",
  ];
  const msgIndex = Math.floor((progress / 92) * (messages.length - 1));

  return (
    <div className="rounded-2xl p-8 mb-6 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      {/* Cercle animé */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="5" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="url(#grad)" strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 213.6} 213.6`}
            style={{ transition: "stroke-dasharray 0.3s ease" }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#20b2aa" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black" style={{ color: "var(--text)" }}>{progress}%</span>
        </div>
      </div>

      {/* Message dynamique */}
      <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>{messages[msgIndex]}</p>
      <p className="text-xs mb-6" style={{ color: "var(--text-3)" }}>~45 secondes · Ne ferme pas cette page</p>

      {/* Statuts par provider */}
      <div className="flex items-center justify-center gap-6">
        {ANALYSIS_PROVIDERS.map((p) => (
          <div key={p.key} className="flex flex-col items-center gap-1.5">
            <div className="text-sm" style={{ color: providerStatus[p.key] === "done" ? "#4ade80" : providerStatus[p.key] === "loading" ? p.color : "var(--text-3)" }}>
              {statusIcon(providerStatus[p.key])}
            </div>
            <span className="text-xs font-medium" style={{ color: providerStatus[p.key] === "waiting" ? "var(--text-3)" : "var(--text-2)" }}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type Tab = "overview" | "content" | "analysis" | "progress";

export default function AnalysisView({ brand, reports, mentions, gaps, initialPublishedArticles, userCreatedAt }: {
  brand: Brand; reports: Report[]; mentions: Analysis[]; gaps: Analysis[]; initialPublishedArticles: PublishedArticle[]; userCreatedAt?: string;
}) {
  const router = useRouter();
  const TRIAL_DAYS = 14;
  const isPro = userCreatedAt
    ? (Date.now() - new Date(userCreatedAt).getTime()) < TRIAL_DAYS * 24 * 60 * 60 * 1000
    : false;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeGenerator, setActiveGenerator] = useState<{ title: string; question: string } | null>(null);
  const [publishedArticles, setPublishedArticles] = useState<PublishedArticle[]>(initialPublishedArticles);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const latest = reports[0] ?? null;

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: brand.id }),
      });
      if (!res.ok) throw new Error("Analyse échouée");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const contentPlan = latest ? generateContentPlan(brand, gaps) : [];
  const totalQuestions = mentions.length + gaps.length;
  const mentionRate = latest ? Math.round((mentions.length / Math.max(totalQuestions, 1)) * 100) : 0;
  const positiveCount = mentions.filter((m) => m.sentiment === "positive").length;
  const topGapQuestions = [...new Set(gaps.map((g) => g.question))].slice(0, 4);

  // Delta-based prediction: score actuel comme base, on ajoute uniquement le gain des nouvelles mentions
  const currentMentionPts = totalQuestions > 0 ? Math.round((mentions.length / totalQuestions) * 70) : 0;

  const calcScore = (extraMentions: number) => {
    if (!latest || extraMentions === 0) return latest?.overall_score ?? 0;
    const newMentioned = Math.min(mentions.length + extraMentions, totalQuestions);
    const newMentionPts = Math.round((newMentioned / Math.max(totalQuestions, 1)) * 70);
    const delta = newMentionPts - currentMentionPts;
    return Math.min(100, latest.overall_score + delta);
  };

  // Only count articles that are visible in the current plan (ignore stale DB entries)
  const planTitles = new Set(contentPlan.map((item) => item.title));
  const relevantPublishedCount = publishedArticles.filter((a) => planTitles.has(a.article_title)).length;
  const predictedScore = latest ? calcScore(relevantPublishedCount) : 0;

  // Articles needed for +25 pts, capped at plan size
  const targetScore = latest ? Math.min(100, latest.overall_score + 25) : 0;
  const neededMentionPts = currentMentionPts + 25;
  const neededMentions = Math.ceil((neededMentionPts / 70) * Math.max(totalQuestions, 1));
  const rawArticlesNeeded = Math.max(0, neededMentions - mentions.length);
  const articlesNeededForTarget = Math.min(rawArticlesNeeded, contentPlan.length);
  const maxAchievableScore = latest ? calcScore(contentPlan.length) : 0;
  const canReachTarget = maxAchievableScore >= targetScore;

  const publishedTitles = new Set(publishedArticles.map((a) => a.article_title));

  const togglePublished = async (title: string) => {
    if (publishedTitles.has(title)) {
      await fetch("/api/publish-article", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: brand.id, articleTitle: title }),
      });
      setPublishedArticles(prev => prev.filter((a) => a.article_title !== title));
    } else {
      await fetch("/api/publish-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: brand.id, articleTitle: title, platform: "manuel" }),
      });
      setPublishedArticles(prev => [...prev, {
        id: Date.now().toString(),
        article_title: title,
        platform: "manuel",
        published_at: new Date().toISOString(),
      }]);
    }
  };

  const allAnalyses = [...mentions, ...gaps];
  const competitorResults = (brand.competitors?.length ?? 0) > 0 && allAnalyses.length > 0
    ? checkCompetitorsMentioned(brand.competitors!, allAnalyses)
    : [];

  // Split mentions: generic (no brand name in question) vs awareness (brand name in question)
  const brandLower = brand.name.toLowerCase();
  const genericMentions = mentions.filter((m) => !m.question.toLowerCase().includes(brandLower));
  const awarenessMentions = mentions.filter((m) => m.question.toLowerCase().includes(brandLower));

  return (
    <div>
      {activeGenerator && (
        <ContentGeneratorModal
          brandId={brand.id}
          brandName={brand.name}
          industry={brand.industry}
          keywords={brand.keywords ?? []}
          context={brand.context ?? ""}
          articleTitle={activeGenerator.title}
          gapQuestion={activeGenerator.question}
          onClose={() => setActiveGenerator(null)}
          onPublished={() => setPublishedArticles(prev => [...prev, {
            id: Date.now().toString(),
            article_title: activeGenerator.title,
            platform: "wordpress",
            published_at: new Date().toISOString(),
          }])}
        />
      )}
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{brand.name}</h1>
            {brand.website && (
              <a href={brand.website} target="_blank" rel="noopener noreferrer"
                className="text-xs px-2 py-0.5 rounded-md transition-colors"
                style={{ color: "var(--accent-light)", background: "rgba(124,58,237,0.1)" }}>
                {brand.website.replace(/^https?:\/\//, "")} ↗
              </a>
            )}
          </div>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>{brand.industry}</p>
          {brand.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {brand.keywords.map((k) => (
                <span key={k} className="text-xs rounded-md px-2 py-0.5" style={{ background: "var(--surface-2)", color: "var(--text-3)", border: "1px solid var(--border)" }}>{k}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href={`/dashboard/brands/${brand.id}/edit`}
            className="rounded-xl px-3 py-2.5 text-sm font-medium flex items-center gap-1.5 transition-colors"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
            <Pencil size={13} /> Modifier
          </a>
          {latest && (
            <button onClick={() => window.print()}
              className="rounded-xl px-3 py-2.5 text-sm font-medium flex items-center gap-1.5 transition-colors"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}
              title="Exporter en PDF">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              PDF
            </button>
          )}
          <button onClick={runAnalysis} disabled={loading}
            className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-50">
            {loading ? <><RotateCcw size={13} className="animate-spin" />En cours...</>
              : <><Zap size={13} />{latest ? "Relancer" : "Lancer l'analyse"}</>}
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-4 rounded-xl px-4 py-2.5" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</p>}

      {loading && <AnalysisLoader />}

      {!latest && !loading && (
        <div className="rounded-2xl p-12 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <TrendingUp size={28} style={{ color: "var(--accent)" }} className="mx-auto mb-3" />
          <p className="text-sm mb-1 font-medium">Aucune analyse pour le moment</p>
          <p className="text-xs" style={{ color: "var(--text-2)" }}>Lancez votre première analyse pour voir votre score de visibilité IA.</p>
        </div>
      )}

      {latest && (
        <>
          {/* Score hero */}
          <div className="rounded-2xl p-6 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {/* Score global */}
              <div>
                <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: "var(--text-3)" }}>Score global</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black" style={{ color: latest.overall_score >= 70 ? "#22c55e" : latest.overall_score >= 40 ? "#eab308" : "#ef4444" }}>
                    {latest.overall_score}
                  </span>
                  <span className="text-lg mb-1" style={{ color: "var(--text-3)" }}>/100</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${latest.overall_score}%`, background: latest.overall_score >= 70 ? "#22c55e" : latest.overall_score >= 40 ? "#eab308" : "#ef4444" }} />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-3)" }}>{new Date(latest.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
              </div>
              {/* Provider scores */}
              {[
                { label: "ChatGPT", score: latest.openai_score, color: "#10a37f" },
                { label: "Claude", score: latest.anthropic_score, color: "#d97757" },
                { label: "Perplexity", score: latest.perplexity_score ?? 0, color: "#20b2aa" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: "var(--text-3)" }}>{item.label}</p>
                  <div className="flex items-end gap-1.5 mb-2">
                    <span className="text-3xl font-extrabold" style={{ color: item.color }}>{item.score}</span>
                    <span className="text-sm mb-0.5" style={{ color: "var(--text-3)" }}>/100</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.score}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Timeline */}
            <div className="mt-5 pt-4 flex items-center gap-2 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text-3)" }}>
              <span>ℹ</span>
              <span>Résultats dans les IA sous <span style={{ color: "var(--text-2)" }}>2 semaines à 2 mois</span> selon la plateforme — Perplexity est la plus rapide.</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            {([
              { id: "overview", label: "Vue d'ensemble", icon: Eye, locked: false },
              { id: "analysis", label: "Analyse IA", icon: MessageSquare, locked: false },
              { id: "content", label: "Plan de contenu", icon: Lightbulb, locked: !isPro },
              { id: "progress", label: "Progression", icon: TrendingUp, locked: !isPro },
            ] as { id: Tab; label: string; icon: React.ElementType; locked: boolean }[]).map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeTab === tab.id ? "var(--surface)" : "transparent",
                  color: activeTab === tab.id ? "var(--text)" : "var(--text-3)",
                  border: activeTab === tab.id ? "1px solid var(--border-strong)" : "1px solid transparent",
                  fontWeight: activeTab === tab.id ? 600 : 400,
                }}>
                {tab.locked ? <Lock size={11} style={{ color: "var(--accent)" }} /> : <tab.icon size={12} />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab: Vue d'ensemble */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Taux de mention", value: `${mentionRate}%`, icon: Eye, color: "var(--accent)" },
                  { label: "Mentions positives", value: positiveCount, icon: Star, color: "#facc15" },
                  { label: "Questions analysées", value: mentions.length + gaps.length, icon: MessageSquare, color: "#60a5fa" },
                  { label: "Questions manquées", value: gaps.length, icon: AlertTriangle, color: "#f87171" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <s.icon size={14} style={{ color: s.color }} className="mb-2.5" />
                    <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Mentions génériques */}
              <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: `1px solid ${genericMentions.length > 0 ? "var(--border)" : "rgba(239,68,68,0.15)"}` }}>
                <h2 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <MessageSquare size={14} style={{ color: genericMentions.length > 0 ? "#4ade80" : "#f87171" }} />
                  Citations sur requêtes génériques
                </h2>
                <p className="text-xs mb-4" style={{ color: "var(--text-2)" }}>
                  Quand un client demande à l&apos;IA la meilleure solution sans citer votre nom — est-ce que vous apparaissez ?
                </p>
                {genericMentions.length > 0 ? (
                  <div className="space-y-3">
                    {genericMentions.map((m) => <MentionCard key={m.id} m={m} />)}
                  </div>
                ) : (
                  <div className="rounded-xl px-4 py-5 text-center" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" }}>
                    <p className="text-sm font-medium mb-1" style={{ color: "#f87171" }}>Vous n&apos;êtes pas cité sur des requêtes génériques</p>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      Les IA ne vous recommandent pas encore spontanément. C&apos;est exactement ce que le plan de contenu ci-dessous va corriger.
                    </p>
                  </div>
                )}
              </div>

              {/* Mentions notoriété */}
              {awarenessMentions.length > 0 && (
                <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h2 className="font-semibold text-sm mb-1 flex items-center gap-2">
                    <Eye size={14} className="text-blue-400" />
                    Comment l&apos;IA vous décrit
                  </h2>
                  <p className="text-xs mb-4" style={{ color: "var(--text-2)" }}>Ce que ChatGPT, Claude et Perplexity savent de vous quand on leur parle directement de votre marque.</p>
                  <div className="space-y-3">
                    {awarenessMentions.map((m) => <MentionCard key={m.id} m={m} />)}
                  </div>
                </div>
              )}

              {/* Gap questions */}
              {topGapQuestions.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(239,68,68,0.18)" }}>
                  <div className="px-5 py-4 flex items-center gap-3" style={{ background: "rgba(239,68,68,0.06)", borderBottom: "1px solid rgba(239,68,68,0.12)" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(239,68,68,0.12)" }}>
                      <AlertTriangle size={13} className="text-red-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm" style={{ color: "var(--text)" }}>Questions où vous êtes invisible</h2>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>Les IA ne vous citent pas sur ces requêtes</p>
                    </div>
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>
                      {topGapQuestions.length} questions
                    </span>
                  </div>
                  <div style={{ background: "var(--surface)" }}>
                    {topGapQuestions.map((q, i) => (
                      <div key={i} className="flex items-start gap-3 px-5 py-3.5" style={{ borderBottom: i < topGapQuestions.length - 1 ? "1px solid var(--border)" : "none" }}>
                        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>{i + 1}</span>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>&ldquo;{q}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concurrents */}
              {competitorResults.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(251,146,60,0.18)" }}>
                  <div className="px-5 py-4 flex items-center gap-3" style={{ background: "rgba(251,146,60,0.06)", borderBottom: "1px solid rgba(251,146,60,0.12)" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(251,146,60,0.12)" }}>
                      <Target size={13} className="text-orange-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm" style={{ color: "var(--text)" }}>Veille concurrentielle</h2>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>Vos concurrents sont-ils cités à votre place ?</p>
                    </div>
                  </div>
                  <div style={{ background: "var(--surface)" }}>
                    {competitorResults.map((c, i) => {
                      const pct = c.total > 0 ? Math.round((c.count / c.total) * 100) : 0;
                      const providerLabels: Record<string, string> = { openai: "ChatGPT", anthropic: "Claude", perplexity: "Perplexity", gemini: "Gemini" };
                      return (
                        <div key={c.name} className="px-5 py-4"
                          style={{ borderBottom: i < competitorResults.length - 1 ? "1px solid var(--border)" : "none" }}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black"
                              style={{ background: c.cited ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", color: c.cited ? "#f87171" : "#4ade80" }}>
                              {c.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold flex-1" style={{ color: "var(--text)" }}>{c.name}</span>
                            {c.cited ? (
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                                style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}>
                                <Flame size={10} /> {c.count} fois · {pct}%
                              </span>
                            ) : (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: "rgba(34,197,94,0.08)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.15)" }}>
                                Non cité ✓
                              </span>
                            )}
                          </div>
                          {c.cited && (
                            <div className="flex items-center gap-2 pl-11">
                              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #f87171, #fb923c)" }} />
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                {c.providers.map((p) => (
                                  <span key={p} className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                    style={{ background: "var(--surface-2)", color: "var(--text-3)", border: "1px solid var(--border)" }}>
                                    {providerLabels[p] ?? p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Score prédit + courbe */}
              <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid rgba(32,178,170,0.2)" }}>
                <h2 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <TrendingUp size={14} className="text-cyan-400" />
                  Progression &amp; prédiction
                </h2>
                <p className="text-xs mb-5" style={{ color: "var(--text-2)" }}>
                  Cochez les articles publiés ci-dessous pour voir votre score prédit évoluer.
                </p>
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-center">
                    <p className="text-3xl font-black" style={{ color: latest.overall_score >= 70 ? "#22c55e" : latest.overall_score >= 40 ? "#eab308" : "#ef4444" }}>{latest.overall_score}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Score actuel</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-3)" }}>
                      <span>Actuel</span>
                      <span>Prédit avec articles publiés</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${predictedScore}%`, background: "linear-gradient(90deg, #7c3aed, #20b2aa)" }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black" style={{ color: predictedScore >= 70 ? "#22c55e" : predictedScore >= 40 ? "#eab308" : "#ef4444" }}>{predictedScore}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Score prédit</p>
                  </div>
                </div>
                <ScoreChart reports={reports} />
              </div>

              {/* Plan de contenu — paywall teaser */}
              {contentPlan.length > 0 && (
                isPro ? (
                  <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid rgba(124,58,237,0.25)" }}>
                    <h2 className="font-semibold text-sm flex items-center gap-2 mb-4">
                      <Lightbulb size={14} className="text-violet-400" />
                      Plan de contenu — objectif +25 points
                    </h2>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>Accède à l&apos;onglet "Plan de contenu" pour voir tous les articles.</p>
                  </div>
                ) : (
                  <PaywallGate score={latest.overall_score} targetScore={targetScore} previewItems={contentPlan.slice(0, 4)} />
                )
              )}
            </div>
          )}

          {/* Tab: Plan de contenu */}
          {activeTab === "content" && !isPro && (
            <PaywallGate score={latest.overall_score} targetScore={targetScore} previewItems={contentPlan.slice(0, 6)} />
          )}
          {activeTab === "content" && isPro && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-sm mb-0.5 flex items-center gap-2">
                    <Lightbulb size={14} className="text-violet-400" />
                    Plan de contenu — objectif +25 points
                  </h2>
                  {predictedScore >= targetScore ? (
                    <p className="text-xs font-medium" style={{ color: "#4ade80" }}>
                      Objectif +25 points atteint ! Score prédit : {predictedScore}/100.
                    </p>
                  ) : (
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>
                      Score prédit actuel : <span className="font-semibold" style={{ color: "var(--text)" }}>{predictedScore}/100</span>. Cochez {Math.max(0, articlesNeededForTarget - publishedArticles.length)} articles de plus pour atteindre {targetScore}.
                    </p>
                  )}
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    background: predictedScore >= targetScore ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.15)",
                    color: predictedScore >= targetScore ? "#4ade80" : "var(--accent)",
                    border: `1px solid ${predictedScore >= targetScore ? "rgba(34,197,94,0.3)" : "rgba(124,58,237,0.3)"}`,
                  }}>
                  {publishedArticles.length}/{contentPlan.length} publiés
                </span>
              </div>
              {contentPlan.map((item, i) => {
                const isPublished = publishedTitles.has(item.title);
                const isInTarget = i < articlesNeededForTarget;
                return (
                  <div key={i} className="rounded-xl p-4 transition-all"
                    style={{
                      background: isPublished ? "rgba(34,197,94,0.04)" : isInTarget ? "rgba(124,58,237,0.05)" : "var(--surface-2)",
                      border: `1px solid ${isPublished ? "rgba(34,197,94,0.2)" : isInTarget ? "rgba(124,58,237,0.2)" : "var(--border)"}`,
                    }}>
                    <div className="flex items-start gap-3">
                      <button onClick={() => togglePublished(item.title)}
                        className="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                        style={{ background: isPublished ? "#22c55e" : "transparent", borderColor: isPublished ? "#22c55e" : isInTarget ? "rgba(124,58,237,0.6)" : "var(--border-strong)" }}>
                        {isPublished && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <p className="font-medium text-sm leading-snug" style={{ color: isPublished ? "var(--text-2)" : "var(--text)", textDecoration: isPublished ? "line-through" : "none" }}>
                            {isInTarget && !isPublished && (
                              <span className="text-[10px] font-bold mr-1.5 px-1.5 py-0.5 rounded align-middle"
                                style={{ background: "rgba(124,58,237,0.15)", color: "var(--accent)" }}>#{i + 1}</span>
                            )}
                            {item.title}
                          </p>
                          <div className="flex gap-1.5 shrink-0">
                            {isPublished ? (
                              <span className="text-xs rounded-full px-2 py-0.5 font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>Publié ✓</span>
                            ) : (
                              <>
                                <span className="text-xs rounded-full px-2 py-0.5 font-medium" style={{ background: item.impact === "high" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)", color: item.impact === "high" ? "#4ade80" : "#facc15" }}>
                                  {item.impact === "high" ? "Fort impact" : "Impact moyen"}
                                </span>
                                <span className="text-xs rounded-full px-2 py-0.5 font-medium" style={{ background: "var(--surface-2)", color: "var(--text-3)" }}>
                                  {item.effort === "low" ? "Rapide" : "Moyen"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {!isPublished && (
                          <>
                            <p className="text-xs mb-3" style={{ color: "var(--text-2)" }}>{item.why}</p>
                            <button
                              onClick={() => setActiveGenerator({ title: item.title, question: item.question || topGapQuestions[0] || `Quelles sont les meilleures solutions en ${brand.industry} ?` })}
                              className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all"
                              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", color: "var(--accent)" }}>
                              <Wand2 size={11} /> Générer l&apos;article →
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab: Analyse IA */}
          {activeTab === "analysis" && (
            <div className="space-y-4">
              {/* Mentions génériques */}
              <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: `1px solid ${genericMentions.length > 0 ? "var(--border)" : "rgba(239,68,68,0.15)"}` }}>
                <h2 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <MessageSquare size={14} style={{ color: genericMentions.length > 0 ? "#4ade80" : "#f87171" }} />
                  Citations sur requêtes génériques <span className="text-xs font-normal ml-1" style={{ color: "var(--text-3)" }}>({genericMentions.length}/{(mentions.length + gaps.length) - awarenessMentions.length - gaps.filter(g => g.question.toLowerCase().includes(brandLower)).length})</span>
                </h2>
                <p className="text-xs mb-4" style={{ color: "var(--text-2)" }}>Requêtes sans mention de votre marque — ce que vos vrais clients tapent dans l&apos;IA.</p>
                {genericMentions.length > 0 ? (
                  <div className="space-y-3">{genericMentions.map((m) => <MentionCard key={m.id} m={m} />)}</div>
                ) : (
                  <div className="rounded-xl px-4 py-5 text-center" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" }}>
                    <p className="text-sm font-medium mb-1" style={{ color: "#f87171" }}>Pas encore cité spontanément</p>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>Publiez les articles du plan de contenu pour changer ça.</p>
                  </div>
                )}
              </div>

              {/* Mentions notoriété */}
              {awarenessMentions.length > 0 && (
                <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h2 className="font-semibold text-sm mb-1 flex items-center gap-2">
                    <Eye size={14} className="text-blue-400" />
                    Comment l&apos;IA vous décrit (notoriété)
                  </h2>
                  <p className="text-xs mb-4" style={{ color: "var(--text-2)" }}>Réponses quand on demande directement à l&apos;IA ce qu&apos;elle sait de vous.</p>
                  <div className="space-y-3">{awarenessMentions.map((m) => <MentionCard key={m.id} m={m} />)}</div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Progression */}
          {activeTab === "progress" && !isPro && (
            <PaywallGate score={latest.overall_score} targetScore={targetScore} previewItems={contentPlan.slice(0, 4)} />
          )}
          {activeTab === "progress" && isPro && (
            <div className="space-y-4">
              {/* Prédiction */}
              <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid rgba(32,178,170,0.2)" }}>
                <h2 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <BookCheck size={14} className="text-cyan-400" />
                  Score prédit
                </h2>
                <p className="text-xs mb-5" style={{ color: "var(--text-2)" }}>Cochez les articles publiés dans l&apos;onglet &ldquo;Plan de contenu&rdquo; pour voir votre score évoluer.</p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-black" style={{ color: latest.overall_score >= 70 ? "#22c55e" : latest.overall_score >= 40 ? "#eab308" : "#ef4444" }}>{latest.overall_score}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Actuel</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${predictedScore}%`, background: "linear-gradient(90deg, #7c3aed, #20b2aa)" }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs" style={{ color: "var(--text-3)" }}>0</span>
                      <span className="text-xs" style={{ color: "var(--text-3)" }}>100</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black" style={{ color: predictedScore >= 70 ? "#22c55e" : predictedScore >= 40 ? "#eab308" : "#ef4444" }}>{predictedScore}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Prédit</p>
                  </div>
                </div>
                {publishedArticles.length > 0 && (
                  <div className="mt-4 space-y-1.5 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                    {publishedArticles.map((a) => (
                      <div key={a.id} className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background: "rgba(34,197,94,0.05)" }}>
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                          <div className="w-1 h-1 rounded-full bg-green-400" />
                        </div>
                        <p className="text-xs flex-1 truncate" style={{ color: "var(--text-2)" }}>{a.article_title}</p>
                        <span className="text-xs shrink-0" style={{ color: "var(--text-3)" }}>
                          {new Date(a.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Graphe */}
              <ScoreChart reports={reports} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
