// Sanity-check del seed via anon key (verifica anche la RLS di lettura pubblica).
// Uso: node scripts/check-seed.mjs   (dalla root del progetto)
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data: decks, error: e1 } = await sb
  .from("decks")
  .select("slug,name,intensity,is_premium,min_players")
  .order("sort_order");
console.log("DECKS:", e1 ? "ERR " + e1.message : decks.map((d) => `${d.slug}(${d.name.it},int${d.intensity}${d.is_premium ? ",premium" : ""})`).join("  "));

const { count, error: e2 } = await sb.from("cards").select("*", { count: "exact", head: true });
console.log("CARDS count:", e2 ? "ERR " + e2.message : count);

const { data: sample } = await sb
  .from("cards")
  .select("type,text,needs_target")
  .in("type", ["sinonimi", "azione", "manichino"])
  .limit(3);
console.log("SAMPLE:", JSON.stringify(sample, null, 0));

// Verifica che un insert anon su decks sia BLOCCATO da RLS (atteso: errore)
const { error: e3 } = await sb.from("decks").insert({ slug: "x", name: {}, description: {} });
console.log("RLS write-block on decks:", e3 ? "OK (bloccato)" : "PROBLEMA: insert riuscito!");
