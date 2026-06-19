import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";
import { PwaRegister } from "@/components/PwaRegister";

// Font display (logo/titoli): tondo e bold, vibe Gartic Phone.
// NOTA: il brief vuole il font "Lou"; quando avremo il .woff2 lo passiamo a
// next/font/local e cambiamo solo questa costante + la var in globals.css.
const display = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

// Font corpo: leggibile per i testi lunghi delle carte.
const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: BRAND.name,
  description:
    "Il party game per bere multiplayer. Una partita, tutti col proprio telefono. 18+",
  applicationName: BRAND.name,
  appleWebApp: {
    capable: true,
    title: BRAND.shortName,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: BRAND.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // estende il contenuto sotto i notch (safe-area-inset-*)
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
