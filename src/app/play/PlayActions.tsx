"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

/**
 * Azioni della schermata di scelta. Crea/Entra portano alla lobby (Fase 2);
 * per ora mostrano un avviso. Include il logout.
 */
export function PlayActions() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [note, setNote] = useState<string | null>(null);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Button
        variant="yellow"
        size="lg"
        className="w-full"
        onClick={() => setNote("La lobby arriva nella Fase 2 🚧")}
      >
        🎉 Crea una partita
      </Button>
      <Button
        variant="cyan"
        size="lg"
        className="w-full"
        onClick={() => setNote("La lobby arriva nella Fase 2 🚧")}
      >
        🔑 Entra con codice
      </Button>
      {note ? <p className="text-sm text-ink-soft">{note}</p> : null}
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
