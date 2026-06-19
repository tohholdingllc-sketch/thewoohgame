import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "yellow" | "cyan" | "magenta" | "lime" | "ghost";
type Size = "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/*
  Bottone "ciccione" stile Gartic Phone: grande, tondo, con ombra solida 3D
  che si "schiaccia" al tap (active:translate-y). Touch-first (stato :active),
  focus ring accessibile.
*/
const base =
  "inline-flex items-center justify-center gap-2 rounded-blob font-display font-bold tracking-wide " +
  "select-none transition-all duration-75 will-change-transform active:translate-y-[4px] " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 " +
  "disabled:opacity-50 disabled:pointer-events-none disabled:active:translate-y-0";

const variants: Record<Variant, string> = {
  yellow: "bg-yellow text-ink-dark btn3d-yellow",
  cyan: "bg-cyan text-ink-dark btn3d-cyan",
  magenta: "bg-magenta text-ink-dark btn3d-magenta",
  lime: "bg-lime text-ink-dark btn3d-lime",
  ghost: "bg-surface-2 text-ink border-2 border-line btn3d-ghost",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-lg",
  lg: "h-16 px-8 text-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "yellow", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
