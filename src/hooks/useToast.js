import { useState, useCallback } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    xp: (xp, task) =>
      addToast({ type: 'xp', title: `+${xp} XP`, message: `"${task}" complete!` }),
    levelUp: (level, title) =>
      addToast({ type: 'levelup', title: `Level Up! → ${level}`, message: `You are now a ${title}`, duration: 5000 }),
    badge: (name) =>
      addToast({ type: 'badge', title: '🏅 Badge Unlocked!', message: name, duration: 5000 }),
    info: (title, message) =>
      addToast({ type: 'info', title, message }),
    error: (message) =>
      addToast({ type: 'error', title: 'Error', message }),
  };

  return { toasts, toast, removeToast };
}
