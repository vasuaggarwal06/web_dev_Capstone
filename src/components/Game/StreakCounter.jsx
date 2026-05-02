import { getStreakMessage } from '../../utils/gameLogic';

export default function StreakCounter({ streak, compact = false }) {
  const message = getStreakMessage(streak);
  const isHot = streak >= 3;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`text-2xl ${isHot ? 'animate-[float_3s_ease-in-out_infinite]' : ''}`}>
          {streak >= 7 ? '🌟' : streak >= 3 ? '🔥' : '❄️'}
        </span>
        <div>
          <span className="font-display text-2xl font-black text-white">{streak}</span>
          <span className="text-xs text-white/40 ml-1">day streak</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className={`text-5xl ${isHot ? 'animate-[float_3s_ease-in-out_infinite]' : ''}`}>
        {streak >= 30 ? '⚡' : streak >= 7 ? '🌟' : streak >= 3 ? '🔥' : '❄️'}
      </div>
      <div className="font-display text-4xl font-black text-white">
        {streak}
      </div>
      <div className="text-xs text-white/40 font-semibold uppercase tracking-widest">
        Day Streak
      </div>
      <p className="text-xs text-white/50 mt-1 max-w-[160px] leading-relaxed">
        {message}
      </p>
    </div>
  );
}
