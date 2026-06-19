"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { AgeGate } from "@/components/auth/AgeGate";
import { LocaleToggle } from "@/components/LocaleToggle";
import { AVATARS } from "@/lib/avatars";
import { NICKNAME_COLORS } from "@/lib/brand";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const AGE_KEY = "wooh_age_ok";
const inputCls =
  "w-full rounded-2xl border-2 border-line bg-white px-4 h-12 text-ink-dark font-semibold placeholder:text-ink-dark/40 focus:border-magenta focus:outline-none";

export function AuthScreen({ locale = "it", nextJoin }: { locale?: Locale; nextJoin?: string }) {
  const [supabase] = useState(() => createClient());
  const d = getDict(locale);

  const [ageOk, setAgeOk] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState("");
  const [avatarId, setAvatarId] = useState(AVATARS[0].id);
  const [color, setColor] = useState(NICKNAME_COLORS[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAgeOk(localStorage.getItem(AGE_KEY) === "1");
  }, []);

  function confirmAge() {
    localStorage.setItem(AGE_KEY, "1");
    setAgeOk(true);
  }

  const meta = () => ({
    nickname: nickname.trim(),
    avatar_id: avatarId,
    nickname_color: color,
    is_adult: true,
  });

  function needNick() {
    if (nickname.trim().length < 2) {
      setError(d.nickTooShort);
      return false;
    }
    return true;
  }

  function done(err: { message: string } | null) {
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    window.location.assign(nextJoin ? `/join?code=${encodeURIComponent(nextJoin)}` : "/play");
  }

  async function playAsGuest() {
    setError(null);
    if (!needNick()) return;
    setBusy(true);
    const { error } = await supabase.auth.signInAnonymously({ options: { data: meta() } });
    done(error);
  }

  async function submitAccount() {
    setError(null);
    if (mode === "signup") {
      if (!needNick()) return;
      setBusy(true);
      const { error } = await supabase.auth.signUp({ email, password, options: { data: meta() } });
      done(error);
    } else {
      setBusy(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      done(error);
    }
  }

  async function withGoogle() {
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setBusy(false);
    }
  }

  if (ageOk === null) return <div className="flex-1" />;
  if (!ageOk) return <AgeGate onConfirm={confirmAge} locale={locale} />;

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-6 pad-safe-t pad-safe-b">
      <div className="flex w-full max-w-md flex-1 flex-col items-center gap-7">
        <LocaleToggle locale={locale} className="self-end" />

        {/* Logo: THE + WOOH (a pennello) + GAME */}
        <h1 className="flex flex-col items-center leading-none" aria-label="The WOOH Game">
          <span className="font-display text-lg font-bold tracking-[0.45em] text-white pl-[0.45em]">THE</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.png"
            alt=""
            className="my-1 w-60 max-w-[72%] drop-shadow-[0_5px_0_rgba(0,0,0,0.2)]"
          />
          <span className="font-display text-2xl font-bold tracking-[0.4em] text-white pl-[0.4em]">GAME</span>
        </h1>

        {/* Identità */}
        <div className="flex w-full flex-col items-center gap-4">
          <button
            type="button"
            aria-label="Cambia avatar"
            onClick={() =>
              setAvatarId(AVATARS[(AVATARS.findIndex((a) => a.id === avatarId) + 1) % AVATARS.length].id)
            }
            className="transition-transform active:scale-95"
          >
            <PlayerAvatar avatarId={avatarId} color={color} size={96} />
          </button>

          <input
            className={`${inputCls} text-center text-lg font-bold`}
            placeholder={d.nicknamePlaceholder}
            maxLength={20}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <div className="flex w-full gap-3 overflow-x-auto pb-2">
            {AVATARS.map((a) => (
              <button key={a.id} type="button" onClick={() => setAvatarId(a.id)} aria-label={a.label} className="shrink-0">
                <PlayerAvatar avatarId={a.id} color={color} size={48} selected={a.id === avatarId} />
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {NICKNAME_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Colore ${c}`}
                className={`h-8 w-8 rounded-full transition-transform ${c === color ? "scale-110 ring-4 ring-white" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <Button variant="magenta" size="lg" className="w-full" disabled={busy} onClick={playAsGuest}>
          {d.playGuest}
        </Button>

        <div className="flex w-full items-center gap-3 text-ink-faint">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs">{d.orSaveAccount}</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="flex w-full flex-col gap-3">
          <input
            className={inputCls}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={inputCls}
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="cyan" size="md" className="w-full" disabled={busy} onClick={submitAccount}>
            {mode === "signup" ? d.signupAndPlay : d.loginCta}
          </Button>
          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === "signup" ? "login" : "signup"));
              setError(null);
            }}
            className="text-sm text-ink-soft underline underline-offset-4"
          >
            {mode === "signup" ? d.toLogin : d.toSignup}
          </button>

          <button
            type="button"
            onClick={withGoogle}
            disabled={busy}
            className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-line bg-surface px-4 font-bold text-ink disabled:opacity-50"
          >
            <span>{d.continueGoogle}</span>
          </button>
        </div>

        {error ? (
          <p className="w-full rounded-xl bg-magenta/15 px-4 py-2 text-center text-sm text-magenta">{error}</p>
        ) : null}

        <p className="mt-auto max-w-xs text-center text-xs leading-relaxed text-ink-faint">
          {d.disclaimerShort}
        </p>
      </div>
    </main>
  );
}
