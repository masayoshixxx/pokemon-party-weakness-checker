import { Pokemon, PokemonType } from './types';
import { POKEMON_TYPES } from './pokemonTypes';
import { calculatePartyWeaknesses } from './calculator';

type TypeCombination = {
  type1: PokemonType;
  type2: PokemonType | null;
};

function normalizeTypeCombination(combo: TypeCombination): TypeCombination {
  if (!combo.type2) {
    return { type1: combo.type1, type2: null };
  }
  const types = [combo.type1, combo.type2].sort();
  return { type1: types[0], type2: types[1] };
}

function isSameTypeCombination(a: TypeCombination, b: TypeCombination): boolean {
  const normalizedA = normalizeTypeCombination(a);
  const normalizedB = normalizeTypeCombination(b);
  return (
    normalizedA.type1 === normalizedB.type1 &&
    normalizedA.type2 === normalizedB.type2
  );
}

function generateTypeCombinations(): TypeCombination[] {
  const combinations: TypeCombination[] = [];

  for (const type1 of POKEMON_TYPES) {
    combinations.push({ type1, type2: null });
    for (const type2 of POKEMON_TYPES) {
      if (type1 !== type2) {
        combinations.push({ type1, type2 });
      }
    }
  }

  return combinations;
}

type WeaknessMetrics = {
  min: number;
  secondMin: number;
  thirdMin: number;
  sumOfBottomThree: number;
};

function evaluateWeakness(weaknesses: Map<PokemonType, { totalValue: number }>): WeaknessMetrics {
  const values = Array.from(weaknesses.values()).map((r) => r.totalValue);
  const sortedAscending = [...values].sort((a, b) => a - b);

  return {
    min: sortedAscending[0] || 0,
    secondMin: sortedAscending[1] || 0,
    thirdMin: sortedAscending[2] || 0,
    sumOfBottomThree: (sortedAscending[0] || 0) + (sortedAscending[1] || 0) + (sortedAscending[2] || 0),
  };
}

function isBetterThan(current: WeaknessMetrics, best: WeaknessMetrics): boolean {
  if (current.min !== best.min) return current.min > best.min;
  if (current.secondMin !== best.secondMin) return current.secondMin > best.secondMin;
  if (current.thirdMin !== best.thirdMin) return current.thirdMin > best.thirdMin;
  return current.sumOfBottomThree > best.sumOfBottomThree;
}

function filterExcluded(
  combinations: TypeCombination[],
  excludeTypes?: TypeCombination[]
): TypeCombination[] {
  if (!excludeTypes) return combinations;
  return combinations.filter(
    (combo) => !excludeTypes.some((excluded) => isSameTypeCombination(combo, excluded))
  );
}

export function suggestPokemonType(
  party: Pokemon[],
  excludeTypes?: TypeCombination[]
): TypeCombination | null {
  const currentWeaknesses = calculatePartyWeaknesses(party);
  const values = Array.from(currentWeaknesses.values()).map((r) => r.totalValue);
  if (Math.max(...values) === 0) return null;

  const combinations = filterExcluded(generateTypeCombinations(), excludeTypes);
  if (combinations.length === 0) return null;

  let bestCombination: TypeCombination | null = null;
  let bestMetrics: WeaknessMetrics = {
    min: -Infinity,
    secondMin: -Infinity,
    thirdMin: -Infinity,
    sumOfBottomThree: -Infinity,
  };

  for (const combination of combinations) {
    const testParty: Pokemon[] = [
      ...party,
      { id: 'test', name: '', type1: combination.type1, type2: combination.type2 },
    ];
    const testWeaknesses = calculatePartyWeaknesses(testParty);
    const metrics = evaluateWeakness(testWeaknesses);

    if (isBetterThan(metrics, bestMetrics)) {
      bestMetrics = metrics;
      bestCombination = combination;
    }
  }

  return bestCombination;
}

function createTestParty(
  baseParty: Pokemon[],
  memberId: string,
  combination: TypeCombination
): Pokemon[] {
  return [
    ...baseParty.map((p) => ({ ...p })),
    { id: memberId, name: '', type1: combination.type1, type2: combination.type2 },
  ];
}

export function suggestMemberType(
  party: Pokemon[],
  memberId: string,
  excludeTypes?: TypeCombination[]
): TypeCombination | null {
  const partyWithoutMember = party.filter((p) => p.id !== memberId);
  const currentMember = party.find((p) => p.id === memberId);

  if (!currentMember?.type1) {
    return suggestPokemonType(partyWithoutMember, excludeTypes);
  }

  const currentType: TypeCombination = {
    type1: currentMember.type1,
    type2: currentMember.type2,
  };

  const shouldEvaluateCurrent =
    !excludeTypes ||
    !excludeTypes.some((excluded) => isSameTypeCombination(currentType, excluded));

  const filteredCombinations = filterExcluded(generateTypeCombinations(), excludeTypes);

  if (filteredCombinations.length === 0 && !shouldEvaluateCurrent) {
    return null;
  }

  let bestCombination: TypeCombination | null = null;
  let bestMetrics: WeaknessMetrics = {
    min: -Infinity,
    secondMin: -Infinity,
    thirdMin: -Infinity,
    sumOfBottomThree: -Infinity,
  };

  if (shouldEvaluateCurrent) {
    const testParty = createTestParty(partyWithoutMember, memberId, currentType);
    const testWeaknesses = calculatePartyWeaknesses(testParty);
    const metrics = evaluateWeakness(testWeaknesses);
    bestMetrics = metrics;
    bestCombination = currentType;
  }

  for (const combination of filteredCombinations) {
    const testParty = createTestParty(partyWithoutMember, memberId, combination);
    const testWeaknesses = calculatePartyWeaknesses(testParty);
    const metrics = evaluateWeakness(testWeaknesses);

    if (isBetterThan(metrics, bestMetrics)) {
      bestMetrics = metrics;
      bestCombination = combination;
    }
  }

  return bestCombination;
}

