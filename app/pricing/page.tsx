"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Zap, Building2, Star, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    price: { monthly: "0€", annual: "0€" },
    desc: "Mesure ta visibilité IA, sans CB",
    highlight: false,
    badge: null,
    cta: "Commencer gratuitement",
    ctaHref: "/onboarding",
    ctaStyle: "border",
    features: [
      "1 marque analysée",
      "Score global IA (sur 100)",
      "Analyse sur 4 LLMs (ChatGPT, Claude, Gemini, Perplexity)",
      "Détection des mentions positives/négatives",
      "Identification des questions sans réponse",
      "Comparaison 3 concurrents",
      "Rapport mensuel",
    ],
    locked: [
      "Plan de contenu personnalisé",
      "Génération d'articles IA",
      "Suivi de progression",
      "Export PDF",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: { monthly: "89€", annual: "74€" },
    period: "/mois",
    desc: "Score + plan pour progresser vers 80/100",
    highlight: true,
    badge: "Le plus populaire",
    cta: "Démarrer l'essai gratuit",
    ctaHref: "/onboarding",
    ctaStyle: "primary",
    features: [
      "Tout le plan Gratuit",
      "Plan de contenu personnalisé",
      "Génération d'articles optimisés IA",
      "Suivi hebdomadaire de progression",
      "Benchmark 3 concurrents",
      "Alertes score en temps réel",
      "Export PDF des rapports",
      "Support email prioritaire",
    ],
    locked: [],
  },
  {
    id: "agency",
    name: "Agency",
    price: { monthly: "249€", annual: "207€" },
    period: "/mois",
    desc: "Gérez plusieurs marques pour vos clients",
    highlight: false,
    badge: null,
    cta: "Contacter l'équipe",
    ctaHref: "mailto:hello@scoreia.fr",
    ctaStyle: "border",
    features: [
      "Tout le plan Starter",
      "Jusqu'à 10 marques",
      "Rapports en marque blanche (white-label)",
      "Dashboard agence centralisé",
      "Accès multi-utilisateurs",
      "API access",
      "Intégrations (Notion, Slack, Zapier)",
      "Support dédié (réponse < 2h)",
    ],
    locked: [],
  },
];

