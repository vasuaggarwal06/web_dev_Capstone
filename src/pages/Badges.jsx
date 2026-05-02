import { useGame } from '../context/GameContext';
import { BADGES, RARITY_COLORS } from '../utils/constants';

const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Legendary'];

function BadgeCard({ badge, isUnlocked }) {
  return (
    <div
      className={`
        glass-card rounded-2xl p-5 flex flex-col items-center gap-3 text-center
        transition-all duration-300 relative overflow-hidden
        ${isUnlocked ? 'glass-card-hover' : 'badge-locked'}
      `}
    >
      {/* Rarity accent */}
      {isUnlocked && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${RARITY_COLORS[badge.rarity] || '#94a3b8'}, transparent)`,
          }}
        />
      )}

      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
        style={
          isUnlocked
            ? {
                background: `${badge.color}18`,
                border: `2px solid ${badge.color}40`,
                boxShadow: `0 0 20px ${badge.color}25`,
              }
            : { background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.05)' }
        }
      >
        <span className={isUnlocked ? 'animate-[float_3s_ease-in-out_infinite]' : ''}>
          {isUnlocked ? badge.icon : '🔒'}
        </span>
      </div>

      <div>
        <p className={`text-sm font-semibold ${isUnlocked ? 'text-white' : 'text-white/30'}`}>
          {badge.name}
        </p>
        <p className="text-[11px] text-white/40 mt-1 leading-relaxed max-w-[140px]">
          {badge.description}
        </p>
      </div>

      <span
        className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border"
        style={
          isUnlocked
            ? {
                color: RARITY_COLORS[badge.rarity],
                background: `${RARITY_COLORS[badge.rarity]}15`,
                borderColor: `${RARITY_COLORS[badge.rarity]}40`,
              }
            : { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.08)', background: 'transparent' }
        }
      >
        {badge.rarity}
      </span>
    </div>
  );
}

export default function Badges() {
  const { player } = useGame();
  const unlockedSet = new Set(player.unlockedBadges || []);

  const byRarity = RARITY_ORDER.map((rarity) => ({
    rarity,
    badges: BADGES.filter((b) => b.rarity === rarity),
  }));

  const totalUnlocked = unlockedSet.size;
  const totalBadges = BADGES.length;
  const percent = Math.round((totalUnlocked / totalBadges) * 100);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-[fadeUp_0.4s_ease-out]">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-black text-white tracking-wide">Badge Collection</h2>
        <p className="text-sm text-white/40 mt-1">
          {totalUnlocked} of {totalBadges} badges unlocked
        </p>
      </div>

      {/* Progress */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative flex items-center gap-6">
          <div className="text-center flex-shrink-0">
            <p className="font-display text-5xl font-black text-amber-400">{totalUnlocked}</p>
            <p className="text-xs text-white/40 mt-1">Earned</p>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/60 font-semibold">Collection Progress</span>
              <span className="text-amber-400 font-mono">{percent}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/06">
              <div
                className="h-3 rounded-full transition-all duration-1000"
                style={{
                  width: `${percent}%`,
                  background: 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
                  boxShadow: '0 0 10px rgba(245,158,11,0.4)',
                }}
              />
            </div>
            <p className="text-xs text-white/30 mt-2">
              {totalBadges - totalUnlocked} badge{totalBadges - totalUnlocked !== 1 ? 's' : ''} remaining
            </p>
          </div>
        </div>
      </div>

      {/* Badges by rarity */}
      {byRarity.map(({ rarity, badges }) => (
        <div key={rarity}>
          <div className="flex items-center gap-3 mb-4">
            <h3
              className="font-display text-xs font-bold uppercase tracking-widest"
              style={{ color: RARITY_COLORS[rarity] }}
            >
              {rarity}
            </h3>
            <div className="flex-1 h-px" style={{ background: `${RARITY_COLORS[rarity]}25` }} />
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                color: RARITY_COLORS[rarity],
                background: `${RARITY_COLORS[rarity]}15`,
                border: `1px solid ${RARITY_COLORS[rarity]}30`,
              }}
            >
              {badges.filter(b => unlockedSet.has(b.id)).length}/{badges.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={unlockedSet.has(badge.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
