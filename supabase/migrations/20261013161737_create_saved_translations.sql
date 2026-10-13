-- Applied to Supabase project "btech-xlit" (ref dodmmmgdexqzrhjrnlbf).
-- Public feed of transliterations saved from the frontend: anyone can read and add,
-- nobody can edit or delete through the Data API.

create table public.saved_translations (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  direction text not null check (direction in ('en2indic', 'indic2en')),
  lang text not null check (lang ~ '^[a-z]{2,3}$'),
  source text not null check (char_length(source) between 1 and 2000),
  output text not null check (char_length(output) between 1 and 4000)
);

comment on table public.saved_translations is 'Public feed of transliterations saved from the Lipi frontend.';

create index saved_translations_created_at_idx on public.saved_translations (created_at desc);

alter table public.saved_translations enable row level security;

-- Shared public feed: anyone may read and add; nobody may edit or delete via the API.
revoke all on table public.saved_translations from anon, authenticated;
grant select on table public.saved_translations to anon, authenticated;
-- Column-level insert grant: clients cannot set id or created_at.
grant insert (direction, lang, source, output) on table public.saved_translations to anon, authenticated;

create policy "Anyone can read saved translations"
  on public.saved_translations for select
  to anon, authenticated
  using (true);

create policy "Anyone can save a translation"
  on public.saved_translations for insert
  to anon, authenticated
  with check (true);
