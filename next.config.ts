import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fissa la root del progetto: evita che Next scelga la cartella sbagliata
  // quando esiste un package-lock.json in una cartella superiore.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
