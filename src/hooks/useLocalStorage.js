import { useState, useEffect, useCallback } from 'react';

/**
 * Persists state in localStorage. Falls back gracefully if storage is unavailable.
 */
export function useLocalStorage(key, initialValue) {
  const readFromStorage = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readFromStorage);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.warn(`useLocalStorage: failed to set "${key}"`, err);
      }
    },
    [key, storedValue]
  );

  // Keep in sync across tabs
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (e.key === key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
