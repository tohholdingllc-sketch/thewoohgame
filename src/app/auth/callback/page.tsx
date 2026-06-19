"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Callback OAuth (Google): scambia il code per la sessione, poi va a /play. */
export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) await supabase.auth.exchangeCodeForSession(code);
      } catch {
        // se fallisce, l'utente torna comunque alla home / play
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      router.replace(session ? "/play" : "/?error=auth");
    })();
  }, [router]);

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-yellow" />
    </main>
  );
}
