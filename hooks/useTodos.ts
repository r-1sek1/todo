'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Todo, Priority, FilterType, SortType } from '@/types/todo';

const STORAGE_KEY = 'todos-app-data';
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTodos(JSON.parse(saved));
    } catch {}
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {}
  }, [todos, initialized]);

  const addTodo = (text: string, priority: Priority, dueDate?: string) => {
    setTodos(prev => [
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
        dueDate: dueDate || undefined,
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) =>
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTodo = (id: string) =>
    setTodos(prev => prev.filter(t => t.id !== id));

  const editTodo = (id: string, text: string) =>
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text: text.trim() } : t)));

  const clearCompleted = () =>
    setTodos(prev => prev.filter(t => !t.completed));

  const filteredTodos = useMemo(() => {
    const filtered = todos.filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        default:
          return 0;
      }
    });
  }, [todos, filter, sort]);

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    sort,
    setSort,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    totalCount: todos.length,
    activeCount: todos.filter(t => !t.completed).length,
    completedCount: todos.filter(t => t.completed).length,
  };
}
