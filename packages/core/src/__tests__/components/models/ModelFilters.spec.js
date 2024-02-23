import ModelFilters from '../../../components/models/ModelFilters';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { createWrapper } from '__tests__/shared/helpers';
import ModelIndexSimple from '../../../components/models/ModelIndexSimple';

describe('ModelFilters', () => {
  const Wrapper = ({ children, ...props }) => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(
      [
        'models-users-index',
        {
          filter: { organization: 1 },
          limit: 100,
          offset: undefined,
          order: undefined,
          search: undefined
        }
      ],
      {
        results: [
          {
            id: 1,
            display_name: 'test'
          },
          {
            id: 2,
            display_name: 'other@example.com'
          }
        ],
        total: 0
      }
    );

    return (
      <MemoryRouter {...props}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route
              path="/:baseOwnerId/*"
              element={
                <ModelIndexSimple
                  model="blog"
                  fallback={false}
                  // queryOptions={{ enabled: false }}
                >
                  {children}
                </ModelIndexSimple>
              }
            />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  sharedModelTests(ModelFilters);

  beforeEach(() => {
    vi.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('resets reference filter defaults', async () => {
    const { asFragment } = render(<ModelFilters paths={['author']} />, {
      wrapper: createWrapper(Wrapper, {
        initialEntries: ['/1/blogs?filter[author][id]=2']
      })
    });
    expect(asFragment()).toMatchSnapshot();

    const authorFilter = screen.getByRole('combobox');
    expect(authorFilter.value).toBe('2');

    fireEvent.click(screen.getByText('Clear all filters'));

    expect(authorFilter.value).toBe('-1');
  });
});
