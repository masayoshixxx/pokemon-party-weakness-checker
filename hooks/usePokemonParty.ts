'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pokemon, PokemonType } from '@/lib/types';
import { DEFAULT_POKEMON } from '@/lib/pokemonTypes';
import { STORAGE_KEYS } from '@/lib/constants';

function createDefaultPokemon(): Pokemon {
  return {
    id: '1',
    name: DEFAULT_POKEMON.name,
    type1: DEFAULT_POKEMON.type1,
    type2: DEFAULT_POKEMON.type2,
  };
}

function createEmptyPokemon(): Pokemon {
  return {
    id: '2',
    name: '',
    type1: null,
    type2: null,
  };
}

export function usePokemonParty() {
  const [party, setParty] = useState<Pokemon[]>(() => [
    createEmptyPokemon(),
  ]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.POKEMON_PARTY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setParty(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load party from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;

    try {
      localStorage.setItem(STORAGE_KEYS.POKEMON_PARTY, JSON.stringify(party));
    } catch (e) {
      console.warn('Failed to save party to localStorage:', e);
    }
  }, [party, isInitialized]);

  const addMember = useCallback(
    (suggestedType?: { type1: PokemonType; type2: PokemonType | null }) => {
      const newMember: Pokemon = {
        id: Date.now().toString(),
        name: '',
        type1: suggestedType?.type1 ?? null,
        type2: suggestedType?.type2 ?? null,
      };
      setParty((prev) => [...prev, newMember]);
    },
    []
  );

  const removeMember = useCallback((id: string) => {
    setParty((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      return filtered.length > 0 ? filtered : prev;
    });
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<Pokemon>) => {
    setParty((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  return {
    party,
    addMember,
    removeMember,
    updateMember,
  };
}

