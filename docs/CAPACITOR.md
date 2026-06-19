# Capacitor — Android / iOS

La shell nativa **avvolge il sito live** (`server.url` in `capacitor.config.ts`), perché l'app è SSR + realtime. Quindi l'app nativa mostra esattamente `https://thewoohgame.vercel.app`.
→ **Il deploy Vercel deve funzionare** perché l'app nativa carichi qualcosa.

- **appId:** `com.woohgame.app` (cambialo in `capacitor.config.ts` prima di pubblicare, se vuoi)
- **Plugin:** App (tasto back), StatusBar, SplashScreen — gestiti in `src/components/NativeShell.tsx`
- **Icone/splash native:** già generate in `android/app/src/main/res/` da `assets/logo.png`

## Prerequisiti
- **Android:** Android Studio + JDK 17
- **iOS:** un Mac con Xcode (la piattaforma iOS NON è stata aggiunta qui perché siamo su Windows)

## Sviluppo / build Android
```bash
npm install
npx cap sync android          # dopo modifiche a config o plugin
npx cap open android          # apre Android Studio
```
In Android Studio: **Run** per testare su device/emulatore.

### Generare l'AAB per il Play Store
```bash
cd android
./gradlew bundleRelease        # output: android/app/build/outputs/bundle/release/app-release.aab
```
(oppure Android Studio → Build → Generate Signed App Bundle). Serve una **keystore** di firma.

## Rigenerare icone e splash
Se cambi il logo, aggiorna `assets/logo.png` (1024×1024) e:
```bash
npx @capacitor/assets generate --android --iconBackgroundColor "#8a27d6" --splashBackgroundColor "#8a27d6"
```

## iOS (su Mac)
```bash
npm install
npx cap add ios
npx cap sync ios
npx cap open ios               # Xcode → Archive → upload App Store Connect
```

## Note Store (compliance)
- **18+ / Adult** in entrambi gli store (questionario IARC/Apple onesto: alcol + contenuti).
- Disclaimer "gioca responsabilmente / funziona anche analcolico / non guidare" già presente in-app.
- Mazzo Hot solo suggestivo, mai esplicito (già così).
- Niente incentivi a bere in modo eccessivo/competitivo (già rispettato).
