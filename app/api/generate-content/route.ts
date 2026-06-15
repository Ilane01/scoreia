import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export type Platform = "wordpress" | "lovable" | "webflow" | "html" | "markdown";

const PLATFORM_INSTRUCTIONS: Record<Platform, string> = {
  wordpress: `Génère le contenu au format WordPress prêt à copier-coller. Structure ta réponse EXACTEMENT ainsi (utilise ces labels exacts) :
TITRE: [titre SEO optimisé, max 60 caractères]
SLUG: [slug URL en kebab-case]
META_DESCRIPTION: [meta description 150-160 caractères]
FOCUS_KEYWORD: [mot-clé principal]
CATEGORIES: [catégorie1, catégorie2]
TAGS: [tag1, tag2, tag3, tag4, tag5]
EXTRAIT: [extrait 2 phrases pour la liste d'articles]
CONTENU:
[Article complet en HTML WordPress avec balises <h2>, <h3>, <p>, <ul>, <li>, <strong>. Minimum 800 mots. Inclure une section FAQ à la fin avec au moins 3 questions/réponses pertinentes.]`,

  lovable: `Génère un prompt optimisé à envoyer directement dans le chat de Lovable.dev pour créer une page article. Structure ta réponse EXACTEMENT ainsi :
TITRE: [titre de l'article]
META_DESCRIPTION: [meta description SEO]
PROMPT_LOVABLE:
[Rédige un prompt en français, naturel et précis, à copier-coller dans le chat Lovable. Le prompt doit demander à Lovable de créer une nouvelle page article/blog avec : le titre exact, le contenu complet de l'article (minimum 600 mots intégrés directement dans le prompt), les sections (intro, 4 parties développées, FAQ avec 3 questions/réponses, conclusion avec CTA). Le prompt doit aussi préciser le style : moderne, épuré, responsive, avec une hero section, des titres h2 stylisés, et un bouton CTA visible. Commence le prompt par "Crée une nouvelle page article dans mon app avec le contenu suivant :"]`,

  webflow: `Génère le contenu pour Webflow CMS. Structure ta réponse EXACTEMENT ainsi :
TITRE: [titre de l'article]
SLUG: [slug URL]
META_TITLE: [meta title SEO]
META_DESCRIPTION: [meta description]
RESUME: [résumé court 2-3 phrases]
CORPS_ARTICLE:
[Article complet en Markdown riche avec ## pour les h2, ### pour les h3. Minimum 800 mots avec sections claires, listes à puces, et section FAQ.]`,

  html: `Génère une page HTML complète et autonome. Structure ta réponse EXACTEMENT ainsi :
META_TITLE: [title tag SEO]
META_DESCRIPTION: [meta description]
CODE_HTML:
[Page HTML5 complète avec <!DOCTYPE html>, <head> avec toutes les meta tags SEO (og:, twitter:, schema.org Article en JSON-LD), et <body> avec article structuré, navigation breadcrumb, et section FAQ avec schema FAQ en JSON-LD. Minimum 800 mots de contenu. Style inline ou <style> tag avec CSS moderne.]`,

  markdown: `Génère un article Markdown complet. Structure ta réponse EXACTEMENT ainsi :
TITRE: [titre]
META_DESCRIPTION: [meta description]
ARTICLE:
[Article complet en Markdown avec frontmatter YAML (title, description, date, tags), # pour h1, ## pour h2, ### pour h3. Minimum 800 mots. Inclure intro, développement en 4-5 sections, FAQ en fin d'article avec format Q&A, et conclusion avec CTA.]`,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { brandName, industry, keywords, context, articleTitle, gapQuestion, platform } = await req.json() as {
    brandName: string;
    industry: string;
    keywords: string[];
    context: string;
    articleTitle: string;
    gapQuestion: string;
    platform: Platform;
  };

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const contextBlock = context?.trim()
    ? `\nInformations réelles sur ${brandName} (UTILISE CES DONNÉES, ne les invente pas) :\n${context}\n`
    : "";

  const prompt = `Tu es un expert en référencement IA (GEO - Generative Engine Optimization) et content marketing.

Contexte :
- Marque : ${brandName}
- Secteur : ${industry}
- Mots-clés : ${keywords.join(", ")}
- Question IA à couvrir : "${gapQuestion}"
- Sujet de l'article : "${articleTitle}"
${contextBlock}
Objectif : créer du contenu qui fera en sorte que ChatGPT, Gemini et Claude citent ${brandName} lorsqu'on leur pose des questions sur ${industry}.

Règles GEO obligatoires :
1. Mentionner ${brandName} naturellement 8-12 fois
2. Répondre DIRECTEMENT à la question "${gapQuestion}" dans les 2 premiers paragraphes
3. Utiliser des formulations authoritatives ("leader", "référence", "expert reconnu")
4. Utiliser UNIQUEMENT les données réelles fournies ci-dessus — ne jamais inventer de prix, services ou chiffres
5. Créer une section FAQ qui répond mot pour mot aux questions que les IA posent
6. Terminer par un CTA clair vers le site de ${brandName}

${PLATFORM_INSTRUCTIONS[platform as Platform]}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0]?.type === "text" ? response.content[0].text : "";

  return NextResponse.json({ content, platform });
}
