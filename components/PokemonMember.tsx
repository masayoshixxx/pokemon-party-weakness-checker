'use client';

import { useCallback } from 'react';
import { Pokemon, PokemonType } from '@/lib/types';
import { POKEMON_TYPES } from '@/lib/pokemonTypes';
import { suggestMemberType } from '@/lib/suggestion';
import { generateYakkunSearchUrl } from '@/lib/typeIdMapping';

interface PokemonMemberProps {
  pokemon: Pokemon;
  party: Pokemon[];
  onUpdate: (id: string, updates: Partial<Pokemon>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  onSuggest: (memberId: string) => void;
  continuousClickState: Array<{ type1: PokemonType; type2: PokemonType | null }> | null;
}

export default function PokemonMember({
  pokemon,
  party,
  onUpdate,
  onRemove,
  canRemove,
  onSuggest,
  continuousClickState,
}: PokemonMemberProps) {

  const handleSuggest = useCallback(() => {
    if (!pokemon.type1) return;

    const currentType = {
      type1: pokemon.type1,
      type2: pokemon.type2,
    };

    const excludedTypes = continuousClickState
      ? [...continuousClickState, currentType]
      : [currentType];

    const suggestion = suggestMemberType(party, pokemon.id, excludedTypes);

    if (suggestion) {
      onUpdate(pokemon.id, {
        type1: suggestion.type1,
        type2: suggestion.type2,
      });
      onSuggest(pokemon.id);
    }
  }, [pokemon.id, pokemon.type1, pokemon.type2, party, onSuggest, onUpdate, continuousClickState]);

  const handleSearch = useCallback(() => {
    if (!pokemon.type1) return;
    const searchUrl = generateYakkunSearchUrl(pokemon.type1, pokemon.type2);
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  }, [pokemon.type1, pokemon.type2]);

  return (
    <div className="pokemon-member">
      <div className="pokemon-member-inputs">
        <select
          value={pokemon.type1 || '-'}
          onChange={(e) => {
            const value = e.target.value;
            const newType1 = value === '-' ? null : (value as PokemonType);
            const newType2 = newType1 && pokemon.type2 === newType1 ? null : pokemon.type2;
            onUpdate(pokemon.id, { type1: newType1, type2: newType2 });
          }}
          className="pokemon-type-select"
          required
        >
          <option value="-">-</option>
          {POKEMON_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={pokemon.type2 || '-'}
          onChange={(e) => {
            const value = e.target.value;
            onUpdate(pokemon.id, {
              type2: value === '-' ? null : (value as PokemonType),
            });
          }}
          className="pokemon-type-select"
        >
          <option value="-">-</option>
          {POKEMON_TYPES.filter((type) => type !== pokemon.type1).map(
            (type) => (
              <option key={type} value={type}>
                {type}
              </option>
            )
          )}
        </select>
        <button
          onClick={() => onRemove(pokemon.id)}
          className="remove-button"
          type="button"
          disabled={!canRemove}
        >
          削除
        </button>
        <button
          onClick={handleSuggest}
          className="suggest-member-button"
          type="button"
          aria-label="このメンバーのタイプを提案"
        >
          提案
        </button>
        <button
          onClick={handleSearch}
          className="search-member-button"
          type="button"
          aria-label="このタイプのポケモンを検索"
          disabled={!pokemon.type1}
        >
          検索
        </button>
      </div>
    </div>
  );
}

