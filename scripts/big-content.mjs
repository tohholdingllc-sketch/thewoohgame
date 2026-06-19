// Espande il contenuto fino a ~100 carte/mazzo. Mantiene le carte esistenti,
// aggiunge dai pool qui sotto, deduplica per testo, cap a 100/mazzo, min_players=2.
// Uso: node scripts/big-content.mjs
import fs from "node:fs";

const path = "data/cards.seed.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
const cards = data.cards;
const seen = new Set(cards.map((c) => c.deck + "|" + c.text.it));
const count = {};
for (const c of cards) count[c.deck] = (count[c.deck] || 0) + 1;

const CAP = 100;
function add(deck, type, it, en, t = 0, param) {
  if ((count[deck] || 0) >= CAP) return;
  const k = deck + "|" + it;
  if (seen.has(k)) return;
  seen.add(k);
  const card = {
    deck,
    type,
    is_persistent: type === "regola" || type === "manichino",
    needs_target: t,
    min_players: 2,
    text: { it, en },
  };
  if (param) card.param = param;
  cards.push(card);
  count[deck] = (count[deck] || 0) + 1;
}
// helper per liste [it, en]
const many = (deck, type, list, t = 0) => list.forEach(([it, en]) => add(deck, type, it, en, t));
const tema = (it, en) => ({ tema: { it, en } });

/* ============================ START (rompighiaccio) ============================ */
many("start", "io_non_ho_mai", [
  ["Io non ho mai dimenticato il nome di qualcuno appena conosciuto. Chi l'ha fatto, beve.", "Never have I ever forgotten someone's name right after meeting them. Whoever has, drinks."],
  ["Io non ho mai fatto finta di essere al telefono per evitare qualcuno. Chi l'ha fatto, beve.", "Never have I ever faked a phone call to avoid someone. Whoever has, drinks."],
  ["Io non ho mai riso in un momento totalmente sbagliato. Chi l'ha fatto, beve.", "Never have I ever laughed at the worst possible moment. Whoever has, drinks."],
  ["Io non ho mai mangiato qualcosa caduto per terra. Chi l'ha fatto, beve.", "Never have I ever eaten something off the floor. Whoever has, drinks."],
  ["Io non ho mai mentito sul mio peso o sulla mia altezza. Chi l'ha fatto, beve.", "Never have I ever lied about my weight or height. Whoever has, drinks."],
  ["Io non ho mai finto di conoscere una canzone per non fare brutta figura. Chi l'ha fatto, beve.", "Never have I ever faked knowing a song to save face. Whoever has, drinks."],
  ["Io non ho mai sbirciato il telefono di qualcun altro. Chi l'ha fatto, beve.", "Never have I ever peeked at someone else's phone. Whoever has, drinks."],
  ["Io non ho mai detto 'sto arrivando' mentre ero ancora a letto. Chi l'ha fatto, beve.", "Never have I ever said 'on my way' while still in bed. Whoever has, drinks."],
  ["Io non ho mai parlato male di qualcuno e poi l'ho salutato sorridendo. Chi l'ha fatto, beve.", "Never have I ever trash-talked someone then smiled at them. Whoever has, drinks."],
  ["Io non ho mai fatto un acquisto inutile di notte. Chi l'ha fatto, beve.", "Never have I ever made a useless purchase late at night. Whoever has, drinks."],
]);
many("start", "tre_cose", [
  ["Di' 3 cose che fai SEMPRE prima di dormire. Se non ne dici 3, bevi.", "Name 3 things you ALWAYS do before sleeping. Can't name 3? Drink."],
  ["Di' 3 app che apri più spesso. Se non ne dici 3, bevi.", "Name the 3 apps you open most. Can't name 3? Drink."],
  ["Di' 3 cibi che porteresti su un'isola deserta. Se non ne dici 3, bevi.", "Name 3 foods you'd take to a desert island. Can't name 3? Drink."],
  ["Di' 3 cose che ti fanno ridere ogni volta. Se non ne dici 3, bevi.", "Name 3 things that make you laugh every time. Can't name 3? Drink."],
  ["Di' 3 personaggi famosi che inviteresti a cena. Se non ne dici 3, bevi.", "Name 3 famous people you'd invite to dinner. Can't name 3? Drink."],
]);
many("start", "azione", [
  ["Fai un highfive a {player} e inventatevi una mossa segreta. Se sbagliate, bevete.", "High-five {player} and invent a secret handshake. Mess up, you both drink."],
  ["Racconta a {player} il tuo primo ricordo d'infanzia. Se non te lo ricordi, bevi.", "Tell {player} your earliest childhood memory. Can't remember? Drink."],
  ["Fai i complimenti a {player} per qualcosa che indossa. Se esiti, bevi.", "Compliment {player} on something they're wearing. Hesitate? Drink."],
], 1);
many("start", "sinonimi", [
  ["A turno, dite un sinonimo di \"divertente\". Il primo che non sa, beve.", "Take turns saying a synonym for \"fun\". First one stuck, drinks."],
  ["A turno, dite un modo di dire \"sei bellissimo\". Il primo che non sa, beve.", "Take turns saying a way to say \"you look great\". First one stuck, drinks."],
  ["A turno, dite una bevanda alcolica. Il primo che non sa, beve.", "Take turns naming an alcoholic drink. First one stuck, drinks."],
], 0);
many("start", "regola", [
  ["REGOLA: fino alla prossima regola, vietato usare il telefono. Chi lo tocca, beve.", "RULE: until the next rule, no phones. Touch yours, drink."],
  ["REGOLA: fino alla prossima regola, dovete ringraziare ogni volta che bevete. Chi dimentica, beve ancora.", "RULE: until the next rule, say thanks every time you drink. Forget, drink again."],
  ["REGOLA: scegliete una parola vietata. Chi la dice, beve. Vale fino alla prossima regola.", "RULE: pick a banned word. Whoever says it drinks. Until the next rule."],
]);
many("start", "wooh", [
  ["WOOH di benvenuto: fate un'ola tutti insieme e urlate WOOH. L'ultimo beve 1 WOOH.", "Welcome WOOH: do a group wave and shout WOOH. The last one drinks 1 WOOH."],
  ["Tutti puntano il dito verso il cielo e urlano WOOH. Chi ride per primo, beve.", "Everyone point a finger to the sky and shout WOOH. First to laugh, drinks."],
]);

