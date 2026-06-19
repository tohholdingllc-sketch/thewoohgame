-- =====================================================================
-- FASE 2 — RPC lobby (SECURITY DEFINER: validano e bypassano RLS in modo sicuro)
-- =====================================================================

-- Crea una partita: codice univoco, master = utente, master aggiunto come giocatore.
create or replace function public.create_game(
  p_decks uuid[] default '{}',
  p_language text default 'it'
)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  v_code text;
  v_game_id uuid;
  v_prof public.profiles%rowtype;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  select * into v_prof from public.profiles where id = auth.uid();
  v_code := public.generate_game_code();

  insert into public.games (code, master_id, selected_decks, language)
  values (v_code, auth.uid(), coalesce(p_decks, '{}'), coalesce(p_language, 'it'))
  returning id into v_game_id;

  insert into public.game_players (game_id, profile_id, nickname, avatar_id, nickname_color, is_manual)
  values (
    v_game_id, auth.uid(),
    coalesce(nullif(v_prof.nickname, ''), 'Master'),
    v_prof.avatar_id, v_prof.nickname_color, false
  );

  return v_code;
end;
$$;

-- Entra in una partita con il codice (case-insensitive). Idempotente.
create or replace function public.join_game(p_code text)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  v_game public.games%rowtype;
  v_prof public.profiles%rowtype;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  select * into v_game from public.games
  where upper(code) = upper(trim(p_code))
  limit 1;

  if not found then
    raise exception 'GAME_NOT_FOUND';
  end if;
  if v_game.status <> 'lobby' then
    raise exception 'GAME_NOT_JOINABLE';
  end if;

  select * into v_prof from public.profiles where id = auth.uid();

  insert into public.game_players (game_id, profile_id, nickname, avatar_id, nickname_color, is_manual)
  values (
    v_game.id, auth.uid(),
    coalesce(nullif(v_prof.nickname, ''), 'Giocatore'),
    v_prof.avatar_id, v_prof.nickname_color, false
  )
  on conflict (game_id, profile_id) do nothing;

  return v_game.code;
end;
$$;

-- Il master aggiunge un giocatore "manuale" (senza account).
create or replace function public.add_manual_player(
  p_game_id uuid,
  p_nickname text,
  p_avatar_id text default null,
  p_color text default null
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.is_game_master(p_game_id) then
    raise exception 'NOT_MASTER';
  end if;

  insert into public.game_players (game_id, profile_id, nickname, avatar_id, nickname_color, is_manual)
  values (p_game_id, null, coalesce(nullif(trim(p_nickname), ''), 'Ospite'), p_avatar_id, p_color, true)
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.create_game(uuid[], text)        to authenticated;
grant execute on function public.join_game(text)                  to authenticated;
grant execute on function public.add_manual_player(uuid, text, text, text) to authenticated;
