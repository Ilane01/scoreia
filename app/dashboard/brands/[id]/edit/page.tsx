"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditBrandPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [competitors, setCompetitors] = useState<string[]>([""]);
  const [context, setContext] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("brands").select("*").eq("id", id).single();
      if (data) {
        setName(data.name ?? "");
        setWebsite(data.website ?? "");
        setIndustry(data.industry ?? "");
        setKeywords(data.keywords?.length ? data.keywords : [""]);
        setCompetitors(data.competitors?.length ? data.competitors : [""]);
        setContext(data.context ?? "");
      }
      setFetching(false);
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase
      .from("brands")
      .update({
        name: name.trim(),
        website: website.trim(),
        industry: industry.trim(),
        keywords: keywords.filter((k) => k.trim()),
        competitors: competitors.filter((c) => c.trim()),
        context: context.trim(),
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/dashboard/brands/${id}`);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <Link href={`/dashboard/brands/${id}`}
          className="inline-flex items-center gap-1.5 text-sm mb-5 transition-colors"
          style={{ color: "var(--text-3)" }}>
          <ArrowLeft size={13} /> Retour à la marque
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Modifier la marque</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Les modifications s&apos;appliqueront à la prochaine analyse.</p>
      </div>

      {error && <p className="text-red-400 text-sm mb-4 rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>Nom de la marque *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="ex: Decathlon, MaClinique, MonSaaS..."
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>
              Site web <span className="font-normal" style={{ color: "var(--text-3)" }}>(optionnel)</span>
            </label>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              type="url"
              placeholder="https://monsite.fr"
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>Secteur d&apos;activité *</label>
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
              placeholder="ex: e-commerce sport, logiciel comptabilité..."
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>
              Mots-clés <span className="font-normal" style={{ color: "var(--text-3)" }}>(jusqu&apos;à 5)</span>
            </label>
            <div className="space-y-2">
              {keywords.map((kw, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={kw}
                    onChange={(e) => {
                      const updated = [...keywords];
                      updated[i] = e.target.value;
                      setKeywords(updated);
                    }}
                    placeholder={`Mot-clé ${i + 1}`}
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                  {keywords.length > 1 && (
                    <button type="button" onClick={() => setKeywords(keywords.filter((_, idx) => idx !== i))}
                      className="transition-colors" style={{ color: "var(--text-3)" }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {keywords.length < 5 && (
              <button type="button" onClick={() => setKeywords([...keywords, ""])}
                className="mt-2 flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                <Plus size={14} /> Ajouter un mot-clé
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>
              Concurrents <span className="font-normal" style={{ color: "var(--text-3)" }}>(jusqu&apos;à 5)</span>
            </label>
            <p className="text-xs mb-2" style={{ color: "var(--text-3)" }}>On vérifiera si les IA les citent à votre place.</p>
            <div className="space-y-2">
              {competitors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={c}
                    onChange={(e) => {
                      const updated = [...competitors];
                      updated[i] = e.target.value;
                      setCompetitors(updated);
                    }}
                    placeholder={`Concurrent ${i + 1}`}
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                  {competitors.length > 1 && (
                    <button type="button" onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))}
                      className="transition-colors" style={{ color: "var(--text-3)" }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {competitors.length < 5 && (
              <button type="button" onClick={() => setCompetitors([...competitors, ""])}
                className="mt-2 flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                <Plus size={14} /> Ajouter un concurrent
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>
            Description de votre activité
            <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: "rgba(124,58,237,0.1)", color: "var(--accent)" }}>Impact direct sur le score</span>
          </label>
          <p className="text-xs mb-3" style={{ color: "var(--text-3)" }}>
            Décrivez précisément ce que vous faites, vos spécialités, vos certifications — l'IA génère des questions <strong style={{ color: "var(--text-2)" }}>beaucoup plus pertinentes</strong> avec ce contexte. Ex : "Organisme de formation spécialisé dans les certifications RGE, QualiPAC, Qualibat pour artisans BTP".
          </p>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={5}
            placeholder={`ex: Organisme de formation spécialisé dans les certifications RGE (QualiPAC, Qualibat, QualiPV) pour artisans et installateurs BTP en Île-de-France. Formations inter et intra entreprise.`}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-colors"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        <div className="flex gap-3">
          <Link href={`/dashboard/brands/${id}`}
            className="flex-1 rounded-xl py-3 text-sm font-medium text-center transition-colors"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
            Annuler
          </Link>
          <button type="submit" disabled={loading}
            className="flex-2 btn-primary rounded-xl py-3 px-8 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? "Enregistrement..." : "Enregistrer les modifications →"}
          </button>
        </div>
      </form>
    </div>
  );
}