/* ============================ MOOD (gruppo) ============================ */
many("mood", "io_non_ho_mai", [
  ["Io non ho mai pianto per una serie TV. Chi l'ha fatto, beve.", "Never have I ever cried over a TV series. Whoever has, drinks."],
  ["Io non ho mai googlato me stesso. Chi l'ha fatto, beve.", "Never have I ever googled myself. Whoever has, drinks."],
  ["Io non ho mai finto un orgasmo... di gioia per un regalo. Chi l'ha fatto, beve.", "Never have I ever faked extreme joy over a gift. Whoever has, drinks."],
  ["Io non ho mai inviato un messaggio e subito dopo l'ho cancellato. Chi l'ha fatto, beve.", "Never have I ever sent a message then instantly deleted it. Whoever has, drinks."],
  ["Io non ho mai dato buca all'ultimo minuto inventando una scusa. Chi l'ha fatto, beve.", "Never have I ever bailed last minute with a fake excuse. Whoever has, drinks."],
  ["Io non ho mai litigato per una cavolata e poi non ricordavo il motivo. Chi l'ha fatto, beve.", "Never have I ever fought over nothing and forgot why. Whoever has, drinks."],
  ["Io non ho mai fatto uno screenshot di una chat per mostrarla agli amici. Chi l'ha fatto, beve.", "Never have I ever screenshotted a chat to show friends. Whoever has, drinks."],
  ["Io non ho mai mangiato l'ultima fetta senza chiedere. Chi l'ha fatto, beve.", "Never have I ever eaten the last slice without asking. Whoever has, drinks."],
]);
many("mood", "domanda", [
  ["Qual è la bugia più grande che hai detto ai tuoi? Rispondi o bevi.", "What's the biggest lie you've told your parents? Answer or drink."],
  ["Chi qui chiameresti per nascondere un cadavere (metaforico)? Rispondi o bevi.", "Who here would you call to hide a (metaphorical) body? Answer or drink."],
  ["Qual è il tuo guilty pleasure più imbarazzante? Rispondi o bevi.", "What's your most embarrassing guilty pleasure? Answer or drink."],
  ["Se potessi leggere nel pensiero di una persona qui, chi? Rispondi o bevi.", "If you could read one person's mind here, whose? Answer or drink."],
  ["Qual è la cosa più folle che faresti per un milione di euro? Rispondi o bevi.", "What's the craziest thing you'd do for a million euros? Answer or drink."],
  ["Qual è l'ultima ricerca imbarazzante nel tuo telefono? Rispondi o bevi 2 WOOH.", "What's the last embarrassing search on your phone? Answer or drink 2 WOOH."],
]);
many("mood", "tre_cose", [
  ["Di' 3 cose che cambieresti del mondo. Se non ne dici 3, bevi.", "Name 3 things you'd change about the world. Can't name 3? Drink."],
  ["Di' 3 talenti nascosti che hai. Se non ne dici 3, bevi.", "Name 3 hidden talents you have. Can't name 3? Drink."],
  ["Di' 3 cose che ti fanno arrabbiare all'istante. Se non ne dici 3, bevi.", "Name 3 things that instantly make you angry. Can't name 3? Drink."],
]);
many("mood", "azione", [
  ["Fai un'imitazione di {player} per 10 secondi. Se non ride nessuno, bevi.", "Imitate {player} for 10 seconds. If nobody laughs, you drink."],
  ["Lascia che {player} scelga il prossimo da bere. Se protesti, bevi tu.", "Let {player} choose who drinks next. Protest, and you drink."],
  ["Scambia di posto con {player} e imita come si siede. Se sbagli, bevi.", "Swap seats with {player} and mimic how they sit. Wrong? Drink."],
], 1);
many("mood", "regola", [
  ["REGOLA: fino alla prossima regola, si parla solo sussurrando. Chi alza la voce, beve.", "RULE: until the next rule, only whispering. Raise your voice, drink."],
  ["REGOLA: fino alla prossima regola, ogni risata costa un WOOH a chi ride.", "RULE: until the next rule, every laugh costs the laugher a WOOH."],
  ["REGOLA: vietato dire 'io'. Chi lo dice, beve. Fino alla prossima regola.", "RULE: saying 'I' is banned. Say it, drink. Until the next rule."],
]);

