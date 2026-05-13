import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/useTheme';

describe('useTheme', () => {
  it('localStorage も system preference もない場合はライトモードで初期化される', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(false);
  });

  it('localStorage に "dark" が保存されている場合はダークモードで初期化される', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(true);
  });

  it('localStorage に "light" が保存されている場合はライトモードで初期化される', () => {
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(false);
  });

  it('system preference が dark の場合はダークモードで初期化される', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(true);
  });

  it('localStorage の値は system preference より優先される', () => {
    localStorage.setItem('theme', 'light');
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(false);
  });

  describe('toggle', () => {
    it('ライトからダークに切り替わる', () => {
      const { result } = renderHook(() => useTheme());
      act(() => result.current.toggle());
      expect(result.current.isDark).toBe(true);
    });

    it('ダークからライトに切り替わる', () => {
      localStorage.setItem('theme', 'dark');
      const { result } = renderHook(() => useTheme());
      act(() => result.current.toggle());
      expect(result.current.isDark).toBe(false);
    });

    it('ダークモードへの切り替え時に localStorage を更新する', () => {
      const { result } = renderHook(() => useTheme());
      act(() => result.current.toggle());
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('ライトモードへの切り替え時に localStorage を更新する', () => {
      localStorage.setItem('theme', 'dark');
      const { result } = renderHook(() => useTheme());
      act(() => result.current.toggle());
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('ダークモードへの切り替え時に documentElement に .dark クラスを追加する', () => {
      const { result } = renderHook(() => useTheme());
      act(() => result.current.toggle());
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('ライトモードへの切り替え時に documentElement から .dark クラスを削除する', () => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      const { result } = renderHook(() => useTheme());
      act(() => result.current.toggle());
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
