"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { WoohEmoji } from "@/components/WoohEmoji";
import { cardTypeMeta, substituteTargets, type CardRow, type Target } from "@/lib/cards";
import type { Game, I18n, Locale } from "@/lib/types";

interface GameBoardProps {
  game: Game;
  cardsById: Record<string, CardRow>;
  isMaster: boolean;
  onAdvance: () => Promise<void>;
  onRestart: () => Promise<void>;
  onExit: () => void;
  locale?: Locale;
}

export function GameBoard({
  game,
  cardsById,
  isMaster,
  onAdvance,
  onRestart,
  onExit,
  locale = "it",
}: GameBoardProps) {
  const [busy, setBusy] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const len = game.card_queue.length;
  const idx = game.current_card_index;
  const ended = game.status === "ended" || idx >= len;

  const doAdvance = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    await onAdvance();
    setBusy(false);
  }, [busy, onAdvance]);

  // Desktop: spazio / freccia destra avanzano (solo master)
  useEffect(() => {
    if (!isMaster || ended) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        void doAdvance();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMaster, ended, doAdvance]);

  const InfoButton = (
    <button
      type="button"
      onClick={() => setShowInfo((s) => !s)}
      aria-label="Gioco responsabile"
      className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-surface/60 text-lg pad-safe-t"
    >
      ℹ️
    </button>
  );

  const InfoOverlay = showInfo ? (
    <button
      type="button"
      onClick={() => setShowInfo(false)}
      className="absolute inset-0 z-20 flex items-center justify-center bg-night/80 px-8 text-center"
    >
      <p className="max-w-sm text-ink-soft">
        Gioca responsabilmente. Tutte le carte funzionano anche con bevande
        analcoliche. Se bevi, non guidare. <span className="text-white">18+</span>
      </p>
    </button>
  ) : null;

  // ---- Schermata di fine partita ----
  if (ended) {
    return (
      <main className="relative flex-1 flex flex-col items-center justify-center gap-7 px-6 py-10 pad-safe-t pad-safe-b text-center">
        {InfoButton}
        {InfoOverlay}
        <WoohEmoji variant="wooh" size={120} style={{ animation: "wooh-pop 0.5s ease-out" }} />
        <div>
          <h1 className="font-display text-4xl text-white">Fine partita!</h1>
          <p className="mt-1 text-ink-soft">Avete fatto WOOH fino in fondo 🍻</p>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-3">
          {isMaster ? (
            <Button variant="magenta" size="lg" className="w-full" disabled={busy} onClick={async () => { setBusy(true); await onRestart(); setBusy(false); }}>
              🔄 Rigioca
            </Button>
          ) : (
            <p className="text-ink-soft">In attesa del master…</p>
          )}
          <button type="button" onClick={onExit} className="text-sm text-ink-faint underline underline-offset-4">
            Esci
          </button>
        </div>
      </main>
    );
  }

  const card = cardsById[game.card_queue[idx]];
  if (!card) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-yellow" />
      </main>
    );
  }

  const meta = cardTypeMeta(card.type);
  const targets = (game.current_targets ?? []) as Target[];
  const text = substituteTargets(card.text[locale] ?? card.text.it, targets);
  const rule = (game.active_rules?.[0] as I18n | undefined) ?? undefined;
  const isWooh = card.type === "wooh";

  return (
    <main className="relative flex-1 flex flex-col px-5 py-6 pad-safe-t pad-safe-b">
      {InfoButton}
      {InfoOverlay}

      {/* Badge regola persistente attiva */}
      {rule ? (
        <div className="mx-auto mb-3 max-w-md rounded-full border-2 border-violet bg-violet/20 px-4 py-1.5 text-center text-sm text-white">
          📜 {rule[locale] ?? rule.it}
        </div>
      ) : null}

      {/* Progresso */}
      <div className="mb-2 text-center text-sm font-bold text-ink-faint">
        {idx + 1} / {len}
      </div>

      {/* Carta a tutto schermo */}
      <div
        key={idx}
        className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
        style={{ animation: "card-in 0.28s ease-out" }}
      >
        {isWooh ? (
          <WoohEmoji variant="wooh" size={130} style={{ animation: "wooh-pop 0.5s ease-out" }} />
        ) : (
          <span className="text-6xl">{meta.emoji}</span>
        )}
        <span className="rounded-full bg-surface-2 px-4 py-1 font-display text-sm uppercase tracking-widest text-ink-soft">
          {meta.label}
        </span>
        <p className="max-w-md font-display text-3xl leading-tight text-white sm:text-4xl">
          {text}
        </p>
      </div>

      {/* Controlli */}
      <div className="mt-4 flex flex-col items-center gap-2">
        {isMaster ? (
          <Button variant="magenta" size="lg" className="w-full max-w-md" disabled={busy} onClick={doAdvance}>
            {idx + 1 >= len ? "Termina 🏁" : "Avanti →"}
          </Button>
        ) : (
          <p className="py-3 text-center text-sm text-ink-soft">
            Il master sta scorrendo le carte…
          </p>
        )}
      </div>
    </main>
  );
}
