import type { CapacitorConfig } from "@capacitor/cli";

/*
  The WOOH Game — Capacitor.
  App "impacchettata": gli asset web (export statico Next in `out/`) stanno DENTRO
  l'app, NON caricati da un URL remoto → niente rischio rifiuto Apple. Nessun App Link
  configurato, quindi i link di invito condivisi restano sempre browser-first.
*/
const config: CapacitorConfig = {
  appId: "com.thewoohgame.app",
  appName: "The WOOH Game",
  webDir: "out",
  backgroundColor: "#0a0716",
  android: {
    backgroundColor: "#0a0716",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0a0716",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0a0716",
    },
  },
};

export default config;
