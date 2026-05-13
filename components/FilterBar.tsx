'use client';

import type { FilterType, SortType } from '@/types/todo';

interface Props {
  filter: FilterType;
  sort: SortType;
  totalCount: number;
  activeCount: number;
  completedCount: number;
  onFilterChange: (f: FilterType) => void;
  onSortChange: (s: SortType) => void;
  onClearCompleted: () => void;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
];

const SORTS: { value: SortType; label: string }[] = [
  { value: 'newest', label: '新しい順' },
  { value: 'oldest', label: '古い順' },
  { value: 'priority', label: '優先度順' },
  { value: 'dueDate', label: '期日順' },
];

export function FilterBar({
  filter,
  sort,
  activeCount,
  completedCount,
  onFilterChange,
  onSortChange,
  onClearCompleted,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === f.value
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {f.label}
            {f.value === 'active' && activeCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full">
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-slate-400 dark:text-slate-500">並び替え:</span>
        <select
          value={sort}
          onChange={e => onSortChange(e.target.value as SortType)}
          className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Clear completed */}
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="text-xs text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors underline-offset-2 hover:underline"
        >
          完了済みを削除 ({completedCount})
        </button>
      )}
    </div>
  );
}
