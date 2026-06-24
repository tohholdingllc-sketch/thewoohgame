"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";

/**
 * Landing di download (URL di marketing per gli store).
 * Mostra i badge ufficiali Google Play / App Store e dei mockup dell'app.
 * Gli screenshot reali vanno messi in /public/store/shot-1.png … shot-3.png:
 * se non ci sono, resta il mockup brandizzato (onError nasconde l'immagine mancante).
 */

const SHOTS = [
  { label: "Crea o entra con un codice", accent: "var(--color-cyan)" },
  { label: "A ogni turno esce una carta", accent: "var(--color-magenta)" },
  { label: "Si gioca tutti insieme", accent: "var(--color-yellow)" },
];

const FEATURES = [
  {
    emoji: "📱",
    title: "Multiplayer in tempo reale",
    text: "Ognuno dal proprio telefono, tutti nella stessa partita — anche a distanza.",
  },
  {
    emoji: "🃏",
    title: "Tante carte e categorie",
    text: "Sfide, domande e mini-giochi: nessuna partita è uguale all'altra.",
  },
  {
    emoji: "🎉",
    title: "Perfetto per le serate",
    text: "Feste, pre-serata, compleanni, viaggi e cene tra amici.",
  },
];

export function DownloadLanding() {
  return (
    <main className="flex-1 pad-safe-t pad-safe-b">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl font-bold text-white">
          WOOH
        </Link>
        <Link href="/" className="text-sm text-ink-soft underline">
          Gioca sul web
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pt-6 text-center">
        <span className="rounded-full border border-line bg-surface/60 px-4 py-1.5 text-sm text-ink-soft">
          Il party game da fare in compagnia · 18+
        </span>
        <h1 className="font-display text-4xl leading-tight text-white sm:text-6xl">
          Scarica <span className="text-yellow">The WOOH Game</span>
        </h1>
        <p className="max-w-xl text-lg text-ink-soft">
          {BRAND.tagline} Riunisci gli amici, crea una stanza e lascia decidere a WOOH:
          carte, sfide e risate in tempo reale.
        </p>

        {/* Badge store ufficiali */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={BRAND.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className="transition active:scale-95"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/store/google-play-badge.svg"
              alt="Disponibile su Google Play"
              className="h-[54px] w-auto"
            />
          </a>
          {BRAND.appStore ? (
            <a
              href={BRAND.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="transition active:scale-95"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/store/app-store-badge.svg" alt="Scarica su App Store" className="h-[54px] w-auto" />
            </a>
          ) : (
            <div className="flex flex-col items-center gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/store/app-store-badge.svg"
                alt="App Store"
                className="h-[54px] w-auto opacity-50"
              />
              <span className="text-xs text-ink-faint">Presto su App Store</span>
            </div>
          )}
        </div>
      </section>

      {/* Mockup telefoni */}
      <section className="mx-auto mt-14 grid w-full max-w-5xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
        {SHOTS.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center gap-3">
            <div className="relative aspect-[9/19] w-full max-w-[230px] overflow-hidden rounded-[2.2rem] border-4 border-surface bg-gradient-to-b from-night-top to-surface-2 shadow-card">
              {/* notch */}
              <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/40" />
              {/* mockup brandizzato (fallback se manca lo screenshot) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
                <span className="font-display text-3xl font-bold text-white">WOOH</span>
                <span className="text-sm text-ink-soft">{s.label}</span>
                <span className="mt-1 h-1 w-10 rounded-full" style={{ background: s.accent }} />
              </div>
              {/* screenshot reale: mettere il file in /public/store/shot-N.png */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/store/shot-${i + 1}.png`}
                alt={s.label}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <p className="text-center text-sm text-ink-faint">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Caratteristiche */}
      <section className="mx-auto mt-16 grid w-full max-w-4xl grid-cols-1 gap-5 px-6 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-blob border border-line bg-surface/60 p-6 text-center">
            <div className="text-4xl">{f.emoji}</div>
            <h3 className="mt-3 font-display text-lg text-white">{f.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{f.text}</p>
          </div>
        ))}
      </section>

      {/* CTA finale */}
      <section className="mx-auto mt-16 flex w-full max-w-2xl flex-col items-center gap-5 px-6 text-center">
        <h2 className="font-display text-3xl text-white">Pronto a far partire la serata?</h2>
        <a
          href={BRAND.playStore}
          target="_blank"
          rel="noopener noreferrer"
          className="btn3d-yellow rounded-full bg-yellow px-8 py-4 font-display text-lg font-bold text-ink-dark transition active:translate-y-1"
        >
          Scarica su Google Play
        </a>
        <Link href="/" className="text-sm text-ink-soft underline">
          oppure gioca subito dal browser →
        </Link>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-16 flex w-full max-w-5xl flex-col items-center gap-3 border-t border-line px-6 py-8 text-sm text-ink-faint">
        <div className="flex gap-5">
          <Link href="/privacy" className="underline">
            Privacy
          </Link>
          <Link href="/contacts" className="underline">
            Assistenza
          </Link>
        </div>
        <p>© 2026 TOH HOLDING LLC · The WOOH Game</p>
      </footer>
    </main>
  );
}
