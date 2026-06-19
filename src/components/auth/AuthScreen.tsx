"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { AgeGate } from "@/components/auth/AgeGate";
import { LocaleToggle } from "@/components/LocaleToggle";
import { EmojiBackground } from "@/components/EmojiBackground";
import { AVATARS, avatarById } from "@/lib/avatars";
import { NICKNAME_COLORS } from "@/lib/brand";
import { friendlyAuthError, getDict } from "@/lib/i18n";
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
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // localStorage non è disponibile in SSR: lettura sicura dopo il mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAgeOk(localStorage.getItem(AGE_KEY) === "1");
  }, []);

  function confirmAge() {
    localStorage.setItem(AGE_KEY, "1");
    setAgeOk(true);
  }

  // Nickname FACOLTATIVO: se vuoto ne generiamo uno divertente dall'avatar
  // scelto (es. "Volpe42"), così "Gioca" e "Registrati" non si bloccano mai.
  function effectiveNick() {
    const n = nickname.trim();
    if (n.length >= 2) return n;
    return `${avatarById(avatarId).label}${1 + Math.floor(Math.random() * 98)}`;
  }

  const meta = () => ({
    nickname: effectiveNick(),
    avatar_id: avatarId,
    nickname_color: color,
    is_adult: true,
  });

  function showError(msg: string) {
    setError(msg);
    setBusy(false);
    requestAnimationFrame(() =>
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  }

  function done(err: { message: string } | null) {
    if (err) {
      showError(friendlyAuthError(d, err.message));
      return;
    }
    window.location.assign(nextJoin ? `/join?code=${encodeURIComponent(nextJoin)}` : "/play");
  }

  async function playAsGuest() {
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInAnonymously({ options: { data: meta() } });
    done(error);
  }

  async function submitAccount() {
    setError(null);
    if (!email.trim() || !password) {
      showError(d.errFillFields);
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: meta() } });
      done(error);
    } else {
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
    if (error) showError(friendlyAuthError(d, error.message));
  }

  if (ageOk === null) return <div className="flex-1" />;
  if (!ageOk) return <AgeGate onConfirm={confirmAge} locale={locale} />;

  return (
    <main className="relative flex-1 flex flex-col items-center overflow-hidden px-6 py-6 pad-safe-t pad-safe-b">
      <EmojiBackground />
      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center gap-7">
        <LocaleToggle locale={locale} className="self-end" />

        {/* Logo: THE + WOOH (a pennello) + GAME — scritta gialla con glow soft */}
        <h1 className="flex flex-col items-center leading-none" aria-label="The WOOH Game">
          <span
            className="font-display text-lg font-bold tracking-[0.45em] text-yellow pl-[0.45em]"
            style={{ textShadow: "0 0 16px rgba(255,210,63,0.45)" }}
          >
            THE
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.png"
            alt=""
            className="my-1 w-60 max-w-[72%]"
            style={{ filter: "drop-shadow(0 0 18px rgba(255,255,255,0.22))" }}
          />
          <span
            className="font-display text-2xl font-bold tracking-[0.4em] text-yellow pl-[0.4em]"
            style={{ textShadow: "0 0 16px rgba(255,210,63,0.45)" }}
          >
            GAME
          </span>
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
            className="mt-1 flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-line bg-white px-4 font-bold text-ink-dark disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            <span>{d.continueGoogle}</span>
          </button>
        </div>

        {error ? (
          <p
            ref={errorRef}
            className="w-full rounded-xl bg-magenta/15 px-4 py-2 text-center text-sm text-magenta"
          >
            {error}
          </p>
        ) : null}

        <p className="mt-auto max-w-xs text-center text-xs leading-relaxed text-ink-faint">
          {d.disclaimerShort}
        </p>
      </div>
    </main>
  );
}
