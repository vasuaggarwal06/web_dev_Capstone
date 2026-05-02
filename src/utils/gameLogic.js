import { LEVELS, BADGES } from './constants';

/**
 * Determine level info based on total XP
 */
export function getLevelInfo(totalXP) {
  let currentLevel = LEVELS[0];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      currentLevel = LEVELS[i];
      break;
    }
  }

  const isMaxLevel = currentLevel.level === LEVELS[LEVELS.length - 1].level;
  const nextLevel = isMaxLevel ? null : LEVELS[currentLevel.level];

  const xpIntoCurrentLevel = totalXP - currentLevel.minXP;
  const xpNeededForNextLevel = nextLevel
    ? nextLevel.minXP - currentLevel.minXP
    : 1;

  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.floor((xpIntoCurrentLevel / xpNeededForNextLevel) * 100));

  return {
    ...currentLevel,
    totalXP,
    xpIntoCurrentLevel,
    xpNeededForNextLevel,
    progressPercent,
    nextLevel,
    isMaxLevel,
  };
}

/**
 * Compute which badges are unlocked given player stats
 */
export function computeUnlockedBadges(stats) {
  return BADGES.filter((badge) => badge.condition(stats)).map((b) => b.id);
}

/**
 * Derive player stats object from tasks array + streak info
 */
export function deriveStats(tasks, streak) {
  const completed = tasks.filter((t) => t.completed);
  const totalCompleted = completed.length;

  const epicCompleted = completed.filter(
    (t) => t.priority === 'EPIC'
  ).length;

  // Tasks per calendar day
  const tasksPerDay = {};
  completed.forEach((t) => {
    const day = new Date(t.completedAt).toDateString();
    tasksPerDay[day] = (tasksPerDay[day] || 0) + 1;
  });
  const maxTasksInDay = Math.max(0, ...Object.values(tasksPerDay));

  // Early bird: completed before 9 AM
  const earlyBird = completed.some((t) => {
    const hour = new Date(t.completedAt).getHours();
    return hour < 9;
  });

  const totalXP = completed.reduce((acc, t) => acc + (t.xpAwarded || 0), 0);
  const levelInfo = getLevelInfo(totalXP);

  return {
    totalCompleted,
    epicCompleted,
    maxTasksInDay,
    earlyBird,
    streak,
    level: levelInfo.level,
    totalXP,
  };
}

/**
 * Check streak logic based on last activity date
 */
export function computeStreak(lastActivityDate, currentStreak) {
  if (!lastActivityDate) return { streak: 1, lastActivityDate: new Date().toDateString() };

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastActivityDate === today) {
    return { streak: currentStreak, lastActivityDate };
  } else if (lastActivityDate === yesterday) {
    return { streak: currentStreak + 1, lastActivityDate: today };
  } else {
    return { streak: 1, lastActivityDate: today };
  }
}

/**
 * Format XP number for display
 */
export function formatXP(xp) {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return String(xp);
}

/**
 * Get a motivational message based on streak
 */
export function getStreakMessage(streak) {
  if (streak >= 30) return "🔥 Absolute legend. 30-day streak!";
  if (streak >= 14) return "⚡ Two weeks strong — unstoppable!";
  if (streak >= 7) return "🌟 A full week? You're on fire!";
  if (streak >= 3) return "🔥 Three days running — keep going!";
  if (streak >= 2) return "⚡ Two days in a row!";
  return "🎯 Start building your streak today!";
}
