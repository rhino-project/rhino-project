import ModelShow from 'rhino/components/models/ModelShow';
import { sharedModelTests } from './sharedModelTests';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as network from 'rhino/lib/networking';

vi.spyOn(network, 'networkApiCall').mockReturnValue({
  data: {
    test: 'test'
  }
});

describe('ModelShow', () => {
  const Foo = (props) => <div>Foo</div>;
  const Bar = (props) => <div>Bar</div>;
  const Baz = (props) => <div>Baz</div>;
  const Foz = (props) => <div>Foz</div>;

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

  sharedModelTests(ModelShow);

  it(`should allow local overrides`, async () => {
    const { asFragment } = render(
      <ModelShow
        overrides={{
          ModelShowHeader: Foo,
          ModelShowActions: Baz,
          ModelShowDescription: Bar,
          ModelShowRelated: Foz
        }}
        model={{ model: 'user', properties: { name: {} } }}
        modelId="1"
        path="name"
        fallback={false}
      />,
      { wrapper }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
