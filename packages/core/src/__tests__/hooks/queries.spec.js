import { renderHook } from '@testing-library/react-hooks/dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useModelInvalidateShow } from 'rhino/hooks/queries';
import {
  useModelInvalidateIndex,
  useModelKey,
  useModelKeyIndex,
  useModelKeyShow
} from 'rhino/hooks/queries';

jest.mock('rhino/models', () => {
  const api = require('../../shared/modelFixtures');
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('rhino/models');

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    default: {
      api: {
        ...api.default
      }
    }
  };
});

const MODEL_INDEX_KEY = 'models-users-index';
const MODEL_SHOW_KEY = 'models-users-show';
const MODEL_TEST_KEYS = ['test-key1', 'test-key2'];

const wrapper = (queryClient) => {
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useModelKey', () => {
  test('generates model key for index action', () => {
    const { result } = renderHook(() => useModelKey('user', 'index'));
    expect(result.current).toEqual([MODEL_INDEX_KEY]);
  });

  test('generates model key for show action', () => {
    const { result } = renderHook(() => useModelKey('user', 'show'));
    expect(result.current).toEqual([MODEL_SHOW_KEY]);
  });

  test('generates model key with extra keys', () => {
    const { result } = renderHook(() =>
      useModelKey('user', 'index', MODEL_TEST_KEYS)
    );
    expect(result.current).toEqual([MODEL_INDEX_KEY, ...MODEL_TEST_KEYS]);
  });
});

describe('useModelKeyIndex', () => {
  test('generates model key', () => {
    const { result } = renderHook(() => useModelKeyIndex('user'));
    expect(result.current).toEqual([MODEL_INDEX_KEY]);
  });

  test('generates model key with extra keys', () => {
    const { result } = renderHook(() =>
      useModelKeyIndex('user', MODEL_TEST_KEYS)
    );
    expect(result.current).toEqual([MODEL_INDEX_KEY, ...MODEL_TEST_KEYS]);
  });
});

describe('useModelKeyShow', () => {
  test('generates model key', () => {
    const { result } = renderHook(() => useModelKeyShow('user', 1));

    expect(result.current).toEqual([MODEL_SHOW_KEY, '1']);
  });

  test('generates model key with extra keys', () => {
    const { result } = renderHook(() =>
      useModelKeyShow('user', 1, MODEL_TEST_KEYS)
    );
    expect(result.current).toEqual([MODEL_SHOW_KEY, '1', ...MODEL_TEST_KEYS]);
  });
});

describe('useModelInvalidateIndex', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    queryClient.invalidateQueries = jest.fn();
  });

  test('generates invalidation function', () => {
    const {
      result: {
        current: { invalidate }
      }
    } = renderHook(() => useModelInvalidateIndex('user'), {
      wrapper: wrapper(queryClient)
    });

    invalidate();

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([
      MODEL_INDEX_KEY
    ]);
  });

  test('generates invalidation function with extra keys', () => {
    const {
      result: {
        current: { invalidate }
      }
    } = renderHook(() => useModelInvalidateIndex('user', MODEL_TEST_KEYS), {
      wrapper: wrapper(queryClient)
    });

    invalidate();

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([
      MODEL_INDEX_KEY,
      ...MODEL_TEST_KEYS
    ]);
  });
});

describe('useModelInvalidateShow', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    queryClient.invalidateQueries = jest.fn();
  });

  test('generates invalidation function', () => {
    const {
      result: {
        current: { invalidate }
      }
    } = renderHook(() => useModelInvalidateShow('user'), {
      wrapper: wrapper(queryClient)
    });

    invalidate(1);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([
      MODEL_SHOW_KEY,
      '1'
    ]);
  });

  test('generates invalidation function with extra keys', () => {
    const {
      result: {
        current: { invalidate }
      }
    } = renderHook(() => useModelInvalidateShow('user', MODEL_TEST_KEYS), {
      wrapper: wrapper(queryClient)
    });

    invalidate(1);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([
      MODEL_SHOW_KEY,
      '1',
      ...MODEL_TEST_KEYS
    ]);
  });
});
