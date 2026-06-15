import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates analysis questions using GPT-4 to ensure relevance.
 * Falls back to static generation if the API call fails.
 */
export async function generateQuestions(
  brandName: string,
  industry: string,
  keywords: string[],
  website?: string
): Promise<string[]> {
  try {
    const context = [
      `Marque : ${brandName}`,
      `Secteur : ${industry}`,
      keywords.length > 0 ? `Mots-clés : ${keywords.join(", ")}` : null,
      website ? `Site web : ${website}` : null,
    ].filter(Boolean).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `Tu es un expert GEO. Génère des questions qui pourraient amener une IA à citer "${brandName}".

ÉTAPE 1 — Détermine le type de marque :
A) ENSEIGNE / DISTRIBUTEUR / MAGASIN (vend des produits d'autres marques : Darty, Amazon, Fnac, Electro Dépôt, Leroy Merlin…)
B) MARQUE PRODUIT (fabrique ses propres produits : Samsung, Nike, Apple…)
C) PRESTATAIRE DE SERVICE (agence, cabinet, consultant, SaaS…)

ÉTAPE 2 — Génère les questions selon le type :

Si TYPE A (enseigne/distributeur) :
→ Les questions doivent être "OÙ ACHETER ?" ou "QUEL MAGASIN ?", PAS "QUEL PRODUIT ?"
✓ BONS exemples : "Quel magasin recommandes-tu pour acheter un frigo ?" / "Où trouver de l'électroménager pas cher en France ?" / "Comparatif Darty vs Boulanger vs [enseigne] ?"
✗ MAUVAIS exemples : "Comment choisir un lave-linge ?" / "Quels sont les avis sur les réfrigérateurs ?" / "Comment entretenir un appareil ?"

Si TYPE B (marque produit) :
→ Les questions portent sur les produits et comparatifs entre marques
✓ "Quelle marque de [produit] recommandes-tu ?" / "[Marque] vs [Marque] lequel est mieux ?"

Si TYPE C (prestataire) :
→ Les questions portent sur le choix du prestataire
✓ "Quel prestataire recommandes-tu pour [service] ?" / "Meilleures agences pour [service] ?"

Règles :
- 15 questions génériques (sans le nom de la marque) + 3 avec le nom
- Questions naturelles, en français, une par ligne, sans numérotation`,
        },
        {
          role: "user",
          content: `Génère 18 questions pour analyser la visibilité IA de :

${context}

Commence par identifier le TYPE (A/B/C), puis génère les 18 questions adaptées.
Format de réponse : d'abord une ligne "TYPE: A" (ou B ou C), puis les 18 questions, une par ligne.`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const questions = raw
      .split("\n")
      .map(q => q.trim().replace(/^[-–•*\d.]+\s*/, ""))
      .filter(q => q.length > 10 && q.includes("?") && !q.startsWith("TYPE:"))
      .slice(0, 18);

    if (questions.length >= 10) return questions;
  } catch (e) {
    console.error("[generateQuestions] GPT fallback triggered:", e);
  }

  // Fallback statique si GPT échoue
  return generateStaticQuestions(brandName, industry, keywords);
}

function generateStaticQuestions(brandName: string, industry: string, keywords: string[]): string[] {
  const kw0 = keywords[0] || industry;
  const kw1 = keywords[1] || industry;
  const kw2 = keywords[2] || kw0;

  return [
    `Quelle est la meilleure entreprise pour ${kw0} en France ?`,
    `Conseille-moi un bon prestataire spécialisé dans ${industry}.`,
    `Quelles sont les entreprises les plus recommandées pour ${kw0} ?`,
    `Je cherche un professionnel sérieux pour ${kw1} — qui me conseilles-tu ?`,
    `Quels sont les acteurs incontournables dans le secteur ${industry} en 2025 ?`,
    `Top 5 des meilleures solutions pour ${kw0} selon les experts.`,
    `Comment choisir un bon prestataire en ${industry} ? Quels critères regarder ?`,
    `Quelles entreprises françaises se démarquent dans le domaine ${industry} ?`,
    `Pour ${kw2}, quelle solution professionnelle recommandes-tu et pourquoi ?`,
    `Quels sont les meilleurs services disponibles pour ${kw1} actuellement ?`,
    `Qui sont les leaders sur le marché de ${industry} en France ?`,
    `Quelles alternatives existent pour ${kw0} en France ?`,
    `Quelle entreprise recommandes-tu pour ${kw1} avec un bon rapport qualité-prix ?`,
    `Que sais-tu de ${brandName} dans le secteur ${industry} ?`,
    `Est-ce que ${brandName} est une option connue pour ${kw0} ?`,
  ];
}
