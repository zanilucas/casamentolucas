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
  ('aparelho-de-jantar-e-cha-30-pecas', 'Aparelho De Jantar E Chá 30 Peças', '', 34690, 'AD', false, true, 1),
  ('armario-multiuso-4-portas-e-8-prateleiras', 'Armário Multiuso 4 Portas e 8 Prateleiras', '', 37998, 'AM', false, true, 2),
  ('aspirador-de-po-e-agua-1200w', 'Aspirador de Pó e Água 1200W', '', 24990, 'AD', false, true, 3),
  ('aspirador-de-po-vertical-2-em-1', 'Aspirador de Pó Vertical 2 em 1', '', 14800, 'AD', false, true, 4),
  ('contribuicao-livre', 'Aviãozinho de Dinheiro', 'Escolha o valor que desejar para nos ajudar nesse novo começo.', null, '+', true, true, 5),
  ('batedeira-duo-mixer-turbo-4-litros', 'Batedeira Duo Mixer Turbo 4 Litros', '', 22990, 'BD', false, true, 6),
  ('batedeira-planetaria-preta', 'Batedeira Planetária Preta', '', 49990, 'BP', false, true, 7),
  ('blender-2-jarras-700w', 'Blender 2 Jarras 700w', '', 24990, 'B2', false, true, 8),
  ('boleira-com-tampa-28cm-bambu', 'Boleira com Tampa 28Cm - Bambu', '', 9999, 'BC', false, true, 9),
  ('bomboniere-com-pe-cristal-25cm', 'Bomboniere com Pé Cristal 25Cm', '', 11999, 'BC', false, true, 10),
  ('bomboniere-com-pe-renaissance-lyor', 'Bomboniere com Pé Renaissance Lyor', '', 9999, 'BC', false, true, 11),
  ('buffet-aparador-4-portas-mdp-mdf', 'Buffet Aparador 4 Portas MDP/MDF', '', 38998, 'BA', false, true, 12),
  ('cabeceira-casal-com-led-e-2-mesas-de-cabeceira', 'Cabeceira Casal com Led e 2 Mesas de Cabeceira', '', 67998, 'CC', false, true, 13),
  ('carrinho-organizador-multiuso-3-andares', 'Carrinho Organizador Multiuso 3 Andares', '', 12065, 'CO', false, true, 14),
  ('casinha-pra-mel', 'Casinha para Mel', '', 30000, 'CM', false, true, 15),
  ('cervejeira-92-litros-painel-touch', 'Cervejeira 92 Litros Painel Touch', '', 199990, 'C9', false, true, 16),
  ('chaleira-eletrica-com-desligamento-automatico', 'Chaleira Elétrica com Desligamento Automático', '', 13940, 'CE', false, true, 17),
  ('churrasqueira-eletrica-antiaderente', 'Churrasqueira Elétrica Antiaderente', '', 24990, 'CE', false, true, 18),
  ('conjunto-de-facas-com-suporte-7-pecas', 'Conjunto de Facas com Suporte - 7 Peças', '', 14999, 'CD', false, true, 19),
  ('cortina-100-vedacao-blackout', 'Cortina 100% Vedação Blackout', '', 14250, 'C1', false, true, 20),
  ('lua-de-mel', 'Cota Lua de Mel', 'Contribua para a viagem dos nossos sonhos.', 20000, 'LM', false, true, 21),
  ('edredom-queen-plush-cinza', 'Edredom Queen Plush Cinza', '', 24990, 'EQ', false, true, 22),
  ('escada-de-aluminio-5-degraus-residencial', 'Escada de Alumínio 5 degraus Residencial', '', 16490, 'ED', false, true, 23),
  ('escorredor-de-louca-rack-preto-2-andares-aco', 'Escorredor de Louça Rack Preto 2 Andares Aço', '', 10115, 'ED', false, true, 24),
  ('faqueiro-de-inox-60-pecas', 'Faqueiro De Inox - 60 Peças', '', 23999, 'FD', false, true, 25),
  ('ferro-de-passar-seco-e-vapor', 'Ferro de Passar Seco e Vapor', '', 10532, 'FD', false, true, 26),
  ('forno-eletrico-65l', 'Forno Elétrico 65L', '', 79990, 'FE', false, true, 27),
  ('garrafa-termica1-8-litros', 'Garrafa Térmica1,8 Litros', '', 10540, 'GT', false, true, 28),
  ('geladeira-frost-free-432l-autosense-duplex', 'Geladeira Frost Free 432L AutoSense Duplex', '', 294405, 'GF', false, true, 29),
  ('jogo-de-assadeiras', 'Jogo de Assadeiras', '', 22045, 'JD', false, true, 30),
  ('jogo-de-assadeiras-3-pecas-portuguesa-retangular', 'Jogo de Assadeiras 3 Peças Portuguesa Retangular', '', 15999, 'JD', false, true, 31),
  ('jogo-de-cama-4-pcs', 'Jogo de Cama 4 pçs', '', 9999, 'JD', false, true, 32),
  ('jogo-de-facas', 'Jogo de Facas', '', 11115, 'JD', false, true, 33),
  ('jogo-de-jantar-e-cha-20-pecas', 'Jogo De Jantar E Chá 20 Peças', '', 23658, 'JD', false, true, 34),
  ('jogo-de-lencol-queen-4-pecas-percal-400-fios', 'Jogo de Lençol Queen 4 Peças Percal 400 Fios', '', 16990, 'JD', false, true, 35),
  ('jogo-de-panelas', 'Jogo de Panelas', '', 22900, 'JD', false, true, 36),
  ('jogo-de-potes-hermeticos-10-pecas', 'Jogo de Potes Herméticos 10 Peças', '', 12999, 'JD', false, true, 37),
  ('jogo-de-tacas-em-cristal-6-pecas', 'Jogo de Taças em Cristal 6 Peças', '', 13190, 'JD', false, true, 38),
  ('jogo-de-travessas-2-pecas', 'Jogo De Travessas 2 Peças', '', 19999, 'JD', false, true, 39),
  ('jogo-toalha-banho-e-rosto-100-algodao', 'Jogo Toalha Banho E Rosto 100% Algodão', '', 15510, 'JT', false, true, 40),
  ('kit-2-poltronas', 'Kit 2 Poltronas', '', 69990, 'K2', false, true, 41),
  ('kit-2-travesseiros-suporte-extra-firme-branco', 'Kit 2 Travesseiros Suporte Extra Firme Branco', '', 15999, 'K2', false, true, 42),
  ('kit-jogo-de-frigideiras-3-pcs-antiaderente', 'Kit Jogo de Frigideiras 3 Pçs Antiaderente', '', 11688, 'KJ', false, true, 43),
  ('kit-lixeira-em-aco-inox-com-3-pecas', 'Kit Lixeira Em Aço Inox Com 3 Peças', '', 19999, 'KL', false, true, 44),
  ('kit-para-churrasco', 'Kit para Churrasco', '', 10450, 'KP', false, true, 45),
  ('kit-tabua-grande-para-queijos-e-frios-com-petisqueira-quei', 'Kit Tábua Grande Para Queijos E Frios Com Petisqueira Queijo', '', 12416, 'KT', false, true, 46),
  ('lasanheira-de-vidro-com-tampa-5-litros', 'Lasanheira de Vidro com Tampa 5 Litros', '', 9999, 'LD', false, true, 47),
  ('mixer-3-em-1-preto', 'Mixer 3 em 1 Preto', '', 20805, 'M3', false, true, 48),
  ('organizador-para-geladeira-com-3-cestos-5-litros', 'Organizador para Geladeira com 3 Cestos - 5 Litros', '', 9999, 'OP', false, true, 49),
  ('panela-de-pressao-eletrica-6-litros', 'Panela De Pressão Elétrica 6 Litros', '', 54990, 'PD', false, true, 50),
  ('panela-eletrica', 'Panela Elétrica', '', 19990, 'PE', false, true, 51),
  ('pipoqueira-pop-time-pip', 'Pipoqueira Pop Time Pip', '', 16900, 'PP', false, true, 52),
  ('prato-de-bolo-com-pe-flor-de-lirio-32cm', 'Prato de Bolo com Pé Flor de Lirio 32Cm', '', 9999, 'PD', false, true, 53),
  ('purificador-de-agua-com-compressor-prata', 'Purificador de Água com Compressor Prata', '', 109990, 'PD', false, true, 54),
  ('saca-rolhas-eletrico-com-cortador-de-lacre', 'Saca Rolhas Elétrico Com Cortador De Lacre', '', 21999, 'SR', false, true, 55),
  ('suqueira-jarra-de-vidro-5-litros-com-torneira', 'Suqueira Jarra De Vidro 5 Litros com Torneira', '', 10115, 'SJ', false, true, 56),
  ('tabua-de-churrasco-c-bandeja-e-potes-inox', 'Tábua De Churrasco C/ Bandeja E Potes Inox', '', 14999, 'TD', false, true, 57),
  ('tapete-para-sala-1-40x2-00-antiderrapante', 'Tapete para Sala 1,40x2,00 Antiderrapante', '', 16119, 'TP', false, true, 58),
  ('toalha-de-mesa-1-40-x-2-50', 'Toalha de Mesa 1,40 X 2,50', '', 9999, 'TD', false, true, 59),
  ('toalha-de-mesa-retangular-estampado', 'Toalha de Mesa Retangular Estampado', '', 10990, 'TD', false, true, 60),
  ('varal-de-chao-reforcado-c-abas-dobravel-retratil', 'Varal De Chão Reforçado C/abas Dobrável Retrátil', '', 10209, 'VD', false, true, 61),
  ('ventilador-de-teto', 'Ventilador de Teto', '', 17990, 'VD', false, true, 62)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  emoji = excluded.emoji,
  allow_custom_amount = excluded.allow_custom_amount,
  active = excluded.active,
  sort_order = excluded.sort_order;
