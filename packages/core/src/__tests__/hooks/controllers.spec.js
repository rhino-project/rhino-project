import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Router } from 'react-router-dom';

import { DEFAULT_SORT, PAGE_SIZE } from 'config';
import {
  useModelCreateContext,
  useModelEditContext,
  useModelIndexContext,
  useModelIndexController,
  useModelShowContext
} from 'rhino/hooks/controllers';

// https://dev.to/alexclaes/test-a-hook-throwing-errors-in-react-18-with-renderhook-from-testing-library-20g8
describe('useModelIndexContext', () => {
  it('throws and error with no context', async () => {
    expect(() =>
      renderHook(() => useModelIndexContext()).toThrow(
        'useModelIndexContext must be used within a ModelIndexProvider'
      )
    );
  });
});

describe('useModelIndexController', () => {
  let testHistory, testLocation;

  const Wrapper = ({ children, ...props }) => {
    const queryClient = new QueryClient();

    return (
      <MemoryRouter {...props}>
        <QueryClientProvider client={queryClient}>
          <Route
            path="*"
            render={({ history, location }) => {
              testHistory = history;
              testLocation = location;
              return null;
            }}
          />
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  // See note at https://testing-library.com/docs/react-testing-library/api#renderhook-options-initialprops
  const createWrapper = (Wrapper, props) => {
    return function CreatedWrapper({ children }) {
      return <Wrapper {...props}>{children}</Wrapper>;
    };
  };

  it('generates default params with no passed in base parameters', () => {
    const { result } = renderHook(
      () => useModelIndexController({ model: 'user' }),
      {
        wrapper: Wrapper
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
        wrapper: Wrapper
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

  it('does not push empty search when search is already empty', () => {
    renderHook(() => useModelIndexController({ model: 'user' }), {
      wrapper: Wrapper,
      initialProps: {
        initialEntries: ['/users']
      }
    });
    expect(testHistory.length).toBe(1);
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
          initialEntries: ['/users?limit=17&offset=20&order=foo&search=bar']
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
        useModelIndexController({ model: 'user', filter: { blog: { id: 1 } } }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/users?filter[blog_post][published]=true']
        })
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
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/users?filter[blog][published]=true']
        })
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

  it('merges nested filters from url with passed in base filter having precedence', async () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({ model: 'user', filter: { blog: { id: 1 } } }),
      {
        wrapper: createWrapper(Wrapper, {
          initialEntries: ['/?filter[blog][published]=true&filter[blog][id]=2']
        })
      }
    );

    await waitFor(() => {
      expect(result.current).toMatchObject({
        filter: { blog: { id: 1, published: 'true' } },
        limit: PAGE_SIZE,
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
        wrapper: Wrapper,
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
        wrapper: Wrapper
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
    expect(() =>
      renderHook(() => useModelShowContext()).toThrow(
        'useModelShowContext must be used within a ModelShowProvider'
      )
    );
  });
});

describe('useModelCreateContext', () => {
  it('throws and error with no context', () => {
    expect(() =>
      renderHook(() => useModelCreateContext()).toThrow(
        'useModelCreateContext must be used within a ModelCreateProvider'
      )
    );
  });
});

describe('useModelEditContext', () => {
  it('throws and error with no context', () => {
    expect(() =>
      renderHook(() => useModelEditContext()).toThrow(
        'useModelEditContext must be used within a ModelEditProvider'
      )
    );
  });
});
