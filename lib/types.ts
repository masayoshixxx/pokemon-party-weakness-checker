// ポケモンのタイプ（18種類）
export type PokemonType =
  | 'ノーマル'
  | 'ほのお'
  | 'みず'
  | 'でんき'
  | 'くさ'
  | 'こおり'
  | 'かくとう'
  | 'どく'
  | 'じめん'
  | 'ひこう'
  | 'エスパー'
  | 'むし'
  | 'いわ'
  | 'ゴースト'
  | 'ドラゴン'
  | 'あく'
  | 'はがね'
  | 'フェアリー';

// ポケモン1匹のデータ
export interface Pokemon {
  id: string;
  name: string;
  type1: PokemonType | null; // nullの場合は未選択（「-」）
  type2: PokemonType | null; // nullの場合は単一タイプまたは未選択
}

// タイプ相性の倍率
export type Effectiveness = 0 | 0.5 | 1 | 2 | 4;

