"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { getClientLocale } from "@/lib/locale-client";
import type { Locale } from "@/lib/types";

function HomeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const join = params.get("join") ?? undefined;
  const [locale, setLocale] = useState<Locale>("it");
  const [loggedOut, setLoggedOut] = useState(false);

  // Se loggato → vai a /play (o /join col codice). Altrimenti mostra il login.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(getClientLocale());
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(join ? `/join?code=${encodeURIComponent(join)}` : "/play");
      } else {
        setLoggedOut(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loggedOut) return <main className="flex-1" />;
  return <AuthScreen locale={locale} nextJoin={join} />;
}

export default function Home() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <HomeInner />
    </Suspense>
  );
}
