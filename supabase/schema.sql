-- RADIO ASTRAËL: run ONCE in a new Supabase project's SQL Editor.
-- This setup is independent of Artemius Radio and of any other Supabase project.
-- Read README.md before executing. Never put secret/service_role keys in GitHub.

create extension if not exists pgcrypto;

create table public.radio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.radio_admins enable row level security;
revoke all on table public.radio_admins from anon, authenticated;
grant select on table public.radio_admins to authenticated;
create policy "Members may view only their own administrator record"
on public.radio_admins for select to authenticated
using (user_id = (select auth.uid()));

create table public.radio_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  artist text not null default 'Astraël',
  genre text not null default 'Progressive / Trance',
  source_type text not null check (source_type in ('mixcloud', 'audio')),
  mixcloud_url text,
  audio_path text,
  cover_url text,
  cover_path text,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  is_published boolean not null default false,
  sort_order integer not null default 0,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (
    (source_type = 'mixcloud' and mixcloud_url like 'https://%' and audio_path is null)
    or (source_type = 'audio' and audio_path is not null and mixcloud_url is null)
  )
);
create index radio_tracks_public_order_idx
  on public.radio_tracks (is_published, sort_order, created_at desc);
alter table public.radio_tracks enable row level security;
revoke all on table public.radio_tracks from anon, authenticated;
grant select on table public.radio_tracks to anon;
grant select, insert, update, delete on table public.radio_tracks to authenticated;

create policy "Visitors can read only published tracks"
on public.radio_tracks for select to anon
using (is_published = true);

create policy "Signed in users see published tracks; admins see drafts"
on public.radio_tracks for select to authenticated
using (
  is_published = true
  or exists (select 1 from public.radio_admins a where a.user_id = (select auth.uid()))
);

create policy "Only admins can add tracks"
on public.radio_tracks for insert to authenticated
with check (
  uploaded_by = (select auth.uid())
  and exists (select 1 from public.radio_admins a where a.user_id = (select auth.uid()))
);

create policy "Only admins can modify tracks"
on public.radio_tracks for update to authenticated
using (exists (select 1 from public.radio_admins a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.radio_admins a where a.user_id = (select auth.uid())));

create policy "Only admins can remove tracks"
on public.radio_tracks for delete to authenticated
using (exists (select 1 from public.radio_admins a where a.user_id = (select auth.uid())));

-- Public buckets are intentional: anyone with a direct uploaded audio link can play it,
-- including draft files. Do not upload private or unlicensed recordings here.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('astrael-audio', 'astrael-audio', true, 52428800, array['audio/mpeg']),
  ('astrael-covers', 'astrael-covers', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "Anyone can view Astrael audio"
on storage.objects for select to anon, authenticated
using (bucket_id = 'astrael-audio');

create policy "Anyone can view Astrael covers"
on storage.objects for select to anon, authenticated
using (bucket_id = 'astrael-covers');

create policy "Only admins can upload Astrael assets"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('astrael-audio', 'astrael-covers')
  and exists (select 1 from public.radio_admins a where a.user_id = (select auth.uid()))
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Only admins can delete their Astrael assets"
on storage.objects for delete to authenticated
using (
  bucket_id in ('astrael-audio', 'astrael-covers')
  and exists (select 1 from public.radio_admins a where a.user_id = (select auth.uid()))
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Create the user first in Supabase Authentication > Users, then grant admin:
-- insert into public.radio_admins (user_id)
-- values ('PASTE-YOUR-SUPABASE-AUTH-USER-UUID-HERE');