/* ============================ HOT (piccante, solo suggestivo) ============================ */
many("hot", "io_non_ho_mai", [
  ["Io non ho mai limonato con due persone diverse nella stessa serata. Chi l'ha fatto, beve.", "Never have I ever made out with two different people in one night. Whoever has, drinks."],
  ["Io non ho mai avuto un sogno hot con qualcuno che conosco. Chi l'ha fatto, beve.", "Never have I ever had a steamy dream about someone I know. Whoever has, drinks."],
  ["Io non ho mai inviato un messaggio piccante alla persona sbagliata. Chi l'ha fatto, beve.", "Never have I ever sent a spicy text to the wrong person. Whoever has, drinks."],
  ["Io non ho mai flirtato per ottenere qualcosa. Chi l'ha fatto, beve.", "Never have I ever flirted to get something. Whoever has, drinks."],
  ["Io non ho mai dato un nome a qualcuno in rubrica per non farmi scoprire. Chi l'ha fatto, beve.", "Never have I ever saved someone under a fake contact name. Whoever has, drinks."],
]);
many("hot", "domanda", [
  ["Chi nella stanza baceresti per una sfida? Rispondi o bevi 2 WOOH.", "Who in the room would you kiss on a dare? Answer or drink 2 WOOH."],
  ["Qual è il complimento più sexy che ti hanno fatto? Rispondi o bevi.", "What's the sexiest compliment you've received? Answer or drink."],
  ["Dove vorresti essere baciato proprio ora? Rispondi o bevi 2 WOOH.", "Where would you want to be kissed right now? Answer or drink 2 WOOH."],
  ["Qual è il tuo tratto fisico preferito in una persona? Rispondi o bevi.", "What's your favorite physical trait in a person? Answer or drink."],
]);
many("hot", "azione", [
  ["Mima la tua mossa di seduzione migliore verso {player}. Se ti vergogni, bevi 2 WOOH.", "Show {player} your best seduction move. Too shy? Drink 2 WOOH."],
  ["Sussurra a {player} cosa ordineresti per una cena romantica. Se rifiuti, bevi.", "Whisper to {player} what you'd order for a romantic dinner. Refuse, drink."],
  ["Guarda {player} negli occhi e fai la faccia più sexy che hai per 5 secondi. Se ridi, bevi.", "Look into {player}'s eyes and give your sexiest face for 5 seconds. Laugh, drink."],
  ["Fai un massaggio alle spalle a {player} per 15 secondi. Se rifiuti, bevi 2 WOOH.", "Give {player} a 15-second shoulder massage. Refuse, drink 2 WOOH."],
], 1);
many("hot", "regola", [
  ["REGOLA: fino alla prossima regola, ogni volta che bevi devi fare l'occhiolino a qualcuno.", "RULE: until the next rule, every time you drink you must wink at someone."],
  ["REGOLA: fino alla prossima regola, vietato incrociare le braccia. Chi lo fa, beve.", "RULE: until the next rule, no crossing your arms. Do it, drink."],
]);

