import '@testing-library/jest-dom';

let idCounter = 0;

Object.defineProperty(global, 'crypto', {
  value: { randomUUID: () => `test-id-${++idCounter}` },
  configurable: true,
});

const matchMediaMock = jest.fn();

const matchMediaDefaultImpl = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

beforeEach(() => {
  idCounter = 0;
  localStorage.clear();
  document.documentElement.className = '';
  // 各テスト前にモックをデフォルト実装（dark=false）にリセット
  matchMediaMock.mockImplementation(matchMediaDefaultImpl);
});
