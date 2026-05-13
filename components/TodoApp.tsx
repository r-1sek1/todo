'use client';

import { useTodos } from '@/hooks/useTodos';
import { useTheme } from '@/hooks/useTheme';
import { AddTodoForm } from './AddTodoForm';
import { FilterBar } from './FilterBar';
import { TodoList } from './TodoList';

export function TodoApp() {
  const {
    todos,
    filter,
    setFilter,
    sort,
    setSort,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    totalCount,
    activeCount,
    completedCount,
  } = useTodos();

  const { isDark, toggle: toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 transition-colors">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Todo
              <span className="ml-2 text-indigo-500">.</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {activeCount > 0
                ? `${activeCount}件のタスクが残っています`
                : totalCount > 0
                ? 'すべて完了しました!'
                : 'タスクを追加してください'}
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all"
            aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800 overflow-hidden">

          {/* Add form */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <AddTodoForm onAdd={addTodo} />
          </div>

          {/* Filter bar */}
          {totalCount > 0 && (
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <FilterBar
                filter={filter}
                sort={sort}
                totalCount={totalCount}
                activeCount={activeCount}
                completedCount={completedCount}
                onFilterChange={setFilter}
                onSortChange={setSort}
                onClearCompleted={clearCompleted}
              />
            </div>
          )}

          {/* Todo list */}
          <div className="p-4">
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </div>

          {/* Footer stats */}
          {totalCount > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                <span>全{totalCount}件</span>
                <span className="text-indigo-500 dark:text-indigo-400 font-medium">{activeCount}件未完了</span>
                {completedCount > 0 && <span className="text-emerald-500 dark:text-emerald-400">{completedCount}件完了</span>}
                <div className="ml-auto w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-300 dark:text-slate-700">
          テキストをクリックして編集 · Enterで保存 · Escでキャンセル
        </p>
      </div>
    </div>
  );
}
