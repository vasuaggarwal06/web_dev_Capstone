import { createContext, useContext, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
import { PRIORITIES, BADGES } from '../utils/constants';
import {
  getLevelInfo,
  computeUnlockedBadges,
  deriveStats,
  computeStreak,
} from '../utils/gameLogic';

const GameContext = createContext(null);

const INITIAL_PLAYER = {
  name: 'Adventurer',
  totalXP: 0,
  streak: 0,
  lastActivityDate: null,
  unlockedBadges: [],
};

export function GameProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('qb_tasks', []);
  const [player, setPlayer] = useLocalStorage('qb_player', INITIAL_PLAYER);
  const { toasts, toast, removeToast } = useToast();

  const prevBadgesRef = useRef(player.unlockedBadges || []);
  const levelInfo = getLevelInfo(player.totalXP);

  // Check for newly unlocked badges whenever tasks/streak change
  useEffect(() => {
    const stats = deriveStats(tasks, player.streak);
    const currentUnlocked = computeUnlockedBadges(stats);
    const newBadges = currentUnlocked.filter(
      (id) => !prevBadgesRef.current.includes(id)
    );

    if (newBadges.length > 0) {
      newBadges.forEach((badgeId) => {
        const badge = BADGES.find((b) => b.id === badgeId);
        if (badge) {
          setTimeout(() => toast.badge(badge.name), 200);
        }
      });
      setPlayer((p) => ({ ...p, unlockedBadges: currentUnlocked }));
      prevBadgesRef.current = currentUnlocked;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, player.streak]);

  const addTask = useCallback(
    ({ title, description = '', priority = 'MEDIUM', category = 'Work', dueDate = null }) => {
      if (!title.trim()) return;
      const newTask = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        xpAwarded: 0,
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    [setTasks]
  );

  const completeTask = useCallback(
    (taskId) => {
      const taskToComplete = tasks.find((t) => t.id === taskId && !t.completed);
      if (!taskToComplete) return;

      const xpGained = PRIORITIES[taskToComplete.priority]?.xp || 50;
      const oldLevel = levelInfo.level;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, completed: true, completedAt: new Date().toISOString(), xpAwarded: xpGained }
            : t
        )
      );

      setPlayer((prev) => {
        const newXP = prev.totalXP + xpGained;
        const streakData = computeStreak(prev.lastActivityDate, prev.streak);
        const newLevelInfo = getLevelInfo(newXP);

        setTimeout(() => {
          toast.xp(xpGained, taskToComplete.title);
          if (newLevelInfo.level > oldLevel) {
            toast.levelUp(newLevelInfo.level, newLevelInfo.title);
          }
        }, 50);

        return {
          ...prev,
          totalXP: newXP,
          streak: streakData.streak,
          lastActivityDate: streakData.lastActivityDate,
        };
      });
    },
    [tasks, levelInfo.level, setTasks, setPlayer, toast]
  );

  const uncompleteTask = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || !task.completed) return;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, completed: false, completedAt: null, xpAwarded: 0 }
            : t
        )
      );

      setPlayer((prev) => ({
        ...prev,
        totalXP: Math.max(0, prev.totalXP - (task.xpAwarded || 0)),
      }));
    },
    [tasks, setTasks, setPlayer]
  );

  const deleteTask = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      if (task.completed && task.xpAwarded > 0) {
        setPlayer((prev) => ({
          ...prev,
          totalXP: Math.max(0, prev.totalXP - task.xpAwarded),
        }));
      }
    },
    [tasks, setTasks, setPlayer]
  );

  const editTask = useCallback(
    (taskId, updates) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
    },
    [setTasks]
  );

  const updatePlayerName = useCallback(
    (name) => setPlayer((p) => ({ ...p, name })),
    [setPlayer]
  );

  const stats = deriveStats(tasks, player.streak);

  return (
    <GameContext.Provider
      value={{
        tasks,
        player,
        levelInfo,
        stats,
        toasts,
        removeToast,
        addTask,
        completeTask,
        uncompleteTask,
        deleteTask,
        editTask,
        updatePlayerName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
