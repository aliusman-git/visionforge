import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

// Works like useState, but also saves the value in the browser (localStorage)
// so it is still there after a page refresh.
export function usePersistentState<T>(
  storageKey: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const savedText = localStorage.getItem(storageKey);
      if (savedText === null) return defaultValue;
      const savedValue = JSON.parse(savedText);
      const isPlainObject =
        typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue);
      // Merge with defaults so a missing field never breaks the app
      return isPlainObject ? ({ ...defaultValue, ...savedValue } as T) : (savedValue as T);
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Storage can be blocked (private mode, full); the app keeps working without saving
    }
  }, [storageKey, value]);

  return [value, setValue];
}
