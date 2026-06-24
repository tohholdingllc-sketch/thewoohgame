import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase lato browser (Client Components).
 * Sessione in **localStorage** (default di supabase-js nel browser): funziona sia su web
 * sia nel WebView nativo (Capacitor). I COOKIE di `@supabase/ssr` NON persistono in modo
 * affidabile su iOS/Android (scheme capacitor://) → l'app restava bloccata sul login.
 * Qui non c'è SSR (export statico), quindi localStorage è la scelta corretta.
 * Singleton per evitare istanze GoTrue multiple. Tutto protetto da Row Level Security.
 */
let client: SupabaseClient | undefined;

export function createClient(): SupabaseClient {
  if (client) return client;
  client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    },
  );
  return client;
}
