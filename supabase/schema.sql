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

update public.gifts set active = false;

insert into public.gifts (id, name, description, price_cents, emoji, allow_custom_amount, active, sort_order)
values
  ('contribuicao-livre', 'Contribuição Livre', 'Escolha o valor que desejar para nos ajudar nesse novo começo.', null, '+', true, true, 1),
  ('lua-de-mel', 'Cota Lua de Mel', 'Contribua para a viagem dos nossos sonhos.', 20000, 'LM', false, true, 2),
  ('geladeira', 'Geladeira', 'Ajude a completar nossa cozinha com esse item essencial.', 250000, 'GE', false, true, 3),
  ('filtro-de-agua', 'Filtro de Água', 'Para deixar nossa rotina mais prática e saudável.', 25000, 'FA', false, true, 4),
  ('aspirador-de-po', 'Aspirador de Pó', 'Uma ajuda bem-vinda para manter nosso lar sempre em ordem.', 35000, 'AP', false, true, 5),
  ('jogo-de-cama', 'Jogo de Cama', 'Para deixar nosso quarto mais aconchegante.', 22000, 'JC', false, true, 6),
  ('jogo-de-toalhas', 'Jogo de Toalhas de Banho', 'Um carinho para o enxoval do nosso novo lar.', 18000, 'JT', false, true, 7),
  ('batedeira', 'Batedeira', 'Para preparar receitas especiais na nossa cozinha.', 28000, 'BT', false, true, 8),
  ('panela-eletrica', 'Panela Elétrica', 'Mais praticidade para os almoços e jantares a dois.', 30000, 'PE', false, true, 9),
  ('grill', 'Grill', 'Para refeições rápidas, práticas e gostosas.', 22000, 'GR', false, true, 10),
  ('chaleira-eletrica', 'Chaleira Elétrica', 'Para café, chá e momentos tranquilos em casa.', 16000, 'CE', false, true, 11),
  ('casinha-pra-mel', 'Casinha pra Mel', 'Um cantinho especial e confortável para a Mel.', 30000, 'CM', false, true, 12),
  ('ferro-de-passar', 'Ferro de Passar', 'Um item simples e muito útil para o dia a dia.', 18000, 'FP', false, true, 13),
  ('aparelho-de-jantar', 'Aparelho de Jantar', 'Para receber com carinho e montar nossa mesa.', 40000, 'AJ', false, true, 14),
  ('kit-churrasco', 'Kit Churrasco', 'Para preparar momentos especiais com família e amigos.', 15000, 'KC', false, true, 15),
  ('conjunto-de-facas', 'Conjunto de Facas', 'Um conjunto prático para o dia a dia da nossa cozinha.', 25000, 'CF', false, true, 16),
  ('jogo-de-assadeiras', 'Jogo de Assadeiras', 'Para receitas de forno, almoços e sobremesas especiais.', 18000, 'JA', false, true, 17),
  ('jogo-de-panelas', 'Jogo de Panelas', 'Um presente essencial para completar nossa cozinha.', 60000, 'JP', false, true, 18),
  ('mixer-com-processador', 'Mixer com Processador', 'Mais praticidade para preparar receitas no dia a dia.', 30000, 'MP', false, true, 19),
  ('ventilador-de-teto', 'Ventilador de Teto', 'Para deixar nosso lar mais confortável e fresquinho.', 35000, 'VT', false, true, 20),
  ('aparador', 'Aparador', 'Um móvel lindo e útil para decorar nosso novo lar.', 70000, 'AR', false, true, 21),
  ('garrafa-termica', 'Garrafa Térmica', 'Para café quentinho e momentos gostosos em casa.', 12000, 'GT', false, true, 22),
  ('toalha-de-mesa', 'Toalha de Mesa', 'Para montar uma mesa bonita nas nossas refeições.', 15000, 'TM', false, true, 23),
  ('petisqueira', 'Petisqueira', 'Para servir petiscos e receber pessoas queridas.', 12000, 'PT', false, true, 24),
  ('suqueira', 'Suqueira', 'Para servir sucos e bebidas com charme.', 18000, 'SQ', false, true, 25),
  ('jogo-de-tacas', 'Jogo de Taças', 'Para brindar momentos especiais da nossa nova vida.', 22000, 'JT', false, true, 26),
  ('kit-de-frigideiras', 'Kit de Frigideiras', 'Para preparar refeições práticas e deliciosas.', 30000, 'KF', false, true, 27)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  emoji = excluded.emoji,
  allow_custom_amount = excluded.allow_custom_amount,
  active = excluded.active,
  sort_order = excluded.sort_order;
