import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '@/components/TodoItem';
import type { Todo } from '@/types/todo';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 'test-1',
  text: 'テストタスク',
  completed: false,
  priority: 'medium',
  createdAt: new Date().toISOString(),
  ...overrides,
});

const defaultProps = {
  onToggle: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TodoItem', () => {
  describe('表示', () => {
    it('タスクのテキストが表示される', () => {
      render(<TodoItem todo={makeTodo({ text: '買い物' })} {...defaultProps} />);
      expect(screen.getByText('買い物')).toBeInTheDocument();
    });

    it('優先度「高」のバッジが表示される', () => {
      render(<TodoItem todo={makeTodo({ priority: 'high' })} {...defaultProps} />);
      expect(screen.getByText('高')).toBeInTheDocument();
    });

    it('優先度「中」のバッジが表示される', () => {
      render(<TodoItem todo={makeTodo({ priority: 'medium' })} {...defaultProps} />);
      expect(screen.getByText('中')).toBeInTheDocument();
    });

    it('優先度「低」のバッジが表示される', () => {
      render(<TodoItem todo={makeTodo({ priority: 'low' })} {...defaultProps} />);
      expect(screen.getByText('低')).toBeInTheDocument();
    });

    it('完了時にテキストに取り消し線が付く', () => {
      render(<TodoItem todo={makeTodo({ completed: true })} {...defaultProps} />);
      expect(screen.getByText('テストタスク')).toHaveClass('line-through');
    });

    it('未完了時は取り消し線がない', () => {
      render(<TodoItem todo={makeTodo({ completed: false })} {...defaultProps} />);
      expect(screen.getByText('テストタスク')).not.toHaveClass('line-through');
    });

    it('期日が今日のとき「今日」と表示される', () => {
      render(<TodoItem todo={makeTodo({ dueDate: today })} {...defaultProps} />);
      expect(screen.getByText('今日')).toBeInTheDocument();
    });

    it('期日が明日のとき「明日」と表示される', () => {
      render(<TodoItem todo={makeTodo({ dueDate: tomorrow })} {...defaultProps} />);
      expect(screen.getByText('明日')).toBeInTheDocument();
    });

    it('期限切れのとき「期限切れ:」テキストが含まれる', () => {
      render(<TodoItem todo={makeTodo({ dueDate: yesterday })} {...defaultProps} />);
      expect(screen.getByText(/期限切れ/)).toBeInTheDocument();
    });

    it('完了済みのとき期日は表示されない', () => {
      render(<TodoItem todo={makeTodo({ completed: true, dueDate: today })} {...defaultProps} />);
      expect(screen.queryByText('今日')).not.toBeInTheDocument();
    });
  });

  describe('操作', () => {
    it('チェックボックスをクリックすると onToggle が呼ばれる', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      render(<TodoItem todo={makeTodo()} onToggle={onToggle} onDelete={jest.fn()} onEdit={jest.fn()} />);
      await user.click(screen.getByRole('button', { name: /タスクを完了/ }));
      expect(onToggle).toHaveBeenCalledWith('test-1');
    });

    it('完了済みタスクのチェックボックスをクリックすると onToggle が呼ばれる', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      render(<TodoItem todo={makeTodo({ completed: true })} onToggle={onToggle} onDelete={jest.fn()} onEdit={jest.fn()} />);
      await user.click(screen.getByRole('button', { name: /タスクを未完了/ }));
      expect(onToggle).toHaveBeenCalledWith('test-1');
    });

    it('削除ボタンをクリックすると onDelete が呼ばれる', async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      render(<TodoItem todo={makeTodo()} onToggle={jest.fn()} onDelete={onDelete} onEdit={jest.fn()} />);
      await user.click(screen.getByRole('button', { name: 'タスクを削除' }));
      expect(onDelete).toHaveBeenCalledWith('test-1');
    });
  });

  describe('インライン編集', () => {
    it('テキストをクリックすると編集モードになる', async () => {
      const user = userEvent.setup();
      render(<TodoItem todo={makeTodo({ text: '元のテキスト' })} {...defaultProps} />);
      await user.click(screen.getByText('元のテキスト'));
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('完了済みのテキストをクリックしても編集モードにならない', async () => {
      const user = userEvent.setup();
      render(<TodoItem todo={makeTodo({ completed: true, text: '完了タスク' })} {...defaultProps} />);
      await user.click(screen.getByText('完了タスク'));
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('Enter キーで編集内容が保存され onEdit が呼ばれる', async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      render(<TodoItem todo={makeTodo({ text: '元のテキスト' })} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={onEdit} />);
      await user.click(screen.getByText('元のテキスト'));
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, '新しいテキスト{Enter}');
      expect(onEdit).toHaveBeenCalledWith('test-1', '新しいテキスト');
    });

    it('Escape キーで編集がキャンセルされ onEdit が呼ばれない', async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      render(<TodoItem todo={makeTodo({ text: '元のテキスト' })} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={onEdit} />);
      await user.click(screen.getByText('元のテキスト'));
      await user.type(screen.getByRole('textbox'), '途中の入力{Escape}');
      expect(onEdit).not.toHaveBeenCalled();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('元のテキスト')).toBeInTheDocument();
    });

    it('テキストが変わっていない場合は onEdit が呼ばれない', async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      render(<TodoItem todo={makeTodo({ text: '同じテキスト' })} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={onEdit} />);
      await user.click(screen.getByText('同じテキスト'));
      await user.type(screen.getByRole('textbox'), '{Enter}');
      expect(onEdit).not.toHaveBeenCalled();
    });
  });
});
