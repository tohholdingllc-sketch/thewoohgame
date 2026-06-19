"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * CTA della splash (Fase 0). I bottoni sono già quelli reali (Crea/Entra);
 * per ora mostrano un avviso "in arrivo" — la logica vera arriva in Fase 2.
 * Serve anche a verificare che un Client Component interattivo funzioni.
 */
export function LandingCta() {
  const [touched, setTouched] = useState(false);

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <Button
        variant="yellow"
        size="lg"
        className="w-full"
        onClick={() => setTouched(true)}
      >
        🎉 Crea una partita
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className="w-full"
        onClick={() => setTouched(true)}
      >
        🔑 Entra con codice
      </Button>
      {touched && (
        <p className="text-center text-ink-soft text-sm">
          Le fondamenta sono pronte — il gioco arriva nelle prossime fasi 👀
        </p>
      )}
    </div>
  );
}
