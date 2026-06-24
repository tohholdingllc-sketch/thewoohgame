import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { DownloadLanding } from "./DownloadLanding";

export const metadata: Metadata = {
  title: `Scarica ${BRAND.name}`,
  description:
    "Scarica The WOOH Game: il party game multiplayer da fare in compagnia. Disponibile su Google Play, presto su App Store.",
  openGraph: {
    title: `Scarica ${BRAND.name}`,
    description: "Il party game multiplayer da fare in compagnia. Una partita, tutti col proprio telefono.",
    url: `${BRAND.url}/download`,
    siteName: BRAND.name,
    type: "website",
  },
};

export default function DownloadPage() {
  return <DownloadLanding />;
}
