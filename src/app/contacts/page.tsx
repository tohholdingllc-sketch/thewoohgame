"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "w-full rounded-2xl border border-line bg-surface-2 px-4 py-3 text-ink outline-none transition placeholder:text-ink-faint focus:border-cyan";

/**
 * Pagina di assistenza/contatti (URL di assistenza richiesto da App Store / Play Store).
 * Il sito è export statico → niente API server: il form invia via Formsubmit (handler
 * esterno) che inoltra il messaggio a BRAND.supportEmail.
 */
export default function ContactsPage() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${BRAND.supportEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
          _subject: `Assistenza ${BRAND.shortName}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error("formsubmit failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="flex-1 px-6 py-10 pad-safe-t pad-safe-b">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <Link href="/" className="font-display text-2xl font-bold text-white">
          WOOH
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl text-white">Assistenza e contatti</h1>
          <p className="text-ink-soft">
            Hai un problema, una domanda o un&apos;idea? Scrivici: ti rispondiamo via email
            il prima possibile.
          </p>
        </div>

        {status === "sent" ? (
          <div className="rounded-blob border border-lime/40 bg-lime/10 p-6 text-center">
            <p className="font-display text-2xl text-lime">Messaggio inviato! 🎉</p>
            <p className="mt-1 text-ink-soft">Ti rispondiamo via email al più presto.</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm text-ink-faint underline"
            >
              Invia un altro messaggio
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-ink-faint">Nome</span>
              <input name="name" required autoComplete="name" className={inputCls} placeholder="Come ti chiami" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-ink-faint">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputCls}
                placeholder="La tua email (per la risposta)"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-ink-faint">Messaggio</span>
              <textarea
                name="message"
                required
                rows={6}
                className={`${inputCls} min-h-[140px] resize-y`}
                placeholder="Scrivi qui il tuo messaggio"
              />
            </label>

            {status === "error" && (
              <p className="text-sm text-magenta">
                Invio non riuscito. Scrivici direttamente a{" "}
                <a className="underline" href={`mailto:${BRAND.supportEmail}`}>
                  {BRAND.supportEmail}
                </a>
                .
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn3d-cyan mt-1 rounded-full bg-cyan px-6 py-3 font-display text-lg font-bold text-ink-dark transition active:translate-y-1 disabled:opacity-60"
            >
              {status === "sending" ? "Invio…" : "Invia messaggio"}
            </button>
          </form>
        )}

        <div className="rounded-2xl border border-line bg-surface/60 p-4 text-sm text-ink-soft">
          Preferisci scrivere direttamente? Mandaci una mail a{" "}
          <a className="text-cyan underline" href={`mailto:${BRAND.supportEmail}`}>
            {BRAND.supportEmail}
          </a>
        </div>

        <div className="flex gap-5 text-sm text-ink-faint">
          <Link href="/privacy" className="underline">
            Privacy
          </Link>
          <Link href="/download" className="underline">
            Scarica l&apos;app
          </Link>
        </div>
      </div>
    </main>
  );
}
