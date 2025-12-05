import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

import { createWrapper } from '../../shared/helpers';
import * as hooks from '@rhino-project/core/hooks';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider
} from '@tanstack/react-router';
import { ModelIndexSimple } from '../../../components/models';

// Avoid router errors because jsdom does not support window.scrollTo
window.scrollTo = vi.fn();

vi.mock(import('@rhino-project/core/hooks'), async (importOriginal) => {
  const mod = await importOriginal(); // type is inferred
  return {
    ...mod,
    useBaseOwnerId: () => 1
  };
});

describe('ModelIndexSimple', () => {
  let spy;

  const Wrapper = ({ children, initialEntries, ...props }) => {
    const queryClient = new QueryClient();
    const history = createMemoryHistory({
      initialEntries
    });
    const rootRoute = createRootRoute();
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/'
    });
    const ownerRoute = createRoute({
      getParentRoute: () => indexRoute,
      path: '$owner'
    });
    const modelRoute = createRoute({
      getParentRoute: () => ownerRoute,
      path: '$model',
      component: () => (
        <div>
          <ModelIndexSimple syncUrl {...props}>
            {children}
          </ModelIndexSimple>
        </div>
      )
    });
    const routeTree = rootRoute.addChildren([
      indexRoute.addChildren([ownerRoute.addChildren([modelRoute])])
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

  beforeEach(() => {
    spy = vi.spyOn(hooks, 'useModelIndexController');
  });

  afterEach(() => {
    spy.mockClear();
  });

  it('does not push empty search when search is already empty', () => {
    render(<></>, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1/users'],
        model: 'user'
      })
    });

    expect(history.length).toBe(1);
  });

  it('takes limit, offset, order and search params from url over passed in base parameters', () => {
    render(<></>, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1/users?limit=17&offset=20&order=foo&search=bar'],
        model: 'user',
        defaultFilter: { blog: { id: 1 } },
        limit: 10,
        offset: 30,
        order: 'updated_at',
        search: 'baz'
      })
    });

    expect(spy.mock.results[0].value).toMatchObject({
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
      limit: 17
    });
  });

  it('takes filter from url with passed in base filter having precedence', () => {
    render(<></>, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1/users?filter=%7B"blog"%3A%7B"id"%3A"2"%7D%7D'],
        model: 'user',
        defaultFilter: { blog: { id: 1 } }
      })
    });

    expect(spy.mock.results[0].value).toMatchObject({
      defaultState: { filter: { blog: { id: 1 } } },
      initialState: { filter: { blog: { id: 1 } } },
      filter: {},
      totalFilters: 0,
      fullFilter: { blog: { id: 1 } },
      totalFullFilters: 1,
      limit: hooks.DEFAULT_LIMIT,
      offset: 0,
      order: hooks.DEFAULT_SORT,
      search: ''
    });
  });

  it('merges nested filters from url', () => {
    render(<></>, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: [
          '/1/users?filter=%7B"blog"%3A%7B"published"%3Atrue%7D%7D'
        ],
        model: 'user',
        defaultFilter: { blog: { id: 1 } }
      })
    });
    expect(spy.mock.results[0].value).toMatchObject({
      defaultState: { filter: { blog: { id: 1 } } },
      initialState: { filter: { blog: { id: 1, published: true } } },
      filter: { blog: { published: true } },
      totalFilters: 1,
      fullFilter: { blog: { id: 1, published: true } },
      totalFullFilters: 2,
      limit: hooks.DEFAULT_LIMIT,
      offset: 0,
      order: hooks.DEFAULT_SORT,
      search: ''
    });
  });

  it('merges nested filters from url with passed in base filter having precedence', async () => {
    render(<></>, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: [
          '/1/users?filter=%7B"blog"%3A%7B"published"%3Atrue%2C"id"%3A2%7D%7D'
        ],
        model: 'user',
        defaultFilter: { blog: { id: 1 } }
      })
    });

    expect(spy.mock.results[0].value).toMatchObject({
      defaultState: { filter: { blog: { id: 1 } } },
      initialState: { filter: { blog: { id: 1, published: true } } },
      filter: { blog: { published: true } },
      totalFilters: 1,
      fullFilter: { blog: { id: 1, published: true } },
      totalFullFilters: 2,
      limit: hooks.DEFAULT_LIMIT,
      offset: 0,
      order: hooks.DEFAULT_SORT,
      search: ''
    });
  });

  it('does not merge from url when syncUrl is false', () => {
    render(<></>, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: [
          '/1/users?filter[blog][published]=true&offset=1&limit=2&search=bar&order=-baz'
        ],
        model: 'user',
        syncUrl: false
      })
    });

    expect(spy.mock.results[0].value).toMatchObject({
      defaultState: { filter: {} },
      initialState: { filter: {} },
      filter: {},
      totalFilters: 0,
      fullFilter: {},
      totalFullFilters: 0,
      limit: hooks.DEFAULT_LIMIT,
      offset: 0,
      order: hooks.DEFAULT_SORT,
      search: ''
    });
  });
});
