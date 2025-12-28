import { Pokemon, PokemonType } from './types';
import { POKEMON_TYPES } from './pokemonTypes';
import { calculateSingleTypeEffectiveness } from './typeEffectiveness';

export interface WeaknessResult {
  totalValue: number;
}

function effectivenessToScore(effectiveness: number): number {
  if (effectiveness === 0) return 4;
  if (effectiveness === 0.25) return 3;
  if (effectiveness === 0.5) return 2;
  if (effectiveness === 1) return 0;
  if (effectiveness === 2) return -2;
  if (effectiveness === 4) return -4;

  if (effectiveness < 0.25) {
    return 4 - (effectiveness / 0.25) * 1;
  }
  if (effectiveness < 0.5) {
    return 3 - ((effectiveness - 0.25) / 0.25) * 1;
  }
  if (effectiveness < 1) {
    return 2 - ((effectiveness - 0.5) / 0.5) * 2;
  }
  if (effectiveness < 2) {
    return -((effectiveness - 1) * 2);
  }
  return -(2 + ((effectiveness - 2) / 2) * 2);
}

export function calculatePartyWeaknesses(party: Pokemon[]): Map<PokemonType, WeaknessResult> {
  const weaknesses = new Map<PokemonType, WeaknessResult>();
  const validParty = party.filter((p) => p.type1 !== null);

  for (const attackType of POKEMON_TYPES) {
    if (validParty.length === 0) {
      weaknesses.set(attackType, { totalValue: 0 });
      continue;
    }

    let totalValue = 0;
    for (const pokemon of validParty) {
      if (pokemon.type1) {
        const effectiveness = calculateSingleTypeEffectiveness(
          attackType,
          pokemon.type1,
          pokemon.type2
        );
        totalValue += effectivenessToScore(effectiveness);
      }
    }

    weaknesses.set(attackType, { totalValue });
  }

  return weaknesses;
}

