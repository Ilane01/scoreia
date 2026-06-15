import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Comment ChatGPT choisit les marques qu'il cite — ScoreIA",
  description: "ChatGPT ne cite pas les marques au hasard. Analyse des mécanismes de citation des IA et stratégies concrètes pour y apparaître.",
};

export default function ArticleChatGPT() {
  return (
    <div className="min-h-screen" style={{ background: "#07070d", color: "#f1f5f9" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 25% at 50% 0%, rgba(124,58,237,0.07), transparent 55%)" }} />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-10 transition-colors" style={{ color: "rgba(255,255,255,0.35)" }}>
          <ArrowLeft size={13} /> Blog
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] font-bold rounded-full px-2.5 py-1" style={{ background: "rgba(37,99,235,0.15)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.25)" }}>Stratégie</span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}><Clock size={10} /> 7 min</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>5 juin 2025</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-6 leading-tight" style={{ letterSpacing: "-0.025em" }}>
          Comment ChatGPT choisit les marques qu&apos;il cite (et comment en faire partie)
        </h1>

        <div className="space-y-5 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          <p>
            Si tu demandes à ChatGPT &laquo; Quelle est la meilleure solution de comptabilité pour PME ? &raquo;,
            il va nommer 3 ou 4 marques. Ces marques ne font pas de la pub sur OpenAI. Elles n&apos;ont pas
            payé pour être là. Alors comment est-ce qu&apos;elles y sont arrivées ?
          </p>

          <h2 className="text-lg font-black text-white pt-4" style={{ letterSpacing: "-0.02em" }}>Le mécanisme de base : l&apos;entraînement + le web en temps réel</h2>
          <p>
            Les LLMs fonctionnent en deux temps. D&apos;abord, ils sont entraînés sur des milliards de pages web.
            Une marque souvent citée dans des contenus de qualité durant cet entraînement devient une
            <strong className="text-white"> référence encodée dans les poids du modèle</strong>.
          </p>
          <p>
            Ensuite, pour des modèles comme Perplexity ou ChatGPT avec browsing, ils peuvent aussi
            consulter le web en temps réel. Là, c&apos;est ta présence actuelle qui compte.
          </p>

          <h2 className="text-lg font-black text-white pt-4" style={{ letterSpacing: "-0.02em" }}>Les 5 signaux qui font qu&apos;une marque est citée</h2>

          <div className="space-y-3">
            {[
              { n: "01", title: "La densité de citation", desc: "Plus ta marque est mentionnée souvent sur des sources diverses (blogs spécialisés, forums, comparatifs, presse sectorielle), plus le modèle la considère comme une référence dans son domaine." },
              { n: "02", title: "La spécificité thématique", desc: "Les IA citent des marques qui sont clairement positionnées sur un sujet précis. Un généraliste sera moins cité qu'un spécialiste reconnu sur une niche." },
              { n: "03", title: "La réponse directe aux questions", desc: "Si ton site contient du contenu qui répond mot pour mot aux questions que les utilisateurs posent aux IA, ta probabilité d'être cité explose. Le format FAQ est roi." },
              { n: "04", title: "La cohérence des signaux", desc: "Une marque avec des avis positifs, des études de cas, des témoignages chiffrés, et une présence sur plusieurs canaux envoie un signal de confiance fort au modèle." },
              { n: "05", title: "L'autorité des sources qui te citent", desc: "Être mentionné dans un article de fond d'un média sectoriel reconnu vaut plus que 100 mentions sur des sites anonymes. La qualité prime sur la quantité." },
            ].map(s => (
              <div key={s.n} className="flex gap-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xs font-black flex-shrink-0 mt-0.5" style={{ color: "#a78bfa" }}>{s.n}</span>
                <div>
                  <p className="font-bold text-white mb-1">{s.title}</p>
                  <p style={{ color: "rgba(255,255,255,0.5)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-black text-white pt-4" style={{ letterSpacing: "-0.02em" }}>Ce qui ne fonctionne PAS</h2>
          <p>Contrairement à ce qu&apos;on pourrait penser :</p>
          <ul className="space-y-2 pl-4">
            <li>• <strong className="text-white">Les backlinks SEO</strong> n&apos;ont aucun impact direct sur les IA</li>
            <li>• <strong className="text-white">Le budget pub Google/Meta</strong> n&apos;influence pas du tout les citations IA</li>
            <li>• <strong className="text-white">Le nombre de followers</strong> sur les réseaux n&apos;est pas un signal pertinent</li>
            <li>• <strong className="text-white">Le trafic du site</strong> seul ne suffit pas si le contenu ne répond pas aux bonnes questions</li>
          </ul>

          <h2 className="text-lg font-black text-white pt-4" style={{ letterSpacing: "-0.02em" }}>La stratégie GEO en 3 phases</h2>
          <div className="space-y-2">
            {[
              { phase: "Phase 1 — Mesurer", desc: "Identifier les questions où tu n'es pas cité. C'est ton point de départ. Sans diagnostic, tu travailles à l'aveugle." },
              { phase: "Phase 2 — Créer", desc: "Produire du contenu qui répond directement aux questions identifiées. Articles de fond, FAQ, études de cas, comparatifs. Chaque article cible une question précise." },
              { phase: "Phase 3 — Relancer", desc: "Attendre 4-6 semaines, re-analyser, mesurer l'évolution du score. Les IA intègrent rapidement les nouveaux contenus de qualité." },
            ].map((p, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl" style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.1)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(124,58,237,0.3)" }}>{i + 1}</div>
                <div>
                  <p className="font-bold text-white mb-0.5">{p.phase}</p>
                  <p style={{ color: "rgba(255,255,255,0.5)" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="pt-2">
            La bonne nouvelle : cette stratégie est accessible à n&apos;importe quelle marque, quelle que soit
            sa taille. Les PME ont même un avantage — elles peuvent se positionner très rapidement sur
            des niches que les grandes marques négligent.
          </p>
        </div>

        <div className="mt-12 rounded-2xl p-6 text-center" style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.18)" }}>
          <p className="text-white font-bold mb-1">Découvre sur quelles questions tu n&apos;es pas cité</p>
          <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>Score gratuit · 2 minutes · Pas de CB</p>
          <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white text-sm">
            Analyser ma marque <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link href="/blog/geo-generative-engine-optimization" className="rounded-xl p-4 transition-all"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs mb-1 font-semibold" style={{ color: "#a78bfa" }}>← Article précédent</p>
            <p className="text-sm font-semibold text-white">Qu&apos;est-ce que le GEO ?</p>
          </Link>
          <Link href="/blog/5-strategies-visibilite-ia" className="rounded-xl p-4 transition-all text-right"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs mb-1 font-semibold" style={{ color: "#a78bfa" }}>Article suivant →</p>
            <p className="text-sm font-semibold text-white">5 stratégies pour apparaître dans les IA</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
