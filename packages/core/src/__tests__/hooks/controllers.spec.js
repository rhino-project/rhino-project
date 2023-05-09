import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { DEFAULT_SORT, PAGE_SIZE } from 'config';
import {
  useModelCreateContext,
  useModelEditContext,
  useModelIndexContext,
  useModelIndexController,
  useModelShowContext
} from 'rhino/hooks/controllers';
import { act } from 'react-test-renderer';

describe('useModelIndexContext', () => {
  it('throws and error with no context', () => {
    const { result } = renderHook(() => useModelIndexContext());
    expect(() => result.current).toThrow(
      'useModelIndexContext must be used within a ModelIndexProvider'
    );
  });
});

describe('useModelIndexController', () => {
  const history = createMemoryHistory();
  const wrapper = ({ children, ...props }) => {
    const queryClient = new QueryClient();

    return (
      <MemoryRouter {...props}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  it('generates default params with no passed in base parameters', () => {
    const { result } = renderHook(
      () => useModelIndexController({ model: 'user' }),
      {
        wrapper
      }
    );
    expect(result.current).toMatchObject({
      filter: {},
      limit: PAGE_SIZE,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('generates params with passed in base parameters', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({
          model: 'user',
          filter: { foo: 'bar' },
          limit: PAGE_SIZE - 1,
          offset: 20,
          order: '-foo',
          search: 'baz'
        }),
      {
        wrapper
      }
    );
    expect(result.current).toMatchObject({
      filter: { foo: 'bar' },
      limit: PAGE_SIZE - 1,
      offset: 20,
      order: '-foo',
      search: 'baz'
    });
  });

  it('takes limit, offset, order and search params from url over passed in base parameters', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({
          model: 'user',
          filter: { blog: { id: 1 } },
          limit: 10,
          offset: 30,
          order: 'updated_at',
          search: 'baz'
        }),
      {
        wrapper,
        initialProps: {
          initialEntries: ['/users?limit=17&offset=20&order=foo&search=bar']
        }
      }
    );
    expect(result.current).toMatchObject({
      filter: { blog: { id: 1 } },
      limit: 17,
      offset: 20,
      order: 'foo',
      search: 'bar'
    });
  });

  it('takes filter from url with passed in base filter having precedence', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({ model: 'user', filter: { blog: { id: 1 } } }),
      {
        wrapper,
        initialProps: {
          initialEntries: ['/users?filter[blog_post][published]=true']
        }
      }
    );
    expect(result.current).toMatchObject({
      filter: { blog: { id: 1 }, blog_post: { published: 'true' } },
      limit: PAGE_SIZE,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('merges nested filters from url', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({ model: 'user', filter: { blog: { id: 1 } } }),
      {
        wrapper,
        initialProps: {
          initialEntries: ['/users?filter[blog][published]=true']
        }
      }
    );
    expect(result.current).toMatchObject({
      filter: { blog: { id: 1, published: 'true' } },
      limit: PAGE_SIZE,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('merges nested filters from url with passed in base filter having precedence', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({ model: 'user', filter: { blog: { id: 1 } } }),
      {
        wrapper,
        initialProps: {
          initialEntries: ['/?filter[blog][published]=true&filter[blog][id]=2']
        }
      }
    );
    expect(result.current).toMatchObject({
      filter: { blog: { id: 1, published: 'true' } },
      limit: PAGE_SIZE,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('does not merge from url when syncUrl is false', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({
          model: 'user',
          syncUrl: false
        }),
      {
        wrapper,
        initialProps: {
          initialEntries: [
            '/?filter[blog][published]=true&offset=1&limit=2&search=bar&order=-baz'
          ]
        }
      }
    );
    expect(result.current).toMatchObject({
      filter: {},
      limit: PAGE_SIZE,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('changes offset when setPage is called', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({ model: 'user', filter: { blog: { id: 1 } } }),
      {
        wrapper
      }
    );
    expect(result.current).toMatchObject({
      limit: PAGE_SIZE,
      offset: 0
    });

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current).toMatchObject({
      limit: PAGE_SIZE,
      offset: PAGE_SIZE
    });
  });
});

describe('useModelShowContext', () => {
  it('throws and error with no context', () => {
    const { result } = renderHook(() => useModelShowContext());
    expect(() => result.current).toThrow(
      'useModelShowContext must be used within a ModelShowProvider'
    );
  });
});

describe('useModelCreateContext', () => {
  it('throws and error with no context', () => {
    const { result } = renderHook(() => useModelCreateContext());
    expect(() => result.current).toThrow(
      'useModelCreateContext must be used within a ModelCreateProvider'
    );
  });
});

describe('useModelEditContext', () => {
  it('throws and error with no context', () => {
    const { result } = renderHook(() => useModelEditContext());
    expect(() => result.current).toThrow(
      'useModelEditContext must be used within a ModelEditProvider'
    );
  });
});
