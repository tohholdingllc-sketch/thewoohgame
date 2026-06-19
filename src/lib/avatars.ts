/**
 * Set di avatar predefiniti. Baseline a emoji (zero peso, offline, sempre nitidi);
 * `img` opzionale per sostituirli con illustrazioni custom (es. generate con
 * Higgsfield) senza cambiare l'API: basta aggiungere il path PNG in /public/avatars.
 */
export type Avatar = {
  id: string;
  emoji: string;
  label: string;
  img?: string;
};

export const AVATARS: Avatar[] = [
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
