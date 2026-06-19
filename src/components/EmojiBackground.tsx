/**
 * Sfondo decorativo: faccine emoji sparse (stile "Logo App" di reference),
 * tenui su fondo scuro. Layer fisso dietro al contenuto, non interattivo.
 */
const EMOJIS: { e: string; top: string; left: string; size: number; rot: number }[] = [
  { e: "😜", top: "6%", left: "10%", size: 44, rot: -14 },
  { e: "🤯", top: "4%", left: "74%", size: 40, rot: 12 },
  { e: "😍", top: "16%", left: "44%", size: 34, rot: -6 },
  { e: "🥵", top: "24%", left: "84%", size: 38, rot: 8 },
  { e: "😈", top: "30%", left: "6%", size: 42, rot: 10 },
  { e: "🥳", top: "40%", left: "70%", size: 36, rot: -10 },
  { e: "🍻", top: "47%", left: "20%", size: 40, rot: 6 },
  { e: "😏", top: "55%", left: "88%", size: 34, rot: -8 },
  { e: "🔥", top: "60%", left: "8%", size: 38, rot: 12 },
  { e: "😮", top: "66%", left: "48%", size: 36, rot: -6 },
  { e: "🥴", top: "74%", left: "78%", size: 40, rot: 10 },
  { e: "🤩", top: "80%", left: "16%", size: 38, rot: -12 },
  { e: "😬", top: "88%", left: "62%", size: 34, rot: 8 },
  { e: "🥰", top: "92%", left: "34%", size: 40, rot: -10 },
];

export function EmojiBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden">
      {EMOJIS.map((x, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: x.top,
            left: x.left,
            fontSize: Math.round(x.size * 1.4),
            transform: `rotate(${x.rot}deg)`,
            opacity: 0.13,
          }}
        >
          {x.e}
        </span>
      ))}
    </div>
  );
}
