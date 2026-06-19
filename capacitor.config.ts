import type { CapacitorConfig } from "@capacitor/cli";

/*
  The WOOH Game — Capacitor.
  App SSR + realtime → la shell nativa carica il sito live (server.url).
  Cambia `appId`/`server.url` se necessario prima della pubblicazione.
*/
const config: CapacitorConfig = {
  appId: "com.woohgame.app",
  appName: "The WOOH Game",
  webDir: "public",
  backgroundColor: "#8a27d6",
  // URL produzione reale: il progetto Vercel sta sotto il team
  // "kiv-mobile-s-projects", quindi l'alias di produzione (branch main) è questo.
  // Se in futuro colleghi un dominio custom, basta sostituirlo qui.
  server: {
    url: "https://thewoohgame-git-main-kiv-mobile-s-projects.vercel.app",
    cleartext: false,
  },
  android: {
    backgroundColor: "#8a27d6",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#8a27d6",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#8a27d6",
    },
  },
};

export default config;
