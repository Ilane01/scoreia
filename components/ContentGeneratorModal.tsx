"use client";

import { useState } from "react";
import { X, Copy, Check, Loader2, Wand2, ChevronDown, ChevronUp, ExternalLink, BookCheck } from "lucide-react";
import type { Platform } from "@/app/api/generate-content/route";

const PLATFORMS: { id: Platform; label: string; icon: string; desc: string }[] = [
  { id: "wordpress", label: "WordPress", icon: "🔵", desc: "HTML + Yoast SEO" },
  { id: "lovable", label: "Lovable", icon: "💜", desc: "Prompt IA prêt à envoyer" },
  { id: "webflow", label: "Webflow", icon: "🟣", desc: "Champs CMS" },
  { id: "html", label: "HTML", icon: "🟠", desc: "Page complète + schema.org" },
  { id: "markdown", label: "Markdown", icon: "⬛", desc: "Frontmatter YAML" },
];

interface Props {
  brandId: string;
  brandName: string;
  industry: string;
  keywords: string[];
  context: string;
  articleTitle: string;
  gapQuestion: string;
  onClose: () => void;
  onPublished?: () => void;
}

function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors shrink-0">
      {copied ? <><Check size={11} className="text-green-400" /><span className="text-green-400">Copié !</span></> : <><Copy size={11} />{label}</>}
    </button>
  );
}

function SectionBlock({ label, value }: { label: string; value: string }) {
  const isLong = value.length > 300;
  const [expanded, setExpanded] = useState(!isLong);

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden bg-black/20">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/3 border-b border-white/5">
        <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
          <CopyButton text={value} />
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="text-white/30 hover:text-white/60">
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          )}
        </div>
      </div>
      <div className={`px-4 py-3 transition-all ${!expanded ? "max-h-20 overflow-hidden" : "max-h-72 overflow-y-auto"}`}>
        <pre className="text-xs text-white/65 whitespace-pre-wrap font-mono leading-relaxed break-words">{value}</pre>
      </div>
      {isLong && !expanded && (
        <button onClick={() => setExpanded(true)} className="w-full text-xs text-violet-400 hover:text-violet-300 py-2 border-t border-white/5 bg-white/2 transition-colors">
          Voir tout le contenu ↓
        </button>
      )}
    </div>
  );
}

function LovableActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const copyAndOpen = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.open("https://lovable.dev", "_blank");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 space-y-3">
      <p className="text-xs font-semibold text-violet-300">Comment utiliser dans Lovable :</p>
      <div className="space-y-2">
        {["Le prompt est prêt dans votre presse-papiers", "Lovable s'ouvre dans un nouvel onglet", "Collez avec ⌘V dans le chat Lovable"].map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-4 h-4 rounded-full bg-violet-500/30 text-violet-300 flex items-center justify-center font-bold shrink-0">{i + 1}</span>
            {step}
          </div>
        ))}
      </div>
      <button
        onClick={copyAndOpen}
        className="w-full btn-primary rounded-xl py-3 font-semibold text-white text-sm flex items-center justify-center gap-2"
      >
        {copied
          ? <><Check size={14} /> Prompt copié — Lovable ouvert !</>
          : <><ExternalLink size={14} /> Copier le prompt et ouvrir Lovable</>}
      </button>
    </div>
  );
}

function parseSections(content: string): { label: string; value: string }[] {
  const knownLabels = ["TITRE", "SLUG", "META_DESCRIPTION", "META_TITLE", "FOCUS_KEYWORD",
    "CATEGORIES", "TAGS", "EXTRAIT", "RESUME", "CONTENU", "CORPS_ARTICLE",
    "CODE_HTML", "ARTICLE", "COMPOSANT", "PROMPT_LOVABLE"];

  const sections: { label: string; value: string }[] = [];
  const lines = content.split("\n");
  let currentLabel = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const matchedLabel = knownLabels.find((l) => line.startsWith(`${l}:`));
    if (matchedLabel) {
      if (currentLabel) sections.push({ label: currentLabel, value: currentLines.join("\n").trim() });
      currentLabel = matchedLabel;
      currentLines = [line.slice(matchedLabel.length + 1).trim()];
    } else if (currentLabel) {
      currentLines.push(line);
    }
  }
  if (currentLabel) sections.push({ label: currentLabel, value: currentLines.join("\n").trim() });
  return sections.filter((s) => s.value.length > 0);
}

