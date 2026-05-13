import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddTodoForm } from '@/components/AddTodoForm';

describe('AddTodoForm', () => {
  it('入力フォームと追加ボタンが表示される', () => {
    render(<AddTodoForm onAdd={jest.fn()} />);
    expect(screen.getByPlaceholderText('新しいタスクを入力...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });

  it('入力が空のとき追加ボタンは disabled', () => {
    render(<AddTodoForm onAdd={jest.fn()} />);
    expect(screen.getByRole('button', { name: '追加' })).toBeDisabled();
  });

  it('入力があれば追加ボタンは enabled', async () => {
    const user = userEvent.setup();
    render(<AddTodoForm onAdd={jest.fn()} />);
    await user.type(screen.getByPlaceholderText('新しいタスクを入力...'), 'タスク');
    expect(screen.getByRole('button', { name: '追加' })).toBeEnabled();
  });

  it('フォーム送信で onAdd が正しい引数で呼ばれる', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    await user.type(screen.getByPlaceholderText('新しいタスクを入力...'), '牛乳を買う');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith('牛乳を買う', 'medium', undefined);
  });

  it('送信後に入力フィールドがクリアされる', async () => {
    const user = userEvent.setup();
    render(<AddTodoForm onAdd={jest.fn()} />);
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    await user.type(input, 'タスク');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(input).toHaveValue('');
  });

  it('Enter キーで送信できる', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    await user.type(input, 'タスク{Enter}');
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('空白のみのテキストでは onAdd が呼ばれない', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    await user.type(screen.getByPlaceholderText('新しいタスクを入力...'), '   ');
    fireEvent.submit(screen.getByRole('button', { name: '追加' }).closest('form')!);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('フォーカス時に優先度と期日のオプションが表示される', async () => {
    const user = userEvent.setup();
    render(<AddTodoForm onAdd={jest.fn()} />);
    await user.click(screen.getByPlaceholderText('新しいタスクを入力...'));
    expect(screen.getByText('優先度:')).toBeInTheDocument();
    expect(screen.getByText('期日:')).toBeInTheDocument();
  });

  it('優先度「高」を選択して送信すると onAdd に high が渡される', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    await user.click(input);
    await user.click(screen.getByRole('button', { name: '高' }));
    await user.type(input, 'タスク');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith('タスク', 'high', undefined);
  });

  it('優先度「低」を選択して送信すると onAdd に low が渡される', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    await user.click(input);
    await user.click(screen.getByRole('button', { name: '低' }));
    await user.type(input, 'タスク');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith('タスク', 'low', undefined);
  });

  it('期日を入力して送信すると onAdd に dueDate が渡される', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    const { container } = render(<AddTodoForm onAdd={onAdd} />);
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    await user.click(input);
    // テキスト入力と期日入力が両方 value="" のため type="date" で特定する
    const dateInput = container.querySelector('input[type="date"]')!;
    fireEvent.change(dateInput, { target: { value: '2026-12-01' } });
    await user.type(input, 'タスク');
    await user.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith('タスク', 'medium', '2026-12-01');
  });
});
