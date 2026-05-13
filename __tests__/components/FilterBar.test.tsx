import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '@/components/FilterBar';
import type { FilterType, SortType } from '@/types/todo';

const defaultProps = {
  filter: 'all' as FilterType,
  sort: 'newest' as SortType,
  totalCount: 5,
  activeCount: 3,
  completedCount: 2,
  onFilterChange: jest.fn(),
  onSortChange: jest.fn(),
  onClearCompleted: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('FilterBar', () => {
  describe('フィルタータブ', () => {
    it('「すべて」「未完了」「完了済み」ボタンが表示される', () => {
      render(<FilterBar {...defaultProps} />);
      expect(screen.getByRole('button', { name: /すべて/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^未完了/ })).toBeInTheDocument();
      // "完了済み" は "完了済みを削除" と区別するため完全一致で検索
      expect(screen.getByRole('button', { name: '完了済み' })).toBeInTheDocument();
    });

    it('「すべて」をクリックすると onFilterChange("all") が呼ばれる', async () => {
      const user = userEvent.setup();
      const onFilterChange = jest.fn();
      render(<FilterBar {...defaultProps} onFilterChange={onFilterChange} />);
      await user.click(screen.getByRole('button', { name: /すべて/ }));
      expect(onFilterChange).toHaveBeenCalledWith('all');
    });

    it('「未完了」をクリックすると onFilterChange("active") が呼ばれる', async () => {
      const user = userEvent.setup();
      const onFilterChange = jest.fn();
      render(<FilterBar {...defaultProps} onFilterChange={onFilterChange} />);
      await user.click(screen.getByRole('button', { name: /^未完了/ }));
      expect(onFilterChange).toHaveBeenCalledWith('active');
    });

    it('「完了済み」をクリックすると onFilterChange("completed") が呼ばれる', async () => {
      const user = userEvent.setup();
      const onFilterChange = jest.fn();
      render(<FilterBar {...defaultProps} onFilterChange={onFilterChange} />);
      await user.click(screen.getByRole('button', { name: '完了済み' }));
      expect(onFilterChange).toHaveBeenCalledWith('completed');
    });

    it('activeCount > 0 のとき未完了タブにカウントが表示される', () => {
      render(<FilterBar {...defaultProps} activeCount={3} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('activeCount が 0 のときカウントは表示されない', () => {
      render(<FilterBar {...defaultProps} activeCount={0} />);
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  describe('ソート', () => {
    it('ソートのセレクトボックスが表示される', () => {
      render(<FilterBar {...defaultProps} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('ソートを変更すると onSortChange が呼ばれる', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();
      render(<FilterBar {...defaultProps} onSortChange={onSortChange} />);
      await user.selectOptions(screen.getByRole('combobox'), 'priority');
      expect(onSortChange).toHaveBeenCalledWith('priority');
    });

    it('現在のソート値がセレクトボックスに反映される', () => {
      render(<FilterBar {...defaultProps} sort="oldest" />);
      expect(screen.getByRole('combobox')).toHaveValue('oldest');
    });
  });

  describe('完了済みを削除', () => {
    it('completedCount > 0 のとき削除ボタンが表示される', () => {
      render(<FilterBar {...defaultProps} completedCount={2} />);
      expect(screen.getByText(/完了済みを削除/)).toBeInTheDocument();
    });

    it('completedCount が 0 のとき削除ボタンは表示されない', () => {
      render(<FilterBar {...defaultProps} completedCount={0} />);
      expect(screen.queryByText(/完了済みを削除/)).not.toBeInTheDocument();
    });

    it('削除ボタンをクリックすると onClearCompleted が呼ばれる', async () => {
      const user = userEvent.setup();
      const onClearCompleted = jest.fn();
      render(<FilterBar {...defaultProps} completedCount={2} onClearCompleted={onClearCompleted} />);
      await user.click(screen.getByText(/完了済みを削除/));
      expect(onClearCompleted).toHaveBeenCalledTimes(1);
    });

    it('完了済みの件数がボタンに表示される', () => {
      render(<FilterBar {...defaultProps} completedCount={5} />);
      expect(screen.getByText(/5/)).toBeInTheDocument();
    });
  });
});
