"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LocaleToggle } from "@/components/LocaleToggle";
import { createClient } from "@/lib/supabase/client";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/** Schermata di scelta: crea una partita (RPC) o vai a inserire un codice. */
export function PlayActions({ locale = "it" }: { locale?: Locale }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const d = getDict(locale);

  async function createGame() {
    setBusy(true);
    setError(null);
    const { data, error } = await supabase.rpc("create_game", { p_decks: [], p_language: locale });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    router.push(`/game/${data}`);
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Button variant="magenta" size="lg" className="w-full" disabled={busy} onClick={createGame}>
        {d.createGame}
      </Button>
      <Button
        variant="cyan"
        size="lg"
        className="w-full"
        disabled={busy}
        onClick={() => router.push("/join")}
      >
        {d.joinGame}
      </Button>
      {error ? (
        <p className="rounded-xl bg-magenta/15 px-4 py-2 text-center text-sm text-white">{error}</p>
      ) : null}
      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={signOut}
          className="text-sm text-ink-faint underline underline-offset-4"
        >
          {d.logout}
        </button>
        <LocaleToggle locale={locale} />
      </div>
    </div>
  );
}
