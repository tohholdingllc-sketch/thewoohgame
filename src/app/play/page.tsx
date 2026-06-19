import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { PlayActions } from "./PlayActions";

export default async function Play() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, avatar_id, nickname_color")
    .eq("id", user.id)
    .single();

  const nickname = profile?.nickname ?? "Giocatore";

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 pad-safe-t pad-safe-b">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <PlayerAvatar
          avatarId={profile?.avatar_id}
          color={profile?.nickname_color}
          size={108}
        />
        <div>
          <p className="text-ink-soft">Benvenuto in The WOOH Game</p>
          <h1 className="font-display text-4xl">Ciao {nickname}! 👋</h1>
        </div>
        <PlayActions />
      </div>
    </main>
  );
}
