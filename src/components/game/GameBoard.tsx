"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { wolfSrc, wolfForIndex } from "@/lib/wolves";
import { cardTypeMeta, substituteTargets, type CardRow, type Target } from "@/lib/cards";
import { getDict, cardTypeLabel } from "@/lib/i18n";
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
  const d = getDict(locale);

  const len = game.card_queue.length;
  const idx = game.current_card_index;
  const ended = game.status === "ended" || idx >= len;

  const doAdvance = useCallback(async () => {
    if (busy || !isMaster) return;
    setBusy(true);
    await onAdvance();
    setBusy(false);
  }, [busy, isMaster, onAdvance]);

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

  // Suono WOOH quando esce una carta di tipo wooh (best-effort: l'autoplay
  // parte dopo che l'utente ha già interagito con la pagina).
  useEffect(() => {
    if (ended) return;
    const current = cardsById[game.card_queue[idx]];
    if (current?.type !== "wooh") return;
    const audio = new Audio("/sounds/wooh.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {});
  }, [idx, ended, cardsById, game.card_queue]);

  const infoButton = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setShowInfo((s) => !s);
      }}
      aria-label={d.infoLabel}
      className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 font-serif text-sm italic text-white/40"
    >
      i
    </button>
  );

  const infoOverlay = showInfo ? (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setShowInfo(false);
      }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-night/85 px-8 text-center"
    >
      <p className="max-w-sm text-ink-soft">{d.disclaimerShort}</p>
    </div>
  ) : null;

  if (ended) {
    return (
      <main className="relative flex-1 flex flex-col items-center justify-center gap-7 px-6 py-10 pad-safe-t pad-safe-b text-center">
        {infoButton}
        {infoOverlay}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wolfSrc("drunk")}
          alt="Lupo WOOH"
          className="h-48 w-auto"
          style={{ animation: "wooh-pop 0.5s ease-out" }}
        />
        <div>
          <h1 className="font-display text-4xl text-white">{d.gameOver}</h1>
          <p className="mt-1 text-ink-soft">{d.gameOverSub}</p>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-3">
          {isMaster ? (
            <Button
              variant="magenta"
              size="lg"
              className="w-full"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await onRestart();
                setBusy(false);
              }}
            >
              {d.playAgain}
            </Button>
          ) : (
            <p className="text-ink-soft">{d.waitMasterShort}</p>
          )}
          <button type="button" onClick={onExit} className="text-sm text-ink-faint underline underline-offset-4">
            {d.exit}
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

  const emoji = cardTypeMeta(card.type).emoji;
  const targets = (game.current_targets ?? []) as Target[];
  const text = substituteTargets(card.text[locale] ?? card.text.it, targets);
  const rule = (game.active_rules?.[0] as I18n | undefined) ?? undefined;
  const isWooh = card.type === "wooh";
  const lastCard = idx + 1 >= len;

  return (
    <main
      onClick={isMaster ? () => void doAdvance() : undefined}
      className={`relative flex-1 flex flex-col px-5 py-6 pad-safe-t pad-safe-b ${
        isMaster ? "cursor-pointer select-none" : ""
      }`}
    >
      {infoButton}
      {infoOverlay}

      {rule ? (
        <div className="mx-auto mb-3 max-w-md rounded-full border-2 border-violet bg-violet/20 px-4 py-1.5 text-center text-sm text-white">
          📜 {rule[locale] ?? rule.it}
        </div>
      ) : null}

      <div className="mb-2 text-center text-sm font-bold text-ink-faint">
        {idx + 1} / {len}
      </div>

      <div
        key={idx}
        className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
        style={{ animation: "card-in 0.28s ease-out" }}
      >
        {isWooh ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={wolfSrc(wolfForIndex(idx))}
            alt="Lupo WOOH"
            className="h-44 w-auto drop-shadow-[0_8px_0_rgba(0,0,0,0.2)]"
            style={{ animation: "wooh-pop 0.5s ease-out" }}
          />
        ) : (
          <span className="text-6xl">{emoji}</span>
        )}
        <span className="rounded-full bg-surface-2 px-4 py-1 font-display text-sm uppercase tracking-widest text-ink-soft">
          {cardTypeLabel(d, card.type)}
        </span>
        <p className="max-w-md font-display text-3xl leading-tight text-white sm:text-4xl">{text}</p>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-night/40 px-4 py-2">
          <span className="text-xl" aria-hidden="true">{"🔥".repeat(Math.max(1, card.penalty))}</span>
          <span className="font-display text-lg text-white">{card.penalty} WOOH</span>
          <span className="text-xs text-ink-faint">{d.woohIfSkip}</span>
        </div>
        {isMaster ? (
          <p className="text-xs text-ink-faint">{lastCard ? d.tapFinish : d.tapNext}</p>
        ) : (
          <p className="text-sm text-ink-soft">{d.masterFlipping}</p>
        )}
      </div>
    </main>
  );
}
