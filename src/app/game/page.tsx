"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lobby } from "@/components/lobby/Lobby";
import { getClientLocale } from "@/lib/locale-client";
import type { Deck, Game, GamePlayer, Locale } from "@/lib/types";

interface Loaded {
  game: Game;
  players: GamePlayer[];
  decks: Deck[];
  userId: string;
  locale: Locale;
}

function GameInner() {
  const router = useRouter();
  const params = useSearchParams();
  const code = (params.get("code") ?? "").replace(/\D/g, "").slice(0, 5);
  const [data, setData] = useState<Loaded | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        router.replace(`/join?code=${code}`);
        return;
      }
      const { data: game } = await supabase
        .from("games")
        .select("*")
        .eq("code", code)
        .maybeSingle();
      if (!game) {
        router.replace(`/join?code=${code}`);
        return;
      }
      const [{ data: players }, { data: decks }] = await Promise.all([
        supabase.from("game_players").select("*").eq("game_id", game.id).order("joined_at"),
        supabase.from("decks").select("*").order("sort_order"),
      ]);
      setData({
        game: game as Game,
        players: (players ?? []) as GamePlayer[],
        decks: (decks ?? []) as Deck[],
        userId: user.id,
        locale: getClientLocale(),
      });
    })();
  }, [router, code]);

  if (!data) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-yellow" />
      </main>
    );
  }

  return (
    <Lobby
      initialGame={data.game}
      initialPlayers={data.players}
      decks={data.decks}
      userId={data.userId}
      locale={data.locale}
    />
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <GameInner />
    </Suspense>
  );
}
