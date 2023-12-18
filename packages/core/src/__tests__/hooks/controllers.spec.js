import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { createWrapper } from '__tests__/shared/helpers';
import {
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  useModelCreateContext,
  useModelEditContext,
  useModelIndexContext,
  useModelIndexController,
  useModelShowContext
} from 'rhino/hooks/controllers';

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

    return (
      <MemoryRouter {...props}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/:baseOwnerId/*" element={<>{children}</>} />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>
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
      filter: { organization: 1 },
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
      filter: { organization: 1 }
    });
    expect(result.current).toMatchObject({
      filter: {},
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
          filter: { organization: 1, foo: 'bar' },
          limit: DEFAULT_LIMIT - 1,
          offset: 20,
          order: '-foo',
          search: 'baz'
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1']
        })
      }
    );
    expect(result.current).toMatchObject({
      filter: { organization: 1, foo: 'bar' },
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
          filter: { blog: { id: 1 } },
          limit: 10,
          offset: 30,
          order: 'updated_at',
          search: 'baz'
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1/users?limit=17&offset=20&order=foo&search=bar']
        })
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
        useModelIndexController({
          model: 'user',
          filter: { blog: { id: 1 } }
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1/users?filter[blog_post][published]=true']
        })
      }
    );
    expect(result.current).toMatchObject({
      filter: { blog: { id: 1 }, blog_post: { published: 'true' } },
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
          filter: { blog: { id: 1 } }
        }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/1/users?filter[blog][published]=true']
        })
      }
    );
    expect(result.current).toMatchObject({
      filter: { blog: { id: 1, published: 'true' } },
      limit: DEFAULT_LIMIT,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('merges nested filters from url with passed in base filter having precedence', async () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({ model: 'user', filter: { blog: { id: 1 } } }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: [
            '/1/?filter[blog][published]=true&filter[blog][id]=2'
          ]
        })
      }
    );

    await waitFor(() => {
      expect(result.current).toMatchObject({
        filter: { blog: { id: 1, published: 'true' } },
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
      filter: {},
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
