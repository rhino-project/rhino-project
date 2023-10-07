import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import ModelIndexTable from 'rhino/components/models/ModelIndexTable';
import ModelIndexSimple from 'rhino/components/models/ModelIndexSimple';

describe('ModelIndexTable', () => {
  const Foo = (props) => <div>Foo</div>;
  const Bar = (props) => <div>Bar</div>;
  const Baz = (props) => <div>Baz</div>;

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
});
