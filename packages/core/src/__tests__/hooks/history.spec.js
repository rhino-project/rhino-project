import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';

import { useSearchParams } from 'rhino/hooks/history';
import { MemoryRouter } from 'react-router-dom';
import { DEFAULT_SORT, PAGE_SIZE } from 'config';

describe('useSearchParams', () => {
  const history = createMemoryHistory();
  const wrapper = ({ children, ...props }) => (
    <MemoryRouter {...props}>{children}</MemoryRouter>
  );

  it('generates default params with no baseFilter', () => {
    const { result } = renderHook(() => useSearchParams(), {
      wrapper
    });
    expect(result.current[0]).toEqual({
      filter: {},
      limit: PAGE_SIZE,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('generates default params with baseFilter', () => {
    const { result } = renderHook(
      () =>
        useSearchParams({
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
    expect(result.current[0]).toEqual({
      filter: { foo: 'bar' },
      limit: PAGE_SIZE - 1,
      offset: 20,
      order: '-foo',
      search: 'baz'
    });
  });

  it('takes limit, offset, order and search params from url over baseFilter', () => {
    const { result } = renderHook(
      () =>
        useSearchParams({
          filter: { blog: { id: 1 } },
          limit: 10,
          offset: 30,
          order: 'updated_at',
          search: 'baz'
        }),
      {
        wrapper,
        initialProps: {
          initialEntries: ['/?limit=17&offset=20&order=foo&search=bar']
        }
      }
    );
    expect(result.current[0]).toEqual({
      filter: { blog: { id: 1 } },
      limit: 17,
      offset: 20,
      order: 'foo',
      search: 'bar'
    });
  });

  it('takes filter from url with baseFilter precedence', () => {
    const { result } = renderHook(
      () => useSearchParams({ filter: { blog: { id: 1 } } }),
      {
        wrapper,
        initialProps: {
          initialEntries: ['/?filter[blog_post][published]=true']
        }
      }
    );
    expect(result.current[0]).toEqual({
      filter: { blog: { id: 1 }, blog_post: { published: 'true' } },
      limit: PAGE_SIZE,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('merges nested filters from url with baseFilter', () => {
    const { result } = renderHook(
      () => useSearchParams({ filter: { blog: { id: 1 } } }),
      {
        wrapper,
        initialProps: {
          initialEntries: ['/?filter[blog][published]=true']
        }
      }
    );
    expect(result.current[0]).toEqual({
      filter: { blog: { id: 1, published: 'true' } },
      limit: PAGE_SIZE,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });

  it('merges nested filters from url with baseFilter having precedence', () => {
    const { result } = renderHook(
      () => useSearchParams({ filter: { blog: { id: 1 } } }),
      {
        wrapper,
        initialProps: {
          initialEntries: ['/?filter[blog][published]=true&filter[blog][id]=2']
        }
      }
    );
    expect(result.current[0]).toEqual({
      filter: { blog: { id: 1, published: 'true' } },
      limit: PAGE_SIZE,
      offset: 0,
      order: DEFAULT_SORT,
      search: ''
    });
  });
});
