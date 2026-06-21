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
  domanda: { label: "Domanda", emoji: "💭" },
};

export function cardTypeMeta(type: string) {
  return CARD_TYPE_META[type] ?? { label: "Carta", emoji: "🎴" };
}

/** Sostituisce {player} / {player2} con i nomi dei giocatori estratti. */
export function substituteTargets(text: string, targets: Target[]): string {
  if (typeof text !== "string") return "";
  const actor = targets[0]?.nickname ?? "qualcuno";
  const other1 = targets[1]?.nickname ?? "un altro";
  const other2 = targets[2]?.nickname ?? other1;
  // Il giocatore di turno (mostrato in alto sulla carta) è l'ATTORE.
  // Se la carta INIZIA con "{player}," → {player} = l'attore (es. "{player}, fai...").
  // Altrimenti {player} è il BERSAGLIO = un ALTRO giocatore (es. "Sussurra a {player}").
  const addressesActor = text.trimStart().startsWith("{player}");
  const p1 = addressesActor ? actor : other1;
  const p2 = addressesActor ? other1 : other2;
  return text.replaceAll("{player2}", p2).replaceAll("{player}", p1);
}
