"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { getDict, normalizeLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

function JoinInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [supabase] = useState(() => createClient());
  const codeParam = (params.get("code") ?? "").replace(/\D/g, "").slice(0, 5);

  const [locale, setLocale] = useState<Locale>("it");
  const [code, setCode] = useState(codeParam);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const d = getDict(locale);

  const doJoin = useCallback(
    async (c: string) => {
      setBusy(true);
      setError(null);
      const { data, error } = await supabase.rpc("join_game", { p_code: c });
      if (error) {
        const m = error.message;
        setError(
          m.includes("GAME_NOT_FOUND") ? d.gameNotFound : m.includes("GAME_NOT_JOINABLE") ? d.gameStarted : m,
        );
        setBusy(false);
        setChecking(false);
        return;
      }
      router.push(`/game/${data}`);
    },
    [supabase, router, d.gameNotFound, d.gameStarted],
  );

  // All'apertura: se non loggato -> vai al login conservando il codice; se
  // loggato e c'è un codice nel link -> entra automaticamente.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(normalizeLocale(document.cookie.match(/wooh_locale=([^;]+)/)?.[1]));
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace(codeParam ? `/?join=${encodeURIComponent(codeParam)}` : "/");
        return;
      }
      if (codeParam) {
        void doJoin(codeParam);
        return;
      }
      setChecking(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function manualJoin() {
    const c = code.replace(/\D/g, "");
    if (c.length < 4) {
      setError(d.enterCode);
      return;
    }
    void doJoin(c);
  }

  if (checking) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-yellow" />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 pad-safe-t pad-safe-b">
      <div className="flex w-full max-w-sm flex-col items-center gap-7 text-center">
        <h1 className="font-display text-4xl text-white">{d.joinTitle}</h1>
        <p className="text-ink-soft">{d.joinSubtitle}</p>
        <input
          className="h-16 w-full rounded-blob border-2 border-line bg-white text-center font-display text-4xl tracking-[0.3em] text-ink-dark placeholder:text-ink-dark/30 focus:border-magenta focus:outline-none"
          placeholder="12345"
          maxLength={5}
          inputMode="numeric"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
          onKeyDown={(e) => e.key === "Enter" && manualJoin()}
        />
        <Button variant="magenta" size="lg" className="w-full" disabled={busy} onClick={manualJoin}>
          {d.joinCta}
        </Button>
        {error ? (
          <p className="w-full rounded-xl bg-magenta/15 px-4 py-2 text-sm text-white">{error}</p>
        ) : null}
        <button
          type="button"
          onClick={() => router.push("/play")}
          className="text-sm text-ink-faint underline underline-offset-4"
        >
          {d.back}
        </button>
      </div>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <JoinInner />
    </Suspense>
  );
}
