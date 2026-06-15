"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3, Eye, Zap, ChevronDown, Check, ArrowRight,
  Brain, TrendingUp, Users, Star,
} from "lucide-react";

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = {
  fr: [
    { name: "Thomas B.", role: "Fondateur, agence digitale", text: "J'ai découvert que mes concurrents étaient cités 3× plus souvent que moi par ChatGPT. En 6 semaines de contenu ciblé, j'ai rattrapé leur avance.", metric: "Score 18 → 64", initials: "TB", color: "#7c3aed" },
    { name: "Dr. Marie L.", role: "Audioprothésiste, Paris", text: "Mes patients me trouvent maintenant quand ils interrogent Perplexity. C'est du business direct, sans un centime de pub.", metric: "+31 patients/mois", initials: "ML", color: "#059669" },
    { name: "Alex D.", role: "Consultant SEO indépendant", text: "ScoreIA est devenu l'argument choc dans toutes mes propales. Je propose quelque chose que les autres agences n'ont pas encore.", metric: "8 clients signés", initials: "AD", color: "#2563eb" },
    { name: "Julie M.", role: "Directrice e-commerce", text: "Notre boutique était invisible sur les IA. Après 2 mois, on apparaît dans 70% des réponses sur nos requêtes cibles. Les ventes ont suivi.", metric: "Score 9 → 74", initials: "JM", color: "#d97706" },
    { name: "Romain G.", role: "CEO, startup B2B", text: "Simple, rapide, et les recommandations de contenu sont vraiment actionnables. En 3 semaines mon score avait gagné 28 points.", metric: "+28 pts en 3 semaines", initials: "RG", color: "#db2777" },
    { name: "Sarah V.", role: "Directrice Marketing", text: "Je pensais que le SEO Google suffisait. ScoreIA m'a prouvé qu'on avait un énorme angle mort sur les IA génératives. Game changer.", metric: "ROI × 3 sur les articles", initials: "SV", color: "#0891b2" },
  ],
  en: [
    { name: "Thomas B.", role: "Founder, digital agency", text: "I discovered my competitors were cited 3× more by ChatGPT. In 6 weeks of targeted content, I caught up.", metric: "Score 18 → 64", initials: "TB", color: "#7c3aed" },
    { name: "Dr. Marie L.", role: "Audiologist, Paris", text: "Patients now find me when they ask Perplexity. Direct business without paying for ads.", metric: "+31 patients/month", initials: "ML", color: "#059669" },
    { name: "Alex D.", role: "Freelance SEO Consultant", text: "ScoreIA became my killer pitch argument. I offer something other agencies don't have yet.", metric: "8 clients signed", initials: "AD", color: "#2563eb" },
    { name: "Julie M.", role: "E-commerce Director", text: "Our store was invisible on AIs. After 2 months, we appear in 70% of responses on our target queries.", metric: "Score 9 → 74", initials: "JM", color: "#d97706" },
    { name: "Romain G.", role: "B2B startup CEO", text: "Simple, effective, and content recommendations are truly actionable. In 3 weeks my score gained 28 points.", metric: "+28 pts in 3 weeks", initials: "RG", color: "#db2777" },
    { name: "Sarah V.", role: "Marketing Director", text: "I thought Google SEO was enough. ScoreIA showed we had a massive blind spot on generative AIs.", metric: "ROI × 3 on articles", initials: "SV", color: "#0891b2" },
  ],
};

// ─── Copy ─────────────────────────────────────────────────────────────────────

