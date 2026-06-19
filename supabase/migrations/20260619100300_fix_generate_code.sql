-- Fix: variabile locale 'code' in conflitto con la colonna games.code
-- ("column reference code is ambiguous"). Rinominata in v_code.
create or replace function public.generate_game_code()
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_code text;
  i int;
  taken boolean;
begin
  loop
    v_code := '';
    for i in 1..5 loop
      v_code := v_code || substr(alphabet, floor(random() * length(alphabet))::int + 1, 1);
    end loop;
    select exists(select 1 from public.games g where g.code = v_code) into taken;
    exit when not taken;
  end loop;
  return v_code;
end;
$$;
