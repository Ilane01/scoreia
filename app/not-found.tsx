import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center" style={{ background: "#07070d" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(124,58,237,0.1), transparent 60%)" }} />
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <Search size={24} style={{ color: "#a78bfa" }} />
        </div>
        <p className="text-7xl font-black text-white mb-4" style={{ letterSpacing: "-0.04em" }}>404</p>
        <h1 className="text-xl font-bold text-white mb-3">Page introuvable</h1>
        <p className="text-sm mb-8 max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 transition-all"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd" }}>
            <ArrowLeft size={14} /> Accueil
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold rounded-xl px-5 py-2.5 text-white btn-primary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
