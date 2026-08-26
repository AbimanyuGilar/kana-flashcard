export type Character = { kana: string; romaji: string };
export type KanaType = 'hiragana' | 'katakana';
export type SentenceKanaType = 'hiragana' | 'katakana' | 'both';
export type QuizMode = 'single' | 'sentence';
export type GameState = 'mode_select' | 'setup' | 'playing' | 'result';

export type KanaGroup = {
  id: string;
  name: string;
  items: Character[];
};