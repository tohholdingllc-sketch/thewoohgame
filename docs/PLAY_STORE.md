# The WOOH Game — Kit scheda Play Store

Tutto da copia-incollare in **Google Play Console** → *Crescita → Presenza sullo store → Scheda principale dello store* (+ le sezioni *Classificazione contenuti* e *Sicurezza dei dati*).

---

## Dettagli app

**Nome app** (max 30)
```
The WOOH Game
```

**Descrizione breve** (max 80)
```
Il party game per bere. Una partita, tutti col proprio telefono. 18+
```

**Descrizione completa** (max 4000)
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

---

## Categorizzazione
- **Tipo di app:** Gioco
- **Categoria:** Casual
- **Tag:** party, multiplayer, carte

## Contatti
- **Email:** tohholdingllc@gmail.com
- **Privacy policy:** `https://thewoohgame.com/privacy`  *(attiva appena il DNS è live)*

---

## Classificazione dei contenuti (questionario IARC)
Rispondi **onestamente** (serve per restare in regola con l'avviso 18+ in app):
- Riferimenti ad **alcol** / incoraggia il consumo → **Sì**
- **Contenuti sessuali** / allusioni (mazzi Spicy/Hot/Coppia) → **Sì** (allusioni, nessuna nudità esplicita)
- Linguaggio volgare → se presente, **Sì**

➡️ Esito atteso: **PEGI 18 / "Adulti"**. È corretto e voluto.

## Pubblico e contenuti
- **Pubblico di destinazione:** 18+ → seleziona *"App non destinata ai bambini"*.
- **Annunci:** No.

---

## Sicurezza dei dati (Data safety)
- **Raccolta dati:** Sì, ma **solo se l'utente crea un account**.
  - **Email** (autenticazione) — per gestire l'account · non condivisa · cifrata in transito.
  - **Nome** — solo se si usa il login Google · facoltativo.
  - **Nickname / avatar** — forniti dall'utente.
- **Gioco da ospite:** identificativo anonimo, **nessun dato personale**.
- **Condivisione con terzi:** No (nessun uso per marketing).
- **Pubblicità:** No.
- **Sicurezza:** dati **cifrati in transito** (HTTPS).
- **Cancellazione:** l'utente può richiedere la cancellazione di account e dati via email (indicata nella privacy).

---

## Asset grafici
| Asset | Requisito | File |
|---|---|---|
| Icona | 512×512 PNG | `public/icons/icon-512.png` ✅ |
| Immagine in evidenza | 1024×500 PNG | `assets/feature-graphic.png` ✅ (logo nuovo) |
| Screenshot telefono | min 2, max 8 | **DA FARE** — li catturo dalla web app: schermata login, lobby col codice, carta di gioco |

## Versione (android/app/build.gradle)
- `versionCode 1`, `versionName "1.0"` → ok per il **primo** upload.
- Dal secondo aggiornamento in poi: **incrementa `versionCode`** (2, 3, …) altrimenti Play rifiuta l'AAB.

## Play App Signing
- Alla creazione dell'app, lascia attivo **Play App Signing** (consigliato): Google gestisce la chiave di firma definitiva; tu carichi l'AAB firmato con la **chiave di upload** (`woohgame_upload`). Se un giorno perdi quella di upload, Google te la fa resettare.
