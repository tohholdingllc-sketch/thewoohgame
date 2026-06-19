// Genera la migration SQL di re-seed (decks + cards) da data/cards.seed.json.
// Dollar-quoting ($j$...$j$) per i payload JSON (niente problemi con apostrofi/virgolette).
// Aggiunge la colonna `penalty` (WOOH da bere se salti la carta) = intensità del mazzo.
// Uso: node scripts/gen-seed.mjs   (dalla root del progetto)
import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("data/cards.seed.json", "utf8"));
const jb = (obj) => `$j$${JSON.stringify(obj)}$j$::jsonb`;
const intensityBySlug = Object.fromEntries(data.decks.map((d) => [d.slug, d.intensity]));

let sql = `-- AUTO-GENERATO da data/cards.seed.json — rigenera con: node scripts/gen-seed.mjs\n`;
sql += `-- Re-seed: testi WOOH + colonna penalty (WOOH da bere se salti la carta)\n\n`;
sql += `alter table public.cards add column if not exists penalty int not null default 2;\n\n`;
sql += `alter table public.cards drop constraint if exists cards_type_chk;\n`;
sql += `alter table public.cards add constraint cards_type_chk check (type in ('io_non_ho_mai','tre_cose','sinonimi','azione','regola','wooh','manichino','domanda'));\n\n`;

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
sql += `insert into public.cards (deck_id, type, text, param, is_persistent, needs_target, min_players, penalty, sort_order) values\n`;
const orderByDeck = {};
sql += data.cards
  .map((c) => {
    orderByDeck[c.deck] = (orderByDeck[c.deck] || 0) + 1;
    const param = c.param ? jb(c.param) : "null";
    const penalty = intensityBySlug[c.deck] ?? 2;
    return `  ((select id from public.decks where slug='${c.deck}'), '${c.type}', ${jb(c.text)}, ${param}, ${c.is_persistent}, ${c.needs_target}, ${c.min_players ?? 1}, ${penalty}, ${orderByDeck[c.deck]})`;
  })
  .join(",\n");
sql += ";\n";

fs.writeFileSync("supabase/migrations/20260619100700_expand_content.sql", sql, "utf8");
console.log(`OK: re-seed ${data.decks.length} mazzi, ${data.cards.length} carte (con penalty) → 20260619100700_expand_content.sql`);
