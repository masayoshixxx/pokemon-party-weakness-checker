import { PokemonType } from './types';

export const TYPE_ID_MAP: Record<PokemonType, number> = {
  'ノーマル': 0,
  'かくとう': 1,
  'ひこう': 2,
  'どく': 3,
  'じめん': 4,
  'いわ': 5,
  'むし': 6,
  'ゴースト': 7,
  'はがね': 8,
  'ほのお': 9,
  'みず': 10,
  'くさ': 11,
  'でんき': 12,
  'エスパー': 13,
  'こおり': 14,
  'ドラゴン': 15,
  'あく': 16,
  'フェアリー': 17,
};

export function getTypeId(type: PokemonType): number {
  return TYPE_ID_MAP[type];
}

export function generateYakkunSearchUrl(type1: PokemonType, type2: PokemonType | null): string {
  const params = new URLSearchParams();
  params.append('search', '1');
  params.append('type_n[]', getTypeId(type1).toString());
  params.append('type_mode[]', '0');
  params.append('type_mode_ex[]', '0');

  if (type2) {
    params.append('type_n[]', getTypeId(type2).toString());
    params.append('type_mode[]', '0');
    params.append('type_mode_ex[]', '0');
  }

  return `https://yakkun.com/sv/zukan/search/?${params.toString()}`;
}
