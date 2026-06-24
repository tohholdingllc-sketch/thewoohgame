"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";

/**
 * Landing di download (URL di marketing per gli store).
 * Badge ufficiali Google Play / App Store, screenshot reali dell'app,
 * un assaggio delle carte Spicy e recensioni (romanzate) della serata.
 */

const SHOTS = [
  { src: "/store/shot-1.png", label: "Scegli avatar e nickname", accent: "var(--color-magenta)" },
  { src: "/store/shot-2.png", label: "Crea una partita o entra col codice", accent: "var(--color-cyan)" },
  { src: "/store/shot-3.png", label: "Invita gli amici col QR e si parte", accent: "var(--color-yellow)" },
];

// Carte Spicy reali catturate dall'app — disposte a ventaglio.
const SPICY = [
  { src: "/store/spicy-1.png", rot: "-7deg" },
  { src: "/store/spicy-2.png", rot: "0deg" },
  { src: "/store/spicy-3.png", rot: "7deg" },
];

const AVATARS = [
  "fox", "cat", "dog", "panda", "bear", "lion", "tiger", "koala", "penguin", "owl",
  "frog", "monkey", "raccoon", "unicorn", "dragon", "alien", "robot", "ghost", "llama",
];

const FEATURES = [
  {
    emoji: "📱",
    title: "Multiplayer in tempo reale",
    text: "Ognuno dal proprio telefono, tutti nella stessa partita. Anche il cugino “a distanza” che però vuole sapere tutti i gossip.",
    accent: "var(--color-cyan)",
  },
  {
    emoji: "🃏",
    title: "Carte che non si ripetono",
    text: "Sfide, domande, mini-giochi e “io non ho mai”. Più siete, più sale il caos, più storie da raccontare lunedì in ufficio.",
    accent: "var(--color-magenta)",
  },
  {
    emoji: "🎉",
    title: "Fatto per le serate",
    text: "Pre-serata, compleanni, viaggi e cene che “finiamo presto, dai”. (Spoiler: non finirete presto.)",
    accent: "var(--color-yellow)",
  },
];

const REVIEWS = [
  { stars: 5, quote: "Doveva essere “una partita veloce”. Erano le 3 di notte.", who: "Marco, 31" },
  { stars: 5, quote: "Ho scoperto cose sui miei amici che ora vorrei dis-sapere. 10/10.", who: "Giulia, 27" },
  { stars: 5, quote: "Non parlo più con Luca. Ne è valsa assolutamente la pena.", who: "Anonimo" },
  { stars: 5, quote: "0% dignità rimasta, 100% serata salvata.", who: "Il gruppo del giovedì" },
];

const up = (delay: number) => ({
  animation: "fade-up 0.6s ease-out both",
  animationDelay: `${delay}s`,
});