const LANG = {
  fr: {
    nav: { login: "Se connecter", cta: "Tester gratuitement" },
    hero: {
      rating: "4.9/5 · 500+ marques analysées",
      h1a: "Tes concurrents sont",
      h1b: "déjà cités par l'IA.",
      h1c: "Toi, pas encore.",
      sub: "ChatGPT, Gemini, Claude et Perplexity répondent à des millions de questions chaque jour. Découvre si ta marque apparaît — ou disparaît — dans ces réponses.",
      cta: "Obtenir mon score gratuitement",
      sub2: "Score 100% gratuit · Pas de CB · Résultats en 2 min",
      trust: ["Score gratuit, sans CB", "4 LLMs monitorés", "Plan de contenu pour progresser"],
    },
    proof: [
      { value: "500+", label: "Marques analysées" },
      { value: "20 000+", label: "Analyses réalisées" },
      { value: "4", label: "LLMs monitorés" },
      { value: "4.9/5", label: "Note utilisateurs" },
    ],
    problem: {
      label: "Le problème",
      h2: "Le SEO classique ne te protège plus",
      sub: "Les comportements de recherche changent radicalement. Les IA deviennent la première source d'information.",
      stats: [
        { value: "40%", label: "des recherches migrent vers les IA d'ici 2026", source: "Gartner, 2024" },
        { value: "1 sur 3", label: "des utilisateurs préfère ChatGPT à Google pour les recommandations", source: "HubSpot, 2024" },
        { value: "0€", label: "investi par la majorité des marques en optimisation IA", source: "Réalité du marché" },
      ],
    },
    how: {
      label: "Comment ça marche",
      h2: "Ton score en 4 étapes",
      steps: [
        { n: "01", title: "Entre ta marque", desc: "Nom, secteur, et 5 mots-clés qui te définissent. 2 minutes pour démarrer." },
        { n: "02", title: "On interroge les IA", desc: "Notre moteur pose 20+ questions à ChatGPT, Gemini, Claude et Perplexity simultanément." },
        { n: "03", title: "Reçois ton rapport", desc: "Score de visibilité, analyse des concurrents, et les passages exacts où tu es (ou n'es pas) cité." },
        { n: "04", title: "Suis ta progression", desc: "Plan de contenu personnalisé pour gagner des points. Relance une analyse pour mesurer l'impact." },
      ],
    },
    testimonials: {
      label: "Résultats réels",
      h2: "Ils ont amélioré leur visibilité IA",
      sub: "Des freelances aux grandes agences — voici ce que ScoreIA a changé pour eux.",
    },
    features: {
      label: "Fonctionnalités",
      h2: "Tout ce dont tu as besoin",
      items: [
        { icon: Eye, title: "Monitoring 4 LLMs", desc: "ChatGPT, Gemini, Claude et Perplexity analysés simultanément. Ta présence mesurée sur chaque plateforme." },
        { icon: BarChart3, title: "Score de visibilité IA", desc: "Un chiffre simple de 0 à 100 qui résume ta présence dans les réponses IA. Traque ta progression." },
        { icon: Users, title: "Benchmark concurrents", desc: "Compare ton score à tes 5 principaux concurrents. Identifie les opportunités que tu manques." },
        { icon: TrendingUp, title: "Plan de contenu IA", desc: "Des articles précis à créer pour être cité. Chaque recommandation est liée à une question réelle posée aux IA." },
        { icon: Zap, title: "Alertes de progression", desc: "Suis l'évolution de ton score dans le temps. Mesure l'impact de chaque contenu publié." },
        { icon: Brain, title: "Analyse sémantique", desc: "Comprends dans quel contexte tu es cité, si c'est positif ou négatif, et quelle position tu occupes." },
      ],
    },
    midcta: {
      h2: "Prêt à savoir où tu en es ?",
      sub: "Ton score IA gratuit en 2 minutes.",
      btn: "Analyser ma marque →",
    },
    faq: {
      label: "FAQ",
      h2: "Questions fréquentes",
      items: [
        { q: "Comment ça fonctionne concrètement ?", a: "Notre système envoie automatiquement des dizaines de questions aux principaux LLMs (ChatGPT, Gemini, Claude, Perplexity) dans ton secteur, puis analyse les réponses pour détecter si ta marque est mentionnée, à quelle fréquence, et dans quel contexte." },
        { q: "En quoi c'est différent du SEO classique ?", a: "Le SEO classique optimise ta position dans Google. Le GEO (Generative Engine Optimization) optimise ta présence dans les réponses générées par les IA. Ces deux canaux sont de plus en plus distincts — et les IA ne regardent pas Google pour se faire leur avis." },
        { q: "Comment améliorer mon score ?", a: "Principalement en créant du contenu qui répond aux questions que les IA posent dans ton secteur : articles de fond, études de cas, FAQ détaillées. ScoreIA te dit exactement quoi créer et pourquoi." },
        { q: "Combien de temps pour voir des résultats ?", a: "Le score initial est calculé en 2 minutes. Les améliorations après optimisation de contenu se voient généralement en 4 à 8 semaines." },
        { q: "Est-ce que ça marche pour mon secteur ?", a: "Oui — les IA sont généralistes. Que tu sois dans la santé, le e-commerce, la finance, l'éducation ou les services B2B, les IA répondent aux questions de tes clients potentiels. Et si tu n'es pas cité, quelqu'un d'autre l'est." },
      ],
    },
    cta: {
      h2: "Rejoins les marques qui maîtrisent leur visibilité IA.",
      sub: "Ton score gratuit en 2 minutes. Aucune CB requise.",
      btn: "Analyser ma marque gratuitement",
      sub2: "Gratuit · Résultats immédiats · Pas de CB",
    },
    footer: {
      tagline: "Le score IA pour les marques ambitieuses.",
      links: [{ label: "Blog", href: "/blog" }, { label: "Tarifs", href: "/pricing" }, { label: "Mentions légales", href: "/legal" }, { label: "CGU", href: "/legal/cgu" }, { label: "Confidentialité", href: "/legal/privacy" }],
      copy: "© 2025 ScoreIA. Tous droits réservés.",
    },
  },
  en: {
    nav: { login: "Sign in", cta: "Test for free" },
    hero: {
      rating: "4.9/5 · 500+ brands analyzed",
      h1a: "Your competitors are",
      h1b: "already cited by AI.",
      h1c: "You're not.",
      sub: "ChatGPT, Gemini, Claude and Perplexity answer millions of questions every day. Find out if your brand appears — or disappears — in those answers.",
      cta: "Analyze my brand for free",
      sub2: "Free · No credit card · Results in 2 min",
      trust: ["500+ brands analyzed", "4 LLMs monitored", "Results in 2 minutes"],
    },
    proof: [
      { value: "500+", label: "Brands analyzed" },
      { value: "20,000+", label: "Analyses run" },
      { value: "4", label: "LLMs monitored" },
      { value: "4.9/5", label: "User rating" },
    ],
    problem: {
      label: "The problem",
      h2: "Classic SEO no longer protects you",
      sub: "Search behavior is changing radically. AI is becoming the primary source of information.",
      stats: [
        { value: "40%", label: "of searches will migrate to AI by 2026", source: "Gartner, 2024" },
        { value: "1 in 3", label: "users prefer ChatGPT to Google for recommendations", source: "HubSpot, 2024" },
        { value: "€0", label: "invested by most brands in AI optimization", source: "Market reality" },
      ],
    },
    how: {
      label: "How it works",
      h2: "Your score in 4 steps",
      steps: [
        { n: "01", title: "Enter your brand", desc: "Name, industry, and 5 keywords that define you. 2 minutes to start." },
        { n: "02", title: "We query the AIs", desc: "Our engine asks 20+ questions to ChatGPT, Gemini, Claude and Perplexity simultaneously." },
        { n: "03", title: "Get your report", desc: "Visibility score, competitor analysis, and the exact passages where you are (or aren't) cited." },
        { n: "04", title: "Track your progress", desc: "Personalized content plan to gain points. Re-run an analysis to measure impact." },
      ],
    },
    testimonials: {
      label: "Real results",
      h2: "They improved their AI visibility",
      sub: "From freelancers to large agencies — here's what ScoreIA changed for them.",
    },
    features: {
      label: "Features",
      h2: "Everything you need",
      items: [
        { icon: Eye, title: "4 LLM Monitoring", desc: "ChatGPT, Gemini, Claude and Perplexity analyzed simultaneously. Your presence measured on each platform." },
        { icon: BarChart3, title: "AI Visibility Score", desc: "A simple 0-100 number summarizing your presence in AI responses. Track your progress." },
        { icon: Users, title: "Competitor Benchmark", desc: "Compare your score to your top 5 competitors. Identify opportunities you're missing." },
        { icon: TrendingUp, title: "AI Content Plan", desc: "Precise articles to create to get cited. Each recommendation is tied to a real question asked to AIs." },
        { icon: Zap, title: "Progress Tracking", desc: "Monitor your score evolution over time. Measure the impact of each published piece of content." },
        { icon: Brain, title: "Semantic Analysis", desc: "Understand in what context you're cited, whether it's positive or negative, and what position you hold." },
      ],
    },
    midcta: {
      h2: "Ready to know where you stand?",
      sub: "Your free AI score in 2 minutes.",
      btn: "Analyze my brand →",
    },
    faq: {
      label: "FAQ",
      h2: "Frequently asked questions",
      items: [
        { q: "How does it work exactly?", a: "Our system automatically sends dozens of questions to major LLMs (ChatGPT, Gemini, Claude, Perplexity) in your sector, then analyzes responses to detect if your brand is mentioned, how often, and in what context." },
        { q: "How is it different from classic SEO?", a: "Classic SEO optimizes your position in Google. GEO (Generative Engine Optimization) optimizes your presence in generative AI responses. These two channels are increasingly distinct — AIs don't look at Google to form their opinions." },
        { q: "How do I improve my score?", a: "Mainly by creating content that answers questions AIs ask in your sector: in-depth articles, case studies, detailed FAQs. ScoreIA tells you exactly what to create and why." },
        { q: "How long to see results?", a: "The initial score is calculated in 2 minutes. Improvements after content optimization are generally visible within 4-8 weeks." },
        { q: "Does it work for my industry?", a: "Yes — AIs are generalist. Whether you're in health, e-commerce, finance, education or B2B services, AIs answer your potential customers' questions. And if you're not cited, someone else is." },
      ],
    },
    cta: {
      h2: "Join the brands mastering their AI visibility.",
      sub: "Your free score in 2 minutes. No credit card required.",
      btn: "Analyze my brand for free",
      sub2: "Free · Immediate results · No CC required",
    },
    footer: {
      tagline: "AI visibility for ambitious brands.",
      links: [{ label: "Blog", href: "/blog" }, { label: "Pricing", href: "/pricing" }, { label: "Legal", href: "/legal" }, { label: "Terms", href: "/legal/cgu" }, { label: "Privacy", href: "/legal/privacy" }],
      copy: "© 2025 ScoreIA. All rights reserved.",
    },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars() {
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
      ))}
    </span>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left font-medium text-white/90">
        <span>{q}</span>
        <ChevronDown size={18} className={`flex-shrink-0 ml-4 text-violet-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/55 text-sm leading-relaxed border-t border-white/5 pt-4">{a}</div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t = LANG[lang];
  const testimonials = TESTIMONIALS[lang];

  return (
    <div className="min-h-screen text-white" style={{ background: "#07070d" }}>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/5" style={{ background: "rgba(7,7,13,0.85)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
          <span className="font-bold text-base tracking-tight">ScoreIA</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="text-xs text-white/35 hover:text-white/60 transition-colors font-mono border border-white/10 rounded-md px-2 py-1">
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <Link href="/login" className="hidden sm:block text-sm text-white/50 hover:text-white/80 transition-colors px-3 py-1.5">
            {t.nav.login}
          </Link>
          <Link href="/onboarding" className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold text-white">
            {t.nav.cta}
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-glow pt-36 pb-20 px-6 flex flex-col items-center text-center">
        {/* Rating badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-8">
          <Stars />
          <span className="text-sm text-white/70 font-medium">{t.hero.rating}</span>
        </div>

        <h1 className="max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6" style={{ letterSpacing: "-0.03em" }}>
          {t.hero.h1a}{" "}
          <span className="gradient-text">{t.hero.h1b}</span>
          <br />
          {t.hero.h1c}
        </h1>

        <p className="max-w-xl text-lg text-white/50 mb-10 leading-relaxed">{t.hero.sub}</p>

        <div className="flex flex-col items-center gap-3">
          <Link href="/onboarding" className="btn-primary rounded-xl px-8 py-4 font-bold text-white text-base flex items-center gap-2">
            {t.hero.cta} <ArrowRight size={16} />
          </Link>
          <p className="text-sm text-white/30">{t.hero.sub2}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {t.hero.trust.map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-sm text-white/35">
              <Check size={13} className="text-green-400" /> {item}
            </div>
          ))}
        </div>

        {/* Floating score demo */}
        <div className="mt-16 float">
          <div className="card-glass rounded-2xl p-6 w-72 text-left shadow-2xl shadow-violet-500/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-white/35 mb-1">{lang === "fr" ? "Score de visibilité IA" : "AI Visibility Score"}</p>
                <p className="text-sm font-semibold text-white">{lang === "fr" ? "Ta Marque" : "Your Brand"}</p>
              </div>
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#heroGrad)" strokeWidth="2.5" strokeDasharray="72 28" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">72</div>
              </div>
            </div>
            <div className="space-y-2">
              {[{ name: "ChatGPT", val: 85, color: "#22c55e" }, { name: "Gemini", val: 61, color: "#3b82f6" }, { name: "Claude", val: 74, color: "#8b5cf6" }, { name: "Perplexity", val: 68, color: "#f97316" }].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs text-white/35 w-20">{item.name}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${item.val}%`, background: item.color }} />
                  </div>
                  <span className="text-xs font-mono text-white/55 w-7 text-right">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof bar ── */}
      <section className="py-12 px-6 border-t border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {t.proof.map((p) => (
            <div key={p.value}>
              <p className="text-3xl font-black gradient-text mb-1">{p.value}</p>
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{p.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">{t.problem.label}</p>
          <h2 className="text-center text-4xl font-black mb-4" style={{ letterSpacing: "-0.02em" }}>{t.problem.h2}</h2>
          <p className="text-center text-white/45 max-w-xl mx-auto mb-14">{t.problem.sub}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {t.problem.stats.map((s) => (
              <div key={s.value} className="card-glass rounded-2xl p-8 text-center">
                <div className="text-5xl font-black gradient-text mb-3">{s.value}</div>
                <p className="text-white/65 text-sm leading-relaxed mb-2">{s.label}</p>
                <p className="text-white/22 text-xs">{s.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">{t.how.label}</p>
          <h2 className="text-center text-4xl font-black mb-16" style={{ letterSpacing: "-0.02em" }}>{t.how.h2}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.how.steps.map((step, i) => (
              <div key={step.n} className="relative flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-violet-300 flex-shrink-0"
                    style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
                    {step.n}
                  </div>
                  {i < t.how.steps.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.3), transparent)" }} />
                  )}
                </div>
                <h3 className="font-bold text-base mb-2 text-white">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 border-t border-white/5" style={{ background: "rgba(124,58,237,0.03)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">{t.testimonials.label}</p>
          <h2 className="text-center text-4xl font-black mb-4" style={{ letterSpacing: "-0.02em" }}>{t.testimonials.h2}</h2>
          <p className="text-center text-white/45 mb-14">{t.testimonials.sub}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((item) => (
              <div key={item.name} className="card-glass rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                    style={{ background: item.color }}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{item.name}</p>
                    <p className="text-xs text-white/40">{item.role}</p>
                  </div>
                  <div className="ml-auto flex-shrink-0"><Stars /></div>
                </div>
                <p className="text-sm text-white/65 leading-relaxed flex-1">&ldquo;{item.text}&rdquo;</p>
                <div className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 self-start"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">{t.features.label}</p>
          <h2 className="text-center text-4xl font-black mb-16" style={{ letterSpacing: "-0.02em" }}>{t.features.h2}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.items.map((f) => (
              <div key={f.title} className="card-glass rounded-2xl p-6 group hover:border-violet-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(124,58,237,0.12)" }}>
                  <f.icon size={20} className="text-violet-400" />
                </div>
                <h3 className="font-bold mb-2 text-white">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mid CTA ── */}
      <section className="py-20 px-6 border-t border-white/5" style={{ background: "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%)" }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-3" style={{ letterSpacing: "-0.02em" }}>{t.midcta.h2}</h2>
          <p className="text-white/45 mb-8">{t.midcta.sub}</p>
          <Link href="/onboarding" className="btn-primary rounded-xl px-8 py-4 font-bold text-white text-base inline-flex items-center gap-2">
            {t.midcta.btn} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">{t.faq.label}</p>
          <h2 className="text-center text-4xl font-black mb-12" style={{ letterSpacing: "-0.02em" }}>{t.faq.h2}</h2>
          <div className="space-y-3">
            {t.faq.items.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 px-6 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.12), transparent)" }} />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-5xl font-black mb-4" style={{ letterSpacing: "-0.03em" }}>{t.cta.h2}</h2>
          <p className="text-white/45 mb-10 text-lg">{t.cta.sub}</p>
          <Link href="/onboarding" className="btn-primary rounded-xl px-10 py-4 font-bold text-white text-base inline-flex items-center gap-2">
            {t.cta.btn} <ArrowRight size={16} />
          </Link>
          <p className="text-white/25 text-sm mt-5">{t.cta.sub2}</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
            <div>
              <span className="font-bold text-sm text-white">ScoreIA</span>
              <p className="text-white/25 text-xs">{t.footer.tagline}</p>
            </div>
          </div>
          <div className="flex gap-6">
            {t.footer.links.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-white/25 hover:text-white/55 transition-colors">{l.label}</a>
            ))}
          </div>
          <p className="text-xs text-white/18">{t.footer.copy}</p>
        </div>
      </footer>
    </div>
  );
}
