import type { WoohVariant } from "@/components/WoohEmoji";

/** Avatar giocatore. `img` = PNG in /public/avatars (generati con Higgsfield). */
export type Avatar = {
  id: string;
  label: string;
  img?: string;
  wooh?: WoohVariant;
  emoji?: string;
};

const LIST: [string, string][] = [
  ["fox", "Volpe"],
  ["cat", "Gatto"],
  ["dog", "Cane"],
  ["panda", "Panda"],
  ["bear", "Orso"],
  ["koala", "Koala"],
  ["lion", "Leone"],
  ["tiger", "Tigre"],
  ["monkey", "Scimmia"],
  ["frog", "Rana"],
  ["penguin", "Pinguino"],
  ["owl", "Gufo"],
  ["unicorn", "Unicorno"],
  ["dragon", "Drago"],
  ["alien", "Alieno"],
  ["robot", "Robot"],
  ["ghost", "Fantasma"],
  ["raccoon", "Procione"],
  ["llama", "Lama"],
];

export const AVATARS: Avatar[] = LIST.map(([id, label]) => ({
  id,
  label,
  img: `/avatars/${id}.png`,
}));

export function avatarById(id?: string | null): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
