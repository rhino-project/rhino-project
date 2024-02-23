import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ModelIndexCardGrid } from '../../../components/models/ModelIndexCardGrid';
import { ModelIndexSimple } from '../../../components/models/ModelIndexSimple';

describe('ModelIndexCardGrid', () => {
  const Foo = () => <div>Foo</div>;

  const wrapper = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ModelIndexSimple
            model="user"
            fallback={false}
            queryOptions={{ enabled: false }}
          >
            {children}
          </ModelIndexSimple>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  sharedModelTests(ModelIndexCardGrid);

  it(`should allow local overrides`, async () => {
    const { asFragment } = render(
      <ModelIndexCardGrid
        overrides={{
          ModelIndexCard: Foo
        }}
      />,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
