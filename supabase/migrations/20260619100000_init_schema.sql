-- =====================================================================
-- THE WOOH Game — Schema iniziale (Fase 1)
-- Tabelle: profiles, decks, cards, games, game_players
-- + RLS, funzioni helper (anti-ricorsione), trigger profilo, codice univoco
-- =====================================================================

-- ---------- PROFILI (collegati a auth.users) ----------
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  nickname       text not null,
  avatar_id      text,
  nickname_color text,
  is_adult       boolean not null default false,
  created_at     timestamptz not null default now()
);

-- ---------- MAZZI ----------
create table if not exists public.decks (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,            -- 'start','mood','hot','coppia','ambiente'
  name        jsonb not null,                  -- {"it": "...", "en": "..."}
  description jsonb not null,
  intensity   int  not null default 1,         -- 1..3 (peperoncini)
  is_premium  boolean not null default false,
  min_players int  not null default 3,         -- 'coppia' = 2
  sort_order  int  not null default 0
);

-- ---------- CARTE ----------
create table if not exists public.cards (
  id            uuid primary key default gen_random_uuid(),
  deck_id       uuid not null references public.decks(id) on delete cascade,
  type          text not null,                 -- vedi card_types
  text          jsonb not null,                -- multilingua; placeholder {player},{player2}
  param         jsonb,                         -- es. {"tema":{"it":"...","en":"..."}}
  is_persistent boolean not null default false,-- true per 'regola' (restano attive)
  needs_target  int  not null default 0,       -- 0,1,2 giocatori da targetizzare
  min_players   int  not null default 1,
  sort_order    int  not null default 0,
  constraint cards_type_chk check (type in
    ('io_non_ho_mai','tre_cose','sinonimi','azione','regola','wooh','manichino'))
);
create index if not exists cards_deck_id_idx on public.cards(deck_id);

-- ---------- PARTITE ----------
create table if not exists public.games (
  id                 uuid primary key default gen_random_uuid(),
  code               text unique not null,          -- codice breve univoco
  master_id          uuid not null references public.profiles(id) on delete cascade,
  status             text not null default 'lobby', -- 'lobby' | 'playing' | 'ended'
  selected_decks     uuid[] not null default '{}',
  current_card_index int  not null default 0,
  card_queue         uuid[] not null default '{}',
  active_rules       jsonb not null default '[]',
  language           text not null default 'it',
  created_at         timestamptz not null default now(),
  constraint games_status_chk check (status in ('lobby','playing','ended'))
);

-- ---------- GIOCATORI IN PARTITA ----------
create table if not exists public.game_players (
  id             uuid primary key default gen_random_uuid(),
  game_id        uuid not null references public.games(id) on delete cascade,
  profile_id     uuid references public.profiles(id) on delete cascade,
  nickname       text not null,                 -- snapshot (anche per manuali/anonimi)
  avatar_id      text,
  nickname_color text,
  is_manual      boolean not null default false,
  joined_at      timestamptz not null default now(),
  unique (game_id, profile_id)
);
create index if not exists game_players_game_id_idx on public.game_players(game_id);
create index if not exists game_players_profile_id_idx on public.game_players(profile_id);

-- =====================================================================
-- FUNZIONI HELPER (SECURITY DEFINER → niente ricorsione RLS)
-- =====================================================================

-- Profilo auto-creato alla registrazione (legge i metadati passati dall'app)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nickname, avatar_id, nickname_color, is_adult)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'nickname', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Giocatore'
    ),
    new.raw_user_meta_data->>'avatar_id',
    new.raw_user_meta_data->>'nickname_color',
    coalesce((new.raw_user_meta_data->>'is_adult')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Codice partita univoco (alfabeto senza caratteri ambigui 0/O/1/I/L)
create or replace function public.generate_game_code()
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code text;
  i int;
  taken boolean;
begin
  loop
    code := '';
    for i in 1..5 loop
      code := code || substr(alphabet, floor(random() * length(alphabet))::int + 1, 1);
    end loop;
    select exists(select 1 from public.games g where g.code = code) into taken;
    exit when not taken;
  end loop;
  return code;
end;
$$;

-- Membership check (master o giocatore) — evita ricorsione nelle policy
create or replace function public.is_game_member(p_game_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.games g
      where g.id = p_game_id and g.master_id = auth.uid()
  ) or exists (
    select 1 from public.game_players gp
      where gp.game_id = p_game_id and gp.profile_id = auth.uid()
  );
$$;

-- È il master della partita?
create or replace function public.is_game_master(p_game_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.games g
      where g.id = p_game_id and g.master_id = auth.uid()
  );
$$;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles     enable row level security;
alter table public.decks        enable row level security;
alter table public.cards        enable row level security;
alter table public.games        enable row level security;
alter table public.game_players enable row level security;

-- PROFILES: ognuno legge/scrive solo se stesso
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- DECKS / CARDS: lettura pubblica (anche anon); scrittura solo service_role
create policy "decks_select_all" on public.decks
  for select using (true);
create policy "cards_select_all" on public.cards
  for select using (true);

-- GAMES
create policy "games_select_members" on public.games
  for select using (public.is_game_member(id));
create policy "games_insert_master" on public.games
  for insert with check (master_id = auth.uid());
create policy "games_update_master" on public.games
  for update using (master_id = auth.uid()) with check (master_id = auth.uid());
create policy "games_delete_master" on public.games
  for delete using (master_id = auth.uid());

-- GAME_PLAYERS
create policy "game_players_select_members" on public.game_players
  for select using (public.is_game_member(game_id));
create policy "game_players_insert_self_or_master" on public.game_players
  for insert with check (
    profile_id = auth.uid() or public.is_game_master(game_id)
  );
create policy "game_players_update_self_or_master" on public.game_players
  for update using (profile_id = auth.uid() or public.is_game_master(game_id))
  with check (profile_id = auth.uid() or public.is_game_master(game_id));
create policy "game_players_delete_self_or_master" on public.game_players
  for delete using (profile_id = auth.uid() or public.is_game_master(game_id));

-- =====================================================================
-- REALTIME (postgres_changes) per lobby e gioco
-- =====================================================================
alter publication supabase_realtime add table public.games;
alter publication supabase_realtime add table public.game_players;