/* ============================ COPPIA ============================ */
many("coppia", "domanda", [
  ["Qual è stato il nostro momento più bello finora? Rispondi o bevi.", "What's been our best moment so far? Answer or drink."],
  ["Cosa ti ho fatto pensare la prima volta che mi hai visto? Rispondi o bevi.", "What did you think the first time you saw me? Answer or drink."],
  ["Una cosa che vorresti facessimo più spesso? Rispondi o bevi.", "One thing you wish we did more often? Answer or drink."],
  ["Qual è la cosa più sexy che faccio senza accorgermene? Rispondi o bevi 2 WOOH.", "What's the sexiest thing I do without realizing? Answer or drink 2 WOOH."],
]);
many("coppia", "azione", [
  ["Datevi un bacio della durata di un sorso (a testa). Se vi staccate prima, bevete il doppio.", "Kiss for as long as one sip lasts (each). Break early, drink double."],
  ["Disegnate insieme un cuore al buio (occhi chiusi). Se viene orribile, bevete.", "Draw a heart together with eyes closed. If it's awful, drink."],
  ["Ditevi a vicenda una cosa che vi fa impazzire dell'altro. Se arrossite, bevete.", "Tell each other one thing that drives you crazy about them. Blush? Drink.", ],
  ["Ballate lenti per 20 secondi senza musica. Se ridete, bevete.", "Slow dance for 20 seconds with no music. Laugh, drink."],
], 1);

/* ============================ AMBIENTE ============================ */
many("ambiente", "azione", [
  ["L'ultimo che alza il bicchiere beve.", "Last one to raise their glass drinks."],
  ["Il primo che trova qualcosa di verde e lo porta al centro distribuisce 2 WOOH.", "First to bring something green to the center hands out 2 WOOH."],
  ["Chi è seduto più lontano dalla porta beve.", "Whoever sits farthest from the door drinks."],
  ["Tutti indicano l'oggetto più brutto nella stanza. Chi indica diverso dalla maggioranza, beve.", "Everyone point at the ugliest object in the room. Minority points, drink."],
  ["Chi ha le scarpe più sporche beve. Mostratele.", "Whoever has the dirtiest shoes drinks. Show them."],
  ["Il primo che spegne/accende una luce distribuisce 1 WOOH.", "First to flick a light switch hands out 1 WOOH."],
  ["Chi ha la batteria del telefono più bassa beve.", "Whoever has the lowest phone battery drinks."],
]);
many("ambiente", "regola", [
  ["REGOLA: fino alla prossima regola, ci si alza in piedi ogni volta che entra qualcuno nella stanza.", "RULE: until the next rule, stand up whenever someone enters the room."],
  ["REGOLA: il bicchiere va tenuto sempre con due mani. Chi usa una mano, beve.", "RULE: hold your glass with two hands always. One hand, drink."],
]);

