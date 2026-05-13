import { renderHook, act } from '@testing-library/react';
import { useTodos } from '@/hooks/useTodos';
import type { Todo } from '@/types/todo';

const STORAGE_KEY = 'todos-app-data';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 'test-id-1',
  text: 'サンプルタスク',
  completed: false,
  priority: 'medium',
  createdAt: new Date('2026-01-01T10:00:00Z').toISOString(),
  ...overrides,
});

describe('useTodos', () => {
  describe('addTodo', () => {
    it('正しいフィールドでタスクを追加できる', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('牛乳を買う', 'high', '2026-12-01');
      });
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0]).toMatchObject({
        text: '牛乳を買う',
        priority: 'high',
        dueDate: '2026-12-01',
        completed: false,
      });
      expect(result.current.todos[0].id).toBeDefined();
      expect(result.current.todos[0].createdAt).toBeDefined();
    });

    it('テキストの前後の空白をトリムする', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('  タスク  ', 'low');
      });
      expect(result.current.todos[0].text).toBe('タスク');
    });

    it('期日なしで追加できる', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク', 'medium');
      });
      expect(result.current.todos[0].dueDate).toBeUndefined();
    });

    it('最新のタスクが先頭に追加される', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1', 'low');
        result.current.addTodo('タスク2', 'low');
      });
      expect(result.current.todos[0].text).toBe('タスク2');
    });
  });

  describe('toggleTodo', () => {
    it('未完了のタスクを完了にする', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('タスク', 'medium'));
      const id = result.current.todos[0].id;
      act(() => result.current.toggleTodo(id));
      expect(result.current.todos[0].completed).toBe(true);
    });

    it('完了済みのタスクを未完了に戻す', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('タスク', 'medium'));
      const id = result.current.todos[0].id;
      act(() => result.current.toggleTodo(id));
      act(() => result.current.toggleTodo(id));
      expect(result.current.todos[0].completed).toBe(false);
    });

    it('他のタスクに影響を与えない', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1', 'medium');
        result.current.addTodo('タスク2', 'medium');
      });
      const id = result.current.todos[0].id;
      act(() => result.current.toggleTodo(id));
      expect(result.current.todos[1].completed).toBe(false);
    });
  });

  describe('deleteTodo', () => {
    it('指定したタスクを削除する', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('タスク', 'medium'));
      const id = result.current.todos[0].id;
      act(() => result.current.deleteTodo(id));
      expect(result.current.todos).toHaveLength(0);
    });

    it('他のタスクは残る', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1', 'medium');
        result.current.addTodo('タスク2', 'medium');
      });
      const id = result.current.todos[0].id;
      act(() => result.current.deleteTodo(id));
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('タスク1');
    });
  });

  describe('editTodo', () => {
    it('タスクのテキストを更新する', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('古いテキスト', 'medium'));
      const id = result.current.todos[0].id;
      act(() => result.current.editTodo(id, '新しいテキスト'));
      expect(result.current.todos[0].text).toBe('新しいテキスト');
    });

    it('テキストをトリムして保存する', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('タスク', 'medium'));
      const id = result.current.todos[0].id;
      act(() => result.current.editTodo(id, '  トリムされたテキスト  '));
      expect(result.current.todos[0].text).toBe('トリムされたテキスト');
    });
  });

  describe('clearCompleted', () => {
    it('完了済みタスクをすべて削除する', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('完了タスク', 'medium');
        result.current.addTodo('未完了タスク', 'medium');
      });
      // インデックスではなくテキストで特定する（ソート順に依存しない）
      const completedId = result.current.todos.find(t => t.text === '完了タスク')!.id;
      act(() => result.current.toggleTodo(completedId));
      act(() => result.current.clearCompleted());
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('未完了タスク');
    });

    it('完了済みがなければ何もしない', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('タスク', 'medium'));
      act(() => result.current.clearCompleted());
      expect(result.current.todos).toHaveLength(1);
    });
  });

  describe('フィルター', () => {
    it("'all' はすべてのタスクを表示する", () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1', 'medium');
        result.current.addTodo('タスク2', 'medium');
      });
      act(() => result.current.toggleTodo(result.current.todos[0].id));
      act(() => result.current.setFilter('all'));
      expect(result.current.todos).toHaveLength(2);
    });

    it("'active' は未完了タスクのみ表示する", () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1', 'medium');
        result.current.addTodo('タスク2', 'medium');
      });
      act(() => result.current.toggleTodo(result.current.todos[0].id));
      act(() => result.current.setFilter('active'));
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].completed).toBe(false);
    });

    it("'completed' は完了済みタスクのみ表示する", () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1', 'medium');
        result.current.addTodo('タスク2', 'medium');
      });
      act(() => result.current.toggleTodo(result.current.todos[0].id));
      act(() => result.current.setFilter('completed'));
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].completed).toBe(true);
    });
  });

  describe('ソート', () => {
    // タイムスタンプの衝突を避けるため既知の値でlocalStorageを事前設定する
    const seedSortData = () => {
      const todos: Todo[] = [
        { id: 's1', text: '古いタスク', completed: false, priority: 'low',    createdAt: '2026-01-01T00:00:00.000Z' },
        { id: 's2', text: '中間タスク', completed: false, priority: 'medium', createdAt: '2026-03-01T00:00:00.000Z', dueDate: '2026-12-31' },
        { id: 's3', text: '新しいタスク', completed: false, priority: 'high', createdAt: '2026-06-01T00:00:00.000Z', dueDate: '2026-06-01' },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    };

    it("'newest' は作成日時の降順で並ぶ", () => {
      seedSortData();
      const { result } = renderHook(() => useTodos());
      act(() => result.current.setSort('newest'));
      expect(result.current.todos[0].text).toBe('新しいタスク');
      expect(result.current.todos[2].text).toBe('古いタスク');
    });

    it("'oldest' は作成日時の昇順で並ぶ", () => {
      seedSortData();
      const { result } = renderHook(() => useTodos());
      act(() => result.current.setSort('oldest'));
      expect(result.current.todos[0].text).toBe('古いタスク');
      expect(result.current.todos[2].text).toBe('新しいタスク');
    });

    it("'priority' は高・中・低の順で並ぶ", () => {
      seedSortData();
      const { result } = renderHook(() => useTodos());
      act(() => result.current.setSort('priority'));
      expect(result.current.todos[0].text).toBe('新しいタスク'); // high
      expect(result.current.todos[1].text).toBe('中間タスク');   // medium
      expect(result.current.todos[2].text).toBe('古いタスク');   // low
    });

    it("'dueDate' は期日の早い順で並び、期日なしは末尾", () => {
      seedSortData();
      const { result } = renderHook(() => useTodos());
      act(() => result.current.setSort('dueDate'));
      expect(result.current.todos[0].text).toBe('新しいタスク'); // dueDate: 2026-06-01
      expect(result.current.todos[1].text).toBe('中間タスク');   // dueDate: 2026-12-31
      expect(result.current.todos[2].text).toBe('古いタスク');   // dueDate なし
    });
  });

  describe('カウント', () => {
    it('activeCount は未完了タスク数を返す', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1', 'medium');
        result.current.addTodo('タスク2', 'medium');
      });
      act(() => result.current.toggleTodo(result.current.todos[0].id));
      expect(result.current.activeCount).toBe(1);
    });

    it('completedCount は完了済みタスク数を返す', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1', 'medium');
        result.current.addTodo('タスク2', 'medium');
      });
      act(() => result.current.toggleTodo(result.current.todos[0].id));
      expect(result.current.completedCount).toBe(1);
    });

    it('totalCount はすべてのタスク数を返す', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1', 'medium');
        result.current.addTodo('タスク2', 'medium');
        result.current.addTodo('タスク3', 'medium');
      });
      expect(result.current.totalCount).toBe(3);
    });
  });

  describe('localStorage 永続化', () => {
    it('タスクを localStorage に保存する', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('永続化タスク', 'high'));
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toHaveLength(1);
      expect(stored[0].text).toBe('永続化タスク');
    });

    it('初期化時に localStorage からタスクを読み込む', () => {
      const savedTodos: Todo[] = [makeTodo({ text: '保存済みタスク' })];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTodos));
      const { result } = renderHook(() => useTodos());
      expect(result.current.todos[0].text).toBe('保存済みタスク');
    });

    it('localStorage が壊れていてもクラッシュしない', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');
      expect(() => renderHook(() => useTodos())).not.toThrow();
    });
  });
});
