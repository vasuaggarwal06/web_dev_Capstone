import { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { PRIORITIES, CATEGORIES, TASKS_PER_PAGE } from '../utils/constants';
import { usePagination } from '../hooks/usePagination';
import TaskCard from '../components/Tasks/TaskCard';
import Modal from '../components/UI/Modal';
import TaskForm from '../components/Tasks/TaskForm';

const FILTER_STATUS = ['All', 'Active', 'Completed'];

function Pagination({ currentPage, totalPages, hasPrev, hasNext, prevPage, nextPage, goToPage }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={prevPage}
        disabled={!hasPrev}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10
          text-white/40 hover:text-white hover:border-violet-500/40 disabled:opacity-30
          disabled:cursor-not-allowed transition-all text-sm"
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border text-xs font-mono font-semibold
            transition-all ${currentPage === page
              ? 'bg-violet-600/30 border-violet-500/50 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
              : 'border-white/08 text-white/40 hover:text-white hover:border-white/20'
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={nextPage}
        disabled={!hasNext}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10
          text-white/40 hover:text-white hover:border-violet-500/40 disabled:opacity-30
          disabled:cursor-not-allowed transition-all text-sm"
      >
        ›
      </button>
    </div>
  );
}

export default function Tasks() {
  const { tasks } = useGame();
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (statusFilter === 'Active') result = result.filter((t) => !t.completed);
    else if (statusFilter === 'Completed') result = result.filter((t) => t.completed);

    if (priorityFilter !== 'All') result = result.filter((t) => t.priority === priorityFilter);
    if (categoryFilter !== 'All') result = result.filter((t) => t.category === categoryFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'xp-high': return (PRIORITIES[b.priority]?.xp || 0) - (PRIORITIES[a.priority]?.xp || 0);
        case 'xp-low': return (PRIORITIES[a.priority]?.xp || 0) - (PRIORITIES[b.priority]?.xp || 0);
        case 'due': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        default: return 0;
      }
    });

    return result;
  }, [tasks, statusFilter, priorityFilter, categoryFilter, search, sortBy]);

  const pagination = usePagination(filteredTasks, TASKS_PER_PAGE);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-[fadeUp_0.4s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-white tracking-wide">Quest Log</h2>
          <p className="text-sm text-white/40 mt-1">
            {activeCount} active · {completedCount} completed
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          + New Quest
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quests..."
            className="w-full bg-white/[0.04] border border-white/08 rounded-xl pl-9 pr-4 py-2.5 text-sm
              text-white placeholder-white/20 focus:outline-none focus:border-violet-500/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-lg transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-3">
          {/* Status */}
          <div className="flex gap-1">
            {FILTER_STATUS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${statusFilter === s
                    ? 'bg-violet-600/30 border border-violet-500/50 text-violet-300'
                    : 'border border-white/08 text-white/40 hover:text-white/70 hover:border-white/15'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex gap-1">
            <button
              onClick={() => setPriorityFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                ${priorityFilter === 'All'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-white/08 text-white/40 hover:text-white/70'
                }`}
            >
              All Difficulties
            </button>
            {Object.entries(PRIORITIES).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setPriorityFilter(priorityFilter === key ? 'All' : key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                  ${priorityFilter === key
                    ? `${p.bgClass} border-opacity-100`
                    : 'border-white/08 text-white/40 hover:text-white/70'
                  }`}
                style={priorityFilter === key ? { color: p.color } : {}}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60
                focus:outline-none focus:border-violet-500/40 transition-colors cursor-pointer appearance-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="newest" style={{ background: '#111120' }}>Newest first</option>
              <option value="oldest" style={{ background: '#111120' }}>Oldest first</option>
              <option value="xp-high" style={{ background: '#111120' }}>Highest XP</option>
              <option value="xp-low" style={{ background: '#111120' }}>Lowest XP</option>
              <option value="due" style={{ background: '#111120' }}>Due date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results info */}
      {filteredTasks.length !== tasks.length && (
        <p className="text-xs text-white/40">
          Showing {filteredTasks.length} of {tasks.length} quests
        </p>
      )}

      {/* Task list */}
      {pagination.paginatedItems.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">
            {tasks.length === 0 ? '⚔️' : '🔍'}
          </p>
          <p className="text-white/60 font-semibold mb-2">
            {tasks.length === 0 ? 'No quests yet' : 'No quests match your filters'}
          </p>
          <p className="text-sm text-white/30 mb-6">
            {tasks.length === 0
              ? 'Add your first quest and start earning XP!'
              : 'Try adjusting your filters or search term.'}
          </p>
          {tasks.length === 0 && (
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
              + Add Your First Quest
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {pagination.paginatedItems.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination {...pagination} />

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="New Quest">
        <TaskForm onClose={() => setShowAdd(false)} />
      </Modal>
    </div>
  );
}
