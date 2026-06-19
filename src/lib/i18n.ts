import type { Locale } from "@/lib/types";

export const LOCALE_COOKIE = "wooh_locale";
export const LOCALES: Locale[] = ["it", "en"];
export const DEFAULT_LOCALE: Locale = "it";

const it = {
  // age gate
  ageTitle: "Hai almeno 18 anni?",
  ageBody:
    "The WOOH Game è un party game per adulti. Gioca responsabilmente: tutte le carte funzionano anche con bevande analcoliche.",
  ageYes: "Sì, ho 18+ anni",
  ageNo: "No, esco",
  // auth
  nicknamePlaceholder: "Il tuo nome (facoltativo)",
  playGuest: "🎉 Gioca come ospite",
  orSaveAccount: "oppure salva il tuo account",
  signupAndPlay: "Registrati e gioca",
  loginCta: "Accedi",
  toLogin: "Hai già un account? Accedi",
  toSignup: "Non hai un account? Registrati",
  continueGoogle: "Continua con Google",
  nickTooShort: "Scegli un nickname (almeno 2 caratteri).",
  errInvalidLogin: "Email o password non corretti.",
  errEmailTaken: "Email già registrata: usa «Accedi» invece di registrarti.",
  errWeakPassword: "Password troppo corta (almeno 6 caratteri).",
  errGoogleNotReady: "Login con Google non ancora attivo. Usa ospite o email.",
  errFillFields: "Inserisci email e password.",
  disclaimer:
    "Gioca responsabilmente. Tutte le carte funzionano anche con bevande analcoliche. Se bevi, non guidare. 18+",
  disclaimerShort:
    "Gioca responsabilmente. Le carte funzionano anche con bevande analcoliche. Se bevi, non guidare. 18+",
  // play
  welcome: "Benvenuto in The WOOH Game",
  hi: (n: string) => `Ciao ${n}! 👋`,
  createGame: "🎉 Crea una partita",
  joinGame: "🔑 Entra con codice",
  logout: "Esci",
  // join
  joinTitle: "Entra in partita",
  joinSubtitle: "Inserisci il codice che ti ha dato il tuo amico.",
  joinCta: "Entra 🎉",
  back: "Indietro",
  enterCode: "Inserisci il codice della partita.",
  gameNotFound: "Partita non trovata. Controlla il codice.",
  gameStarted: "La partita è già iniziata.",
  // lobby
  gameCode: "Codice partita",
  invite: "📋 Invita amici",
  linkCopied: "Link copiato! ✅",
  players: "Giocatori",
  addManual: "Aggiungi giocatore a mano…",
  chooseDecks: "Scegli i mazzi",
  startGame: "🚀 Inizia partita",
  startNeeds: "Servono 2+ giocatori e 1 mazzo",
  waitMaster: "Aspetta che il master faccia iniziare la partita…",
  decksLabel: "Mazzi",
  leaveLobby: "Esci dalla lobby",
  noCards: "Nessuna carta per questi mazzi col numero di giocatori attuale.",
  alsoForTwo: "Anche in 2 ✌️",
  // game
  infoLabel: "Info: gioco responsabile",
  gameOver: "Fine partita!",
  gameOverSub: "Avete fatto WOOH fino in fondo 🍻",
  playAgain: "🔄 Rigioca",
  waitMasterShort: "In attesa del master…",
  exit: "Esci",
  woohIfSkip: "se salti",
  tapNext: "Tocca lo schermo per la prossima carta",
  tapFinish: "Tocca per terminare 🏁",
  masterFlipping: "Il master sta scorrendo le carte…",
  // card types
  ct_io_non_ho_mai: "Io non ho mai",
  ct_tre_cose: "Le 3 cose",
  ct_sinonimi: "Sinonimi",
  ct_azione: "Azione",
  ct_regola: "Regola",
  ct_wooh: "WOOH!",
  ct_manichino: "Manichino",
  ct_domanda: "Domanda",
  ct_default: "Carta",
};

