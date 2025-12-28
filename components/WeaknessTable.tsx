'use client';

import { useState } from 'react';
import { PokemonType } from '@/lib/types';
import { POKEMON_TYPES } from '@/lib/pokemonTypes';
import { WeaknessResult } from '@/lib/calculator';
import { COLORS } from '@/lib/constants';

interface WeaknessTableProps {
  weaknesses: Map<PokemonType, WeaknessResult>;
}

const MIN_VALUE = -10;
const MAX_VALUE = 10;
const ZERO_VALUE = 0;

const LONG_TYPE_NAMES: PokemonType[] = ['フェアリー', 'エスパー', 'ゴースト', 'ドラゴン'];

function getColorForValue(value: number): string {
  const clampedValue = Math.max(MIN_VALUE, Math.min(MAX_VALUE, value));

  if (clampedValue === ZERO_VALUE) {
    return `rgb(${COLORS.WHITE.r}, ${COLORS.WHITE.g}, ${COLORS.WHITE.b})`;
  }

  if (clampedValue > ZERO_VALUE) {
    const normalized = (clampedValue - ZERO_VALUE) / (MAX_VALUE - ZERO_VALUE);
    const adjustedNormalized = Math.pow(normalized, 0.7);
    const r = Math.round(COLORS.WHITE.r + (COLORS.BLUE.r - COLORS.WHITE.r) * adjustedNormalized);
    const g = Math.round(COLORS.WHITE.g + (COLORS.BLUE.g - COLORS.WHITE.g) * adjustedNormalized);
    const b = Math.round(COLORS.WHITE.b + (COLORS.BLUE.b - COLORS.WHITE.b) * adjustedNormalized);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const normalized = (ZERO_VALUE - clampedValue) / (ZERO_VALUE - MIN_VALUE);
  const adjustedNormalized = Math.pow(normalized, 0.7);
  const r = Math.round(COLORS.WHITE.r + (COLORS.RED.r - COLORS.WHITE.r) * adjustedNormalized);
  const g = Math.round(COLORS.WHITE.g + (COLORS.RED.g - COLORS.WHITE.g) * adjustedNormalized);
  const b = Math.round(COLORS.WHITE.b + (COLORS.RED.b - COLORS.WHITE.b) * adjustedNormalized);
  return `rgb(${r}, ${g}, ${b})`;
}

function formatValue(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded.toFixed(2).replace(/\.?0+$/, '');
}

export default function WeaknessTable({ weaknesses }: WeaknessTableProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="weakness-table-container">
      <h2 className="weakness-table-title">タイプ耐性一覧</h2>
      <div className="weakness-table-grid">
        {POKEMON_TYPES.map((type) => {
          const result = weaknesses.get(type) || { totalValue: 0 };
          const { totalValue } = result;
          const backgroundColor = getColorForValue(totalValue);
          const textColor =
            totalValue >= MAX_VALUE || totalValue <= MIN_VALUE
              ? COLORS.TEXT_LIGHT
              : COLORS.TEXT_DARK;

          return (
            <div
              key={type}
              className="weakness-cell"
              style={{
                backgroundColor,
                color: textColor,
              }}
            >
              <div
                className="weakness-type-name"
                style={{
                  color: textColor,
                  fontSize: LONG_TYPE_NAMES.includes(type) ? '0.8125rem' : '0.9375rem',
                }}
              >
                {type}
              </div>
              <div
                className="weakness-value"
                style={{ color: textColor }}
              >
                {formatValue(totalValue)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="explanation-section">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="explanation-toggle"
          type="button"
        >
          耐性計算について
        </button>
        {showExplanation && (
          <div className="explanation-content">
            <p className="explanation-text">
              各タイプの攻撃に対してパーティ全体がどれだけ耐性があるか（または弱点があるか）を数値で表示しています。
            </p>
            <p className="explanation-text">
              計算方法：パーティ内の全ての相性のスコアを合計して表示しています。
            </p>
            <p className="explanation-text">
              耐性の値について：
            </p>
            <ul className="explanation-list">
              <li>4 = 効果なし（ダメージを受けない）</li>
              <li>3 = 1/4（ダメージが1/4倍）</li>
              <li>2 = いまひとつ（ダメージが半分）</li>
              <li>0 = 通常（普通のダメージ）</li>
              <li>-2 = 効果ばつぐん（ダメージが2倍）</li>
              <li>-4 = 4倍（ダメージが4倍）</li>
            </ul>
            <p className="explanation-text">
              表示について：正の値（青）は耐性を、負の値（赤）は弱点を表します。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

