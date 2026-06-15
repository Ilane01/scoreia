export interface MentionResult {
  isMentioned: boolean;
  position: number | null; // 1 = first mention, 2 = second, etc.
  sentiment: "positive" | "neutral" | "negative";
  excerpt: string | null;
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function brandVariants(name: string): string[] {
  const base = normalize(name);
  return [
    base,
    base.replace(/\s+/g, ""),       // "electrodepot"
    base.replace(/\s+/g, "-"),      // "electro-depot"
    base.replace(/\s+/g, "_"),      // "electro_depot"
  ].filter((v, i, a) => a.indexOf(v) === i);
}

export function analyzeResponse(response: string, brandName: string): MentionResult {
  const normResponse = normalize(response);
  const variants = brandVariants(brandName);

  const matchedVariant = variants.find(v => normResponse.includes(v));

  if (!matchedVariant) {
    return { isMentioned: false, position: null, sentiment: "neutral", excerpt: null };
  }

  // Find position using original response (for excerpt quality)
  const sentences = response.split(/[.!?]\s+/);
  let position = 0;
  let excerpt = null;
  for (let i = 0; i < sentences.length; i++) {
    if (variants.some(v => normalize(sentences[i]).includes(v))) {
      position = i + 1;
      excerpt = sentences[i].trim().slice(0, 150);
      break;
    }
  }

  // Simple sentiment detection
  const positiveWords = ["excellent", "recommand", "leader", "référence", "meilleur", "top", "incontournable", "reconnu", "qualit", "innovant", "performant"];
  const negativeWords = ["mauvais", "éviter", "problème", "défaut", "limite", "critiqué", "controvers"];

  const surrounding = normalize(sentences.slice(Math.max(0, position - 2), position + 2).join(" "));
  const hasPositive = positiveWords.some((w) => surrounding.includes(w));
  const hasNegative = negativeWords.some((w) => surrounding.includes(w));

  const sentiment = hasNegative ? "negative" : hasPositive ? "positive" : "neutral";

  return { isMentioned: true, position, sentiment, excerpt };
}

export function calculateScore(results: MentionResult[]): number {
  if (results.length === 0) return 0;

  let score = 0;
  const mentionRate = results.filter((r) => r.isMentioned).length / results.length;
  score += mentionRate * 70; // 70% du score = taux de mention

  // Bonus position (mention tôt = meilleur)
  const mentionedWithPosition = results.filter((r) => r.isMentioned && r.position !== null);
  if (mentionedWithPosition.length > 0) {
    const avgPosition = mentionedWithPosition.reduce((s, r) => s + (r.position ?? 3), 0) / mentionedWithPosition.length;
    const positionBonus = Math.max(0, 20 - (avgPosition - 1) * 5); // max 20pts si position 1
    score += positionBonus;
  }

  // Bonus sentiment
  const positiveCount = results.filter((r) => r.sentiment === "positive").length;
  const negativeCount = results.filter((r) => r.sentiment === "negative").length;
  score += positiveCount * 1.5;
  score -= negativeCount * 2;

  return Math.min(100, Math.max(0, Math.round(score)));
}
