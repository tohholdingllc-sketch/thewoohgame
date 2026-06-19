import type { I18n } from "@/lib/types";

export interface CardRow {
  id: string;
  type: string;
  text: I18n;
  param: { tema?: I18n } | null;
  is_persistent: boolean;
  needs_target: number;
  penalty: number;
}

export interface Target {
  nickname: string;
  nickname_color: string | null;
  avatar_id: string | null;
}

/** Etichetta + emoji per ogni tipo di carta (mostrati come badge sulla carta). */
export const CARD_TYPE_META: Record<string, { label: string; emoji: string }> = {
  io_non_ho_mai: { label: "Io non ho mai", emoji: "🙈" },
  tre_cose: { label: "Le 3 cose", emoji: "✋" },
  sinonimi: { label: "Sinonimi", emoji: "🔤" },
  azione: { label: "Azione", emoji: "🎯" },
  regola: { label: "Regola", emoji: "📜" },
  wooh: { label: "WOOH!", emoji: "🗣️" },
  manichino: { label: "Manichino", emoji: "🪆" },
};

export function cardTypeMeta(type: string) {
  return CARD_TYPE_META[type] ?? { label: "Carta", emoji: "🎴" };
}

/** Sostituisce {player} / {player2} con i nomi dei giocatori estratti. */
export function substituteTargets(text: string, targets: Target[]): string {
  return text
    .replaceAll("{player}", targets[0]?.nickname ?? "qualcuno")
    .replaceAll("{player2}", targets[1]?.nickname ?? "un altro");
}
