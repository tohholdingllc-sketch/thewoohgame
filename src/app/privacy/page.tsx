import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy — ${BRAND.name}`,
};

/** Privacy policy statica (richiesta dal Play Store / App Store). */
export default function PrivacyPage() {
  return (
    <main className="flex-1 px-6 py-10 pad-safe-t pad-safe-b">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 text-ink-soft">
        <h1 className="font-display text-3xl text-white">Privacy Policy</h1>
        <p className="text-sm text-ink-faint">The WOOH Game · ultimo aggiornamento: giugno 2026</p>

        <p>
          The WOOH Game è un party game per adulti (18+). Trattiamo i tuoi dati nel modo più
          ridotto possibile, solo per far funzionare il gioco. Non vendiamo i tuoi dati e (al
          momento) non mostriamo pubblicità.
        </p>

        <h2 className="font-display text-xl text-white">Dati che trattiamo</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b>Gioco da ospite:</b> creiamo un identificativo anonimo e salviamo solo il
            nickname, l&apos;avatar e il colore che scegli. Nessun dato personale.
          </li>
          <li>
            <b>Account (facoltativo):</b> se ti registri, trattiamo email e password (gestite in
            modo sicuro dal nostro fornitore di autenticazione) per farti ritrovare le tue
            partite. Se usi Google, riceviamo nome ed email dal tuo account Google.
          </li>
          <li>
            <b>Dati di gioco:</b> partite, codici, giocatori e avanzamento, necessari per la
            sincronizzazione in tempo reale tra i telefoni.
          </li>
          <li>
            <b>Età:</b> confermi di avere almeno 18 anni all&apos;avvio.
          </li>
        </ul>

        <h2 className="font-display text-xl text-white">Come e dove</h2>
        <p>
          I dati sono ospitati su <b>Supabase</b> (infrastruttura nell&apos;Unione Europea) e usati
          solo per erogare il servizio. Non li cediamo a terzi per scopi di marketing.
        </p>

        <h2 className="font-display text-xl text-white">I tuoi diritti</h2>
        <p>
          Puoi chiedere in qualsiasi momento l&apos;accesso, la correzione o la cancellazione del
          tuo account e dei dati associati scrivendo al contatto qui sotto. Le partite vengono
          eliminate automaticamente quando non più attive.
        </p>

        <h2 className="font-display text-xl text-white">Contatti</h2>
        <p>
          Per qualsiasi richiesta sulla privacy:{" "}
          <a className="text-cyan underline" href="mailto:tohholdingllc@gmail.com">
            tohholdingllc@gmail.com
          </a>
        </p>

        <p className="pt-4 text-sm text-ink-faint">
          Potremmo aggiornare questa policy; le modifiche saranno pubblicate su questa pagina.
        </p>
      </div>
    </main>
  );
}
