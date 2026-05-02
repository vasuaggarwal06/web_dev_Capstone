import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { PRIORITIES, BADGES, RARITY_COLORS } from '../utils/constants';
import { formatXP } from '../utils/gameLogic';
import LevelBadge from '../components/Game/LevelBadge';
import XPBar from '../components/Game/XPBar';
import StreakCounter from '../components/Game/StreakCounter';
import TaskCard from '../components/Tasks/TaskCard';
import Modal from '../components/UI/Modal';
import TaskForm from '../components/Tasks/TaskForm';

function StatCard({ label, value, sub, icon, accentColor }) {
  return (
    <div className="glass-card stat-card rounded-2xl p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}
      >
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl font-black text-white leading-none">{value}</p>
        <p className="text-xs text-white/50 mt-1">{label}</p>
        {sub && <p className="text-[10px] text-white/30 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { tasks, player, levelInfo, stats } = useGame();
  const [showAddTask, setShowAddTask] = useState(false);

  const recentCompleted = tasks.filter((t) => t.completed).slice(0, 3);
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  const unlockedBadges = BADGES.filter((b) => player.unlockedBadges?.includes(b.id)).slice(0, 4);
  const totalBadges = BADGES.length;

  const todayStr = new Date().toDateString();
  const completedToday = tasks.filter(
    (t) => t.completed && new Date(t.completedAt).toDateString() === todayStr
  ).length;

  const xpToday = tasks
    .filter((t) => t.completed && new Date(t.completedAt).toDateString() === todayStr)
    .reduce((acc, t) => acc + (t.xpAwarded || 0), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-[fadeUp_0.4s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-white tracking-wide">
            Welcome back, <span className="text-violet-400">{player.name}</span>
          </h2>
          <p className="text-sm text-white/40 mt-1">
            {pendingTasks.length > 0
              ? `You have ${tasks.filter(t => !t.completed).length} quest${tasks.filter(t => !t.completed).length !== 1 ? 's' : ''} waiting.`
              : tasks.length === 0 ? 'No quests yet — add your first one!'
              : '🎉 All quests complete — you\'re crushing it!'}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddTask(true)}>
          + New Quest
        </button>
      </div>

      {/* Level + XP Hero */}
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/08 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <LevelBadge
              level={levelInfo.level}
              title={levelInfo.title}
              color={levelInfo.color}
              size="lg"
            />
          </div>

          <div className="flex-1 w-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Level {levelInfo.level} — {levelInfo.title}
                </h3>
                <p className="text-sm text-white/40 mt-0.5">
                  Total XP earned:{' '}
                  <span className="text-amber-400 font-mono font-semibold">
                    {formatXP(levelInfo.totalXP)}
                  </span>
                </p>
              </div>
              {levelInfo.isMaxLevel && (
                <span className="text-xs font-display font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                  ⚡ MAX LEVEL
                </span>
              )}
            </div>
            <XPBar levelInfo={levelInfo} />
          </div>

          <div className="flex-shrink-0">
            <StreakCounter streak={player.streak} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="✅"
          label="Tasks Completed"
          value={stats.totalCompleted}
          accentColor="#10b981"
        />
        <StatCard
          icon="⚡"
          label="XP Today"
          value={`+${xpToday}`}
          sub={`${completedToday} task${completedToday !== 1 ? 's' : ''} done today`}
          accentColor="#f59e0b"
        />
        <StatCard
          icon="🏅"
          label="Badges Earned"
          value={`${player.unlockedBadges?.length || 0}/${totalBadges}`}
          sub="Collect them all"
          accentColor="#8b5cf6"
        />
        <StatCard
          icon="🐉"
          label="Epic Slain"
          value={stats.epicCompleted}
          sub="Epic difficulty tasks"
          accentColor="#f43f5e"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending tasks */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-white/70 uppercase tracking-widest">
              Active Quests
            </h3>
            <Link to="/tasks" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              View all →
            </Link>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-3xl mb-3">🎉</p>
              <p className="text-sm text-white/50">No active quests — time to add some!</p>
              <button className="btn-primary mt-4" onClick={() => setShowAddTask(true)}>
                + Add Quest
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} />
              ))}
              {tasks.filter(t => !t.completed).length > 4 && (
                <Link
                  to="/tasks"
                  className="block text-center text-xs text-violet-400 hover:text-violet-300 py-2 transition-colors"
                >
                  +{tasks.filter(t => !t.completed).length - 4} more quests
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right panel: badges + XP breakdown */}
        <div className="space-y-4">
          {/* Recent badges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-white/70 uppercase tracking-widest">
                Badges
              </h3>
              <Link to="/badges" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                All badges →
              </Link>
            </div>

            {unlockedBadges.length === 0 ? (
              <div className="glass-card rounded-2xl p-5 text-center">
                <p className="text-2xl mb-2">🔒</p>
                <p className="text-xs text-white/40">Complete tasks to unlock badges</p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-4 grid grid-cols-2 gap-3">
                {unlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/04 transition-colors"
                    title={badge.description}
                  >
                    <span className="text-2xl animate-[badgePop_0.5s_ease-out]">{badge.icon}</span>
                    <p className="text-[10px] text-white/60 text-center leading-tight">{badge.name}</p>
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        color: RARITY_COLORS?.[badge.rarity] || '#94a3b8',
                        background: `${RARITY_COLORS?.[badge.rarity] || '#94a3b8'}15`,
                      }}
                    >
                      {badge.rarity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* XP by priority */}
          <div>
            <h3 className="font-display text-sm font-bold text-white/70 uppercase tracking-widest mb-3">
              XP Breakdown
            </h3>
            <div className="glass-card rounded-2xl p-4 space-y-3">
              {Object.entries(PRIORITIES).map(([key, p]) => {
                const count = tasks.filter(
                  (t) => t.completed && t.priority === key
                ).length;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">{p.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: p.color }} className="font-semibold">{p.label}</span>
                        <span className="text-white/40">{count} × {p.xp} XP</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/06">
                        <div
                          className="h-1.5 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(100, count * 10)}%`,
                            background: p.color,
                            boxShadow: `0 0 6px ${p.color}60`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="New Quest">
        <TaskForm onClose={() => setShowAddTask(false)} />
      </Modal>
    </div>
  );
}
