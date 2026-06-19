// Sostituisce "sorsi"/"sorso" (IT) e "sips"/"sip" (EN) con "WOOH" nei testi delle carte.
// WOOH = il modo del brand per dire "sorsi": va urlato il più possibile.
// Uso: node scripts/woohify.mjs   (dalla root del progetto)
import fs from "node:fs";

const path = "data/cards.seed.json";
let txt = fs.readFileSync(path, "utf8");
const before = txt;

txt = txt
  .replaceAll("sorsi", "WOOH")
  .replaceAll("sorso", "WOOH")
  .replaceAll("sips", "WOOH")
  .replaceAll("a sip", "a WOOH");

fs.writeFileSync(path, txt, "utf8");

const count = (before.match(/sorsi|sorso|sips|a sip/g) ?? []).length;
console.log(`woohify: ${count} occorrenze sostituite con WOOH`);
