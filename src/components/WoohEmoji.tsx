export type WoohVariant = "wooh" | "love" | "money" | "drunk";

interface WoohEmojiProps {
  variant?: WoohVariant;
  size?: number;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

/**
 * Emoji "WOOH" disegnata a vettori (nessuna dipendenza esterna): faccia gialla
 * con la bocca a U che urla, in 4 espressioni del brand.
 * - wooh:  base, sopracciglia su, occhi spalancati
 * - love:  occhi a cuore (passa una bella persona)
 * - money: occhi a dollaro (grande vincita)
 * - drunk: occhi rossi/woozy + guance rosse (drink forte)
 */
export function WoohEmoji({
  variant = "wooh",
  size = 64,
  className,
  title = "Emoji WOOH",
  style,
}: WoohEmojiProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* faccia */}
      <circle cx="50" cy="50" r="46" fill="#FFC83D" stroke="#E89A00" strokeWidth="1.5" />
      <ellipse cx="50" cy="30" rx="33" ry="18" fill="#FFD96B" opacity="0.7" />

      {/* sopracciglia (tranne ubriaco) */}
      {variant !== "drunk" && (
        <>
          <path d="M27 33 Q35 28 43 32" stroke="#FF8A3D" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M57 32 Q65 28 73 33" stroke="#FF8A3D" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* occhi per variante */}
      {variant === "wooh" && (
        <>
          <ellipse cx="35" cy="41" rx="5.5" ry="7.5" fill="#3A2A00" />
          <ellipse cx="65" cy="41" rx="5.5" ry="7.5" fill="#3A2A00" />
          <circle cx="37" cy="38" r="1.8" fill="#fff" />
          <circle cx="67" cy="38" r="1.8" fill="#fff" />
        </>
      )}
      {variant === "love" && (
        <>
          <path transform="translate(35,41) scale(9)" d="M0 -0.3 C-0.5 -1 -1.3 -0.4 0 0.6 C1.3 -0.4 0.5 -1 0 -0.3 Z" fill="#FF3355" />
          <path transform="translate(65,41) scale(9)" d="M0 -0.3 C-0.5 -1 -1.3 -0.4 0 0.6 C1.3 -0.4 0.5 -1 0 -0.3 Z" fill="#FF3355" />
        </>
      )}
      {variant === "money" && (
        <>
          <rect x="28.5" y="33" width="13" height="16" rx="3.5" fill="#fff" stroke="#3A2A00" strokeWidth="0.8" />
          <rect x="58.5" y="33" width="13" height="16" rx="3.5" fill="#fff" stroke="#3A2A00" strokeWidth="0.8" />
          <text x="35" y="46" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="900" fill="#1FA84B">$</text>
          <text x="65" y="46" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="900" fill="#1FA84B">$</text>
        </>
      )}
      {variant === "drunk" && (
        <>
          <ellipse cx="23" cy="56" rx="8" ry="4.5" fill="#FF7A7A" opacity="0.5" />
          <ellipse cx="77" cy="56" rx="8" ry="4.5" fill="#FF7A7A" opacity="0.5" />
          <ellipse cx="35" cy="42" rx="6" ry="6.5" fill="#fff" stroke="#9B2D22" strokeWidth="1" />
          <circle cx="35" cy="43" r="3" fill="#9B2D22" />
          <path d="M28.5 42 Q35 34 41.5 42 Z" fill="#FFC83D" />
          <path d="M57 42 q3 -5 6 0 t6 0" stroke="#9B2D22" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* bocca a U (urlo WOOH) + lingua */}
      <path d="M33 54 Q50 60 67 54 Q67 82 50 84 Q33 82 33 54 Z" fill="#6A3A0B" />
      <path d="M42 77 Q50 72 58 77 Q58 83 50 84 Q42 83 42 77 Z" fill="#FF5E62" />
    </svg>
  );
}