/* ============================ PROFONDO ============================ */
many("profondo", "domanda", [
  ["Qual è la tua più grande paura? Rispondi o bevi 2 WOOH.", "What's your biggest fear? Answer or drink 2 WOOH."],
  ["C'è qualcosa che rifaresti diversamente nella tua vita? Rispondi o bevi.", "Is there something you'd do differently in your life? Answer or drink."],
  ["Qual è il complimento che ricordi ancora oggi? Rispondi o bevi.", "What's a compliment you still remember today? Answer or drink."],
  ["Quando ti sei sentito più vivo? Rispondi o bevi.", "When did you feel most alive? Answer or drink."],
  ["Cosa diresti a te stesso di 10 anni fa? Rispondi o bevi.", "What would you tell your self from 10 years ago? Answer or drink."],
  ["Qual è una cosa per cui sei grato stasera? Rispondi o bevi.", "What's one thing you're grateful for tonight? Answer or drink."],
  ["Chi vorresti che fosse qui stasera? Rispondi o bevi.", "Who do you wish were here tonight? Answer or drink."],
  ["Qual è il sogno che non hai mai detto a nessuno? Rispondi o bevi 2 WOOH.", "What's the dream you've never told anyone? Answer or drink 2 WOOH."],
]);
many("profondo", "io_non_ho_mai", [
  ["Io non ho mai perdonato qualcuno senza dirglielo. Chi l'ha fatto, beve.", "Never have I ever forgiven someone without telling them. Whoever has, drinks."],
  ["Io non ho mai tenuto un rancore per anni. Chi l'ha fatto, beve.", "Never have I ever held a grudge for years. Whoever has, drinks."],
  ["Io non ho mai cambiato idea su una persona dopo averla conosciuta meglio. Chi l'ha fatto, beve.", "Never have I ever changed my mind about someone after knowing them better. Whoever has, drinks."],
]);

/* ============================ KARAOKE ============================ */
many("karaoke", "azione", [
  ["Canta una canzone a tua scelta cambiando tutte le parole con 'WOOH'. Se ti fermi, bevi.", "Sing any song replacing every word with 'WOOH'. Stop, drink."],
  ["Fai il beatbox per 10 secondi. Se non ci riesci, bevi.", "Beatbox for 10 seconds. Can't? Drink."],
  ["Canta come se fossi arrabbiatissimo. Se ridi, bevi.", "Sing as if you're furious. Laugh, drink."],
  ["Inventa un jingle pubblicitario per il WOOH Game. Se fa schifo, bevi (decide il gruppo).", "Invent an ad jingle for the WOOH Game. If it's bad, drink (group decides)."],
  ["Balla la tua mossa di ballo peggiore con orgoglio per 10 secondi. Se ti fermi, bevi.", "Proudly do your worst dance move for 10 seconds. Stop, drink."],
  ["Canta una canzone di Natale, a tema attuale o meno. Se sbagli le parole, bevi.", "Sing a Christmas carol, in season or not. Wrong words? Drink."],
  ["Imita il verso di un animale a ritmo per 10 secondi. Se ridi, bevi.", "Make an animal sound to a beat for 10 seconds. Laugh, drink."],
]);
many("karaoke", "sinonimi", [
  ["A turno, dite il nome di un cantante. Il primo che non sa, beve.", "Take turns naming a singer. First one stuck, drinks.", ],
  ["A turno, cantate una parola di una canzone famosa a testa, formando il testo. Chi sbaglia, beve.", "Take turns singing one word each of a famous song. Mess up, drink."],
], 0);

data.cards = cards;
fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("Carte per mazzo:", Object.entries(count).map(([d, n]) => `${d}=${n}`).join("  "), "| TOT", cards.length);
