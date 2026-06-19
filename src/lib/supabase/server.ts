import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase lato server (Server Components, Route Handlers, Server Actions).
 * In Next.js 16 `cookies()` è asincrono → va atteso.
 * Il refresh della sessione avviene nel proxy (vedi proxy.ts, Fase 1).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chiamato da un Server Component: ignorabile se il proxy
            // si occupa di rinfrescare le sessioni utente.
          }
        },
      },
    },
  );
}
