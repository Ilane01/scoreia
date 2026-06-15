import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#07070d", color: "#f1f5f9" }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <ArrowLeft size={13} /> Retour à l&apos;accueil
        </Link>
        <div className="prose prose-invert prose-sm max-w-none"
          style={{ "--tw-prose-body": "rgba(255,255,255,0.6)", "--tw-prose-headings": "#fff" } as React.CSSProperties}>
          {children}
        </div>
        <div className="mt-16 pt-8 flex gap-6 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
          <Link href="/legal" className="hover:text-white/50 transition-colors">Mentions légales</Link>
          <Link href="/legal/cgu" className="hover:text-white/50 transition-colors">CGU</Link>
          <Link href="/legal/privacy" className="hover:text-white/50 transition-colors">Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}
