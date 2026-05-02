import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PRIORITIES } from '../../utils/constants';
import Modal from '../UI/Modal';
import TaskForm from './TaskForm';

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TaskCard({ task, index = 0 }) {
  const { completeTask, uncompleteTask, deleteTask } = useGame();
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const priority = PRIORITIES[task.priority] || PRIORITIES.MEDIUM;
  const overdue = isOverdue(task.dueDate) && !task.completed;

  return (
    <>
      <div
        className={`
          glass-card glass-card-hover rounded-2xl p-4 border
          ${task.completed ? 'opacity-60' : ''}
          ${priority.bgClass}
          animate-[fadeUp_0.3s_ease-out]
        `}
        style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
      >
        {/* Top row */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => task.completed ? uncompleteTask(task.id) : completeTask(task.id)}
            className={`
              mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center
              transition-all duration-200
              ${task.completed
                ? 'bg-violet-600 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                : 'border-white/20 hover:border-violet-400 hover:bg-violet-500/10'
              }
            `}
            title={task.completed ? 'Mark incomplete' : 'Complete task'}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold leading-snug task-title text-white ${task.completed ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-white/40 mt-1 leading-relaxed line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {!task.completed && (
              <button
                onClick={() => setShowEdit(true)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/08 transition-colors text-sm"
                title="Edit task"
              >
                ✏️
              </button>
            )}
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-sm"
              title="Delete task"
            >
              🗑
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-3 pl-8 flex-wrap">
          {/* Priority badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono tracking-wider`}
            style={{
              background: `${priority.color}18`,
              color: priority.color,
              border: `1px solid ${priority.color}30`,
            }}
          >
            {priority.icon} {priority.label}
          </span>

          {/* Category */}
          <span className="text-[10px] text-white/30 bg-white/04 border border-white/08 px-2 py-0.5 rounded-md">
            {task.category}
          </span>

          {/* Due date */}
          {task.dueDate && (
            <span className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1
              ${overdue
                ? 'text-rose-400 bg-rose-500/10 border border-rose-500/25'
                : 'text-white/30 bg-white/04 border border-white/08'
              }`}
            >
              📅 {overdue && 'Overdue · '}{formatDate(task.dueDate)}
            </span>
          )}

          {/* XP */}
          {task.completed ? (
            <span className="ml-auto text-[10px] font-mono text-amber-400/70">
              +{task.xpAwarded} XP ✓
            </span>
          ) : (
            <span className="ml-auto text-[10px] font-mono text-white/20">
              +{priority.xp} XP
            </span>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Quest">
        <TaskForm onClose={() => setShowEdit(false)} editTask={task} />
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Quest?">
        <p className="text-sm text-white/60 mb-6">
          Are you sure you want to delete{' '}
          <span className="text-white font-semibold">"{task.title}"</span>?
          {task.completed && (
            <span className="block mt-2 text-rose-400/70">
              ⚠️ This task is completed — deleting it will remove its XP.
            </span>
          )}
        </p>
        <div className="flex gap-3">
          <button className="btn-ghost flex-1" onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
          <button
            className="flex-1 py-2 px-4 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40
              text-rose-400 rounded-xl text-sm font-semibold transition-all"
            onClick={() => { deleteTask(task.id); setConfirmDelete(false); }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
