// Sblocca tutti i mazzi, abbassa min_players a 2 (2 giocatori = ogni mazzo),
// aggiunge mazzi (profondo, karaoke) e nuove carte (incl. tipo "domanda").
// Uso: node scripts/expand-content.mjs
import fs from "node:fs";

const path = "data/cards.seed.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

// 1) Tutto libero + giocabile in 2
for (const d of data.decks) {
  d.is_premium = false;
  d.min_players = 2;
}
for (const c of data.cards) c.min_players = 2;

// 2) Nuovi mazzi
const haveDeck = new Set(data.decks.map((d) => d.slug));
for (const d of [
  { slug: "profondo", name: { it: "Profondo", en: "Deep" }, description: { it: "Domande vere e piccole confessioni", en: "Real questions and little confessions" }, intensity: 2, is_premium: false, min_players: 2, sort_order: 6 },
  { slug: "karaoke", name: { it: "Karaoke", en: "Karaoke" }, description: { it: "Canta, balla e fai scena", en: "Sing, dance and put on a show" }, intensity: 1, is_premium: false, min_players: 2, sort_order: 7 },
]) {
  if (!haveDeck.has(d.slug)) data.decks.push(d);
}

// 3) Nuove carte
const C = (deck, type, it, en, opts = {}) => ({
  deck,
  type,
  is_persistent: type === "regola" || type === "manichino",
  needs_target: opts.needs_target ?? 0,
  min_players: 2,
  ...(opts.param ? { param: opts.param } : {}),
  text: { it, en },
});

