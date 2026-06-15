"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, LayoutDashboard, PlusCircle } from "lucide-react";

export default function DashboardNav({ email }: { email: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const initials = email.slice(0, 2).toUpperCase();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const links = [
    { href: "/dashboard", label: "Mes marques", icon: LayoutDashboard },
    { href: "/dashboard/brands/new", label: "Ajouter", icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-40" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white tracking-tight"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
            <span className="font-bold text-sm" style={{ color: "var(--text)" }}>ScoreIA</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {links.map((l) => {
              const active = l.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(l.href);
              return (
                <Link key={l.href} href={l.href}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    color: active ? "var(--text)" : "var(--text-2)",
                    background: active ? "rgba(124,58,237,0.15)" : "transparent",
                    fontWeight: active ? 600 : 400,
                  }}>
                  <l.icon size={14} />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>{initials}</div>
            <span className="text-xs" style={{ color: "var(--text-2)" }}>{email}</span>
          </div>
          <button onClick={signOut}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "var(--text-3)" }}
            title="Se déconnecter">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
