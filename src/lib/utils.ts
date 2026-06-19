/** Minimal className joiner (no extra deps). Filtra valori falsy e unisce. */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}
