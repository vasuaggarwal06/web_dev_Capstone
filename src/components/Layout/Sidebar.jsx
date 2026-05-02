import { NavLink } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import LevelBadge from '../Game/LevelBadge';
import XPBar from '../Game/XPBar';

const NAV_ITEMS = [
  { to: '/',        icon: '⚡', label: 'Dashboard'  },
  { to: '/tasks',   icon: '📋', label: 'Tasks'      },
  { to: '/badges',  icon: '🏅', label: 'Badges'     },
  { to: '/stats',   icon: '📊', label: 'Stats'      },
];

export default function Sidebar() {
  const { player, levelInfo } = useGame();

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/[0.06] glass-card rounded-none">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center text-lg shadow-lg"
            style={{ boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
            ⚔️
          </div>
          <div>
            <h1 className="font-display text-sm font-bold text-white tracking-wide">QuestBoard</h1>
            <p className="text-[10px] text-white/30 tracking-widest uppercase">Task Manager</p>
          </div>
        </div>
      </div>

      {/* Player profile */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-4 mb-4">
          <LevelBadge
            level={levelInfo.level}
            title={levelInfo.title}
            color={levelInfo.color}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{player.name}</p>
            <p className="text-[11px] font-mono text-amber-400/80 mt-0.5">
              {levelInfo.totalXP.toLocaleString()} XP total
            </p>
          </div>
        </div>
        <XPBar levelInfo={levelInfo} compact />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-base w-5 text-center">{icon}</span>
            <span className="font-body">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Streak in sidebar footer */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-xl">
            {player.streak >= 3 ? '🔥' : '❄️'}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {player.streak} day streak
            </p>
            <p className="text-[10px] text-white/30">Keep it going!</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
