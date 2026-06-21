"use client";

import { useEffect } from "react";

// Rete di sicurezza GLOBALE: qualunque errore di render in una pagina viene
// catturato qui → mostriamo un fallback amichevole con "Riprova" (rimonta il
// segmento e ricarica lo stato dal server) invece della schermata bianca "reload".
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("WOOH error boundary:", error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-12 text-center pad-safe-t pad-safe-b">
      <span className="text-6xl" style={{ filter: "drop-shadow(0 0 16px rgba(255,255,255,0.22))" }}>
        🐺
      </span>
      <div>
        <h1 className="font-display text-2xl text-white">Ops, un piccolo intoppo</h1>
        <p className="mt-2 max-w-xs text-ink-soft">
          La partita è salva. Tocca «Riprova»: riprendi da dove eravate.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="h-12 w-full rounded-2xl bg-magenta font-display font-bold text-white"
        >
          🔄 Riprova
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href = "/play";
          }}
          className="text-sm text-ink-faint underline underline-offset-4"
        >
          Torna alla home
        </button>
      </div>
    </main>
  );
}
