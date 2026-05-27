create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp text,
  attending boolean not null,
  companions_count integer not null default 0 check (companions_count >= 0),
  companions_names text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.gifts (
  id text primary key,
  name text not null,
  description text not null,
  price_cents integer check (price_cents is null or price_cents >= 1000),
  emoji text,
  allow_custom_amount boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  external_reference uuid not null unique,
  mercado_pago_payment_id text,
  guest_name text not null,
  gift_id text references public.gifts(id),
  gift_name text not null,
  amount_cents integer not null check (amount_cents >= 1000),
  status text not null default 'pending',
  payment_method text,
  paid_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
alter table public.gifts enable row level security;
alter table public.payments enable row level security;
alter table public.admins enable row level security;

grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;

alter default privileges in schema public grant all privileges on tables to service_role;
alter default privileges in schema public grant all privileges on sequences to service_role;

create index if not exists rsvps_attending_idx on public.rsvps(attending);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists payments_external_reference_idx on public.payments(external_reference);

insert into public.gifts (id, name, description, price_cents, emoji, allow_custom_amount, sort_order)
values
  ('lua-de-mel', 'Cota Lua de Mel', 'Contribua para a viagem dos nossos sonhos.', 20000, '✈', false, 1),
  ('jantar-romantico', 'Jantar Romantico', 'Um jantar especial para dois no destino da lua de mel.', 15000, '♡', false, 2),
  ('moveis', 'Ajuda para Moveis', 'Ajude a mobiliar e decorar nosso primeiro lar.', 35000, '⌂', false, 3),
  ('passeio', 'Passeio na Viagem', 'Patrocine uma experiencia especial na nossa viagem.', 25000, '✦', false, 4),
  ('enxoval', 'Enxoval & Cama', 'Contribua para o enxoval elegante do nosso novo lar.', 18000, '❀', false, 5),
  ('contribuicao-livre', 'Contribuicao Livre', 'Qualquer valor e muito bem-vindo e apreciado de coracao.', null, '♥', true, 6)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  emoji = excluded.emoji,
  allow_custom_amount = excluded.allow_custom_amount,
  sort_order = excluded.sort_order;
