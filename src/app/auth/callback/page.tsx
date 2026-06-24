"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Callback OAuth (Apple/Google sul web): scambia il code per la sessione e va a /play.
 * Robusto contro la race con detectSessionInUrl di @supabase/ssr: dopo l'exchange
 * (che potrebbe già essere stato fatto dal client) ASPETTIAMO che la sessione
 * compaia davvero, poi reindirizziamo. Così non si finisce per sbaglio sul login.
 */
export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const oauthErr = params.get("error_description") ?? params.get("error");
      if (oauthErr) {
        router.replace(`/?autherr=${encodeURIComponent(oauthErr)}`);
        return;
      }
      const code = params.get("code");
      if (code) {
        // Può fallire se detectSessionInUrl ha già consumato il code: lo ignoriamo
        // e ci affidiamo al polling della sessione qui sotto.
        await supabase.auth.exchangeCodeForSession(code).catch(() => {});
      }
      // Aspetta che la sessione sia effettivamente disponibile (max ~3s).
      for (let i = 0; i < 15; i++) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.replace("/play");
          return;
        }
        await new Promise((r) => setTimeout(r, 200));
      }
      router.replace("/?autherr=no_session");
    })();
  }, [router]);

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-yellow" />
    </main>
  );
}
