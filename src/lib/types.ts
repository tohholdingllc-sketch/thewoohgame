export type Locale = "it" | "en";
export type I18n = { it: string; en: string };

export interface Deck {
  id: string;
  slug: string;
  name: I18n;
  description: I18n;
  intensity: number;
  is_premium: boolean;
  min_players: number;
  sort_order: number;
}

export interface GamePlayer {
  id: string;
  game_id: string;
  profile_id: string | null;
  nickname: string;
  avatar_id: string | null;
  nickname_color: string | null;
  is_manual: boolean;
  joined_at: string;
}

export type GameStatus = "lobby" | "playing" | "ended";

export interface Game {
  id: string;
  code: string;
  master_id: string;
  status: GameStatus;
  selected_decks: string[];
  current_card_index: number;
  card_queue: string[];
  active_rules: unknown[];
  language: string;
  created_at: string;
}