export function DownloadLanding() {
  return (
    <main className="relative flex-1 overflow-hidden pad-safe-t pad-safe-b">
      {/* Blob decorativi per atmosfera */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-magenta/20 blur-3xl" />
        <div className="absolute -right-24 top-[34rem] h-80 w-80 rounded-full bg-cyan/15 blur-3xl" />
        <div className="absolute left-1/3 top-[80rem] h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
      </div>

      <div className="relative">
        {/* Top bar */}
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="transition active:scale-95">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt="The WOOH Game" className="h-9 w-auto" />
          </Link>
          <Link href="/" className="text-sm text-ink-soft underline-offset-4 hover:underline">
            Gioca sul web
          </Link>
        </header>

        {/* Hero */}
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pt-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-app.png"
            alt="Icona The WOOH Game"
            style={{ animation: "float-y 5s ease-in-out infinite" }}
            className="h-24 w-24 rounded-[1.5rem] shadow-card"
          />
          <span
            style={{ ...up(0), animation: "float-y 4s ease-in-out infinite" }}
            className="rounded-full border border-line bg-surface/60 px-4 py-1.5 text-sm text-ink-soft backdrop-blur"
          >
            🐺 Il party game da fare in compagnia · 18+
          </span>
          <h1 style={up(0.05)} className="font-display text-5xl leading-[1.05] text-white sm:text-7xl">
            Scarica <span className="text-yellow">The WOOH Game</span>
          </h1>
          <p style={up(0.12)} className="max-w-xl text-lg text-ink-soft sm:text-xl">
            Una partita, tutti col proprio telefono. Zero setup, zero app da spiegare: crei una
            stanza, mandi il codice e in 10 secondi siete dentro. Poi ci pensa WOOH a decidere chi
            balla, chi confessa e chi beve. <span className="whitespace-nowrap">Cosa può andare storto? 🐺</span>
          </p>

          {/* Badge store ufficiali */}
          <div style={up(0.2)} className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <a href={BRAND.playStore} target="_blank" rel="noopener noreferrer" className="transition hover:-translate-y-0.5 active:scale-95">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/store/google-play-badge.svg" alt="Disponibile su Google Play" className="h-[56px] w-auto" />
            </a>
            {BRAND.appStore ? (
              <a href={BRAND.appStore} target="_blank" rel="noopener noreferrer" className="transition hover:-translate-y-0.5 active:scale-95">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/store/app-store-badge.svg" alt="Scarica su App Store" className="h-[56px] w-auto" />
              </a>
            ) : (
              <div className="flex flex-col items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/store/app-store-badge.svg" alt="App Store" className="h-[56px] w-auto opacity-50" />
                <span className="text-xs text-ink-faint">Presto su App Store</span>
              </div>
            )}
          </div>
          <p style={up(0.26)} className="text-sm text-lime">
            ✓ Già live su Android · 📱 iOS in arrivo
          </p>
        </section>

        {/* Screenshot app */}
        <section className="mx-auto mt-16 grid w-full max-w-5xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
          {SHOTS.map((s, i) => (
            <div key={s.src} style={up(0.1 * i)} className="flex flex-col items-center gap-3">
              <div className="relative aspect-[9/19] w-full max-w-[230px] overflow-hidden rounded-[2.2rem] border-4 border-surface bg-gradient-to-b from-night-top to-surface-2 shadow-card transition-transform hover:-translate-y-1">
                <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
                  <span className="font-display text-3xl font-bold text-white">WOOH</span>
                  <span className="text-sm text-ink-soft">{s.label}</span>
                  <span className="mt-1 h-1 w-10 rounded-full" style={{ background: s.accent }} />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
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

        {/* Avatar */}
        <section className="mx-auto mt-20 w-full max-w-3xl px-6 text-center">
          <h2 className="font-display text-2xl text-white sm:text-3xl">Scegli chi essere stasera</h2>
          <p className="mt-2 text-sm text-ink-soft">19 avatar, zero scuse.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {AVATARS.map((a, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={a}
                src={`/avatars/${a}.png`}
                alt={a}
                style={{ animationDelay: `${i * 0.04}s` }}
                className="h-12 w-12 rounded-full ring-2 ring-line transition-transform hover:scale-125 hover:-translate-y-1"
              />
            ))}
          </div>
        </section>

        {/* ── SEZIONE NUOVA 1: un assaggio delle carte Spicy ── */}
        <section className="mx-auto mt-28 w-full max-w-5xl px-6 text-center">
          <span className="inline-block rounded-full border-2 border-orange/60 bg-orange/10 px-4 py-1 font-display text-sm uppercase tracking-widest text-orange">
            🌶️ Mazzo Spicy
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl text-white sm:text-5xl">
            Un assaggio delle carte
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-ink-soft">
            Sfide, domande e “io non ho mai” che tirano fuori il peggio del gruppo (cioè il meglio).
            E occhio: <span className="text-orange">queste sono le soft</span>.
          </p>

          {/* Ventaglio di carte reali */}
          <div className="mt-12 flex items-center justify-center">
            {SPICY.map((c, i) => (
              <div
                key={c.src}
                style={{ transform: `rotate(${c.rot})`, zIndex: i === 1 ? 3 : 1 }}
                className="relative -mx-3 aspect-[9/19] w-[150px] shrink-0 overflow-hidden rounded-[1.8rem] border-4 border-surface bg-surface-2 shadow-card transition-transform duration-300 hover:z-10 hover:-translate-y-3 hover:rotate-0 hover:scale-105 sm:w-[210px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.src}
                  alt="Carta Spicy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-ink-faint">
            Le altre… le scopri tu. (Sì, diventano peggio. 🔥)
          </p>
        </section>

        {/* Caratteristiche */}
        <section className="mx-auto mt-28 grid w-full max-w-4xl grid-cols-1 gap-5 px-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-blob border border-line bg-surface/60 p-6 text-center backdrop-blur transition-transform hover:-translate-y-1"
              style={{ boxShadow: `0 0 0 1px ${f.accent}22` }}
            >
              <div className="text-5xl">{f.emoji}</div>
              <h3 className="mt-3 font-display text-lg text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.text}</p>
            </div>
          ))}
        </section>

        {/* ── SEZIONE NUOVA 2: recensioni della serata ── */}
        <section className="mx-auto mt-28 w-full max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full border border-line bg-surface/60 px-4 py-1 font-display text-sm uppercase tracking-widest text-yellow">
            ⭐ Recensioni della serata
          </span>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
            Cosa dice chi ha già giocato
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
            {REVIEWS.map((r) => (
              <figure
                key={r.who}
                className="rounded-blob border border-line bg-surface/60 p-6 backdrop-blur transition-transform hover:-translate-y-1"
              >
                <div className="text-lg tracking-wider text-yellow">{"★".repeat(r.stars)}</div>
                <blockquote className="mt-2 font-display text-xl leading-snug text-white">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-3 text-sm text-ink-faint">— {r.who}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink-faint">Recensioni romanzate. Le risate, quelle no. 🐺</p>
        </section>

        {/* CTA finale */}
        <section className="mx-auto mt-28 flex w-full max-w-2xl flex-col items-center gap-5 px-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wolf-drunk.png"
            alt="Lupo WOOH"
            style={{ animation: "float-y 4s ease-in-out infinite" }}
            className="h-44 w-auto drop-shadow-[0_12px_30px_rgba(255,93,162,0.35)]"
          />
          <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
            Pronto a rovinare qualche amicizia?
          </h2>
          <p className="text-lg text-ink-soft">(Per gioco. Quasi sempre.)</p>
          <a
            href={BRAND.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className="btn3d-yellow mt-1 rounded-full bg-yellow px-9 py-4 font-display text-xl font-bold text-ink-dark transition active:translate-y-1"
          >
            🎉 Scarica su Google Play
          </a>
          <Link href="/" className="text-sm text-ink-soft underline-offset-4 hover:underline">
            oppure gioca subito dal browser →
          </Link>
        </section>

        {/* Footer */}
        <footer className="mx-auto mt-24 flex w-full max-w-5xl flex-col items-center gap-3 border-t border-line px-6 py-8 text-sm text-ink-faint">
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contacts" className="hover:underline">
              Assistenza
            </Link>
          </div>
          <p>© 2026 TOH HOLDING LLC · The WOOH Game · Bevi responsabilmente 🥂</p>
        </footer>
      </div>
    </main>
  );
}
