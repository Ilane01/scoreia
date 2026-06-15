import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScoreIA — Ta marque est-elle citée par les IA ?",
  description: "Mesure et améliore ta visibilité dans les IA génératives : ChatGPT, Gemini, Claude, Perplexity. Score gratuit, plan de contenu personnalisé, résultats en 2 minutes.",
  keywords: "score IA, GEO, generative engine optimization, visibilité ChatGPT, référencement IA, optimisation LLM, SEO intelligence artificielle",
  metadataBase: new URL("https://scoreia.fr"),
  openGraph: {
    title: "ScoreIA — Ta marque est-elle citée par les IA ?",
    description: "Score de visibilité IA gratuit en 2 minutes. ChatGPT, Gemini, Claude et Perplexity analysés simultanément.",
    type: "website",
    url: "https://scoreia.fr",
    siteName: "ScoreIA",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScoreIA — Ta marque est-elle citée par les IA ?",
    description: "Score de visibilité IA gratuit en 2 minutes.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
