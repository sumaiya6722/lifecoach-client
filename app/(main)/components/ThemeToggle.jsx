'use client'

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

// Empty subscribe function since mount status never changes after initial load
const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Returns true on client, false on server without triggering linter warnings
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
      aria-label="Toggle Theme"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}