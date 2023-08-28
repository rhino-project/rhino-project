import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import ModelEdit from 'rhino/components/models/ModelEdit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* eslint react/display-name: 0, react/prop-types: 0 */
describe('ModelEdit', () => {
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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  sharedModelTests(ModelEdit);

  it(`should allow local overrides`, async () => {
    const { asFragment } = render(
      <ModelEdit
        overrides={{
          ModelEditHeader: Foo,
          ModelEditForm: Bar,
          ModelEditActions: Baz
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
