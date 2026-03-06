-- =============================================
-- BAFF Admin — Supabase Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- NEWS
create table news (
  id uuid default gen_random_uuid() primary key,
  titolo text not null,
  slug text unique not null,
  categoria text not null default 'festival',
  testo text,
  immagine_url text,
  data_pubblicazione date default current_date,
  pubblicato boolean default false,
  created_at timestamptz default now()
);

-- PROGRAMMA
create table programma (
  id uuid default gen_random_uuid() primary key,
  titolo text not null,
  regista text,
  anno smallint,
  durata text,
  sala text,
  data_proiezione date,
  ora time,
  poster_url text,
  sezione text not null default 'concorso-italiano',
  pubblicato boolean default false,
  created_at timestamptz default now()
);

-- OSPITI
create table ospiti (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  foto_url text,
  biografia text,
  ruolo text,
  pubblicato boolean default false,
  created_at timestamptz default now()
);

-- SPONSOR
create table sponsor (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  logo_url text,
  categoria text not null default 'sponsor',
  ordine integer default 0,
  link text,
  pubblicato boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- Row Level Security
-- Public: read only | Admin: via service_role key
-- =============================================

alter table news enable row level security;
alter table programma enable row level security;
alter table ospiti enable row level security;
alter table sponsor enable row level security;

-- Public read policies
create policy "Public read news" on news for select using (true);
create policy "Public read programma" on programma for select using (true);
create policy "Public read ospiti" on ospiti for select using (true);
create policy "Public read sponsor" on sponsor for select using (true);

-- Admin write policies (authenticated via anon key with RLS bypass or service_role)
create policy "Admin insert news" on news for insert with check (true);
create policy "Admin update news" on news for update using (true);
create policy "Admin delete news" on news for delete using (true);

create policy "Admin insert programma" on programma for insert with check (true);
create policy "Admin update programma" on programma for update using (true);
create policy "Admin delete programma" on programma for delete using (true);

create policy "Admin insert ospiti" on ospiti for insert with check (true);
create policy "Admin update ospiti" on ospiti for update using (true);
create policy "Admin delete ospiti" on ospiti for delete using (true);

create policy "Admin insert sponsor" on sponsor for insert with check (true);
create policy "Admin update sponsor" on sponsor for update using (true);
create policy "Admin delete sponsor" on sponsor for delete using (true);

-- =============================================
-- Storage bucket for media uploads
-- =============================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Allow public read access to media bucket
create policy "Public read media" on storage.objects
  for select using (bucket_id = 'media');

-- Allow uploads to media bucket (for admin panel)
create policy "Allow uploads to media" on storage.objects
  for insert with check (bucket_id = 'media');

create policy "Allow updates to media" on storage.objects
  for update using (bucket_id = 'media');

create policy "Allow deletes from media" on storage.objects
  for delete using (bucket_id = 'media');
