-- Ejecutar una vez en Supabase > SQL Editor.
-- Todas las tablas tienen RLS activado y SIN políticas: solo el servidor
-- (con la service role key) puede leer o escribir. El navegador no accede.

create table if not exists public.ordenes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  producto text not null,
  monto numeric(12,2) not null,
  estado text not null default 'creada',
  preferencia_id text,
  pago_id text,
  creada timestamptz not null default now(),
  pagada timestamptz
);
create index if not exists ordenes_user on public.ordenes(user_id);

create table if not exists public.accesos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  producto text not null,
  orden_id uuid not null unique references public.ordenes(id),
  otorgado timestamptz not null default now(),
  revocado timestamptz
);
create index if not exists accesos_user on public.accesos(user_id, producto);

create table if not exists public.dispositivos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  user_agent text,
  creado timestamptz not null default now(),
  ultimo_uso timestamptz not null default now(),
  cerrado timestamptz
);
create index if not exists dispositivos_user on public.dispositivos(user_id, cerrado);

create table if not exists public.lecturas (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  pagina int not null,
  momento timestamptz not null default now()
);
create index if not exists lecturas_user_momento on public.lecturas(user_id, momento);

alter table public.ordenes enable row level security;
alter table public.accesos enable row level security;
alter table public.dispositivos enable row level security;
alter table public.lecturas enable row level security;

-- Bucket privado para las páginas de la guía (no público)
insert into storage.buckets (id, name, public)
values ('guia-paginas', 'guia-paginas', false)
on conflict (id) do update set public = false;

-- Pedidos del botón de arrepentimiento (Res. 424/2020). Se revisan en Supabase > Table editor.
create table if not exists public.arrepentimientos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  email text not null,
  nombre text,
  fecha_compra text,
  motivo text,
  user_id uuid references auth.users(id) on delete set null,
  creado timestamptz not null default now(),
  resuelto timestamptz
);
alter table public.arrepentimientos enable row level security;
