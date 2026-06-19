import { avatarById } from "@/lib/avatars";
import { cn } from "@/lib/utils";

interface PlayerAvatarProps {
  avatarId?: string | null;
  color?: string | null;
  name?: string | null;
  size?: number;
  selected?: boolean;
  className?: string;
}

/**
 * Avatar giocatore: cerchio (emoji o immagine) col colore scelto, nome sotto.
 * Riusato in selezione avatar, lobby e gioco.
 */
export function PlayerAvatar({
  avatarId,
  color,
  name,
  size = 64,
  selected = false,
  className,
}: PlayerAvatarProps) {
  const a = avatarById(avatarId);
  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-full leading-none transition-transform",
          selected && "scale-105 ring-4 ring-white",
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: color ?? "var(--color-surface-2)",
          fontSize: Math.round(size * 0.52),
        }}
      >
        {a.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.img} alt={a.label} className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden>{a.emoji}</span>
        )}
      </div>
      {name ? (
        <span
          className="max-w-[88px] truncate text-sm font-bold"
          style={{ color: color ?? "var(--color-ink)" }}
        >
          {name}
        </span>
      ) : null}
    </div>
  );
}
