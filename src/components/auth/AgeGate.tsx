"use client";

import { Button } from "@/components/ui/Button";

/**
 * Gate 18+ mostrato alla prima apertura. La conferma viene memorizzata
 * (localStorage) e, dopo il login, salvata anche nel profilo (is_adult).
 */
export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-night/95 px-6 text-center pad-safe-t pad-safe-b">
      <div className="text-7xl">🔞</div>
      <h2 className="font-display text-3xl">Hai almeno 18 anni?</h2>
      <p className="max-w-xs text-ink-soft">
        The WOOH Game è un party game per adulti. Gioca responsabilmente: tutte le
        carte funzionano anche con bevande analcoliche.
      </p>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button variant="yellow" size="lg" className="w-full" onClick={onConfirm}>
          Sì, ho 18+ anni
        </Button>
        <a
          href="https://www.google.com"
          className="text-sm text-ink-faint underline underline-offset-4"
        >
          No, esco
        </a>
      </div>
    </div>
  );
}
