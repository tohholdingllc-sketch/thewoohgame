"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { DeckCard } from "@/components/DeckCard";
import type { Deck, Game, GamePlayer } from "@/lib/types";

interface LobbyProps {
  initialGame: Game;
  initialPlayers: GamePlayer[];
  decks: Deck[];
  userId: string;
}

export function Lobby({ initialGame, initialPlayers, decks, userId }: LobbyProps) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [game, setGame] = useState<Game>(initialGame);
  const [players, setPlayers] = useState<GamePlayer[]>(initialPlayers);
  const [manualName, setManualName] = useState("");
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const isMaster = game.master_id === userId;
  const selected = game.selected_decks ?? [];

  const refetchPlayers = useCallback(async () => {
    const { data } = await supabase
      .from("game_players")
      .select("*")
      .eq("game_id", game.id)
      .order("joined_at");
    if (data) setPlayers(data as GamePlayer[]);
  }, [supabase, game.id]);

  // Realtime: giocatori che entrano/escono + aggiornamenti partita
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

  async function toggleDeck(id: string) {
    if (!isMaster) return;
    const next = selected.includes(id) ? selected.filter((d) => d !== id) : [...selected, id];
    setGame((g) => ({ ...g, selected_decks: next }));
    await supabase.from("games").update({ selected_decks: next }).eq("id", game.id);
  }

  async function addManual() {
    const n = manualName.trim();
    if (!n) return;
    setManualName("");
    await supabase.rpc("add_manual_player", {
      p_game_id: game.id,
      p_nickname: n,
      p_avatar_id: "wooh",
      p_color: "#ffd23f",
    });
  }

  function copyInvite() {
    const url = `${location.origin}/join?code=${game.code}`;
    void navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function startGame() {
    // Il motore di gioco (mischiata carte + sincronizzazione) arriva nella Fase 3.
    setNote("🚧 Il motore di gioco arriva nella Fase 3.");
  }

  const canStart = isMaster && players.length >= 2 && selected.length >= 1;

  return (
    <main className="flex-1 flex flex-col items-center px-5 py-7 pad-safe-t pad-safe-b">
      <div className="flex w-full max-w-xl flex-col gap-6">
        {/* Codice + invito */}
        <div className="flex flex-col items-center gap-2 rounded-blob border-2 border-line bg-surface/50 p-5">
          <span className="text-sm uppercase tracking-widest text-ink-soft">Codice partita</span>
          <span className="font-display text-6xl tracking-[0.15em] text-white">{game.code}</span>
          <button
            type="button"
            onClick={copyInvite}
            className="mt-1 rounded-full bg-cyan px-5 py-2 font-display font-bold text-ink-dark"
          >
            {copied ? "Link copiato! ✅" : "📋 Invita amici"}
          </button>
        </div>

        {/* Giocatori */}
        <section>
          <h2 className="mb-3 font-display text-xl text-white">
            Giocatori <span className="text-ink-soft">({players.length})</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            {players.map((p) => (
              <PlayerAvatar
                key={p.id}
                avatarId={p.avatar_id}
                color={p.nickname_color}
                name={p.nickname + (p.profile_id === game.master_id ? " 👑" : "")}
                size={64}
              />
            ))}
          </div>
        </section>

        {isMaster ? (
          <>
            {/* Aggiungi giocatore manuale */}
            <div className="flex gap-2">
              <input
                className="h-12 flex-1 rounded-2xl border-2 border-line bg-white px-4 font-semibold text-ink-dark placeholder:text-ink-dark/40 focus:border-magenta focus:outline-none"
                placeholder="Aggiungi giocatore a mano…"
                maxLength={20}
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addManual()}
              />
              <Button variant="lime" size="md" onClick={addManual}>
                +
              </Button>
            </div>

            {/* Selezione mazzi */}
            <section>
              <h2 className="mb-3 font-display text-xl text-white">Scegli i mazzi</h2>
              <div className="grid gap-3">
                {decks.map((d) => (
                  <DeckCard
                    key={d.id}
                    deck={d}
                    selected={selected.includes(d.id)}
                    onToggle={() => toggleDeck(d.id)}
                  />
                ))}
              </div>
            </section>

            {/* Avvio */}
            <Button variant="magenta" size="lg" className="w-full" disabled={!canStart} onClick={startGame}>
              {canStart ? "🚀 Inizia partita" : "Servono 2+ giocatori e 1 mazzo"}
            </Button>
            {note ? <p className="text-center text-sm text-ink-soft">{note}</p> : null}
          </>
        ) : (
          /* Vista ospite */
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-yellow" />
            <p className="max-w-xs text-ink-soft">
              Aspetta che il master faccia iniziare la partita…
            </p>
            {selected.length > 0 ? (
              <p className="text-sm text-ink-faint">
                Mazzi scelti:{" "}
                {decks
                  .filter((d) => selected.includes(d.id))
                  .map((d) => d.name.it)
                  .join(", ")}
              </p>
            ) : null}
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/play")}
          className="mx-auto mt-2 text-sm text-ink-faint underline underline-offset-4"
        >
          Esci dalla lobby
        </button>
      </div>
    </main>
  );
}
