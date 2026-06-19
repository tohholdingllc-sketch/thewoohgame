-- =====================================================================
-- FASE 3 — Motore di gioco
-- current_targets: giocatori estratti per la carta corrente (sync per tutti)
-- =====================================================================
alter table public.games
  add column if not exists current_targets jsonb not null default '[]'::jsonb;

-- Avvia la partita: costruisce la card_queue mischiata dai mazzi scelti
-- (solo carte compatibili col numero di giocatori), status -> playing.
create or replace function public.start_game(p_game_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_count int;
  v_decks uuid[];
  v_queue uuid[];
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

  update public.games
  set status = 'playing',
      card_queue = v_queue,
      current_card_index = 0,
      active_rules = '[]'::jsonb,
      current_targets = '[]'::jsonb
  where id = p_game_id;
end;
$$;

-- Avanza alla carta successiva: estrae i target casuali necessari, aggiorna
-- la regola persistente attiva, oppure termina la partita a fine mazzo.
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
  v_targets jsonb := '[]'::jsonb;
  v_rules jsonb;
begin
  if not public.is_game_master(p_game_id) then
    raise exception 'NOT_MASTER';
  end if;

  select * into v_game from public.games where id = p_game_id;
  v_len := coalesce(array_length(v_game.card_queue, 1), 0);
  v_next := v_game.current_card_index + 1;

  -- Fine mazzo
  if v_next >= v_len then
    update public.games set current_card_index = v_len, status = 'ended' where id = p_game_id;
    return;
  end if;

  -- Carta nuova (array Postgres 1-based; current_card_index è 0-based)
  select * into v_card from public.cards where id = v_game.card_queue[v_next + 1];

  -- Target casuali (giocatori distinti) se la carta ne richiede
  if coalesce(v_card.needs_target, 0) > 0 then
    select jsonb_agg(t)
    into v_targets
    from (
      select jsonb_build_object(
               'nickname', nickname,
               'nickname_color', nickname_color,
               'avatar_id', avatar_id
             ) as t
      from public.game_players
      where game_id = p_game_id
      order by random()
      limit v_card.needs_target
    ) s;
    v_targets := coalesce(v_targets, '[]'::jsonb);
  end if;

  -- Regola persistente: sostituisce quella attiva; le altre carte la lasciano
  if v_card.type = 'regola' then
    v_rules := jsonb_build_array(v_card.text);
  else
    v_rules := v_game.active_rules;
  end if;

  update public.games
  set current_card_index = v_next,
      current_targets = v_targets,
      active_rules = v_rules
  where id = p_game_id;
end;
$$;

grant execute on function public.start_game(uuid)   to authenticated;
grant execute on function public.advance_card(uuid) to authenticated;