export default function ContentGeneratorModal({ brandId, brandName, industry, keywords, context, articleTitle, gapQuestion, onClose, onPublished }: Props) {
  const [platform, setPlatform] = useState<Platform>("wordpress");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const markPublished = async () => {
    setPublishing(true);
    try {
      await fetch("/api/publish-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, articleTitle, platform }),
      });
      setPublished(true);
      onPublished?.();
    } finally {
      setPublishing(false);
    }
  };

  const generate = async () => {
    setLoading(true);
    setContent("");
    setGenerated(false);
    setPublished(false);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, industry, keywords, context, articleTitle, gapQuestion, platform }),
      });
      const data = await res.json();
      setContent(data.content ?? "");
      setGenerated(true);
    } catch {
      setContent("Erreur lors de la génération.");
      setGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  const sections = generated && content ? parseSections(content) : [];
  const lovableContent = sections.find((s) => s.label === "PROMPT_LOVABLE")?.value ?? content;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="w-full sm:max-w-2xl flex flex-col rounded-t-2xl sm:rounded-2xl border border-white/10 overflow-hidden" style={{ background: "#0f0f1a", maxHeight: "92vh" }}>

        {/* Header — fixe */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shrink-0">
              <Wand2 size={13} className="text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-white text-sm">Générateur de contenu GEO</h2>
              <p className="text-white/30 text-xs truncate">{articleTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors ml-3 shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Platform selector */}
          <div>
            <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-2.5">Plateforme</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p.id} onClick={() => { setPlatform(p.id); setContent(""); setGenerated(false); }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium border transition-all ${
                    platform === p.id ? "border-violet-500/60 bg-violet-500/15 text-white" : "border-white/8 bg-white/3 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}>
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-white/25 mt-1.5">{PLATFORMS.find(p => p.id === platform)?.desc}</p>
          </div>

          {/* Question ciblée */}
          <div className="bg-white/3 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-white/30 mb-0.5">Question IA ciblée</p>
            <p className="text-xs text-white/60 italic">&ldquo;{gapQuestion}&rdquo;</p>
          </div>

          {/* Résultat généré */}
          {generated && sections.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-green-400 flex items-center gap-1.5">
                  <Check size={12} /> Contenu prêt
                </p>
                <CopyButton text={content} label="Tout copier" />
              </div>

              {platform === "lovable" ? (
                <div className="space-y-3">
                  {sections.map((s, i) => <SectionBlock key={i} label={s.label} value={s.value} />)}
                  <LovableActions content={lovableContent} />
                </div>
              ) : (
                <div className="space-y-3">
                  {sections.map((s, i) => <SectionBlock key={i} label={s.label} value={s.value} />)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer — bouton génération fixe en bas */}
        {!generated && (
          <div className="shrink-0 px-5 py-4 border-t border-white/5 bg-black/20">
            <button onClick={generate} disabled={loading}
              className="w-full btn-primary rounded-xl py-3 font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 text-sm">
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Génération en cours (~15 sec)...</>
                : <><Wand2 size={15} /> Générer pour {PLATFORMS.find(p => p.id === platform)?.label}</>}
            </button>
          </div>
        )}

        {generated && (
          <div className="shrink-0 px-5 py-3 border-t border-white/5 bg-black/20 space-y-2">
            <button
              onClick={markPublished}
              disabled={published || publishing}
              className={`w-full rounded-xl py-2.5 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                published
                  ? "bg-green-500/15 border border-green-500/30 text-green-400 cursor-default"
                  : "bg-white/5 border border-white/10 hover:border-green-500/40 hover:bg-green-500/10 text-white/60 hover:text-green-400"
              }`}
            >
              {published
                ? <><Check size={14} /> Article marqué comme publié</>
                : publishing
                ? <><Loader2 size={14} className="animate-spin" /> Enregistrement...</>
                : <><BookCheck size={14} /> J&apos;ai publié cet article</>}
            </button>
            <div className="flex justify-between items-center">
              <button onClick={() => { setContent(""); setGenerated(false); setPublished(false); }}
                className="text-xs text-white/30 hover:text-white/60 transition-colors">
                ↺ Régénérer
              </button>
              <button onClick={onClose} className="text-xs bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2 text-white/60 hover:text-white transition-all">
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
