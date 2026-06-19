"use client";

import { useRouter } from "next/navigation";
import { LOCALES, setLocaleCookie } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Toggle lingua IT/EN: scrive il cookie e ri-renderizza (server + client). */
export function LocaleToggle({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();

  function pick(l: Locale) {
    if (l === locale) return;
    setLocaleCookie(l);
    router.refresh();
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-white/15 p-0.5 text-xs font-bold",
        className,
      )}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => pick(l)}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            l === locale ? "bg-white/90 text-ink-dark" : "text-white/60",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
