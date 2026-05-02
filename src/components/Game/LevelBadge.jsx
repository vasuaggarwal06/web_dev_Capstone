export default function LevelBadge({ level, title, color, size = 'md' }) {
  const sizes = {
    sm: { outer: 'w-10 h-10', inner: 'w-8 h-8', text: 'text-sm', titleSize: 'text-[9px]' },
    md: { outer: 'w-16 h-16', inner: 'w-13 h-13', text: 'text-xl', titleSize: 'text-[10px]' },
    lg: { outer: 'w-24 h-24', inner: 'w-20 h-20', text: 'text-3xl', titleSize: 'text-xs' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`${s.outer} rounded-full flex items-center justify-center relative`}
        style={{
          background: `conic-gradient(${color} 0deg, ${color}88 180deg, #1a1a2e 180deg)`,
          boxShadow: `0 0 20px ${color}40`,
        }}
      >
        <div
          className="w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full flex flex-col items-center justify-center"
          style={{ background: '#111120' }}
        >
          <span className={`${s.text} font-display font-black leading-none`} style={{ color }}>
            {level}
          </span>
        </div>
      </div>
      <span className={`${s.titleSize} font-display font-semibold tracking-widest uppercase`} style={{ color }}>
        {title}
      </span>
    </div>
  );
}
