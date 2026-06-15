-- Brands
create table brands (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  industry text not null,
  keywords text[] default '{}',
  created_at timestamptz default now()
);
alter table brands enable row level security;
create policy "Users see own brands" on brands for all using (auth.uid() = user_id);

-- Analyses (individual LLM query results)
create table analyses (
  id uuid default gen_random_uuid() primary key,
  brand_id uuid references brands on delete cascade not null,
  provider text not null,
  question text not null,
  response text,
  is_mentioned boolean default false,
  mention_position int,
  sentiment text default 'neutral',
  excerpt text,
  created_at timestamptz default now()
);
alter table analyses enable row level security;
create policy "Users see own analyses" on analyses for all
  using (exists (select 1 from brands where brands.id = analyses.brand_id and brands.user_id = auth.uid()));

-- Reports (aggregated scores per analysis run)
create table reports (
  id uuid default gen_random_uuid() primary key,
  brand_id uuid references brands on delete cascade not null,
  overall_score int not null,
  openai_score int default 0,
  anthropic_score int default 0,
  gemini_score int default 0,
  created_at timestamptz default now()
);
alter table reports enable row level security;
create policy "Users see own reports" on reports for all
  using (exists (select 1 from brands where brands.id = reports.brand_id and brands.user_id = auth.uid()));
