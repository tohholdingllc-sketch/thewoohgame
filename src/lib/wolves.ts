/** Mascotte lupo (PNG trasparenti generati con Higgsfield, in /public/brand). */
export const WOLVES = ["love", "money", "drunk"] as const;
export type WolfVariant = (typeof WOLVES)[number];

export function wolfSrc(v: WolfVariant): string {
  return `/brand/wolf-${v}.png`;
}

/** Sceglie un lupo in modo deterministico (varia per indice carta). */
export function wolfForIndex(i: number): WolfVariant {
  return WOLVES[((i % WOLVES.length) + WOLVES.length) % WOLVES.length];
}
