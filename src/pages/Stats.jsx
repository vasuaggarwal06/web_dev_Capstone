import { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { PRIORITIES, LEVELS } from '../utils/constants';
import { getLevelInfo, formatXP } from '../utils/gameLogic';
import LevelBadge from '../components/Game/LevelBadge';

function ProgressToLevel({ levelData, currentXP }) {
  const isCurrentLevel = getLevelInfo(currentXP).level === levelData.level;
  const isUnlocked = currentXP >= levelData.minXP;

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-xl transition-all
        ${isCurrentLevel ? 'bg-violet-600/10 border border-violet-500/25' : ''}
      `}
    >
      <LevelBadge
        level={levelData.level}
        title=""
        color={isUnlocked ? levelData.color : '#2d2d4e'}
        size="sm"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span
            className={`text-xs font-semibold ${isUnlocked ? 'text-white' : 'text-white/30'}`}
          >
            Lv.{levelData.level} — {levelData.title}
          </span>
          {isCurrentLevel && (
            <span className="text-[10px] text-violet-400 font-display font-bold">CURRENT</span>
          )}
          {isUnlocked && !isCurrentLevel && (
            <span className="text-[10px] text-emerald-400">✓ Unlocked</span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-white/06">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{
              width: isUnlocked ? '100%' : '0%',
              background: isUnlocked ? levelData.color : 'transparent',
              boxShadow: isUnlocked ? `0 0 6px ${levelData.color}60` : 'none',
            }}
          />
        </div>
        <p className="text-[10px] text-white/30 mt-0.5 font-mono">
          {levelData.minXP.toLocaleString()} XP required
        </p>
      </div>
    </div>
  );
}

export default function Stats() {
  const { tasks, player, levelInfo, stats } = useGame();

  const completedTasks = tasks.filter((t) => t.completed);

  // Tasks per day (last 7 days)
  const last7Days = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toDateString();
      const count = completedTasks.filter(
        (t) => new Date(t.completedAt).toDateString() === dateStr
      ).length;
      result.push({
        label: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
        date: dateStr,
      });
    }
    return result;
  }, [completedTasks]);

  const maxCount = Math.max(1, ...last7Days.map((d) => d.count));

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map = {};
    completedTasks.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [completedTasks]);

  const totalXPFromTasks = completedTasks.reduce((acc, t) => acc + (t.xpAwarded || 0), 0);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-[fadeUp_0.4s_ease-out]">
      <div>
        <h2 className="font-display text-2xl font-black text-white tracking-wide">Statistics</h2>
        <p className="text-sm text-white/40 mt-1">Your adventure progress at a glance</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: formatXP(totalXPFromTasks), icon: '⚡', color: '#f59e0b' },
          { label: 'Current Level', value: levelInfo.level, icon: '🏆', color: levelInfo.color },
          { label: 'Tasks Done', value: stats.totalCompleted, icon: '✅', color: '#10b981' },
          { label: 'Best Streak', value: `${player.streak}d`, icon: '🔥', color: '#fb923c' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass-card stat-card rounded-2xl p-5">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="font-display text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-xs text-white/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-day activity chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display text-sm font-bold text-white/70 uppercase tracking-widest mb-5">
            7-Day Activity
          </h3>
          <div className="flex items-end gap-2 h-32">
            {last7Days.map(({ label, count }) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-white/50 font-mono">{count > 0 ? count : ''}</span>
                <div className="w-full flex flex-col justify-end" style={{ height: '88px' }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700 min-h-[3px]"
                    style={{
                      height: `${(count / maxCount) * 88}px`,
                      background: count > 0
                        ? 'linear-gradient(180deg, #8b5cf6, #6d28d9)'
                        : 'rgba(255,255,255,0.04)',
                      boxShadow: count > 0 ? '0 0 10px rgba(139,92,246,0.4)' : 'none',
                    }}
                  />
                </div>
                <span className="text-[10px] text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display text-sm font-bold text-white/70 uppercase tracking-widest mb-5">
            By Category
          </h3>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-8">No completed tasks yet</p>
          ) : (
            <div className="space-y-3">
              {categoryBreakdown.map(([cat, count]) => {
                const pct = Math.round((count / stats.totalCompleted) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/70 font-semibold">{cat}</span>
                      <span className="text-white/40 font-mono">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/06">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)',
                          boxShadow: '0 0 8px rgba(139,92,246,0.3)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Level progression */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display text-sm font-bold text-white/70 uppercase tracking-widest mb-5">
          Level Progression
        </h3>
        <div className="space-y-2">
          {LEVELS.map((levelData) => (
            <ProgressToLevel
              key={levelData.level}
              levelData={levelData}
              currentXP={player.totalXP}
            />
          ))}
        </div>
      </div>

      {/* Priority breakdown */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display text-sm font-bold text-white/70 uppercase tracking-widest mb-5">
          Difficulty Breakdown
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(PRIORITIES).map(([key, p]) => {
            const count = completedTasks.filter((t) => t.priority === key).length;
            const xpEarned = count * p.xp;
            return (
              <div
                key={key}
                className={`${p.bgClass} border rounded-xl p-4 text-center`}
              >
                <span className="text-3xl block mb-2">{p.icon}</span>
                <p className="font-display text-2xl font-black" style={{ color: p.color }}>
                  {count}
                </p>
                <p className="text-xs text-white/60 mt-0.5">{p.label} tasks</p>
                <p className="text-[10px] font-mono text-white/30 mt-1">
                  {xpEarned} XP earned
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
