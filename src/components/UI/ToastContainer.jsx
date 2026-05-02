import { useGame } from '../../context/GameContext';

const TOAST_STYLES = {
  xp: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    icon: '⚡',
    titleColor: 'text-amber-400',
  },
  levelup: {
    border: 'border-violet-500/50',
    bg: 'bg-violet-500/15',
    icon: '🎉',
    titleColor: 'text-violet-300',
  },
  badge: {
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-500/10',
    icon: '🏅',
    titleColor: 'text-cyan-400',
  },
  info: {
    border: 'border-slate-500/30',
    bg: 'bg-slate-500/10',
    icon: 'ℹ️',
    titleColor: 'text-slate-300',
  },
  error: {
    border: 'border-rose-500/40',
    bg: 'bg-rose-500/10',
    icon: '⚠️',
    titleColor: 'text-rose-400',
  },
};

function ToastItem({ toast, onRemove }) {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl
        border ${style.border} ${style.bg}
        backdrop-blur-md shadow-2xl
        animate-[fadeUp_0.3s_ease-out]
        min-w-[260px] max-w-[320px]
        cursor-pointer
      `}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
      onClick={() => onRemove(toast.id)}
    >
      <span className="text-xl leading-none mt-0.5">{style.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold font-display tracking-wide ${style.titleColor}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-white/50 mt-0.5 leading-relaxed truncate">
            {toast.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useGame();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}
