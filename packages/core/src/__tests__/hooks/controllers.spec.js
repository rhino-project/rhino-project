import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';

import { createWrapper } from '../shared/helpers';
import {
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  createFilteredObject,
  useModelCreateContext,
  useModelEditContext,
  useModelIndexContext,
  useModelIndexController,
  useModelShowContext
} from '../../hooks/controllers';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider
} from '@tanstack/react-router';

// Avoid router errors because jsdom does not support window.scrollTo
window.scrollTo = vi.fn();

vi.mock('../../hooks/owner', () => ({
  useBaseOwnerId: () => 1
}));

// https://dev.to/alexclaes/test-a-hook-throwing-errors-in-react-18-with-renderhook-from-testing-library-20g8
describe('useModelIndexContext', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('throws and error with no context', async () => {
    expect(() => renderHook(() => useModelIndexContext())).toThrow(
      'useModelIndexContext must be used within a ModelIndexProvider'
    );
  });
});

describe('useModelIndexController', () => {
  const Wrapper = ({ children, ...props }) => {
    const queryClient = new QueryClient();
    const history = createMemoryHistory({
      ...props
    });
    const rootRoute = createRootRoute();
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/'
    });
    const ownerRoute = createRoute({
      getParentRoute: () => indexRoute,
      path: '$owner',
      component: () => <div>{children}</div>
    });
    const routeTree = rootRoute.addChildren([
      indexRoute.addChildren([ownerRoute])
    ]);
    const defaultRouter = createRouter({
      routeTree,
      history
    });

    return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={defaultRouter} />
      </QueryClientProvider>
    );
  };

  it('generates default params with no passed in base parameters', () => {
    const { result } = renderHook(
      () => useModelIndexController({ model: 'blog' }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(result.current).toMatchObject({
      defaultState: { filter: { organization: 1 } },
      initialState: { filter: { organization: 1 } },
      filter: {},
      totalFilters: 0,
      fullFilter: { organization: 1 },
      totalFullFilters: 1,
      limit: DEFAULT_LIMIT,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('generates default params with no passed in base parameters and defaultFiltersBaseOwner false', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({
          model: 'blog',
          defaultFiltersBaseOwner: false
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(result.current).not.toMatchObject({
      fullFilter: { organization: 1 }
    });
    expect(result.current).toMatchObject({
      defaultState: { filter: {} },
      initialState: { filter: {} },
      filter: {},
      totalFilters: 0,
      fullFilter: {},
      totalFullFilters: 0,
      limit: DEFAULT_LIMIT,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('generates params with passed in base parameters', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({
          model: 'blog',
          defaultFilter: { organization: 1, foo: 'bar' },
          defaultLimit: DEFAULT_LIMIT - 1,
          defaultOffset: 20,
          defaultOrder: '-foo',
          defaultSearch: 'baz'
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(result.current).toMatchObject({
      defaultState: { filter: { organization: 1, foo: 'bar' } },
      initialState: { filter: { organization: 1, foo: 'bar' } },
      filter: {},
      totalFilters: 0,
      fullFilter: { organization: 1, foo: 'bar' },
      totalFullFilters: 2,
      limit: DEFAULT_LIMIT - 1,
      offset: 20,
      order: '-foo',
      search: 'baz'
    });
  });

  it('does not push empty search when search is already empty', () => {
    renderHook(() => useModelIndexController({ model: 'user' }), {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1/users']
      })
    });
    expect(history.length).toBe(1);
  });

  it('takes limit, offset, order and search params from url over passed in base parameters', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({
          model: 'user',
          defaultFilter: { blog: { id: 1 } },
          limit: 10,
          offset: 30,
          order: 'updated_at',
          search: 'baz'
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1/?limit=17&offset=20&order=foo&search=bar']
        })
      }
    );

    expect(result.current).toMatchObject({
      defaultState: { filter: { blog: { id: 1 } } },
      initialState: {
        filter: { blog: { id: 1 } },
        limit: 17,
        offset: 20,
        order: 'foo',
        search: 'bar'
      },
      filter: {},
      totalFilters: 0,
      fullFilter: { blog: { id: 1 } },
      totalFullFilters: 1,
      limit: 17,
      offset: 20,
      order: 'foo',
      search: 'bar'
    });
  });

  it('takes filter from url with passed in base filter having precedence', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({
          model: 'user',
          defaultFilter: { blog: { id: 1 } }
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1/?filter=%7B"blog"%3A%7B"id"%3A"2"%7D%7D']
        })
      }
    );
    expect(result.current).toMatchObject({
      defaultState: { filter: { blog: { id: 1 } } },
      initialState: { filter: { blog: { id: 1 } } },
      filter: {},
      totalFilters: 0,
      fullFilter: { blog: { id: 1 } },
      totalFullFilters: 1,
      limit: DEFAULT_LIMIT,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('merges nested filters from url', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({
          model: 'user',
          defaultFilter: { blog: { id: 1 } }
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1/?filter=%7B"blog"%3A%7B"published"%3Atrue%7D%7D']
        })
      }
    );
    expect(result.current).toMatchObject({
      defaultState: { filter: { blog: { id: 1 } } },
      initialState: { filter: { blog: { id: 1, published: true } } },
      filter: { blog: { published: true } },
      totalFilters: 1,
      fullFilter: { blog: { id: 1, published: true } },
      totalFullFilters: 2,
      limit: DEFAULT_LIMIT,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('merges nested filters from url with passed in base filter having precedence', async () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({
          model: 'user',
          defaultFilter: { blog: { id: 1 } }
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: [
            '/1/?filter=%7B"blog"%3A%7B"published"%3Atrue%2C"id"%3A2%7D%7D'
          ]
        })
      }
    );

    await waitFor(() => {
      expect(result.current).toMatchObject({
        defaultState: { filter: { blog: { id: 1 } } },
        initialState: { filter: { blog: { id: 1, published: true } } },
        filter: { blog: { published: true } },
        totalFilters: 1,
        fullFilter: { blog: { id: 1, published: true } },
        totalFullFilters: 2,
        limit: DEFAULT_LIMIT,
        offset: 0,
        order: DEFAULT_SORT,
        search: ''
      });
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
        wrapper: createWrapper(Wrapper, {
          initialEntries: [
            '/1/?filter[blog][published]=true&offset=1&limit=2&search=bar&order=-baz'
          ]
        })
      }
    );
    expect(result.current).toMatchObject({
      defaultState: { filter: {} },
      initialState: { filter: {} },
      filter: {},
      totalFilters: 0,
      fullFilter: {},
      totalFullFilters: 0,
      limit: DEFAULT_LIMIT,
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
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(result.current).toMatchObject({
      limit: DEFAULT_LIMIT,
      offset: 0
    });

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current).toMatchObject({
      limit: DEFAULT_LIMIT,
      offset: DEFAULT_LIMIT
    });
  });
});

describe('useModelShowContext', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('throws and error with no context', () => {
    expect(() => renderHook(() => useModelShowContext())).toThrow(
      'useModelShowContext must be used within a ModelShowProvider'
    );
  });
});

describe('useModelCreateContext', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('throws and error with no context', () => {
    expect(() => renderHook(() => useModelCreateContext())).toThrow(
      'useModelCreateContext must be used within a ModelCreateProvider'
    );
  });
});

describe('useModelEditContext', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('throws and error with no context', () => {
    expect(() => renderHook(() => useModelEditContext())).toThrow(
      'useModelEditContext must be used within a ModelEditProvider'
    );
  });
});

describe('createFilteredObject', () => {
  it('preserves defined properties', async () => {
    expect(createFilteredObject({ foo: 'bar' })).toEqual({ foo: 'bar' });
  });

  it('preserves array properties', async () => {
    expect(createFilteredObject({ foo: ['a', 'b'] })).toEqual({
      foo: ['a', 'b']
    });
  });

  it('remove null properties', async () => {
    expect(createFilteredObject({ foo: null })).toEqual({});
  });

  it('remove undefined properties', async () => {
    expect(createFilteredObject({ foo: undefined })).toEqual({});
  });
});
