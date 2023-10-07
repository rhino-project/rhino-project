import ModelShow from 'rhino/components/models/ModelShow';
import { sharedModelTests } from './sharedModelTests';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as network from 'rhino/lib/networking';
import rhinoConfig from 'rhino.config';

vi.spyOn(network, 'networkApiCall').mockReturnValue({
  data: {
    test: 'test'
  }
});

/* eslint react/display-name: 0, react/prop-types: 0 */
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

  describe('local overrides', () => {
    let configSpy;

    beforeEach(() => {
      configSpy = vi.spyOn(rhinoConfig, 'components', 'get').mockReturnValue({
        ModelShowHeader: null,
        ModelShowActions: {
          props: {
            paths: ['title', 'category']
          }
        },
        ModelShowDescription: null,
        ModelShowRelated: null
      });
    });

    afterEach(() => {
      configSpy.mockRestore();
    });

    it(`should allow local overrides`, () => {
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

    it(`should use global overrides when local are not present`, () => {
      const { asFragment } = render(
        <ModelShow
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
});
