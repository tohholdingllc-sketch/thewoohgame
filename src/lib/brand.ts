/** Costanti di brand riusabili (lato JS, oltre ai token Tailwind). */
export const BRAND = {
  name: "The WOOH Game",
  shortName: "WOOH",
  tagline: "Una partita. Tutti col proprio telefono.",
  themeColor: "#8a27d6",
} as const;

/** Palette accenti come valori JS (per avatar, colori nickname, grafici, ecc.). */
export const ACCENTS = {
  yellow: "#ffd23f",
  cyan: "#3dd6d0",
  magenta: "#ff5da2",
  lime: "#9be564",
  violet: "#8b5cf6",
  orange: "#ff8a3d",
} as const;

/** Colori selezionabili per il nickname in fase di login/profilo. */
export const NICKNAME_COLORS: string[] = [
  ACCENTS.yellow,
  ACCENTS.cyan,
  ACCENTS.magenta,
  ACCENTS.lime,
  ACCENTS.violet,
  ACCENTS.orange,
];
