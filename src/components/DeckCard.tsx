import { cn } from "@/lib/utils";
import type { Deck, Locale } from "@/lib/types";

interface DeckCardProps {
  deck: Deck;
  selected: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  locale?: Locale;
}

/** Rettangolo mazzo: nome + descrizione + intensità 🌶️ (selezionabile dal master). */
export function DeckCard({ deck, selected, onToggle, disabled, locale = "it" }: DeckCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full flex-col items-start gap-1 rounded-blob border-2 p-4 text-left transition-all active:translate-y-[2px]",
        selected
          ? "border-yellow bg-surface-2 shadow-[0_5px_0_0_#1c0838]"
          : "border-line bg-surface/50",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="font-display text-lg text-ink">{deck.name?.[locale] ?? deck.name?.it ?? deck.slug}</span>
        <span className="shrink-0 text-sm">
          {"🌶️".repeat(deck.intensity)}
          {deck.is_premium ? " 🔒" : ""}
        </span>
      </div>
      <span className="text-sm text-ink-soft">{deck.description?.[locale] ?? deck.description?.it ?? ""}</span>
    </button>
  );
}
