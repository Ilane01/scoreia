"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X, Plus } from "lucide-react";

const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors";
const inputStyle = { background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" };

export default function NewBrandPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [competitors, setCompetitors] = useState<string[]>([""]);
  const [context, setContext] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addKeyword = () => { if (keywords.length < 5) setKeywords([...keywords, ""]); };
  const updateKeyword = (i: number, val: string) => { const u = [...keywords]; u[i] = val; setKeywords(u); };
  const removeKeyword = (i: number) => setKeywords(keywords.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data, error } = await supabase
      .from("brands")
      .insert({ name: name.trim(), website: website.trim(), industry: industry.trim(), keywords: keywords.filter(k => k.trim()), competitors: competitors.filter(c => c.trim()), context: context.trim(), user_id: user.id })
      .select().single();

    if (error) { setError(error.message); setLoading(false); }
    else router.push(`/dashboard/brands/${data.id}`);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Étape 1/2</p>
        <h1 className="text-2xl font-black mb-2" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>Parle-nous de ta marque</h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>Ces informations guident nos questions aux IA. Plus c&apos;est précis, plus le score sera juste.</p>
      </div>

      {error && <p className="text-sm mb-4 rounded-lg px-3 py-2" style={{ color: "#dc2626", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.15)" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>Nom de la marque *</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="ex: Decathlon, MaClinique, MonSaaS..." className={inputCls} style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>
              Site web <span className="font-normal" style={{ color: "var(--text-3)" }}>(optionnel)</span>
            </label>
            <input value={website} onChange={e => setWebsite(e.target.value)} type="url" placeholder="ex: https://monsite.fr" className={inputCls} style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>Secteur d&apos;activité *</label>
            <input value={industry} onChange={e => setIndustry(e.target.value)} required placeholder="ex: e-commerce sport, logiciel comptabilité..." className={inputCls} style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>
              Mots-clés <span className="font-normal" style={{ color: "var(--text-3)" }}>(jusqu&apos;à 5)</span>
            </label>
            <div className="space-y-2">
              {keywords.map((kw, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={kw} onChange={e => updateKeyword(i, e.target.value)} placeholder={`Mot-clé ${i + 1}`} className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors" style={inputStyle} />
                  {keywords.length > 1 && <button type="button" onClick={() => removeKeyword(i)} style={{ color: "var(--text-3)" }}><X size={14} /></button>}
                </div>
              ))}
            </div>
            {keywords.length < 5 && (
              <button type="button" onClick={addKeyword} className="mt-2 flex items-center gap-1.5 text-sm transition-colors" style={{ color: "var(--accent)" }}>
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
                  <input value={c} onChange={e => { const u = [...competitors]; u[i] = e.target.value; setCompetitors(u); }} placeholder={`Concurrent ${i + 1}`} className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors" style={inputStyle} />
                  {competitors.length > 1 && <button type="button" onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))} style={{ color: "var(--text-3)" }}><X size={14} /></button>}
                </div>
              ))}
            </div>
            {competitors.length < 5 && (
              <button type="button" onClick={() => setCompetitors([...competitors, ""])} className="mt-2 flex items-center gap-1.5 text-sm transition-colors" style={{ color: "var(--accent)" }}>
                <Plus size={14} /> Ajouter un concurrent
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>
            Informations clés <span className="font-normal" style={{ color: "var(--text-3)" }}>(optionnel mais recommandé)</span>
          </label>
          <p className="text-xs mb-3" style={{ color: "var(--text-3)" }}>Prix, services, arguments différenciants... Le générateur de contenu utilisera ces données réelles.</p>
          <textarea value={context} onChange={e => setContext(e.target.value)} rows={5}
            placeholder={`ex:\n- Tarifs : à partir de 2 150€ HT\n- Services : création de site, SEO, refonte\n- Argument clé : +40% de leads en moyenne`}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-colors" style={inputStyle} />
        </div>

        <button type="submit" disabled={loading} className="w-full btn-primary rounded-xl py-4 font-bold text-white disabled:opacity-50 text-sm">
          {loading ? "Création en cours…" : "Créer ma marque → Étape suivante"}
        </button>
        <p className="text-center text-xs" style={{ color: "var(--text-3)" }}>Prochaine étape : lancer l&apos;analyse IA (2 minutes)</p>
      </form>
    </div>
  );
}
