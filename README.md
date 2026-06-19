# The WOOH Game 🍻

Party game multiplayer per bere, stile **Gartic Phone**. Una partita, tutti col proprio telefono: il _master_ crea la stanza, gli altri entrano con un codice, e l'avanzamento delle carte è sincronizzato in tempo reale.

> ⚠️ **18+.** Gioca responsabilmente. Tutte le carte funzionano anche con bevande analcoliche. Se bevi, non guidare.

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Supabase** — Postgres, Auth, Realtime, Row Level Security
- **Vercel** (hosting web) · **Capacitor** (Android/iOS) · **PWA**
- i18n **IT/EN**

Una codebase, **4 target**: web mobile, web desktop, Android, iOS.

## Sviluppo

```bash
npm install
cp .env.example .env.local   # inserisci le chiavi Supabase
npm run dev                  # http://localhost:3000
```

## Roadmap (per fasi)

| Fase | Output |
|---|---|
| **0. Setup** ✅ | Next.js + Tailwind + Supabase client + design system Gartic |
| 1. DB & Auth | Migration + RLS, login email/Google/anonimo, age-gate 18+, seed |
| 2. Lobby realtime | Crea/entra con codice, master vs ospite, selezione mazzi |
| 3. Motore di gioco | 7 tipi di carta, target dinamici, regole persistenti, WOOH |
| 4. Contenuti | Mazzi Start/Mood/Hot/Coppia/Ambiente, i18n |
| 5. PWA & polish | Manifest, service worker, animazioni, suono WOOH |
| 6. Mobile | Capacitor → build Android/iOS |
