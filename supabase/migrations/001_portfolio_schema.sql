-- Portfolio backend schema for Supabase
-- Run in Supabase Dashboard → SQL Editor, or via Supabase CLI: supabase db push

create extension if not exists "pgcrypto";

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists newsletter_subscribers_active_idx
  on public.newsletter_subscribers (email)
  where unsubscribed_at is null;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;

-- API routes use the service role key; no public table policies are required.
