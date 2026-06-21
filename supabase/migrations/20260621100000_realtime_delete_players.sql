-- =====================================================================
-- Kick / "esci dalla lobby" visibili in TEMPO REALE a tutti i client.
-- I postgres_changes di tipo DELETE con un filtro (game_id=eq.X) NON scattano
-- se il record "vecchio" non contiene game_id: di default REPLICA IDENTITY è
-- solo la PRIMARY KEY (id), quindi il filtro su game_id non combacia e l'evento
-- DELETE viene scartato → gli altri giocatori non vedono chi viene espulso/esce.
-- REPLICA IDENTITY FULL fa includere TUTTE le colonne nel payload DELETE → il
-- filtro combacia → tutti ricevono l'evento e aggiornano la lista giocatori.
-- =====================================================================
alter table public.game_players replica identity full;
