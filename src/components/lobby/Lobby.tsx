"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { DeckCard } from "@/components/DeckCard";
import { GameBoard } from "@/components/game/GameBoard";
import { MasterMenu } from "@/components/MasterMenu";
import { QRCodeSVG } from "qrcode.react";
import { getDict } from "@/lib/i18n";
import { isNicknameClean } from "@/lib/profanity";
import { BRAND } from "@/lib/brand";
import type { CardRow } from "@/lib/cards";
import type { Deck, Game, GamePlayer, Locale } from "@/lib/types";

interface LobbyProps {
  initialGame: Game;
  initialPlayers: GamePlayer[];
  decks: Deck[];
  userId: string;
  locale: Locale;
}

export function Lobby({ initialGame, initialPlayers, decks, userId, locale }: LobbyProps) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [game, setGame] = useState<Game>(initialGame);
  const [players, setPlayers] = useState<GamePlayer[]>(initialPlayers);
  const [cardsById, setCardsById] = useState<Record<string, CardRow>>({});
  const [manualName, setManualName] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const d = getDict(locale);
  const isMaster = game.master_id === userId;
  const selected = game.selected_decks ?? [];
  const queueLen = (game.card_queue ?? []).length;
  const inviteUrl = `${BRAND.url}/join?code=${game.code}`;

  const refetchPlayers = useCallback(async () => {
    const { data } = await supabase
      .from("game_players")
      .select("*")
      .eq("game_id", game.id)
      .order("joined_at");
    if (data) setPlayers(data as GamePlayer[]);
  }, [supabase, game.id]);

  useEffect(() => {
    const channel = supabase
      .channel(`game-${game.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_players", filter: `game_id=eq.${game.id}` },
        () => {
          void refetchPlayers();
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${game.id}` },
        (payload) => setGame(payload.new as Game),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, game.id, refetchPlayers]);

  useEffect(() => {
    if (game.status === "lobby") return;
    const ids = game.card_queue ?? [];
    if (ids.length === 0) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("cards")
        .select("id,type,text,param,is_persistent,needs_target,penalty")
        .in("id", ids);
      if (active && data) {
        const map: Record<string, CardRow> = {};
        for (const c of data as CardRow[]) map[c.id] = c;
        setCardsById(map);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, game.status, queueLen]);

  async function toggleDeck(id: string) {
    if (!isMaster) return;
    if (decks.find((dk) => dk.id === id)?.is_premium) return; // mazzo bloccato (es. Streap)
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setGame((g) => ({ ...g, selected_decks: next }));
    await supabase.from("games").update({ selected_decks: next }).eq("id", game.id);
  }

  async function kickPlayer(playerId: string) {
    await supabase.from("game_players").delete().eq("id", playerId);
  }

  async function leaveLobby() {
    const me = players.find((p) => p.profile_id === userId);
    if (me) await supabase.from("game_players").delete().eq("id", me.id);
    router.push("/play");
  }

  async function addManual() {
    const n = manualName.trim();
    if (!n) return;
    if (!isNicknameClean(n)) {
      setError(d.nickBadWord);
      return;
    }
    setManualName("");
    await supabase.rpc("add_manual_player", {
      p_game_id: game.id,
      p_nickname: n,
      p_avatar_id: "fox",
      p_color: "#ffd23f",
    });
  }

  function copyInvite() {
    void navigator.clipboard?.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const start = useCallback(async () => {
    setError(null);
    const { error } = await supabase.rpc("start_game", { p_game_id: game.id });
    if (error) setError(error.message.includes("NO_CARDS") ? d.noCards : error.message);
  }, [supabase, game.id, d.noCards]);

  const advance = useCallback(async () => {
    await supabase.rpc("advance_card", { p_game_id: game.id });
  }, [supabase, game.id]);

  const canStart = isMaster && players.length >= 2 && selected.length >= 1;

  if (game.status !== "lobby") {
    return (
      <GameBoard
        game={game}
        cardsById={cardsById}
        isMaster={isMaster}
        onAdvance={advance}
        onRestart={start}
        onExit={() => router.push("/play")}
        locale={locale}
      />
    );
  }

  return (
    <main className="relative flex-1 flex flex-col items-center px-5 pt-14 pb-10 pad-safe-t pad-safe-b">
      {isMaster ? (
        <MasterMenu
          label={d.menuLabel}
          actions={[{ label: d.exitGame, onClick: () => void leaveLobby(), danger: true }]}
        />
      ) : null}
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div className="flex flex-col items-center gap-2 rounded-blob border-2 border-line bg-surface/50 p-5">
          <span className="text-sm uppercase tracking-widest text-ink-soft">{d.gameCode}</span>
          <span className="font-display text-6xl tracking-[0.15em] text-white">{game.code}</span>
          {inviteUrl ? (
            <div className="mt-2 rounded-2xl bg-white p-2.5">
              <QRCodeSVG value={inviteUrl} size={148} bgColor="#ffffff" fgColor="#2a0f4d" level="M" />
            </div>
          ) : null}
          <button
            type="button"
            onClick={copyInvite}
            className="mt-1 rounded-full bg-cyan px-5 py-2 font-display font-bold text-ink-dark"
          >
            {copied ? d.linkCopied : d.invite}
          </button>
        </div>

        <section>
          <h2 className="mb-3 font-display text-xl text-white">
            {d.players} <span className="text-ink-soft">({players.length})</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            {players.map((p) => (
              <div key={p.id} className="relative">
                <PlayerAvatar
                  avatarId={p.avatar_id}
                  color={p.nickname_color}
                  name={p.nickname + (p.profile_id === game.master_id ? " 👑" : "")}
                  size={64}
                />
                {isMaster && p.profile_id !== userId ? (
                  <button
                    type="button"
                    onClick={() => kickPlayer(p.id)}
                    aria-label={`Espelli ${p.nickname}`}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-night bg-magenta text-sm font-bold leading-none text-white"
                  >
                    ×
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {isMaster ? (
          <>
            <div className="flex gap-2">
              <input
                className="h-12 flex-1 rounded-2xl border-2 border-line bg-white px-4 font-semibold text-ink-dark placeholder:text-ink-dark/40 focus:border-magenta focus:outline-none"
                placeholder={d.addManual}
                maxLength={20}
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addManual()}
              />
              <Button variant="lime" size="md" onClick={addManual}>
                +
              </Button>
            </div>

            <section>
              <h2 className="mb-3 font-display text-xl text-white">{d.chooseDecks}</h2>
              <div className="grid gap-3">
                {decks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    selected={selected.includes(deck.id)}
                    onToggle={() => toggleDeck(deck.id)}
                    disabled={deck.is_premium}
                    locale={locale}
                  />
                ))}
              </div>
            </section>

            <Button variant="magenta" size="lg" className="w-full" disabled={!canStart} onClick={start}>
              {canStart ? d.startGame : d.startNeeds}
            </Button>
            {error ? <p className="text-center text-sm text-magenta">{error}</p> : null}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-yellow" />
            <p className="max-w-xs text-ink-soft">{d.waitMaster}</p>
            {selected.length > 0 ? (
              <p className="text-sm text-ink-faint">
                {d.decksLabel}: {decks.filter((x) => selected.includes(x.id)).map((x) => x.name[locale]).join(", ")}
              </p>
            ) : null}
          </div>
        )}

        <button
          type="button"
          onClick={leaveLobby}
          className="mx-auto mt-2 text-sm text-ink-faint underline underline-offset-4"
        >
          {d.leaveLobby}
        </button>
      </div>
    </main>
  );
}
