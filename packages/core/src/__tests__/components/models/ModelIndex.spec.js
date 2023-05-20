import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import ModelIndex from 'rhino/components/models/ModelIndex';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';

/* eslint react/display-name: 0, react/prop-types: 0 */
describe('ModelIndex', () => {
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
      />,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
