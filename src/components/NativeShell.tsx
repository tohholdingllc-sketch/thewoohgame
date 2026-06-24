"use client";

import { useEffect } from "react";

/**
 * Comportamenti nativi (solo in app Capacitor; no-op sul web):
 * - status bar viola con testo chiaro
 * - nasconde la splash dopo il mount
 * - tasto BACK Android: torna indietro se possibile, altrimenti esce
 * I plugin sono importati dinamicamente, così non finiscono nel bundle web.
 */
export function NativeShell() {
  useEffect(() => {
    let cleanup = () => {};

    (async () => {
      const { Capacitor } = await import("@capacitor/core");
      if (!Capacitor.isNativePlatform()) return;

      // Marca l'app nativa: abilita il padding safe-area minimo (vedi globals.css),
      // perché Android non riporta env(safe-area-inset-*) e il contenuto finirebbe
      // sotto status bar / barra di navigazione.
      document.documentElement.classList.add("native");

      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setStyle({ style: Style.Light });
        if (Capacitor.getPlatform() === "android") {
          await StatusBar.setBackgroundColor({ color: "#0a0716" });
        }
      } catch {}

      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await SplashScreen.hide();
      } catch {}

      try {
        const { App } = await import("@capacitor/app");
        const subBack = await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack) window.history.back();
          else App.exitApp();
        });
        // Ritorno OAuth (Apple/Google) via deep-link com.thewoohgame.app://login-callback
        const subUrl = await App.addListener("appUrlOpen", async ({ url }) => {
          if (!url.includes("login-callback")) return;
          try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            const code = new URL(url).searchParams.get("code");
            if (code) {
              await supabase.auth.exchangeCodeForSession(code);
            } else {
              const hp = new URLSearchParams(url.split("#")[1] ?? "");
              const at = hp.get("access_token");
              const rt = hp.get("refresh_token");
              if (at && rt) await supabase.auth.setSession({ access_token: at, refresh_token: rt });
            }
          } catch {}
          try {
            const { Browser } = await import("@capacitor/browser");
            await Browser.close();
          } catch {}
          window.location.assign("/play");
        });
        cleanup = () => {
          void subBack.remove();
          void subUrl.remove();
        };
      } catch {}
    })();

    return () => cleanup();
  }, []);

  return null;
}
