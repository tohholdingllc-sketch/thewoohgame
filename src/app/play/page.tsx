"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { PlayActions } from "./PlayActions";
import { getClientLocale } from "@/lib/locale-client";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

interface Profile {
  nickname: string | null;
  avatar_id: string | null;
  nickname_color: string | null;
}

export default function Play() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("it");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(getClientLocale());
    const supabase = createClient();
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        router.replace("/");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("nickname, avatar_id, nickname_color")
        .eq("id", user.id)
        .single();
      setProfile((data as Profile) ?? { nickname: null, avatar_id: null, nickname_color: null });
      setReady(true);
    })();
  }, [router]);

  if (!ready) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-yellow" />
      </main>
    );
  }

  const d = getDict(locale);
  const nickname = profile?.nickname ?? "Giocatore";

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 pad-safe-t pad-safe-b">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <PlayerAvatar avatarId={profile?.avatar_id} color={profile?.nickname_color} size={108} />
        <div>
          <p className="text-ink-soft">{d.welcome}</p>
          <h1 className="font-display text-4xl">{d.hi(nickname)}</h1>
        </div>
        <PlayActions locale={locale} />
      </div>
    </main>
  );
}
