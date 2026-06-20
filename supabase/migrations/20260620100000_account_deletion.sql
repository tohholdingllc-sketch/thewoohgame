-- =====================================================================
-- Cancellazione account self-service
-- Richiesta da: App Store Guideline 5.1.1(v), Google Play, GDPR.
-- Cancella la riga auth.users del chiamante; il CASCADE definito nello schema
-- (profiles.id -> auth.users; games.master_id -> profiles; game_players -> profiles/games)
-- rimuove automaticamente tutti i dati collegati.
-- SECURITY DEFINER: necessario per poter eliminare da auth.users.
-- =====================================================================
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  delete from auth.users where id = uid;  -- cascade -> profiles -> games -> game_players
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
