import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import { ModelIndex } from '../../../components/models/ModelIndex';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

describe('ModelIndex', () => {
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
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  sharedModelTests(ModelIndex);

  it(`should allow local overrides`, async () => {
    const { asFragment } = render(
      <ModelIndex
        overrides={{
          ModelIndexHeader: Foo,
          ModelIndexActions: Bar,
          ModelIndexTable: Baz
        }}
        model={{ model: 'user', properties: { name: {} } }}
        path="name"
        fallback={false}
        queryOptions={{ enabled: false }}
      />,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
