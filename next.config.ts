import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statico: l'app diventa HTML/JS bundle-abile da Capacitor (app native),
  // e resta deployabile come sito statico su Vercel. Tutto gira client-side (Supabase).
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
