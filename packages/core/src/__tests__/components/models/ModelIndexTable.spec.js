import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import ModelIndexTable from 'rhino/components/models/ModelIndexTable';
import ModelIndexSimple from 'rhino/components/models/ModelIndexSimple';
import modelLoader from 'rhino/models';
import api from '__tests__/shared/modelFixtures';
import rhinoConfig from '../../../../rhino.config';

vi.spyOn(modelLoader, 'api', 'get').mockReturnValue(api);

describe('ModelIndexTable', () => {
  const Foo = () => <div>Foo</div>;
  const Bar = () => <div>Bar</div>;
  const Baz = () => <div>Baz</div>;

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
          <ModelIndexSimple model="user" fallback={false}>
            {children}
          </ModelIndexSimple>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  sharedModelTests(ModelIndexTable);

  it(`should allow local overrides`, async () => {
    const configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({});

    const { asFragment } = render(
      <ModelIndexTable
        overrides={{
          ModelHeader: Foo,
          ModelCell: Bar,
          ModelFooter: Baz
        }}
      />,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();

    configSpy.mockRestore();
  });
});
