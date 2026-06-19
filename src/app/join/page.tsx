"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { getDict, normalizeLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

function JoinInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [supabase] = useState(() => createClient());
  const [locale, setLocale] = useState<Locale>("it");
  const [code, setCode] = useState((params.get("code") ?? "").toUpperCase());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocale(normalizeLocale(document.cookie.match(/wooh_locale=([^;]+)/)?.[1]));
  }, []);
  const d = getDict(locale);

  async function join() {
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setError(d.enterCode);
      return;
    }
    setBusy(true);
    setError(null);
    const { data, error } = await supabase.rpc("join_game", { p_code: c });
    if (error) {
      const m = error.message;
      setError(
        m.includes("GAME_NOT_FOUND") ? d.gameNotFound : m.includes("GAME_NOT_JOINABLE") ? d.gameStarted : m,
      );
      setBusy(false);
      return;
    }
    router.push(`/game/${data}`);
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 pad-safe-t pad-safe-b">
      <div className="flex w-full max-w-sm flex-col items-center gap-7 text-center">
        <h1 className="font-display text-4xl text-white">{d.joinTitle}</h1>
        <p className="text-ink-soft">{d.joinSubtitle}</p>
        <input
          className="h-16 w-full rounded-blob border-2 border-line bg-white text-center font-display text-3xl tracking-[0.3em] text-ink-dark uppercase placeholder:text-ink-dark/30 focus:border-magenta focus:outline-none"
          placeholder="ABCDE"
          maxLength={5}
          autoCapitalize="characters"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && join()}
        />
        <Button variant="magenta" size="lg" className="w-full" disabled={busy} onClick={join}>
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
