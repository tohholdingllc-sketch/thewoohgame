import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Lobby } from "@/components/lobby/Lobby";
import { getLocale } from "@/lib/locale-server";
import type { Deck, Game, GamePlayer } from "@/lib/types";

export default async function GamePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const codeUpper = code.toUpperCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/join?code=${codeUpper}`);

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("code", codeUpper)
    .maybeSingle();

  // Partita inesistente o non ancora unito → passa da /join (auto-compila il codice)
  if (!game) redirect(`/join?code=${codeUpper}`);

  const [{ data: players }, { data: decks }, locale] = await Promise.all([
    supabase.from("game_players").select("*").eq("game_id", game.id).order("joined_at"),
    supabase.from("decks").select("*").order("sort_order"),
    getLocale(),
  ]);

  return (
    <Lobby
      initialGame={game as Game}
      initialPlayers={(players ?? []) as GamePlayer[]}
      decks={(decks ?? []) as Deck[]}
      userId={user.id}
      locale={locale}
    />
  );
}
