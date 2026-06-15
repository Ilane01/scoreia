import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "ilaneboucobza@gmail.com";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  const [
    { data: usersData },
    { count: brandsCount },
    { count: reportsCount },
    { count: analysesCount },
    { data: recentBrands },
    { data: topBrands },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 500 }),
    admin.from("brands").select("*", { count: "exact", head: true }),
    admin.from("reports").select("*", { count: "exact", head: true }),
    admin.from("analyses").select("*", { count: "exact", head: true }),
    admin.from("brands").select("id, name, industry, user_id, created_at").order("created_at", { ascending: false }).limit(5),
    admin.from("reports").select("brand_id, overall_score, created_at, brands(name, industry, user_id)").order("created_at", { ascending: false }).limit(10),
  ]);

  const users = usersData?.users ?? [];

  // Signups per day over last 30 days
  const now = new Date();
  const signupsPerDay: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    signupsPerDay[d.toISOString().slice(0, 10)] = 0;
  }
  users.forEach((u) => {
    const day = u.created_at?.slice(0, 10);
    if (day && signupsPerDay[day] !== undefined) signupsPerDay[day]++;
  });

  // Users with brand/report counts
  const { data: brandCounts } = await admin
    .from("brands")
    .select("user_id");

  const { data: reportCounts } = await admin
    .from("reports")
    .select("brand_id, brands(user_id)");

  const brandsByUser: Record<string, number> = {};
  brandCounts?.forEach((b) => {
    brandsByUser[b.user_id] = (brandsByUser[b.user_id] ?? 0) + 1;
  });

  const reportsByUser: Record<string, number> = {};
  reportCounts?.forEach((r) => {
    const uid = (r.brands as unknown as { user_id: string } | null)?.user_id;
    if (uid) reportsByUser[uid] = (reportsByUser[uid] ?? 0) + 1;
  });

  const enrichedUsers = users
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50)
    .map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      brands: brandsByUser[u.id] ?? 0,
      analyses: reportsByUser[u.id] ?? 0,
      confirmed: !!u.email_confirmed_at,
    }));

  return NextResponse.json({
    totalUsers: users.length,
    totalBrands: brandsCount ?? 0,
    totalReports: reportsCount ?? 0,
    totalAnalyses: analysesCount ?? 0,
    newUsersThisWeek: users.filter((u) => {
      const d = new Date(u.created_at);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      return d > weekAgo;
    }).length,
    newUsersThisMonth: users.filter((u) => {
      const d = new Date(u.created_at);
      const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
      return d > monthAgo;
    }).length,
    signupsPerDay,
    recentUsers: enrichedUsers,
    recentBrands,
    topReports: topBrands,
  });
}
