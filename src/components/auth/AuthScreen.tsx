"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { AgeGate } from "@/components/auth/AgeGate";
import { AVATARS } from "@/lib/avatars";
import { WoohEmoji } from "@/components/WoohEmoji";
import { NICKNAME_COLORS } from "@/lib/brand";

const AGE_KEY = "wooh_age_ok";
const inputCls =
  "w-full rounded-2xl border-2 border-line bg-white px-4 h-12 text-ink-dark font-semibold placeholder:text-ink-dark/40 focus:border-magenta focus:outline-none";

export function AuthScreen() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

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
      setError("Scegli un nickname (almeno 2 caratteri).");
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
    router.replace("/play");
    router.refresh();
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: meta() },
      });
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

  // Evita flash dell'overlay finché non leggiamo localStorage
  if (ageOk === null) return <div className="flex-1" />;
  if (!ageOk) return <AgeGate onConfirm={confirmAge} />;

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-8 pad-safe-t pad-safe-b">
      <div className="flex w-full max-w-md flex-1 flex-col items-center gap-7">
        {/* Wordmark (logo a pennello: bianco con bordo arancione) */}
        <div className="flex flex-col items-center leading-none">
          <WoohEmoji
            variant="wooh"
            size={72}
            className="mb-3 drop-shadow-[0_6px_0_rgba(0,0,0,0.18)]"
          />
          <span className="font-display text-base tracking-[0.3em] text-white/90">THE</span>
          <h1
            className="font-display text-7xl text-white"
            style={{
              WebkitTextStroke: "6px #ff8a3d",
              paintOrder: "stroke",
              filter: "drop-shadow(0 5px 0 rgba(0,0,0,0.18))",
            }}
          >
            WOOH
          </h1>
          <span className="font-display text-2xl tracking-[0.35em] text-white">GAME</span>
        </div>

        {/* Identità */}
        <div className="flex w-full flex-col items-center gap-4">
          <PlayerAvatar avatarId={avatarId} color={color} size={88} />

          <input
            className={`${inputCls} text-center text-lg font-bold`}
            placeholder="Il tuo nickname"
            maxLength={20}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          {/* Picker avatar */}
          <div className="flex w-full gap-3 overflow-x-auto pb-2">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAvatarId(a.id)}
                aria-label={a.label}
                className="shrink-0"
              >
                <PlayerAvatar avatarId={a.id} color={color} size={48} selected={a.id === avatarId} />
              </button>
            ))}
          </div>

          {/* Picker colore */}
          <div className="flex gap-3">
            {NICKNAME_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Colore ${c}`}
                className={`h-8 w-8 rounded-full transition-transform ${
                  c === color ? "scale-110 ring-4 ring-white" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Gioca come ospite (path primario) */}
        <Button
          variant="magenta"
          size="lg"
          className="w-full"
          disabled={busy}
          onClick={playAsGuest}
        >
          🎉 Gioca come ospite
        </Button>

        {/* Divider */}
        <div className="flex w-full items-center gap-3 text-ink-faint">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs">oppure salva il tuo account</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        {/* Account email/password */}
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
            {mode === "signup" ? "Registrati e gioca" : "Accedi"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === "signup" ? "login" : "signup"));
              setError(null);
            }}
            className="text-sm text-ink-soft underline underline-offset-4"
          >
            {mode === "signup" ? "Hai già un account? Accedi" : "Non hai un account? Registrati"}
          </button>

          <button
            type="button"
            onClick={withGoogle}
            disabled={busy}
            className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-line bg-surface px-4 font-bold text-ink disabled:opacity-50"
          >
            <span>Continua con Google</span>
          </button>
        </div>

        {error ? (
          <p className="w-full rounded-xl bg-magenta/15 px-4 py-2 text-center text-sm text-magenta">
            {error}
          </p>
        ) : null}

        <p className="mt-auto max-w-xs text-center text-xs leading-relaxed text-ink-faint">
          Gioca responsabilmente. Le carte funzionano anche con bevande analcoliche.
          Se bevi, non guidare. 18+
        </p>
      </div>
    </main>
  );
}
