import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import ModelIndexCardGrid from 'rhino/components/models/ModelIndexCardGrid';
import ModelIndexSimple from 'rhino/components/models/ModelIndexSimple';
import rhinoConfig from '../../../../rhino.config';

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
    const configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({});

    const { asFragment } = render(
      <ModelIndexCardGrid
        overrides={{
          ModelIndexCard: Foo
        }}
      />,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();

    configSpy.mockRestore();
  });
});
