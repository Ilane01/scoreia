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
Tu dois générer des questions que de vrais clients tapent dans ChatGPT, Gemini ou Perplexity quand ils cherchent un produit/service dans ce secteur.
Ces questions serviront à tester si la marque "${brandName}" est citée par les IA.

Règles :
- La MAJORITÉ des questions ne doit PAS mentionner le nom de la marque (questions génériques comme un vrai client le ferait)
- Les questions doivent être naturelles, conversationnelles, en français
- Elles doivent couvrir : recommandations, comparatifs, prix, qualité, avis, comment choisir
- Varie les intentions : informationnelles, transactionnelles, comparatives
- Adapte les questions au secteur réel, pas juste aux mots-clés fournis
- Ne génère que les questions, une par ligne, sans numérotation ni tiret`,
        },
        {
          role: "user",
          content: `Génère 18 questions pour analyser la visibilité IA de cette marque :

${context}

Génère 15 questions génériques (sans le nom de la marque) + 3 questions de notoriété (avec le nom de la marque).
Une question par ligne.`,
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