const en: typeof it = {
  ageTitle: "Are you 18 or older?",
  ageBody:
    "The WOOH Game is an adults-only party game. Play responsibly: every card works with non-alcoholic drinks too.",
  ageYes: "Yes, I'm 18+",
  ageNo: "No, I'll leave",
  nicknamePlaceholder: "Your name (optional)",
  playGuest: "🎉 Play as guest",
  orSaveAccount: "or save your account",
  signupAndPlay: "Sign up and play",
  loginCta: "Log in",
  toLogin: "Already have an account? Log in",
  toSignup: "No account? Sign up",
  continueGoogle: "Continue with Google",
  nickTooShort: "Pick a nickname (at least 2 characters).",
  errInvalidLogin: "Wrong email or password.",
  errEmailTaken: "Email already registered: use “Log in” instead.",
  errWeakPassword: "Password too short (at least 6 characters).",
  errGoogleNotReady: "Google login isn't active yet. Use guest or email.",
  errFillFields: "Enter email and password.",
  disclaimer:
    "Play responsibly. Every card works with non-alcoholic drinks too. If you drink, don't drive. 18+",
  disclaimerShort:
    "Play responsibly. Cards work with non-alcoholic drinks too. If you drink, don't drive. 18+",
  welcome: "Welcome to The WOOH Game",
  hi: (n: string) => `Hi ${n}! 👋`,
  createGame: "🎉 Create a game",
  joinGame: "🔑 Join with a code",
  logout: "Log out",
  joinTitle: "Join a game",
  joinSubtitle: "Enter the code your friend gave you.",
  joinCta: "Join 🎉",
  back: "Back",
  enterCode: "Enter the game code.",
  gameNotFound: "Game not found. Check the code.",
  gameStarted: "The game has already started.",
  gameCode: "Game code",
  invite: "📋 Invite friends",
  linkCopied: "Link copied! ✅",
  players: "Players",
  addManual: "Add a player manually…",
  chooseDecks: "Choose the decks",
  startGame: "🚀 Start game",
  startNeeds: "Need 2+ players and 1 deck",
  waitMaster: "Wait for the host to start the game…",
  decksLabel: "Decks",
  leaveLobby: "Leave lobby",
  noCards: "No cards for these decks with the current number of players.",
  alsoForTwo: "Also for 2 ✌️",
  infoLabel: "Info: responsible gaming",
  gameOver: "Game over!",
  gameOverSub: "You WOOH'd all the way 🍻",
  playAgain: "🔄 Play again",
  waitMasterShort: "Waiting for the host…",
  exit: "Exit",
  woohIfSkip: "if you skip",
  tapNext: "Tap the screen for the next card",
  tapFinish: "Tap to finish 🏁",
  masterFlipping: "The host is flipping the cards…",
  ct_io_non_ho_mai: "Never have I ever",
  ct_tre_cose: "3 things",
  ct_sinonimi: "Synonyms",
  ct_azione: "Action",
  ct_regola: "Rule",
  ct_wooh: "WOOH!",
  ct_manichino: "Mannequin",
  ct_domanda: "Question",
  ct_default: "Card",
};

const DICT = { it, en };
export type Dict = typeof it;

export function getDict(locale: Locale): Dict {
  return DICT[locale] ?? DICT.it;
}

/** Traduce i messaggi d'errore (inglese) di Supabase Auth in testo amichevole. */
export function friendlyAuthError(dict: Dict, msg: string): string {
  const m = (msg || "").toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials")) return dict.errInvalidLogin;
  if (m.includes("already registered") || m.includes("already exists") || m.includes("user already"))
    return dict.errEmailTaken;
  if (m.includes("password")) return dict.errWeakPassword;
  if (m.includes("provider is not enabled") || m.includes("unsupported provider") || m.includes("validation_failed"))
    return dict.errGoogleNotReady;
  return msg || "Errore. Riprova.";
}

export function cardTypeLabel(dict: Dict, type: string): string {
  switch (type) {
    case "io_non_ho_mai":
      return dict.ct_io_non_ho_mai;
    case "tre_cose":
      return dict.ct_tre_cose;
    case "sinonimi":
      return dict.ct_sinonimi;
    case "azione":
      return dict.ct_azione;
    case "regola":
      return dict.ct_regola;
    case "wooh":
      return dict.ct_wooh;
    case "manichino":
      return dict.ct_manichino;
    case "domanda":
      return dict.ct_domanda;
    default:
      return dict.ct_default;
  }
}

/** Imposta la lingua lato client (cookie) — poi serve un router.refresh(). */
export function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** Legge la lingua da una stringa cookie (client) o da un valore. */
export function normalizeLocale(value?: string | null): Locale {
  return value === "en" ? "en" : "it";
}
