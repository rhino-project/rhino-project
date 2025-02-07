import { render } from '@testing-library/react';
import { sharedModelTests } from './sharedModelTests';
import { ModelEdit } from '../../../components/models/ModelEdit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('ModelEdit', () => {
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
        model="user"
        path="name"
        fallback={false}
      />,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
