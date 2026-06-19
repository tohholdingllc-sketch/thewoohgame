-- Codice partita SOLO NUMERICO: le lettere confondevano (case, O/0, I/1/L).
-- 5 cifre zero-padded (es. "04827"), retry su collisione. games.code resta text.
create or replace function public.generate_game_code()
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  v_code text;
  taken boolean;
begin
  loop
    v_code := lpad(floor(random() * 100000)::int::text, 5, '0');
    select exists(select 1 from public.games g where g.code = v_code) into taken;
    exit when not taken;
  end loop;
  return v_code;
end;
$$;
