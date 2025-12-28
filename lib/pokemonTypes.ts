import { PokemonType } from './types';

// ポケモンの全タイプ（18種類）
export const POKEMON_TYPES: PokemonType[] = [
  'ノーマル',
  'ほのお',
  'みず',
  'でんき',
  'くさ',
  'こおり',
  'かくとう',
  'どく',
  'じめん',
  'ひこう',
  'エスパー',
  'むし',
  'いわ',
  'ゴースト',
  'ドラゴン',
  'あく',
  'はがね',
  'フェアリー',
];

// デフォルトのポケモン（リザードン）
export const DEFAULT_POKEMON = {
  name: 'リザードン',
  type1: 'ほのお' as PokemonType,
  type2: 'ひこう' as PokemonType,
};

