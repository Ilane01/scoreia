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
          content: `Tu es un expert en GEO (Generative Engine Optimization).

Ta mission : générer 18 questions que de vrais clients tapent dans ChatGPT, Gemini ou Perplexity — des questions qui pourraient amener l'IA à citer "${brandName}".

IMPORTANT : Utilise ta connaissance réelle de cette marque/entreprise pour générer des questions précises et pertinentes. Ne devine pas ce qu'elle vend — tu le sais déjà si c'est une marque connue.

Règles :
- Les questions doivent correspondre exactement à ce que vend ou fait réellement cette marque
- 15 questions génériques (sans citer le nom de la marque) + 3 questions de notoriété (avec le nom)
- Questions naturelles, conversationnelles, en français
- Une question par ligne, sans numérotation ni tiret`,
        },
        {
          role: "user",
          content: `Génère 18 questions pour analyser la visibilité IA de :

${context}

Consigne : base-toi sur ce que cette marque vend/fait RÉELLEMENT (utilise ta connaissance du monde).
15 questions génériques + 3 avec le nom de la marque. Une par ligne.`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const questions = raw
      .split("\n")
      .map(q => q.trim().replace(/^[-–•*\d.]+\s*/, ""))
      .filter(q => q.length > 10 && q.includes("?"))
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
