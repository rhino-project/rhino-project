import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ModelIndexTable } from '../../../components/models/ModelIndexTable';
import { ModelIndexSimple } from '../../../components/models/ModelIndexSimple';

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

  sharedModelTests(ModelIndexTable);

  it(`should allow local overrides`, async () => {
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
  });

  it(`should allow local overrides of Table`, async () => {
    const { asFragment } = render(
      <ModelIndexTable
        overrides={{
          Table: Foo
        }}
      />,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
