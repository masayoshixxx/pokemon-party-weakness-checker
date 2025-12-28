'use client';

import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { usePokemonParty } from '@/hooks/usePokemonParty';
import { calculatePartyWeaknesses } from '@/lib/calculator';
import { suggestPokemonType } from '@/lib/suggestion';
import { PokemonType } from '@/lib/types';
import PokemonMember from '@/components/PokemonMember';
import WeaknessTable from '@/components/WeaknessTable';
import ThemeSelector from '@/components/ThemeSelector';

function normalizeTypeCombination(combo: { type1: PokemonType; type2: PokemonType | null }): {
  type1: PokemonType;
  type2: PokemonType | null;
} {
  if (!combo.type2) {
    return { type1: combo.type1, type2: null };
  }
  const types = [combo.type1, combo.type2].sort();
  return { type1: types[0], type2: types[1] };
}

export default function Home() {
  const { party, addMember, removeMember, updateMember } = usePokemonParty();
  
  const [continuousClickState, setContinuousClickState] = useState<{
    memberId: string;
    excludedTypes: Array<{ type1: PokemonType; type2: PokemonType | null }>;
  } | null>(null);
  const [isPartyCollapsed, setIsPartyCollapsed] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const weaknesses = useMemo(() => calculatePartyWeaknesses(party), [party]);

  const handleSuggestion = useCallback(() => {
    const suggestion = suggestPokemonType(party);
    if (suggestion) {
      addMember(suggestion);
    }
  }, [party, addMember]);

  const handleMemberSuggestion = useCallback(
    (memberId: string) => {
      const currentMember = party.find((p) => p.id === memberId);
      if (!currentMember?.type1) return;

      const currentType = {
        type1: currentMember.type1,
        type2: currentMember.type2,
      };

      setContinuousClickState((prev) => {
        if (prev?.memberId === memberId) {
          const normalizedCurrent = normalizeTypeCombination(currentType);
          const isAlreadyExcluded = prev.excludedTypes.some((excluded) => {
            const normalizedExcluded = normalizeTypeCombination(excluded);
            return (
              normalizedCurrent.type1 === normalizedExcluded.type1 &&
              normalizedCurrent.type2 === normalizedExcluded.type2
            );
          });
          if (isAlreadyExcluded) return prev;
          return {
            memberId,
            excludedTypes: [...prev.excludedTypes, currentType],
          };
        }
        return { memberId, excludedTypes: [] };
      });
    },
    [party]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setContinuousClickState(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <main className="container" ref={containerRef}>
      <header className="header">
        <div className="header-content">
          <h1 className="title">ポケモンパーティ耐性チェッカー</h1>
          <ThemeSelector />
        </div>
      </header>

      <div className="main-content">
        <section className="party-section">
          <button
            onClick={() => setIsPartyCollapsed(!isPartyCollapsed)}
            className="section-title-toggle"
            type="button"
          >
            <h2 className="section-title">メンバー構成</h2>
            <span className={`collapse-icon ${isPartyCollapsed ? 'collapsed' : ''}`}>
              ▼
            </span>
          </button>
          {!isPartyCollapsed && (
            <div className="pokemon-list">
            {party.map((pokemon) => (
              <PokemonMember
                key={pokemon.id}
                pokemon={pokemon}
                party={party}
                onUpdate={updateMember}
                onRemove={removeMember}
                canRemove={party.length > 1}
                onSuggest={handleMemberSuggestion}
                continuousClickState={
                  continuousClickState?.memberId === pokemon.id
                    ? continuousClickState.excludedTypes
                    : null
                }
              />
            ))}
            </div>
          )}
          {!isPartyCollapsed && party.length < 6 && (
            <div className="button-group">
              <button
                onClick={() => addMember()}
                className="add-button"
                type="button"
                aria-label="メンバーを追加"
              >
                <span>＋</span>
                <span>追加</span>
              </button>
              <button
                onClick={handleSuggestion}
                className="suggest-button"
                type="button"
                aria-label="メンバーを提案"
              >
                <span>＋</span>
                <span>提案</span>
              </button>
            </div>
          )}
        </section>

        <section className="weakness-section">
          <WeaknessTable weaknesses={weaknesses} />
        </section>
      </div>
    </main>
  );
}

