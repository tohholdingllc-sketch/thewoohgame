// Genera la migration SQL di seed (decks + cards) da data/cards.seed.json.
// Usa il dollar-quoting di Postgres ($j$...$j$) per i payload JSON → nessun
// problema con apostrofi/virgolette nei testi italiani.
// Uso: node scripts/gen-seed.mjs   (dalla root del progetto)
import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("data/cards.seed.json", "utf8"));
const jb = (obj) => `$j$${JSON.stringify(obj)}$j$::jsonb`;

let sql = `-- AUTO-GENERATO da data/cards.seed.json — non modificare a mano (rigenera con: node scripts/gen-seed.mjs)\n`;
sql += `-- Seed: mazzi + carte (Fase 1)\n\n`;

// --- DECKS (upsert su slug) ---
sql += `insert into public.decks (slug, name, description, intensity, is_premium, min_players, sort_order) values\n`;
sql += data.decks
  .map(
    (d) =>
      `  ('${d.slug}', ${jb(d.name)}, ${jb(d.description)}, ${d.intensity}, ${d.is_premium}, ${d.min_players}, ${d.sort_order})`,
  )
  .join(",\n");
sql += `\non conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  intensity = excluded.intensity,
  is_premium = excluded.is_premium,
  min_players = excluded.min_players,
  sort_order = excluded.sort_order;\n\n`;

// --- CARDS (reseed pulito) ---
sql += `delete from public.cards;\n`;
sql += `insert into public.cards (deck_id, type, text, param, is_persistent, needs_target, min_players, sort_order) values\n`;
const orderByDeck = {};
sql += data.cards
  .map((c) => {
    orderByDeck[c.deck] = (orderByDeck[c.deck] || 0) + 1;
    const param = c.param ? jb(c.param) : "null";
    return `  ((select id from public.decks where slug='${c.deck}'), '${c.type}', ${jb(c.text)}, ${param}, ${c.is_persistent}, ${c.needs_target}, ${c.min_players ?? 1}, ${orderByDeck[c.deck]})`;
  })
  .join(",\n");
sql += ";\n";

fs.writeFileSync("supabase/migrations/20260619100100_seed_decks_cards.sql", sql, "utf8");
console.log(`OK: ${data.decks.length} mazzi, ${data.cards.length} carte → supabase/migrations/20260619100100_seed_decks_cards.sql`);
