export type Priority = 'high' | 'medium' | 'low';
export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'newest' | 'oldest' | 'priority' | 'dueDate';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  dueDate?: string;
}
