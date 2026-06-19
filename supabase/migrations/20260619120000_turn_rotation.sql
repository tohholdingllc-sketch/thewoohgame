-- =====================================================================
-- Turni a ROTAZIONE (round-robin per ordine d'ingresso) invece che casuali.
-- Ogni carta ha current_targets = [giocatore di turno, prossimo giocatore]:
--   {player}  = giocatore di turno (mostrato SEMPRE in alto sulla carta)
--   {player2} = giocatore successivo (per le carte di coppia)
-- =====================================================================

-- Helper: target [turno, successivo] per l'indice di carta dato (0-based).
create or replace function public._wooh_targets(p_game_id uuid, p_index int)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_players jsonb;
  v_n int;
begin
  select jsonb_agg(
           jsonb_build_object('nickname', nickname, 'nickname_color', nickname_color, 'avatar_id', avatar_id)
           order by joined_at, id
         )
  into v_players
  from public.game_players
  where game_id = p_game_id;

  v_n := coalesce(jsonb_array_length(v_players), 0);
  if v_n = 0 then
    return '[]'::jsonb;
  end if;

  return jsonb_build_array(
    v_players -> (p_index % v_n),
    v_players -> ((p_index + 1) % v_n)
  );
end;
$$;

-- start_game: prima carta con target di turno (indice 0) + eventuale regola.
create or replace function public.start_game(p_game_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_count int;
  v_decks uuid[];
  v_queue uuid[];
  v_card public.cards%rowtype;
  v_rules jsonb := '[]'::jsonb;
begin
  if not public.is_game_master(p_game_id) then
    raise exception 'NOT_MASTER';
  end if;

  select selected_decks into v_decks from public.games where id = p_game_id;
  if v_decks is null or array_length(v_decks, 1) is null then
    raise exception 'NO_DECKS';
  end if;

  select count(*) into v_count from public.game_players where game_id = p_game_id;

  select array_agg(c.id order by random())
  into v_queue
  from public.cards c
  where c.deck_id = any(v_decks)
    and c.min_players <= v_count;

  if v_queue is null or array_length(v_queue, 1) is null then
    raise exception 'NO_CARDS';
  end if;

  select * into v_card from public.cards where id = v_queue[1];
  if v_card.type = 'regola' then
    v_rules := jsonb_build_array(v_card.text);
  end if;

  update public.games
  set status = 'playing',
      card_queue = v_queue,
      current_card_index = 0,
      active_rules = v_rules,
      current_targets = public._wooh_targets(p_game_id, 0)
  where id = p_game_id;
end;
$$;

-- advance_card: ruota i target in base all'indice della carta successiva.
create or replace function public.advance_card(p_game_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_game public.games%rowtype;
  v_len int;
  v_next int;
  v_card public.cards%rowtype;
  v_rules jsonb;
begin
  if not public.is_game_master(p_game_id) then
    raise exception 'NOT_MASTER';
  end if;

  select * into v_game from public.games where id = p_game_id;
  v_len := coalesce(array_length(v_game.card_queue, 1), 0);
  v_next := v_game.current_card_index + 1;

  if v_next >= v_len then
    update public.games set current_card_index = v_len, status = 'ended' where id = p_game_id;
    return;
  end if;

  select * into v_card from public.cards where id = v_game.card_queue[v_next + 1];

  if v_card.type = 'regola' then
    v_rules := jsonb_build_array(v_card.text);
  else
    v_rules := v_game.active_rules;
  end if;

  update public.games
  set current_card_index = v_next,
      current_targets = public._wooh_targets(p_game_id, v_next),
      active_rules = v_rules
  where id = p_game_id;
end;
$$;

grant execute on function public.start_game(uuid)   to authenticated;
grant execute on function public.advance_card(uuid) to authenticated;
