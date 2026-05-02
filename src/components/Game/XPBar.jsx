import { formatXP } from '../../utils/gameLogic';

export default function XPBar({ levelInfo, compact = false }) {
  const { progressPercent, xpIntoCurrentLevel, xpNeededForNextLevel, isMaxLevel } = levelInfo;

  if (compact) {
    return (
      <div className="w-full">
        <div className="xp-bar-track h-2">
          <div
            className="xp-bar-fill h-2"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-amber-400/60 font-mono">
            {formatXP(xpIntoCurrentLevel)} XP
          </span>
          <span className="text-[10px] text-white/30 font-mono">
            {isMaxLevel ? 'MAX' : `${formatXP(xpNeededForNextLevel)} needed`}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono text-amber-400/80">
          {formatXP(xpIntoCurrentLevel)} / {isMaxLevel ? '∞' : formatXP(xpNeededForNextLevel)} XP
        </span>
        <span className="text-xs text-white/40">{progressPercent}%</span>
      </div>
      <div className="xp-bar-track h-3">
        <div
          className="xp-bar-fill h-3"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {!isMaxLevel && levelInfo.nextLevel && (
        <p className="text-[11px] text-white/30 mt-1.5">
          {formatXP(xpNeededForNextLevel - xpIntoCurrentLevel)} XP until{' '}
          <span className="text-white/50">{levelInfo.nextLevel.title}</span>
        </p>
      )}
    </div>
  );
}
