'use client';

import { useState, useRef, useEffect } from 'react';
import type { Todo, Priority } from '@/types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const PRIORITY_CONFIG: Record<Priority, { dot: string; badge: string; label: string }> = {
  high: {
    dot: 'bg-red-500',
    badge: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40',
    label: '高',
  },
  medium: {
    dot: 'bg-amber-500',
    badge: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40',
    label: '中',
  },
  low: {
    dot: 'bg-sky-500',
    badge: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/40',
    label: '低',
  },
};

function formatDueDate(dateStr: string): { label: string; isOverdue: boolean; isToday: boolean } {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const isOverdue = dateStr < today;
  const isToday = dateStr === today;
  const isTomorrow = dateStr === tomorrow;
  const label = isToday ? '今日' : isTomorrow ? '明日' : dateStr.replace(/-/g, '/').slice(2);
  return { label, isOverdue, isToday };
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const priority = PRIORITY_CONFIG[todo.priority];

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEdit = () => {
    if (todo.completed) return;
    setEditText(todo.text);
    setEditing(true);
  };

  const saveEdit = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onEdit(todo.id, editText);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditing(false);
    }
  };

  const dueInfo = todo.dueDate ? formatDueDate(todo.dueDate) : null;

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3 rounded-xl border transition-all ${
        todo.completed
          ? 'border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-sm'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
          todo.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
        }`}
        aria-label={todo.completed ? 'タスクを未完了にする' : 'タスクを完了にする'}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="w-full text-sm bg-transparent border-b border-indigo-400 outline-none text-slate-900 dark:text-slate-100 pb-0.5"
          />
        ) : (
          <p
            onClick={startEdit}
            className={`text-sm leading-relaxed transition-all ${
              todo.completed
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-800 dark:text-slate-200 cursor-text hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title={todo.completed ? undefined : 'クリックして編集'}
          >
            {todo.text}
          </p>
        )}

        {/* Meta */}
        {dueInfo && !todo.completed && (
          <span
            className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              dueInfo.isOverdue
                ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40'
                : dueInfo.isToday
                ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40'
                : 'text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-700'
            }`}
          >
            {dueInfo.isOverdue ? '期限切れ: ' : ''}{dueInfo.label}
          </span>
        )}
      </div>

      {/* Priority badge */}
      <span className={`flex-shrink-0 mt-0.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${priority.badge}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
        {priority.label}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        aria-label="タスクを削除"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
