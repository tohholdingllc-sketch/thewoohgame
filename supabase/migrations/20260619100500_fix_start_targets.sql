-- Fix: start_game ora estrae i target (e l'eventuale regola) anche per la PRIMA carta,
-- altrimenti {player} sulla carta 1 mostrava il fallback "qualcuno".
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
  v_targets jsonb := '[]'::jsonb;
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

  -- Prima carta: target + eventuale regola persistente
  select * into v_card from public.cards where id = v_queue[1];
  if coalesce(v_card.needs_target, 0) > 0 then
    select jsonb_agg(t)
    into v_targets
    from (
      select jsonb_build_object('nickname', nickname, 'nickname_color', nickname_color, 'avatar_id', avatar_id) as t
      from public.game_players
      where game_id = p_game_id
      order by random()
      limit v_card.needs_target
    ) s;
    v_targets := coalesce(v_targets, '[]'::jsonb);
  end if;
  if v_card.type = 'regola' then
    v_rules := jsonb_build_array(v_card.text);
  end if;

  update public.games
  set status = 'playing',
      card_queue = v_queue,
      current_card_index = 0,
      active_rules = v_rules,
      current_targets = v_targets
  where id = p_game_id;
end;
$$;
