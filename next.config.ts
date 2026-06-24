import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statico: l'app diventa HTML/JS bundle-abile da Capacitor (app native),
  // e resta deployabile come sito statico su Vercel. Tutto gira client-side (Supabase).
  output: "export",
  // Route come /play/ → out/play/index.html: così il WebView nativo (Capacitor)
  // risolve le navigazioni hard (window.location.assign) come fa un server web.
  // Senza, Next genera out/play.html e su iOS "/play" dà 404 → app bloccata sul login.
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
