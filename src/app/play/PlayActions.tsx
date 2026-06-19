"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

/** Schermata di scelta: crea una partita (RPC) o vai a inserire un codice. */
export function PlayActions() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createGame() {
    setBusy(true);
    setError(null);
    const { data, error } = await supabase.rpc("create_game", {
      p_decks: [],
      p_language: "it",
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    router.push(`/game/${data}`);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Button variant="magenta" size="lg" className="w-full" disabled={busy} onClick={createGame}>
        🎉 Crea una partita
      </Button>
      <Button
        variant="cyan"
        size="lg"
        className="w-full"
        disabled={busy}
        onClick={() => router.push("/join")}
      >
        🔑 Entra con codice
      </Button>
      {error ? (
        <p className="rounded-xl bg-magenta/15 px-4 py-2 text-center text-sm text-white">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={signOut}
        className="mt-2 text-sm text-ink-faint underline underline-offset-4"
      >
        Esci
      </button>
    </div>
  );
}
