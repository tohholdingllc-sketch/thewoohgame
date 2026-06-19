import type { WoohVariant } from "@/components/WoohEmoji";

/**
 * Set di avatar predefiniti.
 * - Le 4 facce "WOOH" (vettoriali, brand) in cima.
 * - Poi emoji unicode (zero peso, offline). `img` opzionale per immagini custom.
 */
export type Avatar = {
  id: string;
  label: string;
  wooh?: WoohVariant;
  emoji?: string;
  img?: string;
};

export const AVATARS: Avatar[] = [
  { id: "wooh", label: "Wooh", wooh: "wooh" },
  { id: "wooh-love", label: "Innamorato", wooh: "love" },
  { id: "wooh-money", label: "Vincita", wooh: "money" },
  { id: "wooh-drunk", label: "Sbronzo", wooh: "drunk" },
  { id: "party", emoji: "🥳", label: "Festaiolo" },
  { id: "cool", emoji: "😎", label: "Figo" },
  { id: "unicorn", emoji: "🦄", label: "Unicorno" },
  { id: "alien", emoji: "👽", label: "Alieno" },
  { id: "ghost", emoji: "👻", label: "Fantasma" },
  { id: "fox", emoji: "🦊", label: "Volpe" },
  { id: "robot", emoji: "🤖", label: "Robot" },
  { id: "cat", emoji: "😺", label: "Gatto" },
  { id: "dragon", emoji: "🐲", label: "Drago" },
  { id: "clown", emoji: "🤡", label: "Clown" },
];

export function avatarById(id?: string | null): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
