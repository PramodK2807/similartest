import { useCallback, useState } from 'react';
import { STORAGE_KEY } from '../config.js';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// Remembers which tests were attempted (saved in this browser only).
export function useAttempts() {
  const [map, setMap] = useState(load);

  const isAttempted = useCallback((id) => Boolean(map[id]), [map]);

  const markAttempted = useCallback((id) => {
    setMap((prev) => {
      const next = { ...prev, [id]: Date.now() };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage blocked: the card simply won't remember */
      }
      return next;
    });
  }, []);

  return { isAttempted, markAttempted };
}
