"use client";

import { useState } from "react";

export interface MenuAction {
  label: string;
  icon?: string;
  onClick: () => void;
  danger?: boolean;
}

/**
 * Menu del master: bottone ☰ in alto a sinistra che apre un pannello con le
 * azioni di gestione (esci, ricomincia, ecc.). Solo il master lo monta.
 * Ferma la propagazione: aprirlo/usarlo non fa avanzare la carta sotto.
 */
export function MasterMenu({ actions, label = "Menu" }: { actions: MenuAction[]; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="absolute left-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border-2 border-line bg-surface/80 text-lg text-white backdrop-blur"
      >
        ☰
      </button>

      {open ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
          className="fixed inset-0 z-40 flex items-start justify-start bg-night/70 p-4 pad-safe-t"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-64 max-w-[82vw] overflow-hidden rounded-2xl border-2 border-line bg-surface-2 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          >
            {actions.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  a.onClick();
                }}
                className={`flex w-full items-center gap-3 px-5 py-4 text-left font-bold ${
                  a.danger ? "text-magenta" : "text-white"
                } ${i > 0 ? "border-t border-line" : ""}`}
              >
                {a.icon ? <span className="text-xl">{a.icon}</span> : null}
                {a.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
