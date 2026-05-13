import { render, screen } from '@testing-library/react';
import { TodoList } from '@/components/TodoList';
import type { Todo } from '@/types/todo';

const makeTodo = (id: string, text: string): Todo => ({
  id,
  text,
  completed: false,
  priority: 'medium',
  createdAt: new Date().toISOString(),
});

const defaultProps = {
  onToggle: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
};

describe('TodoList', () => {
  it('タスクがない場合は空状態メッセージを表示する', () => {
    render(<TodoList todos={[]} {...defaultProps} />);
    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    expect(screen.getByText('上のフォームから追加してください')).toBeInTheDocument();
  });

  it('タスクがある場合はすべてのタスクを表示する', () => {
    const todos: Todo[] = [
      makeTodo('1', 'タスク1'),
      makeTodo('2', 'タスク2'),
      makeTodo('3', 'タスク3'),
    ];
    render(<TodoList todos={todos} {...defaultProps} />);
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク3')).toBeInTheDocument();
  });

  it('タスクがある場合は空状態メッセージを表示しない', () => {
    render(<TodoList todos={[makeTodo('1', 'タスク')]} {...defaultProps} />);
    expect(screen.queryByText('タスクがありません')).not.toBeInTheDocument();
  });

  it('タスク数分の TodoItem を描画する', () => {
    const todos = [makeTodo('1', 'タスク1'), makeTodo('2', 'タスク2')];
    render(<TodoList todos={todos} {...defaultProps} />);
    expect(screen.getAllByRole('button', { name: /タスクを完了/ })).toHaveLength(2);
  });
});
