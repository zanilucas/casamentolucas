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
  ('casinha-pra-mel', 'Casinha pra Mel', 'Um cantinho especial e confortável para a Mel.', 30000, 'CM', false, true, 3),
  ('kit-para-churrasco', 'Kit para Churrasco', 'Um presente escolhido com carinho para o nosso novo lar.', 10450, 'KP', false, true, 4),
  ('jogo-de-facas', 'Jogo de Facas', 'Um presente escolhido com carinho para o nosso novo lar.', 11115, 'JD', false, true, 5),
  ('jogo-de-assadeiras', 'Jogo de Assadeiras', 'Um presente escolhido com carinho para o nosso novo lar.', 22045, 'JD', false, true, 6),
  ('jogo-de-panelas', 'Jogo de Panelas', 'Um presente escolhido com carinho para o nosso novo lar.', 22900, 'JD', false, true, 7),
  ('mixer-3-em-1-preto', 'Mixer 3 em 1 Preto', 'Um presente escolhido com carinho para o nosso novo lar.', 20805, 'M3', false, true, 8),
  ('ventilador-de-teto', 'Ventilador de Teto', 'Um presente escolhido com carinho para o nosso novo lar.', 17990, 'VD', false, true, 9),
  ('buffet-aparador-4-portas-mdp-mdf', 'Buffet Aparador 4 Portas MDP/MDF', 'Um presente escolhido com carinho para o nosso novo lar.', 38998, 'BA', false, true, 10),
  ('garrafa-termica1-8-litros', 'Garrafa Térmica1,8 Litros', 'Um presente escolhido com carinho para o nosso novo lar.', 10540, 'GT', false, true, 11),
  ('toalha-de-mesa-retangular-estampado', 'Toalha de Mesa Retangular Estampado', 'Um presente escolhido com carinho para o nosso novo lar.', 10990, 'TD', false, true, 12),
  ('kit-tabua-grande-para-queijos-e-frios-com-petisqueira-quei', 'Kit Tábua Grande Para Queijos E Frios Com Petisqueira Queijo', 'Um presente escolhido com carinho para o nosso novo lar.', 12416, 'KT', false, true, 13),
  ('suqueira-jarra-de-vidro-5-litros-com-torneira', 'Suqueira Jarra De Vidro 5 Litros com Torneira', 'Um presente escolhido com carinho para o nosso novo lar.', 10115, 'SJ', false, true, 14),
  ('jogo-de-tacas-em-cristal-6-pecas', 'Jogo de Taças em Cristal 6 Peças', 'Um presente escolhido com carinho para o nosso novo lar.', 13190, 'JD', false, true, 15),
  ('aspirador-de-po-e-agua-1200w', 'Aspirador de Pó e Água 1200W', 'Um presente escolhido com carinho para o nosso novo lar.', 24990, 'AD', false, true, 16),
  ('aspirador-de-po-vertical-2-em-1', 'Aspirador de Pó Vertical 2 em 1', 'Um presente escolhido com carinho para o nosso novo lar.', 14800, 'AD', false, true, 17),
  ('kit-jogo-de-frigideiras-3-pcs-antiaderente', 'Kit Jogo de Frigideiras 3 Pçs Antiaderente', 'Um presente escolhido com carinho para o nosso novo lar.', 11688, 'KJ', false, true, 18),
  ('escorredor-de-louca-rack-preto-2-andares-aco', 'Escorredor de Louça Rack Preto 2 Andares Aço', 'Um presente escolhido com carinho para o nosso novo lar.', 10115, 'ED', false, true, 19),
  ('cortina-100-vedacao-blackout', 'Cortina 100% Vedação Blackout', 'Um presente escolhido com carinho para o nosso novo lar.', 14250, 'C1', false, true, 20),
  ('carrinho-organizador-multiuso-3-andares', 'Carrinho Organizador Multiuso 3 Andares', 'Um presente escolhido com carinho para o nosso novo lar.', 12065, 'CO', false, true, 21),
  ('pipoqueira-pop-time-pip', 'Pipoqueira Pop Time Pip', 'Um presente escolhido com carinho para o nosso novo lar.', 16900, 'PP', false, true, 22),
  ('chaleira-eletrica-com-desligamento-automatico', 'Chaleira Elétrica com Desligamento Automático', 'Um presente escolhido com carinho para o nosso novo lar.', 13940, 'CE', false, true, 23),
  ('geladeira-frost-free-432l-autosense-duplex', 'Geladeira Frost Free 432L AutoSense Duplex', 'Um presente escolhido com carinho para o nosso novo lar.', 294405, 'GF', false, true, 24),
  ('jogo-de-lencol-queen-4-pecas-percal-400-fios', 'Jogo de Lençol Queen 4 Peças Percal 400 Fios', 'Um presente escolhido com carinho para o nosso novo lar.', 16990, 'JD', false, true, 25),
  ('edredom-queen-plush-cinza', 'Edredom Queen Plush Cinza', 'Um presente escolhido com carinho para o nosso novo lar.', 24990, 'EQ', false, true, 26),
  ('escada-de-aluminio-5-degraus-residencial', 'Escada de Alumínio 5 degraus Residencial', 'Um presente escolhido com carinho para o nosso novo lar.', 16490, 'ED', false, true, 27),
  ('jogo-toalha-banho-e-rosto-100-algodao', 'Jogo Toalha Banho E Rosto 100% Algodão', 'Um presente escolhido com carinho para o nosso novo lar.', 15510, 'JT', false, true, 28),
  ('kit-2-travesseiros-suporte-extra-firme-branco', 'Kit 2 Travesseiros Suporte Extra Firme Branco', 'Um presente escolhido com carinho para o nosso novo lar.', 15999, 'K2', false, true, 29),
  ('ferro-de-passar-seco-e-vapor', 'Ferro de Passar Seco e Vapor', 'Um presente escolhido com carinho para o nosso novo lar.', 10532, 'FD', false, true, 30),
  ('varal-de-chao-reforcado-c-abas-dobravel-retratil', 'Varal De Chão Reforçado C/abas Dobrável Retrátil', 'Um presente escolhido com carinho para o nosso novo lar.', 10209, 'VD', false, true, 31),
  ('aparelho-de-jantar-e-cha-30-pecas', 'Aparelho De Jantar E Chá 30 Peças', 'Um presente escolhido com carinho para o nosso novo lar.', 34690, 'AD', false, true, 32),
  ('jogo-de-jantar-e-cha-20-pecas', 'Jogo De Jantar E Chá 20 Peças', 'Um presente escolhido com carinho para o nosso novo lar.', 23658, 'JD', false, true, 33),
  ('kit-lixeira-em-aco-inox-com-3-pecas', 'Kit Lixeira Em Aço Inox Com 3 Peças', 'Um presente escolhido com carinho para o nosso novo lar.', 19999, 'KL', false, true, 34),
  ('purificador-de-agua-com-compressor-prata', 'Purificador de Água com Compressor Prata', 'Um presente escolhido com carinho para o nosso novo lar.', 109990, 'PD', false, true, 35),
  ('panela-de-pressao-eletrica-6-litros', 'Panela De Pressão Elétrica 6 Litros', 'Um presente escolhido com carinho para o nosso novo lar.', 54990, 'PD', false, true, 36),
  ('batedeira-planetaria-preta', 'Batedeira Planetária Preta', 'Um presente escolhido com carinho para o nosso novo lar.', 49990, 'BP', false, true, 37),
  ('churrasqueira-eletrica-antiaderente', 'Churrasqueira Elétrica Antiaderente', 'Um presente escolhido com carinho para o nosso novo lar.', 24990, 'CE', false, true, 38),
  ('blender-2-jarras-700w', 'Blender 2 Jarras 700w', 'Um presente escolhido com carinho para o nosso novo lar.', 24990, 'B2', false, true, 39),
  ('cervejeira-92-litros-painel-touch', 'Cervejeira 92 Litros Painel Touch', 'Um presente escolhido com carinho para o nosso novo lar.', 199990, 'C9', false, true, 40),
  ('batedeira-duo-mixer-turbo-4-litros', 'Batedeira Duo Mixer Turbo 4 Litros', 'Um presente escolhido com carinho para o nosso novo lar.', 22990, 'BD', false, true, 41),
  ('forno-eletrico-65l', 'Forno Elétrico 65L', 'Um presente escolhido com carinho para o nosso novo lar.', 79990, 'FE', false, true, 42),
  ('jogo-de-cama-4-pcs', 'Jogo de Cama 4 pçs', 'Um presente escolhido com carinho para o nosso novo lar.', 9999, 'JD', false, true, 43),
  ('toalha-de-mesa-1-40-x-2-50', 'Toalha de Mesa 1,40 X 2,50', 'Um presente escolhido com carinho para o nosso novo lar.', 9999, 'TD', false, true, 44),
  ('bomboniere-com-pe-cristal-25cm', 'Bomboniere com Pé Cristal 25Cm', 'Um presente escolhido com carinho para o nosso novo lar.', 11999, 'BC', false, true, 45),
  ('bomboniere-com-pe-renaissance-lyor', 'Bomboniere com Pé Renaissance Lyor', 'Um presente escolhido com carinho para o nosso novo lar.', 9999, 'BC', false, true, 46),
  ('prato-de-bolo-com-pe-flor-de-lirio-32cm', 'Prato de Bolo com Pé Flor de Lirio 32Cm', 'Um presente escolhido com carinho para o nosso novo lar.', 9999, 'PD', false, true, 47),
  ('jogo-de-potes-hermeticos-10-pecas', 'Jogo de Potes Herméticos 10 Peças', 'Um presente escolhido com carinho para o nosso novo lar.', 12999, 'JD', false, true, 48),
  ('jogo-de-travessas-2-pecas', 'Jogo De Travessas 2 Peças', 'Um presente escolhido com carinho para o nosso novo lar.', 19999, 'JD', false, true, 49),
  ('saca-rolhas-eletrico-com-cortador-de-lacre', 'Saca Rolhas Elétrico Com Cortador De Lacre', 'Um presente escolhido com carinho para o nosso novo lar.', 21999, 'SR', false, true, 50),
  ('organizador-para-geladeira-com-3-cestos-5-litros', 'Organizador para Geladeira com 3 Cestos - 5 Litros', 'Um presente escolhido com carinho para o nosso novo lar.', 9999, 'OP', false, true, 51),
  ('jogo-de-assadeiras-3-pecas-portuguesa-retangular', 'Jogo de Assadeiras 3 Peças Portuguesa Retangular', 'Um presente escolhido com carinho para o nosso novo lar.', 15999, 'JD', false, true, 52),
  ('boleira-com-tampa-28cm-bambu', 'Boleira com Tampa 28Cm - Bambu', 'Um presente escolhido com carinho para o nosso novo lar.', 9999, 'BC', false, true, 53),
  ('lasanheira-de-vidro-com-tampa-5-litros', 'Lasanheira de Vidro com Tampa 5 Litros', 'Um presente escolhido com carinho para o nosso novo lar.', 9999, 'LD', false, true, 54),
  ('faqueiro-de-inox-60-pecas', 'Faqueiro De Inox - 60 Peças', 'Um presente escolhido com carinho para o nosso novo lar.', 23999, 'FD', false, true, 55),
  ('conjunto-de-facas-com-suporte-7-pecas', 'Conjunto de Facas com Suporte - 7 Peças', 'Um presente escolhido com carinho para o nosso novo lar.', 14999, 'CD', false, true, 56),
  ('tabua-de-churrasco-c-bandeja-e-potes-inox', 'Tábua De Churrasco C/ Bandeja E Potes Inox', 'Um presente escolhido com carinho para o nosso novo lar.', 14999, 'TD', false, true, 57),
  ('panela-eletrica', 'Panela Elétrica', 'Um presente escolhido com carinho para o nosso novo lar.', 19990, 'PE', false, true, 58),
  ('kit-2-poltronas', 'Kit 2 Poltronas', 'Um presente escolhido com carinho para o nosso novo lar.', 69990, 'K2', false, true, 59),
  ('armario-multiuso-4-portas-e-8-prateleiras', 'Armário Multiuso 4 Portas e 8 Prateleiras', 'Um presente escolhido com carinho para o nosso novo lar.', 37998, 'AM', false, true, 60),
  ('cabeceira-casal-com-led-e-2-mesas-de-cabeceira', 'Cabeceira Casal com Led e 2 Mesas de Cabeceira', 'Um presente escolhido com carinho para o nosso novo lar.', 67998, 'CC', false, true, 61),
  ('tapete-para-sala-1-40x2-00-antiderrapante', 'Tapete para Sala 1,40x2,00 Antiderrapante', 'Um presente escolhido com carinho para o nosso novo lar.', 16119, 'TP', false, true, 62)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  emoji = excluded.emoji,
  allow_custom_amount = excluded.allow_custom_amount,
  active = excluded.active,
  sort_order = excluded.sort_order;
