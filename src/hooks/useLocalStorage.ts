/**
 * useLocalStorage.ts — SSR-safe React hook for localStorage.
 *
 * Features:
 * - Safe during SSR (checks for `window`)
 * - Automatic JSON serialization / deserialization
 * - Updater-function support (like `useState`)
 * - Cross-tab synchronization via the `storage` event
 * - Graceful error handling (falls back to `initialValue`)
 *
 * @example
 * ```tsx
 * const [name, setName] = useLocalStorage<string>('user-name', '');
 * setName('Alice');
 * setName((prev) => prev.toUpperCase());
 * ```
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Persist state in `localStorage` with automatic JSON handling.
 *
 * @param key          - The localStorage key.
 * @param initialValue - Fallback value when no stored value exists or on SSR.
 * @returns A `[value, setValue]` tuple identical to `useState`.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  // ---------- initialiser (runs once) ----------
  const readValue = useCallback((): T => {
    // SSR guard
    if (typeof window === 'undefined') return initialValue;

    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // ---------- setter ----------
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`[useLocalStorage] Error setting key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  // ---------- cross-tab sync ----------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) return;

      try {
        const newValue =
          event.newValue !== null
            ? (JSON.parse(event.newValue) as T)
            : initialValue;
        setStoredValue(newValue);
      } catch (error) {
        console.warn(
          `[useLocalStorage] Error parsing storage event for key "${key}":`,
          error,
        );
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
