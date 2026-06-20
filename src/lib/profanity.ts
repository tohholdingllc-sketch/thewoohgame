// Filtro nickname di base — richiesto da App Store Guideline 1.2 (contenuti generati
// dagli utenti: i nickname sono visibili agli altri giocatori). Non è moderazione
// perfetta: blocca i termini più offensivi (slur/odio/sessuale esplicito) IT+EN.
// Estendibile aggiungendo voci a BANNED.

const BANNED = [
  // slur / odio (IT+EN)
  "negro", "negri", "frocio", "froci", "ricchione", "checca", "terrone", "zingaro",
  "nigger", "nigga", "faggot", "retard", "tranny", "chink", "spic", "kike",
  // sessuale esplicito
  "porn", "porno", "rape", "stupro", "pedo", "pedofil", "incest", "incest",
  // odio
  "hitler", "nazi", "nazis", "isis", "kkk",
];

// Mappa leetspeak comune così "n3gr0" → "negro"
const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .split("")
    .map((c) => LEET[c] ?? c)
    .join("")
    .replace(/[^a-z]/g, ""); // tieni solo lettere → rimuove accenti/spazi/punti tra i caratteri
}

/** true se il nickname è accettabile (non contiene termini vietati). */
export function isNicknameClean(name: string): boolean {
  const n = normalize(name || "");
  if (!n) return true; // vuoto = ok (verrà auto-generato)
  return !BANNED.some((w) => n.includes(w));
}
