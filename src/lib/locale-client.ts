import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/** Legge la lingua scelta (cookie) lato client. SSR-safe: ritorna "it" sul server. */
export function getClientLocale(): Locale {
  if (typeof document === "undefined") return "it";
  const m = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  return normalizeLocale(m?.[1]);
}
