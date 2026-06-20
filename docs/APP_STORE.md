# The WOOH Game — Kit scheda App Store (iOS)

Da incollare in **App Store Connect** quando compili la scheda dell'app. Complementare a `PLAY_STORE.md`.

---

## Informazioni app
- **Nome** (max 30): `The WOOH Game`
- **Sottotitolo** (max 30): `Party game da bere · 18+`
- **Categoria:** principale **Giochi**, secondaria **Intrattenimento**
- **Copyright:** `© 2026 Toh Holding LLC`

## Testo promozionale (max 170, modificabile in ogni momento)
```
Una partita, tutti col proprio telefono. 300 carte, 5 mazzi tra sfide, domande e penitenze. Solo per maggiorenni — bevi responsabilmente. WOOH!
```

## Descrizione (max 4000) — stessa di Google Play
```
The WOOH Game è il party game pensato per le serate tra amici — e per chi non ha paura di mettersi in gioco.

Una sola partita, tutti col proprio telefono: il master apre la stanza, gli altri entrano con un codice numerico. Niente download obbligatori: si può giocare anche dal browser.

🐺 COME SI GIOCA
A turno si pesca una carta: una sfida, una domanda o una penitenza. La carta dice anche quanti WOOH (sorsi) tocca bere e a chi. Più la carta è spinta, più 🔥 — e più si beve.

🎴 5 MAZZI, 300 CARTE
• Start — per rompere il ghiaccio
• Spicy — quando sale la temperatura
• Deep — le domande che scavano
• Hot — solo per i più coraggiosi
• Coppia — pensato per due
(+ mazzo Streap in arrivo)

✨ PERFETTO PER
Feste, pre-serata, compleanni, addii al celibato/nubilato o una serata in casa che non vuoi finisca presto.

⚠️ SOLO PER MAGGIORENNI (18+)
Bevi responsabilmente: gioca con la testa e divertiti senza esagerare. E se non vuoi bere, nessun problema — i WOOH possono essere quello che decidi tu.

Pronti? Aprite una stanza e che vinca chi resta in piedi. WOOH!
```

## Parole chiave (max 100 caratteri, separate da virgola)
```
party,gioco,bere,festa,amici,carte,coppia,obbligo,verità,serata,drinking,18+
```

## URL
- **Supporto:** `https://thewoohgame.com`
- **Marketing** (opz.): `https://thewoohgame.com`
- **Privacy Policy:** `https://thewoohgame.com/privacy`

---

## Classificazione per età → 17+ / 18+
Nel questionario rispondi onestamente:
- **Alcol, tabacco o droghe** (riferimenti/uso): **Frequente o intenso** (è un gioco da bere)
- **Contenuti sessuali o nudità:** **Non frequente/lieve** (allusioni, niente di esplicito)
- **Linguaggio volgare / temi adulti:** **Non frequente/lieve**
- Violenza, gioco d'azzardo, orrore, ecc.: **Nessuno**
➡️ Esito: **17+** (imposta **18+** dove l'opzione è disponibile). Coerente con l'avviso 18+ in app.

## Privacy dell'app (App Privacy "nutrition label")
- **Raccogli dati?** Sì, **solo se l'utente crea un account**.
  - **Email** → Funzionalità dell'app · *collegata all'identità* · **non** per tracciamento.
  - **Nome** (solo se login Google, facoltativo) → Funzionalità dell'app · collegata all'identità.
  - **ID utente** → Funzionalità dell'app.
- **Gioco da ospite:** identificativo anonimo, **nessun dato personale**.
- **Tracciamento (ATT):** No. **Pubblicità:** No. **Condivisione con terzi:** No.
- Dati **cifrati in transito**; l'utente può chiedere la **cancellazione** (email nella privacy).

## Screenshot (già pronti)
- **iPhone 6.9":** cartella `WOOH-store-assets/ios-iphone-6.9/` (1320×2868)
- **iPhone 6.7":** cartella `WOOH-store-assets/ios-iphone-6.7/` (1290×2796)
- iPad: solo se attivi il supporto iPad (al momento **non necessario** → tieni l'app "solo iPhone").

## Build
- Arriva da **Codemagic** (workflow `ios`) → caricata su **TestFlight** → poi la selezioni nella scheda prima dell'invio.

## Posizionamento (mitiga il rifiuto 4.3 "drinking game low-quality", giu 2026)
- Posiziona come **party game multiplayer**, NON come "app per bere". Il bere è **opzionale**.
- Keyword/testi: punta su *party, festa, amici, multiplayer, carte*; evita di centrare tutto su *drinking/alcol*.

## Note per il revisore (App Review Information → Notes) — copia-incolla
```
The WOOH Game is a multiplayer party game, not a generic drinking-game card list.
Differentiators: real-time multiplayer (each player on their own phone, joining via a
numeric room code), 300 hand-written cards across 5 themed decks, turn rotation with
personalized prompts, and a polished custom UI. Drinking is entirely optional — the in-app
18+ age gate, the responsible-play disclaimer, and the card copy make clear that "WOOH"
sips can be any drink, alcoholic or not. We do not encourage excessive consumption or
target minors. To review the full experience without an account, tap "Play as guest".
```

## Compliance implementata (giugno 2026)
- ✅ **Sign in with Apple** accanto a Google (Guideline 4.8) — *richiede la config Apple+Supabase prima dell'invio*.
- ✅ **Cancellazione account in-app** (schermata iniziale → "Elimina account") (5.1.1(v)).
- ✅ **Age gate 18+** + disclaimer "bevi responsabilmente / anche analcolico".
- ✅ **Filtro nickname** sui nomi inseriti dagli utenti (1.2); il master può anche espellere (block).
- ⏳ Nessun acquisto in-app ora (3.1.1 N/A). Se in futuro Streap/abbonamento a pagamento su iOS → **obbligatorio Apple IAP**.
