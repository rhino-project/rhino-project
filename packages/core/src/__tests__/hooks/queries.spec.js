import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '__tests__/shared/helpers';
import {
  useModelCreate,
  useModelDelete,
  useModelIndex,
  useModelInvalidateIndex,
  useModelInvalidateShow,
  useModelKey,
  useModelKeyIndex,
  useModelKeyShow,
  useModelShow,
  useModelUpdate
} from 'rhino/hooks/queries';
import * as network from '../../../rhino/lib/networking';

const testQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    },
    logger: {
      error: () => {}
    }
  });

const abortFn = vi.fn();

global.AbortController = vi.fn(() => ({
  abort: abortFn
}));

const MODEL_INDEX_KEY = 'models-users-index';
const MODEL_SHOW_KEY = 'models-users-show';
const MODEL_TEST_KEYS = ['test-key1', 'test-key2'];

const Wrapper = ({ children, ...props }) => (
  <QueryClientProvider {...props}>{children}</QueryClientProvider>
);

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
    queryClient = testQueryClient();
    queryClient.invalidateQueries = vi.fn();
  });

  test('generates invalidation function', () => {
    const {
      result: {
        current: { invalidate }
      }
    } = renderHook(() => useModelInvalidateIndex('user'), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
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
      wrapper: createWrapper(Wrapper, { client: queryClient })
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
    queryClient = testQueryClient();
    queryClient.invalidateQueries = vi.fn();
  });

  test('generates invalidation function', () => {
    const {
      result: {
        current: { invalidate }
      }
    } = renderHook(() => useModelInvalidateShow('user'), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
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
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    invalidate(1);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([
      MODEL_SHOW_KEY,
      '1',
      ...MODEL_TEST_KEYS
    ]);
  });
});

describe('useModelCreate', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = testQueryClient();

    vi.spyOn(network, 'networkApiCall').mockReturnValue({
      data: { id: 10, test: 'bar' }
    });
  });

  test('selects axios data correctly and provides legacy support', async () => {
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useModelCreate('user'), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    result.current.mutate({ test: 'foo' }, { onSuccess });
    await waitFor(() => result.current.isSuccess);

    // Backwards compat support
    console.warn = vi.fn();
    expect(result.current.data.data).toEqual({ id: 10, test: 'bar' });
    expect(console.warn).toHaveBeenCalledWith(
      'Legacy data access used in query hooks'
    );

    // Callback is called with the data from the network call
    expect(onSuccess).toHaveBeenCalledWith(
      { id: 10, test: 'bar' },
      { test: 'foo' },
      undefined
    );
  });
});

describe('useModelUpdate', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = testQueryClient();

    vi.spyOn(network, 'networkApiCall').mockReturnValue({
      data: { id: 6, test: 'bar' }
    });
  });

  test('selects axios data correctly and provides legacy support', async () => {
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useModelUpdate('user'), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    act(() => result.current.mutate({ id: 6, test: 'foo' }, { onSuccess }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Backwards compat support
    console.warn = vi.fn();
    expect(result.current.data.data).toEqual({ id: 6, test: 'bar' });
    expect(console.warn).toHaveBeenCalledWith(
      'Legacy data access used in query hooks'
    );

    // Callback is called with the data from the network call
    expect(onSuccess).toHaveBeenCalledWith(
      { id: 6, test: 'bar' },
      { id: 6, test: 'foo' },
      undefined
    );
  });
});

describe('useModelDelete', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = testQueryClient();

    vi.spyOn(network, 'networkApiCall').mockReturnValue({
      data: { test: 'test' }
    });
  });

  test('selects axios data correctly and provides legacy support', async () => {
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useModelDelete('user'), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    result.current.mutate(6, { onSuccess });
    await waitFor(() => result.current.isSuccess);

    // Backwards compat support
    console.warn = vi.fn();
    expect(result.current.data.data).toEqual({ test: 'test' });
    expect(console.warn).toHaveBeenCalledWith(
      'Legacy data access used in query hooks'
    );

    // Callback is called with the data from the network call
    expect(onSuccess).toHaveBeenCalledWith({ test: 'test' }, 6, undefined);
  });
});

describe('useModelShow', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = testQueryClient();

    vi.spyOn(network, 'networkApiCall').mockReturnValue({
      data: { test: 'test' }
    });
  });

  test('selects axios data correctly and provides legacy support', async () => {
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () => useModelShow('user', 1, { queryOptions: { onSuccess } }),
      {
        wrapper: createWrapper(Wrapper, { client: queryClient })
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ test: 'test' });

    // Backwards compat support
    console.warn = vi.fn();
    expect(result.current.data.data).toEqual({ test: 'test' });
    expect(console.warn).toHaveBeenCalledWith(
      'Legacy data access used in query hooks'
    );
    expect(onSuccess).toHaveBeenCalledWith({ test: 'test' });
  });
});

describe('useModelIndex', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = testQueryClient();

    vi.spyOn(network, 'networkApiCall').mockReturnValue({
      data: { test: 'test' }
    });
  });

  test('sets default non-legacy params', () => {
    renderHook(() => useModelIndex('user'), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    expect(network.networkApiCall).toHaveBeenCalledWith('/api/users', {});
  });

  test('inserts search, filter, order, limit, offset correctly', () => {
    const options = {
      search: 'test',
      filter: { test: 'test' },
      order: 'updated_at',
      limit: 10,
      offset: 10
    };
    renderHook(() => useModelIndex('user', options), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    expect(network.networkApiCall).toHaveBeenCalledWith('/api/users', {
      params: {
        ...options
      }
    });
  });

  test('does not insert search, filter, order, limit, offset as undefined when not passed', () => {
    renderHook(() => useModelIndex('user', {}), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    expect(network.networkApiCall).toHaveBeenCalledWith('/api/users', {});
  });

  test('sets search, filter, order, limit, offset to falsey values when passed', () => {
    const options = {
      search: null,
      filter: null,
      order: null,
      limit: 0,
      offset: 0
    };

    renderHook(() => useModelIndex('user', options), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    expect(network.networkApiCall).toHaveBeenCalledWith('/api/users', {
      params: {
        ...options
      }
    });
  });

  test('sets search, filter, order, limit, offset to undefined when passed', () => {
    const options = {
      search: undefined,
      filter: undefined,
      order: undefined,
      limit: undefined,
      offset: undefined
    };

    renderHook(() => useModelIndex('user', options), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    expect(network.networkApiCall).toHaveBeenCalledWith('/api/users', {
      params: {
        ...options
      }
    });
  });

  test('supports legacy params option', () => {
    const options = {
      params: {
        search: 'test',
        filter: { test: 'test' },
        order: 'updated_at',
        limit: 10,
        offset: 10
      }
    };
    renderHook(() => useModelIndex('user', options), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    expect(network.networkApiCall).toHaveBeenCalledWith('/api/users', {
      params: {
        ...options.params
      }
    });
  });

  test('selects axios data correctly and provides legacy support', async () => {
    const options = {
      search: 'test',
      filter: { test: 'test' },
      order: 'updated_at',
      limit: 10,
      offset: 10
    };
    const { result } = renderHook(() => useModelIndex('user', options), {
      wrapper: createWrapper(Wrapper, { client: queryClient })
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ test: 'test' });

    // Backwards compat support
    console.warn = vi.fn();
    expect(result.current.data.data).toEqual({ test: 'test' });
    expect(console.warn).toHaveBeenCalledWith(
      'Legacy data access used in query hooks'
    );
  });
});
