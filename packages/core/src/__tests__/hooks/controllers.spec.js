import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';

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
  const Wrapper = ({ children }) => {
    const queryClient = new QueryClient();

    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('generates default params with no passed in base parameters', () => {
    const { result } = renderHook(
      () => useModelIndexController({ model: 'blog' }),
      {
        wrapper: createWrapper(Wrapper)
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
        wrapper: createWrapper(Wrapper)
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
        wrapper: createWrapper(Wrapper)
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

  it('changes offset when setPage is called', () => {
    const { result } = renderHook(
      () =>
        useModelIndexController({ model: 'user', filter: { blog: { id: 1 } } }),
      {
        wrapper: createWrapper(Wrapper)
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
