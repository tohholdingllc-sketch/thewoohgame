import type { SupabaseClient } from "@supabase/supabase-js";

// Redirect deep-link per l'app nativa: dopo l'auth, Supabase rimanda a questo
// schema custom, che riapre l'app; NativeShell (appUrlOpen) completa la sessione.
export const NATIVE_OAUTH_REDIRECT = "com.thewoohgame.app://login-callback";

/**
 * OAuth nativo (Apple/Google) per l'app Capacitor:
 * 1) Supabase genera l'URL (skipBrowserRedirect: non navighiamo nella webview)
 * 2) apriamo l'URL nel browser di sistema (@capacitor/browser)
 * 3) al ritorno, lo schema custom riapre l'app → NativeShell scambia il code.
 */
export async function nativeOAuth(supabase: SupabaseClient, provider: "apple" | "google") {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: NATIVE_OAUTH_REDIRECT, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (data?.url) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({ url: data.url });
  }
}
