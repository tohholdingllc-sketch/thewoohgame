"use client";

import { useEffect } from "react";

/**
 * Registra il service worker SOLO in produzione (in dev romperebbe l'HMR).
 * Su controllerchange ricarica una volta, così l'utente non resta su un bundle vecchio.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {});

    let refreshed = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshed) return;
      refreshed = true;
      window.location.reload();
    });
  }, []);

  return null;
}
