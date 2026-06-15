import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Qu'est-ce que le GEO ? Le nouveau SEO à maîtriser en 2025 — ScoreIA",
  description: "Le Generative Engine Optimization (GEO) est la discipline qui consiste à optimiser ta présence dans les réponses des IA génératives. Voici pourquoi c'est urgent.",
};

export default function ArticleGEO() {
  return (
    <div className="min-h-screen" style={{ background: "#07070d", color: "#f1f5f9" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 25% at 50% 0%, rgba(124,58,237,0.07), transparent 55%)" }} />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-10 transition-colors" style={{ color: "rgba(255,255,255,0.35)" }}>
          <ArrowLeft size={13} /> Blog
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] font-bold rounded-full px-2.5 py-1" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}>Fondamentaux</span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}><Clock size={10} /> 5 min</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>10 juin 2025</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-6 leading-tight" style={{ letterSpacing: "-0.025em" }}>
          Qu&apos;est-ce que le GEO ? Le nouveau SEO à maîtriser en 2025
        </h1>

        <div className="space-y-5 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          <p>
            Pendant 20 ans, le SEO (Search Engine Optimization) a dicté les règles de la visibilité en ligne.
            Apparaître en première page de Google était l&apos;objectif ultime. Puis les IA génératives ont tout changé.
          </p>

          <h2 className="text-lg font-black text-white pt-4" style={{ letterSpacing: "-0.02em" }}>Le problème : les IA ne fonctionnent pas comme Google</h2>
          <p>
            Quand un utilisateur demande à ChatGPT &laquo; Quelle est la meilleure clinique dentaire à Paris ? &raquo;,
            l&apos;IA ne liste pas 10 liens bleus. Elle <strong className="text-white">cite directement des noms</strong>.
            Et si ton nom n&apos;y est pas, tu n&apos;existes pas pour cet utilisateur.
          </p>
          <p>
            Selon Gartner, 40% des recherches vont migrer vers les IA d&apos;ici 2026. HubSpot rapporte qu&apos;1
            utilisateur sur 3 préfère déjà ChatGPT à Google pour obtenir des recommandations.
            Le canal existe. La question est : est-ce que tu y es présent ?
          </p>

          <h2 className="text-lg font-black text-white pt-4" style={{ letterSpacing: "-0.02em" }}>Le GEO : définition</h2>
          <p>
            Le <strong className="text-white">Generative Engine Optimization (GEO)</strong> est l&apos;ensemble des
            techniques visant à améliorer la probabilité qu&apos;une IA générative cite ta marque, tes produits ou
            tes services dans ses réponses.
          </p>
          <p>
            À la différence du SEO, le GEO ne cherche pas à ranker une URL. Il vise à devenir une
            <strong className="text-white"> référence dans la mémoire des modèles</strong> — à travers le contenu
            web que ces modèles ont ingéré lors de leur entraînement, et via les sources qu&apos;ils consultent en temps réel.
          </p>

          <h2 className="text-lg font-black text-white pt-4" style={{ letterSpacing: "-0.02em" }}>Comment les IA décident qui citer</h2>
          <p>Les modèles comme ChatGPT ou Claude citent une marque quand :</p>
          <ul className="space-y-2 pl-4">
            <li>• Elle apparaît fréquemment dans des contenus <strong className="text-white">autoritaires et spécialisés</strong> sur le web</li>
            <li>• Elle répond explicitement aux questions que les utilisateurs posent à l&apos;IA</li>
            <li>• Elle est mentionnée dans des contextes <strong className="text-white">positifs et contextuels</strong></li>
            <li>• Elle dispose de <strong className="text-white">signaux de confiance</strong> : avis, comparatifs, études de cas</li>
          </ul>

          <h2 className="text-lg font-black text-white pt-4" style={{ letterSpacing: "-0.02em" }}>GEO vs SEO : les différences clés</h2>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  <th className="text-left px-4 py-2.5 font-semibold text-white">Critère</th>
                  <th className="text-left px-4 py-2.5 font-semibold" style={{ color: "#60a5fa" }}>SEO</th>
                  <th className="text-left px-4 py-2.5 font-semibold" style={{ color: "#a78bfa" }}>GEO</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Objectif", "Rank #1 sur Google", "Être cité par l'IA"],
                  ["Format", "Pages optimisées balises", "Contenu conversationnel, FAQ"],
                  ["Signaux", "Backlinks, DA, ancre", "Autorité thématique, fréquence"],
                  ["Mesure", "Position, trafic organique", "Score de citation (0-100)"],
                  ["Délai", "3-6 mois", "4-8 semaines"],
                ].map(([c, s, g], i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <td className="px-4 py-2.5 text-white font-medium">{c}</td>
                    <td className="px-4 py-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>{s}</td>
                    <td className="px-4 py-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>{g}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-black text-white pt-4" style={{ letterSpacing: "-0.02em" }}>Par où commencer ?</h2>
          <p>
            La première étape est de <strong className="text-white">mesurer ton point de départ</strong>.
            Sans score de référence, impossible de savoir si tes actions ont un impact.
            ScoreIA interroge ChatGPT, Gemini, Claude et Perplexity avec une batterie de questions
            sur ton secteur, et te donne un score de visibilité de 0 à 100 — gratuitement, en 2 minutes.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl p-6 text-center" style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.18)" }}>
          <p className="text-white font-bold mb-1">Quel est ton score GEO actuel ?</p>
          <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>Gratuit · 2 minutes · Pas de CB</p>
          <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white text-sm">
            Analyser ma marque <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/blog/comment-chatgpt-choisit-les-marques" className="flex-1 rounded-xl p-4 transition-all"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs mb-1 font-semibold" style={{ color: "#a78bfa" }}>Article suivant →</p>
            <p className="text-sm font-semibold text-white">Comment ChatGPT choisit les marques qu&apos;il cite</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
