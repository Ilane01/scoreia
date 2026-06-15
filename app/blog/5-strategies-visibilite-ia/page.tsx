import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "5 stratégies pour apparaître dans les réponses IA dès aujourd'hui — ScoreIA",
  description: "Des actions concrètes et testées pour améliorer ton score GEO rapidement : FAQ structurée, études de cas, comparatifs, autorité thématique.",
};

export default function Article5Strategies() {
  return (
    <div className="min-h-screen" style={{ background: "#07070d", color: "#f1f5f9" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 25% at 50% 0%, rgba(124,58,237,0.07), transparent 55%)" }} />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-10 transition-colors" style={{ color: "rgba(255,255,255,0.35)" }}>
          <ArrowLeft size={13} /> Blog
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] font-bold rounded-full px-2.5 py-1" style={{ background: "rgba(5,150,105,0.15)", color: "#34d399", border: "1px solid rgba(5,150,105,0.25)" }}>Pratique</span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}><Clock size={10} /> 6 min</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>1 juin 2025</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-6 leading-tight" style={{ letterSpacing: "-0.025em" }}>
          5 stratégies pour apparaître dans les réponses IA dès aujourd&apos;hui
        </h1>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          <p>
            Tu sais maintenant pourquoi le GEO est crucial. Voici comment passer à l&apos;action concrètement.
            Ces 5 stratégies sont issues de nos analyses sur 500+ marques — classées par impact/effort.
          </p>

          {[
            {
              n: "01",
              title: "La FAQ exhaustive (impact élevé · effort faible)",
              tag: "⚡ Priorité #1",
              tagColor: "#a78bfa",
              content: `Le format FAQ est le type de contenu le plus cité verbatim par les IA. Pourquoi ? Parce que quand ChatGPT reçoit une question, il cherche la réponse directe la plus précise. Une FAQ qui correspond mot pour mot à une question d'utilisateur = citation quasi garantie.`,
              actions: [
                "Liste les 20 questions que tes clients posent le plus souvent (SAV, commerciaux, réseaux sociaux)",
                "Crée une page FAQ dédiée avec une question par section H2",
                "Réponds de manière directe en commençant par la réponse, pas par du contexte",
                "Inclus des données chiffrées, dates et sources — les IA adorent les faits vérifiables",
              ],
            },
            {
              n: "02",
              title: "Les études de cas chiffrées (impact élevé · effort moyen)",
              tag: "💪 Fort impact",
              tagColor: "#22c55e",
              content: `Les IA recommandent des marques qui ont des preuves. Une étude de cas avec des résultats concrets ("+40% de leads en 3 mois", "coût réduit de 30%") est extrêmement bien citée dans les recommandations IA car elle apporte la preuve sociale que les utilisateurs cherchent.`,
              actions: [
                "Documente 3 à 5 succès clients avec des métriques précises",
                "Structure chaque case study : problème → solution → résultats chiffrés",
                "Inclus des verbatims clients (citations directes)",
                "Publie-les sur ton site ET sur des plateformes tierces (G2, Clutch, Trustpilot)",
              ],
            },
            {
              n: "03",
              title: "Les articles comparatifs (impact élevé · effort moyen)",
              tag: "🎯 Très ciblé",
              tagColor: "#3b82f6",
              content: `Quand un utilisateur demande à ChatGPT de comparer des solutions, l'IA se base souvent sur des comparatifs existants. Être l'auteur d'un comparatif te positionne comme expert ET augmente tes chances d'être cité dans ces réponses.`,
              actions: [
                'Crée un article "[Ta marque] vs [Concurrent principal] : comparatif honnête"',
                "Compare objectivement — les IA détectent et pénalisent le contenu trop promotionnel",
                "Inclus un tableau de comparaison structuré (les IA les adorent)",
                "Mets à jour ce comparatif tous les 6 mois",
              ],
            },
            {
              n: "04",
              title: "La page de définition sectorielle (impact moyen · effort faible)",
              tag: "🧱 Fondation",
              tagColor: "#f59e0b",
              content: `Pour chaque terme clé de ton secteur, crée une page qui le définit exhaustivement. Ces "pages de définition" sont massivement utilisées par les IA pour répondre aux questions éducatives. En étant l'auteur de ces définitions, tu construis ton autorité thématique.`,
              actions: [
                "Identifie les 5-10 termes techniques de ton secteur",
                'Crée une page par terme : "Qu\'est-ce que [terme] ?"',
                "Inclus des exemples, des cas d'usage, des données sectorielles",
                "Établis des liens entre ces pages (maillage interne dense)",
              ],
            },
            {
              n: "05",
              title: "La page tarifaire transparente (impact moyen · effort faible)",
              tag: "💰 Quick win",
              tagColor: "#06b6d4",
              content: `Les IA sont très sollicitées sur les questions de prix. "Combien coûte [service] ?" est parmi les requêtes les plus fréquentes. Une page tarifaire claire et bien structurée est régulièrement sourcée par les IA pour répondre à ces questions — même si tu n'affiches pas de prix fixes.`,
              actions: [
                'Crée une page "Tarifs" avec au minimum des fourchettes de prix',
                "Explique ce qui influence le prix (facteurs, options)",
                "Compare avec le marché (positionnement haut/milieu/bas)",
                "Ajoute une FAQ sur la facturation et les modalités",
              ],
            },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-black" style={{ color: "#a78bfa" }}>{s.n}</span>
                  <span className="text-[11px] font-bold rounded-full px-2.5 py-1"
                    style={{ background: `${s.tagColor}15`, color: s.tagColor, border: `1px solid ${s.tagColor}25` }}>
                    {s.tag}
                  </span>
                </div>
                <h2 className="font-black text-white mb-3" style={{ letterSpacing: "-0.015em" }}>{s.title}</h2>
                <p style={{ color: "rgba(255,255,255,0.55)" }}>{s.content}</p>
              </div>
              <div className="px-5 py-4 space-y-2" style={{ background: "rgba(124,58,237,0.04)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>Actions concrètes</p>
                {s.actions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(124,58,237,0.15)" }}>
                      <Check size={9} style={{ color: "#a78bfa" }} />
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <h2 className="text-lg font-black text-white pt-2" style={{ letterSpacing: "-0.02em" }}>Comment mesurer l&apos;impact ?</h2>
          <p>
            Chaque stratégie doit être mesurée. Lance une analyse ScoreIA avant de commencer,
            puis relance 4 à 6 semaines après avoir publié tes contenus. Tu verras concrètement
            quelles questions IA tu as conquises et lesquelles restent à travailler.
          </p>
          <p>
            En moyenne, nos utilisateurs gagnent <strong className="text-white">+18 à +35 points de score</strong> en
            6 semaines en appliquant ces 5 stratégies. Le contenu de qualité est l&apos;arme absolue du GEO.
          </p>
        </div>

        <div className="mt-12 rounded-2xl p-6 text-center" style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.18)" }}>
          <p className="text-white font-bold mb-1">Mesure ton score de départ gratuitement</p>
          <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>Score gratuit · 2 minutes · Pas de CB</p>
          <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white text-sm">
            Analyser ma marque <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/blog/comment-chatgpt-choisit-les-marques" className="rounded-xl p-4 inline-flex flex-col transition-all w-full"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs mb-1 font-semibold" style={{ color: "#a78bfa" }}>← Article précédent</p>
            <p className="text-sm font-semibold text-white">Comment ChatGPT choisit les marques qu&apos;il cite</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
