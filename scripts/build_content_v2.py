"""Assembla le 300 carte (6 file JSON generati dagli agenti) in una migration.
Ricostruisce i mazzi: Start, Spicy, Deep, Hot, Coppia, Streap(bloccato).
Uso: python scripts/build_content_v2.py
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRATCH = r"C:/Users/stefa/AppData/Local/Temp/claude/C--Users-stefa-Desktop-CLAUDE-MARKETING/f7a07223-16e9-4792-8641-a6543a20412c/scratchpad"

ALLOWED = {"io_non_ho_mai", "tre_cose", "sinonimi", "azione", "regola", "wooh", "manichino", "domanda"}

# (slug, file, name_it, name_en, desc_it, desc_en, intensity, is_premium, sort, old_slug_to_rename_from)
DECKS = [
    ("start",  "cards_start.json",  "Start",  "Start",  "Per rompere il ghiaccio e scaldare il gruppo", "Break the ice and warm up the group", 1, False, 1, "start"),
    ("spicy",  "cards_spicy.json",  "Spicy",  "Spicy",  "Sfacciato e civettuolo: domande pungenti e sfide", "Cheeky and flirty: bold questions and dares", 2, False, 2, "mood"),
    ("deep",   "cards_deep.json",   "Deep",   "Deep",   "Domande vere e confessioni profonde", "Real questions and deep confessions", 2, False, 3, "profondo"),
    ("hot",    "cards_hot.json",    "Hot",    "Hot",    "Piccante e sensuale. Solo per adulti", "Spicy and sensual. Adults only", 3, False, 4, "hot"),
    ("coppia", "cards_coppia.json", "Coppia", "Couple", "Pensato per chi gioca in coppia", "Made for couples", 2, False, 5, "coppia"),
    ("streap", "cards_streap.json", "Streap", "Streap", "Sfide bollenti in stile striptease. Sbloccalo per osare", "Red-hot striptease dares. Unlock to dare", 3, True, 6, "ambiente"),
]


def q(s):
    """Single-quote-escape per SQL."""
    return s.replace("'", "''")


def load(fn):
    path = os.path.join(SCRATCH, fn)
    with open(path, encoding="utf-8") as f:
        raw = f.read().strip()
    # togli eventuali fence markdown
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)


def norm(card):
    t = card.get("type")
    if t not in ALLOWED:
        t = card.get("type_real") if card.get("type_real") in ALLOWED else "azione"
    it = (card.get("it") or "").strip()
    en = (card.get("en") or it).strip()
    pen = int(card.get("penalty") or 1)
    pen = max(1, min(9, pen))
    return {"type": t, "it": it, "en": en, "penalty": pen}


lines = []
lines.append("-- =====================================================================")
lines.append("-- CONTENUTI v2: 6 mazzi (Start, Spicy, Deep, Hot, Coppia, Streap bloccato)")
lines.append("-- 50 carte per mazzo, con {player}/{player2} dove serve. Rigenera tutto.")
lines.append("-- =====================================================================")
lines.append("begin;")
lines.append("delete from public.cards;")
lines.append("delete from public.decks where slug = 'karaoke';")

report = {}
card_values = []
for slug, fn, n_it, n_en, d_it, d_en, inten, prem, sort, old in DECKS:
    cards = [norm(c) for c in load(fn)]
    cards = [c for c in cards if c["it"]][:50]
    report[slug] = len(cards)

    name = json.dumps({"it": n_it, "en": n_en}, ensure_ascii=False)
    desc = json.dumps({"it": d_it, "en": d_en}, ensure_ascii=False)
    # rinomina/aggiorna il mazzo esistente (riusa l'id) per lo slug 'old'
    lines.append(
        f"update public.decks set slug='{slug}', name='{q(name)}', description='{q(desc)}', "
        f"intensity={inten}, is_premium={'true' if prem else 'false'}, min_players=2, sort_order={sort} "
        f"where slug='{old}';"
    )
    for i, c in enumerate(cards):
        text = json.dumps({"it": c["it"], "en": c["en"]}, ensure_ascii=False)
        needs = 2 if "{player2}" in (c["it"] + c["en"]) else (1 if "{player}" in (c["it"] + c["en"]) else 0)
        persistent = "true" if c["type"] == "regola" else "false"
        card_values.append(
            f"('{slug}','{c['type']}','{q(text)}',{c['penalty']},{persistent},{needs},{i + 1})"
        )

lines.append("")
lines.append("insert into public.cards (deck_id, type, text, penalty, is_persistent, needs_target, min_players, sort_order)")
lines.append("select d.id, x.type, x.text::jsonb, x.penalty, x.is_persistent, x.needs_target, 2, x.ord")
lines.append("from (values")
lines.append("  " + ",\n  ".join(card_values))
lines.append(") as x(deck_slug, type, text, penalty, is_persistent, needs_target, ord)")
lines.append("join public.decks d on d.slug = x.deck_slug;")
lines.append("commit;")

out = os.path.join(ROOT, "supabase", "migrations", "20260619130000_content_v2.sql")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

print("Report carte per mazzo:", report)
print("TOTALE carte:", sum(report.values()))
print("Migration scritta:", out)
