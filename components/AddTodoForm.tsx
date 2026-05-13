'use client';

import { useState, useRef } from 'react';
import type { Priority } from '@/types/todo';

interface Props {
  onAdd: (text: string, priority: Priority, dueDate?: string) => void;
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: '高', color: 'text-red-500 border-red-500 bg-red-50 dark:bg-red-950/40' },
  { value: 'medium', label: '中', color: 'text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  { value: 'low', label: '低', color: 'text-sky-500 border-sky-500 bg-sky-50 dark:bg-sky-950/40' },
];

export function AddTodoForm({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, dueDate || undefined);
    setText('');
    setDueDate('');
    setPriority('medium');
    setShowOptions(false);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => setShowOptions(true)}
          placeholder="新しいタスクを入力..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          autoFocus
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all active:scale-95"
        >
          追加
        </button>
      </div>

      {showOptions && (
        <div className="flex flex-wrap items-center gap-3 px-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">優先度:</span>
          <div className="flex gap-1">
            {PRIORITIES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                  priority === p.value
                    ? p.color
                    : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:text-slate-500'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">期日:</span>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}
    </form>
  );
}
