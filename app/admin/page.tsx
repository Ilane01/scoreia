"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, BarChart3, Zap, TrendingUp, ArrowUpRight,
  Activity, Clock, CheckCircle, XCircle, RefreshCw,
  DollarSign, Eye, ArrowLeft,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalBrands: number;
  totalReports: number;
  totalAnalyses: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  signupsPerDay: Record<string, number>;
  recentUsers: {
    id: string; email: string; created_at: string;
    last_sign_in_at: string | null; brands: number; analyses: number; confirmed: boolean;
  }[];
  recentBrands: { id: string; name: string; industry: string; user_id: string; created_at: string }[];
  topReports: { brand_id: string; overall_score: number; created_at: string; brands: { name: string; industry: string } | null }[];
}

function SparkLine({ data }: { data: Record<string, number> }) {
  const values = Object.values(data);
  const max = Math.max(...values, 1);
  const W = 600, H = 80, P = 8;
  const cW = W - P * 2, cH = H - P * 2;
  const n = values.length;
  const pts = values.map((v, i) => ({
    x: P + (i / (n - 1)) * cW,
    y: P + cH - (v / max) * cH,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${d} L${pts[pts.length - 1].x},${H - P} L${pts[0].x},${H - P} Z`;

  const days = Object.keys(data);
  const labels = [0, 7, 14, 21, 29].map((i) => ({
    x: P + (i / (n - 1)) * cW,
    label: days[i]?.slice(5) ?? "",
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full">
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-grad)" />
      <path d={d} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => values[i] > 0 && (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#7c3aed" />
      ))}
      {labels.map((l) => (
        <text key={l.label} x={l.x} y={H + 14} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)">{l.label}</text>
      ))}
    </svg>
  );
}

function KPICard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <ArrowUpRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
      </div>
      <p className="text-3xl font-black text-white mb-1" style={{ letterSpacing: "-0.03em" }}>{value}</p>
      <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{sub}</p>}
    </div>
  );
}

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `il y a ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"overview" | "users" | "brands">("overview");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Forbidden");
      setStats(await res.json());
      setError("");
    } catch {
      setError("Accès refusé ou erreur de chargement.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredUsers = stats?.recentUsers.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="min-h-screen" style={{ background: "#07070d", color: "#f1f5f9" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(124,58,237,0.08), transparent 60%)" }} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>S</div>
            <span className="font-black text-sm text-white">ScoreIA</span>
          </div>
          <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={refreshing}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <RefreshCw size={11} className={refreshing ? "animate-spin" : ""} /> Actualiser
          </button>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}>
            <ArrowLeft size={12} /> Dashboard client
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">

        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-red-400 font-semibold">{error}</p>
          </div>
        )}

        {stats && (
          <>
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {(["overview", "users", "brands"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                  style={{
                    background: tab === t ? "rgba(124,58,237,0.2)" : "transparent",
                    color: tab === t ? "#c4b5fd" : "rgba(255,255,255,0.35)",
                    border: tab === t ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                  }}>
                  {t === "overview" ? "Vue d'ensemble" : t === "users" ? `Utilisateurs (${stats.totalUsers})` : `Marques (${stats.totalBrands})`}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard icon={Users} label="Utilisateurs" value={stats.totalUsers} sub={`+${stats.newUsersThisMonth} ce mois`} color="#a855f7" />
                  <KPICard icon={BarChart3} label="Marques créées" value={stats.totalBrands} sub={`${(stats.totalBrands / Math.max(stats.totalUsers, 1)).toFixed(1)} par user`} color="#3b82f6" />
                  <KPICard icon={Zap} label="Analyses lancées" value={stats.totalReports} sub={`${stats.totalAnalyses} questions posées`} color="#22c55e" />
                  <KPICard icon={DollarSign} label="MRR" value="—" sub="Stripe non connecté" color="#f59e0b" />
                </div>

                {/* Secondary KPIs */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Cette semaine</p>
                    <p className="text-2xl font-black text-white">+{stats.newUsersThisWeek}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>nouveaux inscrits</p>
                  </div>
                  <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Taux d&apos;activation</p>
                    <p className="text-2xl font-black text-white">
                      {stats.totalUsers > 0 ? Math.round((stats.totalBrands / stats.totalUsers) * 100) : 0}%
                    </p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>ont créé une marque</p>
                  </div>
                  <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Analyses / marque</p>
                    <p className="text-2xl font-black text-white">
                      {stats.totalBrands > 0 ? (stats.totalReports / stats.totalBrands).toFixed(1) : "0"}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>analyses en moyenne</p>
                  </div>
                </div>

                {/* Signups chart */}
                <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <TrendingUp size={14} style={{ color: "#a78bfa" }} /> Inscriptions — 30 derniers jours
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa" }}>
                      {stats.newUsersThisMonth} total
                    </span>
                  </div>
                  <SparkLine data={stats.signupsPerDay} />
                </div>

                {/* Recent activity split */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Recent signups */}
                  <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                      <Activity size={13} style={{ color: "#a78bfa" }} /> Dernières inscriptions
                    </h3>
                    <div className="space-y-3">
                      {stats.recentUsers.slice(0, 6).map((u) => (
                        <div key={u.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                              style={{ background: "rgba(124,58,237,0.2)" }}>
                              {u.email?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-white truncate max-w-[160px]">{u.email}</p>
                              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{timeAgo(u.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {u.confirmed
                              ? <CheckCircle size={11} className="text-green-400" />
                              : <XCircle size={11} className="text-red-400/50" />
                            }
                            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{u.brands} marque{u.brands !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setTab("users")} className="mt-4 text-xs flex items-center gap-1" style={{ color: "#a78bfa" }}>
                      Voir tous <ArrowUpRight size={10} />
                    </button>
                  </div>

                  {/* Recent analyses */}
                  <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                      <Zap size={13} style={{ color: "#a78bfa" }} /> Dernières analyses
                    </h3>
                    <div className="space-y-3">
                      {stats.topReports.slice(0, 6).map((r, i) => {
                        const score = r.overall_score;
                        const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
                        return (
                          <div key={i} className="flex items-center justify-between">
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-white truncate max-w-[180px]">{r.brands?.name ?? "—"}</p>
                              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{r.brands?.industry ?? ""} · {timeAgo(r.created_at)}</p>
                            </div>
                            <span className="text-sm font-black flex-shrink-0" style={{ color }}>{score}/100</span>
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={() => setTab("brands")} className="mt-4 text-xs flex items-center gap-1" style={{ color: "#a78bfa" }}>
                      Voir toutes <ArrowUpRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {tab === "users" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un email…"
                    className="rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none w-72"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{filteredUsers.length} résultat{filteredUsers.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Email", "Inscrit", "Dernière co.", "Marques", "Analyses", "Email confirmé"].map((h) => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                style={{ background: "rgba(124,58,237,0.18)" }}>
                                {u.email?.[0]?.toUpperCase() ?? "?"}
                              </div>
                              <span className="font-medium text-white text-xs">{u.email}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {new Date(u.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-5 py-3.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {timeAgo(u.last_sign_in_at)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-white font-semibold">{u.brands}</td>
                          <td className="px-5 py-3.5 text-xs text-white font-semibold">{u.analyses}</td>
                          <td className="px-5 py-3.5">
                            {u.confirmed
                              ? <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle size={11} /> Oui</span>
                              : <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(239,68,68,0.6)" }}><XCircle size={11} /> Non</span>
                            }
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Aucun utilisateur trouvé</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── BRANDS ── */}
            {tab === "brands" && (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Marque", "Secteur", "Dernière analyse", "Score", ""].map((h) => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topReports.map((r, i) => {
                        const score = r.overall_score;
                        const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
                        return (
                          <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                            <td className="px-5 py-3.5 text-xs font-semibold text-white">{r.brands?.name ?? "—"}</td>
                            <td className="px-5 py-3.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{r.brands?.industry ?? "—"}</td>
                            <td className="px-5 py-3.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                              <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(r.created_at)}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-sm font-black" style={{ color }}>{score}/100</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <Link href={`/dashboard/brands/${r.brand_id}`}
                                className="flex items-center gap-1 text-xs transition-colors" style={{ color: "#a78bfa" }}>
                                <Eye size={11} /> Voir
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                      {stats.topReports.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Aucune analyse encore</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Revenue placeholder */}
                <div className="rounded-2xl p-6 mt-6" style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={14} style={{ color: "#f59e0b" }} />
                    <h3 className="text-sm font-bold" style={{ color: "#f59e0b" }}>Revenus — Stripe non connecté</h3>
                  </div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Connecte Stripe pour voir MRR, ARR, churn, paiements en attente et historique de transactions ici.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