const newCards = [
  // --- start ---
  C("start", "io_non_ho_mai", "Io non ho mai rubato qualcosa, nemmeno una penna. Chi l'ha fatto, beve.", "Never have I ever stolen something, not even a pen. Whoever has, drinks."),
  C("start", "wooh", "Tutti insieme: 3, 2, 1... WOOH! L'ultimo a urlare distribuisce 2 WOOH.", "All together: 3, 2, 1... WOOH! The last to shout hands out 2 WOOH."),
  C("start", "domanda", "Qual è la cosa più imbarazzante che hai fatto da ubriaco? Racconta o bevi 2 WOOH.", "What's the most embarrassing thing you've done while drunk? Tell it or drink 2 WOOH."),
  C("start", "azione", "Scambia un accessorio (occhiali, cappello, gioiello) con {player} fino alla prossima carta.", "Swap an accessory (glasses, hat, jewelry) with {player} until the next card.", { needs_target: 1 }),
  // --- mood ---
  C("mood", "io_non_ho_mai", "Io non ho mai finto di stare male per evitare un impegno. Chi l'ha fatto, beve.", "Never have I ever faked being sick to skip something. Whoever has, drinks."),
  C("mood", "tre_cose", "Di' 3 cose che faresti se fossi invisibile per un'ora. Se non ne dici 3, bevi.", "Name 3 things you'd do if you were invisible for an hour. Can't name 3? Drink."),
  C("mood", "regola", "REGOLA: fino alla prossima regola è vietato dire 'no'. Chi lo dice, beve un WOOH.", "RULE: until the next rule, saying 'no' is banned. Say it, drink a WOOH."),
  C("mood", "azione", "Manda (o fingi di mandare) un vocale super drammatico a {player}.", "Send (or pretend to send) a super dramatic voice note to {player}.", { needs_target: 1 }),
  C("mood", "domanda", "Se potessi cancellare un tuo ex dalla memoria di tutti, chi? Rispondi o bevi.", "If you could erase one of your exes from everyone's memory, who? Answer or drink."),
  // --- hot ---
  C("hot", "io_non_ho_mai", "Io non ho mai mandato una foto bollente a qualcuno. Chi l'ha fatto, beve.", "Never have I ever sent a spicy photo to someone. Whoever has, drinks."),
  C("hot", "azione", "Detta a {player} un messaggio audace da mandare alla sua cotta. Se rifiuti, bevi 2 WOOH.", "Dictate a bold message for {player} to send their crush. Refuse, drink 2 WOOH.", { needs_target: 1 }),
  C("hot", "domanda", "Qual è il posto più assurdo in cui hai baciato qualcuno? Rispondi o bevi 2 WOOH.", "What's the most absurd place you've kissed someone? Answer or drink 2 WOOH."),
  C("hot", "azione", "Siediti sulle ginocchia di {player} fino alla prossima carta. Se rifiuti, bevi.", "Sit on {player}'s lap until the next card. Refuse and drink.", { needs_target: 1 }),
  // --- coppia ---
  C("coppia", "azione", "Bendati e riconosci {player} toccandogli solo le mani. Se sbagli, bevi.", "Close your eyes and recognize {player} by touching only their hands. Wrong? Drink.", { needs_target: 1 }),
  C("coppia", "domanda", "Qual è la prima cosa che hai pensato quando mi hai visto? Rispondi o bevi.", "What was the first thing you thought when you saw me? Answer or drink."),
  C("coppia", "azione", "Dite contemporaneamente la prima parola che vi viene in mente. Se è diversa, bevete entrambi.", "Both say the first word that comes to mind at the same time. Different? You both drink.", { needs_target: 1 }),
  // --- ambiente ---
  C("ambiente", "azione", "L'ultimo che tocca qualcosa di blu nella stanza beve.", "Last to touch something blue in the room drinks."),
  C("ambiente", "regola", "REGOLA: fino alla prossima regola si può bere solo stando in piedi. Chi beve seduto, raddoppia.", "RULE: until the next rule, you can only drink standing up. Drink seated, double it."),
  C("ambiente", "azione", "Fai un brindisi a sorpresa dedicato a chi ha organizzato la serata. Se non lo fai, bevi.", "Make a surprise toast to whoever organized the night. Don't, and drink."),
  // --- profondo ---
  C("profondo", "domanda", "Di cosa sei più orgoglioso nella tua vita? Rispondi davvero o bevi 2 WOOH.", "What are you most proud of in your life? Answer for real or drink 2 WOOH."),
  C("profondo", "domanda", "Qual è una cosa che non hai mai detto a nessuno in questa stanza? Rispondi o bevi 2 WOOH.", "What's something you've never told anyone in this room? Answer or drink 2 WOOH."),
  C("profondo", "domanda", "Chi in questo gruppo ti ha cambiato la vita, e come? Rispondi o bevi.", "Who in this group changed your life, and how? Answer or drink."),
  C("profondo", "tre_cose", "Di' 3 cose che vorresti aver fatto diversamente quest'anno. Se non ne dici 3, bevi.", "Name 3 things you wish you'd done differently this year. Can't name 3? Drink."),
  C("profondo", "io_non_ho_mai", "Io non ho mai pianto guardando un film. Chi l'ha fatto, beve.", "Never have I ever cried watching a movie. Whoever has, drinks."),
  C("profondo", "azione", "Guarda {player} e digli una cosa che ammiri sinceramente di lui. Se ti emozioni, bevi.", "Look at {player} and tell them one thing you sincerely admire about them. Get emotional? Drink.", { needs_target: 1 }),
  C("profondo", "domanda", "Se questa fosse la tua ultima serata, con chi la passeresti tra noi? Rispondi o bevi.", "If this were your last night out, who here would you spend it with? Answer or drink."),
  // --- karaoke ---
  C("karaoke", "azione", "Canta il ritornello dell'ultima canzone che hai ascoltato. Se ti fermi, bevi.", "Sing the chorus of the last song you listened to. Stop, and drink."),
  C("karaoke", "azione", "Improvvisa un balletto di 10 secondi mentre gli altri contano. Se ti vergogni, bevi.", "Improvise a 10-second dance while the others count. Too shy? Drink."),
  C("karaoke", "azione", "Canta 'tanti auguri' in stile opera lirica. Se ridi, bevi.", "Sing 'happy birthday' opera-style. If you laugh, drink."),
  C("karaoke", "sinonimi", "A turno, dite il titolo di una canzone d'amore. Il primo che non sa, beve.", "Take turns naming a love song. First one stuck, drinks.", { param: { tema: { it: "canzoni d'amore", en: "love songs" } } }),
  C("karaoke", "azione", "Imita un cantante famoso finché gli altri non indovinano chi è. Se non ci riescono, bevi.", "Imitate a famous singer until the others guess who. If they can't, you drink."),
  C("karaoke", "wooh", "Karaoke WOOH: tutti cantano 'WOOH' sulle note che volete. Il più stonato distribuisce 2 WOOH.", "Karaoke WOOH: everyone sings 'WOOH' on any notes. The most off-key hands out 2 WOOH."),
  C("karaoke", "azione", "Fai air-guitar per 10 secondi come a un concerto rock. Se non lo fai, bevi.", "Play air guitar for 10 seconds like at a rock concert. Don't, and drink."),
];

data.cards.push(...newCards);

fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`OK: ${data.decks.length} mazzi, ${data.cards.length} carte (aggiunte ${newCards.length}); tutto sbloccato, min_players=2`);
