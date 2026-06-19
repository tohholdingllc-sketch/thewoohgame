import { BRAND } from "@/lib/brand";
import { LandingCta } from "./LandingCta";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 pad-safe-t pad-safe-b">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-9">
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-xl text-ink-soft">The</span>
          <h1 className="font-display font-bold leading-[0.85] text-7xl sm:text-8xl drop-shadow-[0_8px_0_rgba(0,0,0,0.25)]">
            <span className="text-yellow">W</span>
            <span className="text-cyan">O</span>
            <span className="text-magenta">O</span>
            <span className="text-lime">H</span>
          </h1>
          <span className="font-display text-2xl tracking-[0.4em] text-ink pl-[0.4em]">
            GAME
          </span>
        </div>

        <p className="max-w-xs text-lg text-ink-soft">{BRAND.tagline} 🍻</p>

        <LandingCta />

        {/* Disclaimer gioco responsabile (compliance store) */}
        <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
          Gioca responsabilmente. Tutte le carte funzionano anche con bevande
          analcoliche. Se bevi, non guidare. <span className="text-ink-soft">18+</span>
        </p>
      </div>
    </main>
  );
}
