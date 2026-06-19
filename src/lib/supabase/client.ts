import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase lato browser (Client Components).
 * Usa la anon key: tutto è protetto da Row Level Security.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
