import { useEffect, useLayoutEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

function getInitialDark(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTheme() {
  const [dark, setDark] = useState(getInitialDark);

  // useLayoutEffect fires before paint → no flash on initial load
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Follow OS preference changes when the user has not set an explicit override
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setDark(e.matches);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  return { dark, toggle };
}
