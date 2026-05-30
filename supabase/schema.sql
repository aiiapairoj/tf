-- ============================================================
-- TypeFun Kids — Leaderboard schema (Supabase / PostgreSQL)
-- รันใน Supabase Dashboard > SQL Editor
-- ============================================================

create table if not exists public.scores (
  id          bigint generated always as identity primary key,
  name        text    not null check (char_length(name) between 1 and 24),
  lang        text    not null check (lang in ('th','en')),
  level       text    not null check (level in ('easy','medium','hard')),
  mode        text    not null check (mode in ('practice','time','adventure')),
  wpm         integer not null check (wpm between 0 and 400),
  accuracy    real    not null check (accuracy between 0 and 1),
  score       integer not null check (score between 0 and 1000000),
  created_at  timestamptz not null default now()
);

create index if not exists scores_rank_idx on public.scores (score desc);
create index if not exists scores_filter_idx on public.scores (lang, level, score desc);

-- เปิด RLS แล้วอนุญาตให้อ่าน + เพิ่มได้ (เกมสาธารณะ ไม่ต้อง login)
alter table public.scores enable row level security;

drop policy if exists "read scores" on public.scores;
create policy "read scores" on public.scores
  for select using (true);

drop policy if exists "insert scores" on public.scores;
create policy "insert scores" on public.scores
  for insert with check (true);
