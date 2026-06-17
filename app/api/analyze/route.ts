import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQuestions } from "@/lib/llm/questions";
import { queryLLM, type LLMProvider } from "@/lib/llm/providers";
import { analyzeResponse, calculateScore } from "@/lib/llm/analyzer";

const PROVIDERS: LLMProvider[] = ["openai", "anthropic", "gemini", "perplexity"];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { brandId } = await req.json();

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("id", brandId)
    .eq("user_id", user.id)
    .single();

  if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const questions = await generateQuestions(brand.name, brand.industry, brand.keywords ?? [], brand.website ?? undefined, brand.context ?? undefined);

  const analysisRows: object[] = [];
  const scoresByProvider: Record<string, number> = {};

  await Promise.all(
    PROVIDERS.map(async (provider) => {
      const results = await Promise.all(
        questions.map(async (question) => {
          try {
            const response = await queryLLM(provider, question);
            const mention = analyzeResponse(response, brand.name);
            analysisRows.push({
              brand_id: brandId,
              provider,
              question,
              response: response.slice(0, 1000),
              is_mentioned: mention.isMentioned,
              mention_position: mention.position,
              sentiment: mention.sentiment,
              excerpt: mention.excerpt,
            });
            return mention;
          } catch {
            return { isMentioned: false, position: null, sentiment: "neutral" as const, excerpt: null };
          }
        })
      );
      scoresByProvider[provider] = calculateScore(results);
    })
  );

  await supabase.from("analyses").insert(analysisRows);

  const overallScore = Math.round(
    Object.values(scoresByProvider).reduce((a, b) => a + b, 0) / PROVIDERS.length
  );

  const { data: report } = await supabase
    .from("reports")
    .insert({
      brand_id: brandId,
      overall_score: overallScore,
      openai_score: scoresByProvider["openai"] ?? 0,
      anthropic_score: scoresByProvider["anthropic"] ?? 0,
      gemini_score: scoresByProvider["gemini"] ?? 0,
      perplexity_score: scoresByProvider["perplexity"] ?? 0,
    })
    .select()
    .single();

  return NextResponse.json({ report, scoresByProvider, overallScore });
}
