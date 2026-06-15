import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type LLMProvider = "openai" | "anthropic" | "gemini" | "perplexity";

export async function queryLLM(provider: LLMProvider, question: string): Promise<string> {
  switch (provider) {
    case "openai": {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: question }],
        max_tokens: 500,
        temperature: 0.3,
      });
      return res.choices[0]?.message?.content ?? "";
    }

    case "anthropic": {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const res = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [{ role: "user", content: question }],
      });
      return res.content[0]?.type === "text" ? res.content[0].text : "";
    }

    case "gemini": {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const res = await model.generateContent(question);
      return res.response.text();
    }

    case "perplexity": {
      // Perplexity utilise l'API OpenAI-compatible avec recherche web en temps réel
      const client = new OpenAI({
        apiKey: process.env.PERPLEXITY_API_KEY,
        baseURL: "https://api.perplexity.ai",
      });
      const res = await client.chat.completions.create({
        model: "sonar",
        messages: [{ role: "user", content: question }],
        max_tokens: 500,
      });
      return res.choices[0]?.message?.content ?? "";
    }

    default:
      return "";
  }
}
