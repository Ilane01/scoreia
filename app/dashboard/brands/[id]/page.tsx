import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnalysisView from "@/components/AnalysisView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BrandPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!brand) redirect("/dashboard");

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("brand_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch all analyses from latest run (mentioned + not mentioned)
  const { data: allAnalyses } = await supabase
    .from("analyses")
    .select("*")
    .eq("brand_id", id)
    .order("created_at", { ascending: false })
    .limit(40);

  const { data: publishedArticles } = await supabase
    .from("published_articles")
    .select("*")
    .eq("brand_id", id)
    .order("published_at", { ascending: false });

  const mentions = (allAnalyses ?? []).filter((a) => a.is_mentioned);
  const gaps = (allAnalyses ?? []).filter((a) => !a.is_mentioned);

  const userCreatedAt = user.created_at ?? new Date().toISOString();

  return <AnalysisView brand={brand} reports={reports ?? []} mentions={mentions} gaps={gaps} initialPublishedArticles={publishedArticles ?? []} userCreatedAt={userCreatedAt} />;
}
