import ModelCreate from 'rhino/components/models/ModelCreate';
import { sharedModelTests } from './sharedModelTests';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as modelUtils from 'rhino/utils/models';

// Create controller looks for a valid parent model
jest.spyOn(modelUtils, 'getParentModel').mockReturnValue({ model: 'another' });

/* eslint react/display-name: 0, react/prop-types: 0 */
describe('ModelCreate', () => {
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

  sharedModelTests(ModelCreate);

  it(`should allow local overrides`, async () => {
    const { asFragment } = render(
      <ModelCreate
        overrides={{
          ModelCreateHeader: Foo,
          ModelCreateForm: Bar,
          ModelCreateActions: Baz
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
