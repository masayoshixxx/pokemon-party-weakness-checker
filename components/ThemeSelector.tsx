'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { SunIcon, MoonIcon, SystemIcon, CheckIcon } from './ThemeIcons';

export default function ThemeSelector() {
  const { theme, setTheme, mounted, effectiveTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu || typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const selector = document.querySelector('.theme-selector');
      if (selector && !selector.contains(target)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="theme-selector">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="theme-toggle"
        type="button"
        aria-label="テーマ切り替え"
        suppressHydrationWarning
      >
        {!mounted ? (
          <SunIcon />
        ) : effectiveTheme === 'dark' ? (
          <MoonIcon />
        ) : (
          <SunIcon />
        )}
      </button>
      {showMenu && (
        <div className="theme-menu">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTheme('light');
              setShowMenu(false);
            }}
            className={`theme-menu-item ${theme === 'light' ? 'active' : ''}`}
            type="button"
          >
            <SunIcon />
            <span>ライトテーマ</span>
            {theme === 'light' && <CheckIcon className="check" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTheme('dark');
              setShowMenu(false);
            }}
            className={`theme-menu-item ${theme === 'dark' ? 'active' : ''}`}
            type="button"
          >
            <MoonIcon />
            <span>ダークテーマ</span>
            {theme === 'dark' && <CheckIcon className="check" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTheme('system');
              setShowMenu(false);
            }}
            className={`theme-menu-item ${theme === 'system' ? 'active' : ''}`}
            type="button"
          >
            <SystemIcon />
            <span>システムテーマ</span>
            {theme === 'system' && <CheckIcon className="check" />}
          </button>
        </div>
      )}
    </div>
  );
}

