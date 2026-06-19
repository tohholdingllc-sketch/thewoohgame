"""Esporta TUTTE le carte dal database di produzione in docs/CARTE.md (leggibile).
Riusabile: legge le chiavi da .env.local e interroga Supabase via REST.
Uso: python scripts/export_cards.py
"""
import json, os, urllib.request
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def env(key):
    with open(os.path.join(ROOT, ".env.local"), encoding="utf-8") as f:
        for line in f:
            if line.startswith(key + "="):
                return line.split("=", 1)[1].strip()
    raise SystemExit(f"Manca {key} in .env.local")


SR = env("SUPABASE_SERVICE_ROLE_KEY")
BASE = env("NEXT_PUBLIC_SUPABASE_URL")


def fetch(path):
    req = urllib.request.Request(
        f"{BASE}/rest/v1/{path}",
        headers={"apikey": SR, "Authorization": f"Bearer {SR}"},
    )
    return json.load(urllib.request.urlopen(req))


decks = fetch("decks?select=*")
cards = fetch("cards?select=*")

TYPE = {
    "io_non_ho_mai": ("🙅", "Io non ho mai"),
    "tre_cose": ("3️⃣", "Le 3 cose"),
    "sinonimi": ("🔤", "Sinonimi"),
    "azione": ("⚡", "Azione"),
    "regola": ("📜", "Regola"),
    "wooh": ("🍻", "WOOH!"),
    "manichino": ("🗿", "Manichino"),
    "domanda": ("💭", "Domanda"),
}
INT = {1: "🌶️", 2: "🌶️🌶️", 3: "🌶️🌶️🌶️"}

decks.sort(key=lambda d: d.get("sort_order", 0))
by_deck = {}
for c in cards:
    by_deck.setdefault(c["deck_id"], []).append(c)
for v in by_deck.values():
    v.sort(key=lambda c: c.get("sort_order", 0))

L = []
L.append("# 🐺 The WOOH Game — Tutte le carte")
L.append("")
L.append(f"> Estratte dal **database di produzione** (Supabase): **{len(cards)} carte** in **{len(decks)} mazzi**. Aggiornato: 19 giugno 2026.")
L.append("> Le carte vivono nel database → si possono aggiungere/modificare **senza aggiornare l'app**. `{player}`/`{player2}` = nome giocatore inserito a runtime.")
L.append("")
L.append("## Riepilogo")
L.append("")
L.append("| Mazzo | Carte | Intensità | Min. giocatori |")
L.append("|---|---:|---|---:|")
for d in decks:
    n = len(by_deck.get(d["id"], []))
    L.append(f"| {d['name']['it']} | {n} | {INT.get(d['intensity'], '')} | {d['min_players']} |")
L.append(f"| **TOTALE** | **{len(cards)}** | | |")
L.append("")
tc = Counter(c["type"] for c in cards)
L.append("**Per tipo di carta:** " + " · ".join(f"{TYPE.get(t, ('🃏', t))[0]} {TYPE.get(t, ('🃏', t))[1]}: {n}" for t, n in tc.most_common()))
L.append("")
for d in decks:
    dc = by_deck.get(d["id"], [])
    L.append(f"## {INT.get(d['intensity'], '')} {d['name']['it']} — {len(dc)} carte")
    L.append(f"*{d['description']['it']}*")
    L.append("")
    for i, c in enumerate(dc, 1):
        emoji, label = TYPE.get(c["type"], ("🃏", c["type"]))
        pen = c.get("penalty")
        pen_s = f" · _salti = {pen} WOOH_" if pen else ""
        txt = (c["text"].get("it") or "").replace("\n", " ").strip()
        L.append(f"{i}. {emoji} **{label}**{pen_s}  ")
        L.append(f"   {txt}")
        en = (c["text"].get("en") or "").replace("\n", " ").strip()
        if en:
            L.append(f"   <sub>EN — {en}</sub>")
    L.append("")

out = os.path.join(ROOT, "docs", "CARTE.md")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(L))
print(f"OK: scritto {out} — {len(cards)} carte, {len(decks)} mazzi")