const FAQS = [
  {
    q: "Est-ce que l'essai gratuit nécessite une CB ?",
    a: "Non. L'essai gratuit de 14 jours est sans carte bancaire. Tu entres tes coordonnées seulement à la fin de la période d'essai si tu décides de continuer.",
  },
  {
    q: "Comment fonctionne l'analyse IA ?",
    a: "On soumet automatiquement 15+ questions sur ta marque à ChatGPT, Claude, Gemini et Perplexity. On mesure si tu es cité, comment, et on génère un score de 0 à 100. L'analyse prend environ 2 minutes.",
  },
  {
    q: "Quelle est la différence entre le plan Gratuit et Starter ?",
    a: "Le plan Gratuit te donne ton score IA (diagnostic complet gratuit). Le plan Starter débloque le plan de contenu personnalisé et la génération d'articles — c'est-à-dire les actions concrètes pour améliorer ton score.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, sans engagement. Tu peux annuler depuis ton dashboard en 2 clics. Aucun frais caché, aucune reconduction silencieuse.",
  },
  {
    q: "Le plan Agency permet combien de marques ?",
    a: "Jusqu'à 10 marques sur un seul compte, avec rapports en marque blanche pour tes clients. Pour plus de 10 marques, contacte-nous pour un tarif sur mesure.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#07070d", color: "#f1f5f9" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.12), transparent 60%)" }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
          <span className="font-black text-sm text-white tracking-tight">ScoreIA</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
          <ArrowLeft size={14} /> Retour au dashboard
        </Link>
      </nav>

      {/* Header */}
      <div className="relative z-10 text-center px-5 pt-10 pb-14">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
          <Zap size={11} /> Essai gratuit 14 jours · Sans CB
        </div>
        <h1 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: "-0.03em" }}>
          Choisis ton plan
        </h1>
        <p className="text-base max-w-md mx-auto mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
          Mesure ta visibilité IA gratuitement. Passe au Starter pour recevoir ton plan d&apos;action personnalisé.
        </p>

        {/* Annual toggle */}
        <div className="inline-flex items-center gap-3 rounded-full p-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setAnnual(false)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{ background: !annual ? "rgba(124,58,237,0.9)" : "transparent", color: !annual ? "#fff" : "rgba(255,255,255,0.4)" }}>
            Mensuel
          </button>
          <button onClick={() => setAnnual(true)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2"
            style={{ background: annual ? "rgba(124,58,237,0.9)" : "transparent", color: annual ? "#fff" : "rgba(255,255,255,0.4)" }}>
            Annuel
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.2)", color: "#4ade80" }}>-17%</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 pb-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
          {PLANS.map((plan) => (
            <div key={plan.id} className="rounded-2xl flex flex-col relative"
              style={{
                background: plan.highlight ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.03)",
                border: plan.highlight ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: plan.highlight ? "0 0 40px rgba(124,58,237,0.12)" : "none",
              }}>

              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                    <Star size={9} className="fill-white" /> {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-7 flex-1 flex flex-col">
                {/* Plan header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    {plan.id === "agency" ? <Building2 size={14} style={{ color: "#a78bfa" }} /> : <Zap size={14} style={{ color: "#a78bfa" }} />}
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>{plan.name}</p>
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black text-white" style={{ letterSpacing: "-0.04em" }}>
                      {annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.period && (
                      <span className="text-sm mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>{plan.period}</span>
                    )}
                  </div>
                  {annual && plan.id !== "free" && (
                    <p className="text-xs" style={{ color: "#4ade80" }}>Facturé annuellement · 2 mois offerts</p>
                  )}
                  <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>{plan.desc}</p>
                </div>

                {/* CTA */}
                <a href={plan.ctaHref}
                  className={`w-full rounded-xl py-3.5 text-sm font-bold text-center transition-all duration-200 flex items-center justify-center gap-2 mb-6 ${plan.ctaStyle === "primary" ? "btn-primary text-white" : ""}`}
                  style={plan.ctaStyle === "border" ? {
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.65)",
                    background: "rgba(255,255,255,0.03)",
                  } : {}}>
                  {plan.cta} {plan.ctaStyle === "primary" && <ArrowRight size={14} />}
                </a>

                {/* Features */}
                <div className="space-y-2.5 flex-1">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(124,58,237,0.15)" }}>
                        <Check size={10} style={{ color: "#a78bfa" }} />
                      </div>
                      <span className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.65)" }}>{f}</span>
                    </div>
                  ))}

                  {plan.locked.length > 0 && (
                    <>
                      <div className="my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
                      {plan.locked.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5 opacity-35">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: "rgba(255,255,255,0.05)" }}>
                            <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>🔒</span>
                          </div>
                          <span className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.35)" }}>{f}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12">
          {["14 jours d'essai gratuit", "Sans engagement", "Annulable en 2 clics", "Données 100% sécurisées"].map((t) => (
            <div key={t} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Check size={11} style={{ color: "#a78bfa" }} /> {t}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-8" style={{ letterSpacing: "-0.025em" }}>Questions fréquentes</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={15} style={{ color: "#a78bfa", flexShrink: 0 }} />
                    : <ChevronDown size={15} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center rounded-2xl p-10" style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <h3 className="text-2xl font-black text-white mb-3" style={{ letterSpacing: "-0.025em" }}>Commence gratuitement</h3>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Ton score IA en 2 minutes · Pas de CB · Résultats immédiats</p>
          <Link href="/onboarding"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-4 font-bold text-white text-sm">
            Analyser ma marque gratuitement <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
        © 2025 ScoreIA · <Link href="/login" className="hover:text-white/40 transition-colors">Se connecter</Link>
      </footer>
    </div>
  );
}
