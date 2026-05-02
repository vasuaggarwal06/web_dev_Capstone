import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PRIORITIES, CATEGORIES } from '../../utils/constants';

const defaultForm = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  category: 'Work',
  dueDate: '',
};

export default function TaskForm({ onClose, editTask = null }) {
  const { addTask, editTask: updateTask } = useGame();
  const [form, setForm] = useState(
    editTask
      ? {
          title: editTask.title,
          description: editTask.description,
          priority: editTask.priority,
          category: editTask.category,
          dueDate: editTask.dueDate ? editTask.dueDate.slice(0, 10) : '',
        }
      : defaultForm
  );
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Task title is required';
    if (form.title.trim().length > 100) errs.title = 'Title must be under 100 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editTask) {
      updateTask(editTask.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        category: form.category,
        dueDate: form.dueDate || null,
      });
    } else {
      addTask({
        title: form.title,
        description: form.description,
        priority: form.priority,
        category: form.category,
        dueDate: form.dueDate || null,
      });
    }
    onClose();
  };

  const selectedPriority = PRIORITIES[form.priority];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
          Quest Title *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="What needs to be done?"
          className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20
            focus:outline-none focus:ring-1 transition-colors
            ${errors.title
              ? 'border-rose-500/60 focus:ring-rose-500/40'
              : 'border-white/10 focus:border-violet-500/50 focus:ring-violet-500/30'
            }`}
        />
        {errors.title && (
          <p className="text-xs text-rose-400 mt-1.5">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Optional details..."
          rows={3}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white
            placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1
            focus:ring-violet-500/30 transition-colors resize-none"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
          Difficulty / XP Reward
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRIORITIES).map(([key, p]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleChange('priority', key)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all
                ${form.priority === key
                  ? `${p.bgClass} border-opacity-100`
                  : 'bg-white/[0.03] border-white/08 hover:border-white/15'
                }
              `}
            >
              <span className="text-base">{p.icon}</span>
              <div>
                <p className={`text-xs font-semibold ${form.priority === key ? p.textColor : 'text-white/70'}`}>
                  {p.label}
                </p>
                <p className="text-[10px] text-white/30">+{p.xp} XP</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category + Due Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white
              focus:outline-none focus:border-violet-500/50 transition-colors appearance-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} style={{ background: '#111120' }}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
            Due Date
          </label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white
              focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>

      {/* XP Preview */}
      <div className="p-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 flex items-center gap-3">
        <span className="text-2xl">{selectedPriority.icon}</span>
        <div>
          <p className="text-xs text-amber-400/80 font-semibold">
            Complete this to earn
          </p>
          <p className="text-lg font-display font-bold text-amber-400">
            +{selectedPriority.xp} XP
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-[2]">
          {editTask ? 'Update Quest' : 'Add Quest'}
        </button>
      </div>
    </form>
  );
}
